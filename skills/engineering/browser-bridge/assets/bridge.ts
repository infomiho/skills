// bun bridge.ts serve [port] | state | run SESSION '{"action":"snapshot"}' | stop
import { readFileSync, writeFileSync, chmodSync } from "node:fs"
const root = import.meta.dir,
  [verb = "serve", arg, json] = Bun.argv.slice(2)
const configFile = root + "/.bridge.json"
const privateFile = (name: string, data: string) => {
  writeFileSync(root + "/" + name, data, { mode: 0o600 })
  chmodSync(root + "/" + name, 0o600)
}
if (verb !== "serve") {
  const c = JSON.parse(readFileSync(configFile, "utf8"))
  if (!["state", "run", "stop"].includes(verb))
    throw Error("Use serve, state, run, or stop")
  const response = await fetch(
    c.base + "/" + verb + (verb === "run" ? "/" + arg : ""),
    {
      method: verb === "state" ? "GET" : "POST",
      headers: { Authorization: "Bearer " + c.controller },
      body:
        verb === "run"
          ? json === "-"
            ? await Bun.stdin.text()
            : json
          : undefined,
    },
  )
  const result = await response.json()
  console.log(JSON.stringify(result))
  if (!response.ok || result?.ok === false || result?.error)
    process.exitCode = 1
} else {
  const port = Number(arg || 8766),
    base = `http://127.0.0.1:${port}`
  const browser = crypto.randomUUID(),
    controller = crypto.randomUUID()
  const sessions = new Map<string, any>()
  const script = (mode: string, key = browser) =>
    readFileSync(root + "/client.js", "utf8").replace(
      "__CONFIG__",
      JSON.stringify({ base, key, mode }),
    )
  const reply = (body: any, status = 200) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port,
    idleTimeout: 35,
    maxRequestBodySize: 1_000_000,
    async fetch(req, server) {
      const url = new URL(req.url)
      if (req.headers.get("host") !== `127.0.0.1:${port}`) return reply({}, 403)
      if (url.pathname === "/inject.js") {
        const mode = url.searchParams.get("mode") || "popup"
        if (
          url.searchParams.get("key") !== browser ||
          !["direct", "popup"].includes(mode)
        )
          return reply({}, 403)
        return new Response(script(mode), {
          headers: {
            "Content-Type": "text/javascript; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "no-referrer",
          },
        })
      }
      if (url.pathname === "/relay")
        return new Response(
          readFileSync(root + "/relay.html", "utf8").replace(
            "__RELAY_SCRIPT__",
            () => script("relay", ""),
          ),
          {
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "no-store",
              "Referrer-Policy": "no-referrer",
            },
          },
        )
      if (url.pathname === "/ws") {
        const origin = req.headers.get("origin") || ""
        if (
          url.searchParams.get("key") !== browser ||
          !/^https?:\/\//.test(origin)
        )
          return reply({}, 403)
        if (sessions.size >= 32) return reply({ error: "Session limit" }, 429)
        if (server.upgrade(req, { data: { id: crypto.randomUUID(), origin } }))
          return
        return reply({}, 400)
      }
      if (
        req.headers.has("origin") ||
        req.headers.get("authorization") !== "Bearer " + controller
      )
        return reply({}, 403)
      if (url.pathname === "/state")
        return reply(
          [...sessions].map(([id, s]) => ({
            id,
            origin: s.origin,
            snapshot: s.snapshot,
          })),
        )
      if (req.method === "POST" && url.pathname === "/stop") {
        for (const s of sessions.values()) s.ws.close()
        setTimeout(() => void server.stop(true), 100)
        return reply({ stopped: true })
      }
      if (req.method === "POST" && url.pathname.startsWith("/run/")) {
        const s = sessions.get(url.pathname.slice(5))
        if (!s) return reply({ error: "Unknown session" }, 404)
        if (s.pending) return reply({ error: "Command pending" }, 409)
        let command
        try {
          command = await req.json()
        } catch {
          return reply({ error: "Invalid JSON" }, 400)
        }
        if (
          !command ||
          typeof command !== "object" ||
          typeof command.action !== "string"
        )
          return reply({ error: "Invalid command" }, 400)
        if (sessions.get(url.pathname.slice(5)) !== s)
          return reply({ error: "Disconnected" }, 409)
        if (s.pending) return reply({ error: "Command pending" }, 409)
        const id = crypto.randomUUID()
        return new Promise<Response>((resolve) => {
          const finish = (result: any) => {
            if (s.pending?.id !== id) return
            clearTimeout(s.pending.timer)
            s.pending = null
            resolve(reply(result))
          }
          s.pending = {
            id,
            finish,
            timer: setTimeout(
              () =>
                finish({
                  error: "No acknowledgement; inspect before retrying",
                  may_have_executed: true,
                }),
              25000,
            ),
          }
          s.ws.send(
            JSON.stringify({
              type: "command",
              id,
              expires: Date.now() + 24000,
              command,
            }),
          )
        })
      }
      return reply({}, 404)
    },
    websocket: {
      data: {} as { id: string; origin: string },
      maxPayloadLength: 1_000_000,
      open(ws) {
        sessions.set(ws.data.id, {
          ws,
          origin: ws.data.origin,
          snapshot: null,
          pending: null,
        })
        ws.send(JSON.stringify({ type: "connected", id: ws.data.id }))
      },
      message(ws, raw) {
        let m
        try {
          m = JSON.parse(String(raw))
        } catch {
          ws.close(1008, "Invalid JSON")
          return
        }
        if (!m || typeof m !== "object") {
          ws.close(1008, "Invalid message")
          return
        }
        const s = sessions.get(ws.data.id)
        if (!s) return
        if (m.type === "snapshot") s.snapshot = m.snapshot
        if (m.type === "result" && s.pending?.id === m.id) {
          if (m.result?.snapshot) s.snapshot = m.result.snapshot
          s.pending.finish(m.result)
        }
      },
      close(ws) {
        const s = sessions.get(ws.data.id)
        s?.pending?.finish({ error: "Disconnected", may_have_executed: true })
        sessions.delete(ws.data.id)
      },
    },
  })
  privateFile(
    ".bridge.json",
    JSON.stringify({ base, controller, pid: process.pid }),
  )
  for (const mode of ["direct", "popup"]) {
    privateFile("inject-" + mode + ".js", script(mode))
    const url = base + "/inject.js?mode=" + mode + "&key=" + browser
    privateFile(
      "load-" + mode + ".js",
      'document.head.append(Object.assign(document.createElement("script"),{src:' +
        JSON.stringify(url) +
        "}));\n",
    )
  }
  console.log(
    base + ": paste inject-popup.js or inject-direct.js into the target tab",
  )
}
