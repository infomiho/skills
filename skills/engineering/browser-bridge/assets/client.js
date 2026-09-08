// Template consumed by bridge.ts. Generated scripts are pasted into DevTools.
;(() => {
  const { base, key, mode } = __CONFIG__
  const relay = mode === "relay",
    channel = relay ? location.hash.slice(1) : crypto.randomUUID()
  if (!relay) window.__bridge?.stop()
  let peer = relay ? opener : null,
    peerOrigin = relay ? null : base,
    socket,
    timer,
    ready,
    stopped = false
  const badge = relay
    ? document.querySelector("#disconnect")
    : document.createElement("button")
  let connectionTimeout
  let failureDetail
  if (!relay) {
    badge.textContent = "Bridge connecting…"
    badge.style.cssText =
      "position:fixed;bottom:12px;right:12px;z-index:2147483647;padding:12px"
    const container = document.body || document.documentElement
    container.append(badge)
  }
  function showStatus(state, title, detail) {
    if (!relay) return
    if (document.querySelector("#connection").dataset.state === state) return
    document.querySelector("#connection").dataset.state = state
    document.querySelector("#status").textContent = title
    document.querySelector("#detail").textContent = detail
    document.title = `${title} | Browser bridge`
  }
  function showTab(snapshot) {
    if (!relay || !snapshot) return
    let origin
    try {
      origin = new URL(snapshot.url).origin
    } catch {
      return
    }
    clearTimeout(connectionTimeout)
    document.querySelector("#tab").hidden = false
    document.querySelector("#tab-title").textContent =
      snapshot.title || "Untitled tab"
    document.querySelector("#tab-origin").textContent = origin
    badge.textContent = "Disconnect"
    showStatus(
      "connected",
      "Connected",
      "Your agent can read and interact with this tab. Keep this window open. Closing it disconnects the tab.",
    )
  }
  const post = (type, data = {}) =>
    peer?.postMessage({ channel, type, ...data }, peerOrigin)
  const send = (data) => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(data))
  }
  const nodes = new Map(),
    ids = new WeakMap()
  let serial = 0
  function snapshot() {
    nodes.clear()
    const elements = [
      ...document.querySelectorAll(
        "input,textarea,select,button,a,[role],[contenteditable=true]",
      ),
    ]
      .filter(
        (e) =>
          e !== badge &&
          e.type !== "hidden" &&
          e.getClientRects().length &&
          getComputedStyle(e).visibility !== "hidden",
      )
      .slice(0, 250)
      .map((e) => {
        if (!ids.has(e)) ids.set(e, "e" + ++serial)
        const id = ids.get(e)
        nodes.set(id, e)
        const value = e.value
        return {
          id,
          tag: e.tagName.toLowerCase(),
          label: String(
            e.getAttribute("aria-label") ||
              e.labels?.[0]?.innerText ||
              e.innerText ||
              e.placeholder ||
              "",
          ).slice(0, 200),
          role: e.getAttribute("role"),
          type: e.type,
          name: e.name,
          disabled: e.disabled,
          checked: e.checked,
          value:
            ["password", "hidden", "file"].includes(e.type) ||
            !["string", "number", "boolean"].includes(typeof value)
              ? undefined
              : String(value).slice(0, 8000),
          options:
            e.tagName === "SELECT"
              ? [...e.options].map((o) => ({ value: o.value, text: o.text }))
              : undefined,
        }
      })
    return {
      url: location.href,
      title: document.title,
      text: document.body.innerText.slice(0, 30000),
      elements,
    }
  }
  async function act(m) {
    try {
      if (stopped || Date.now() > m.expires)
        throw Error("Disconnected or expired")
      const c = m.command
      if (c.action === "disconnect") {
        setTimeout(stop, 100)
        return { ok: true }
      }
      if (c.action !== "snapshot") {
        const matches = c.selector
          ? [...document.querySelectorAll(c.selector)]
          : [nodes.get(c.target)].filter(Boolean)
        if (matches.length !== 1 || !matches[0].isConnected)
          throw Error("Missing/stale/ambiguous target")
        const e = matches[0]
        if (e.disabled || e.readOnly) throw Error("Disabled/read-only")
        if (c.action === "click") e.click()
        else if (c.action === "fill") {
          e.focus()
          if (e.type === "file") throw Error("Choose files manually")
          if (e.isContentEditable) e.textContent = String(c.value)
          else
            Object.getOwnPropertyDescriptor(
              e.tagName === "TEXTAREA"
                ? HTMLTextAreaElement.prototype
                : HTMLInputElement.prototype,
              "value",
            ).set.call(e, String(c.value))
          e.dispatchEvent(new Event("input", { bubbles: true }))
          e.dispatchEvent(new Event("change", { bubbles: true }))
        } else if (c.action === "select") {
          if (
            e.tagName !== "SELECT" ||
            ![...e.options].some((o) => o.value === c.value && !o.disabled)
          )
            throw Error("Invalid option")
          e.value = c.value
          e.dispatchEvent(new Event("input", { bubbles: true }))
          e.dispatchEvent(new Event("change", { bubbles: true }))
        } else if (c.action === "check") {
          if (
            !["checkbox", "radio"].includes(e.type) ||
            typeof c.value !== "boolean" ||
            (e.type === "radio" && !c.value)
          )
            throw Error("Invalid check")
          if (e.checked !== c.value) e.click()
        } else if (c.action === "scroll") e.scrollIntoView({ block: "center" })
        else throw Error("Unknown action")
      }
      await new Promise((r) => setTimeout(r, 100))
      return { ok: true, snapshot: snapshot() }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }
  const publish = () => {
    const m = { type: "snapshot", snapshot: snapshot() }
    mode === "popup" ? post(m.type, m) : send(m)
  }
  function stop() {
    if (stopped) return
    stopped = true
    clearInterval(timer)
    clearInterval(ready)
    clearTimeout(connectionTimeout)
    post("disconnect")
    socket?.close()
    if (relay) {
      showStatus(
        failureDetail ? "error" : "disconnected",
        failureDetail ? "Connection interrupted" : "Disconnected",
        failureDetail ||
          "The bridge is no longer connected. To reconnect, paste the connection script into your tab again.",
      )
      badge.textContent = "Close window"
      badge.onclick = () => window.close()
    } else badge.remove()
    nodes.clear()
    window.removeEventListener("message", receive)
    window.removeEventListener("pagehide", stop)
    if (window.__bridge?.stop === stop) delete window.__bridge
  }
  function connect(token) {
    socket = new WebSocket(
      base.replace("http:", "ws:") + "/ws?key=" + encodeURIComponent(token),
    )
    socket.onmessage = async (e) => {
      const m = JSON.parse(e.data)
      if (m.type === "connected") {
        if (relay)
          showStatus(
            "connecting",
            "Waiting for your tab…",
            "The local bridge is ready. Waiting for your tab to finish connecting.",
          )
        else badge.textContent = "Bridge connected · Disconnect"
        if (relay) post("connected")
        else {
          publish()
          timer = setInterval(publish, 3000)
        }
      } else if (m.type === "command") {
        if (relay) post("command", m)
        else send({ type: "result", id: m.id, result: await act(m) })
      }
    }
    socket.onerror = () => {
      failureDetail =
        "Could not reach the local bridge. Ask your agent to check that it is running, then paste the connection script again."
      stop()
    }
    socket.onclose = () => {
      if (!stopped)
        failureDetail =
          "The local bridge connection closed. Ask your agent to check it, then paste the connection script again."
      stop()
    }
  }
  async function receive(e) {
    if (stopped || e.data?.channel !== channel) return
    if (!relay && e.origin !== base) return
    if (!peer && e.data.type === "ready") peer = e.source
    if (e.source !== peer) return
    const m = e.data
    if (relay && m.type === "init" && !socket) {
      peerOrigin = e.origin
      clearInterval(ready)
      connect(m.key)
      return
    }
    if (e.origin !== peerOrigin) return
    if (m.type === "ready") post("init", { key })
    else if (m.type === "disconnect") stop()
    else if (relay && (m.type === "result" || m.type === "snapshot")) {
      showTab(m.type === "snapshot" ? m.snapshot : m.result?.snapshot)
      send(m)
    } else if (!relay && m.type === "command")
      post("result", { id: m.id, result: await act(m) })
    else if (!relay && m.type === "connected") {
      badge.textContent = "Bridge connected · Disconnect"
      publish()
      timer = setInterval(() => {
        if (peer.closed) stop()
        else publish()
      }, 3000)
    }
  }
  badge.onclick = stop
  window.__bridge = { stop }
  window.addEventListener("pagehide", stop)
  if (mode === "direct") connect(key)
  else {
    window.addEventListener("message", receive)
    if (relay) {
      connectionTimeout = setTimeout(() => {
        failureDetail =
          "Your tab did not connect. Return to the tab and paste the script again. If this repeats, ask your agent to try a direct connection."
        stop()
      }, 10000)
      ready = setInterval(() => {
        if (!peer || peer.closed) {
          failureDetail =
            "The original tab is unavailable. Paste the connection script into the tab you want to connect."
          stop()
        } else peer.postMessage({ channel, type: "ready" }, "*")
      }, 300)
    } else {
      peer = window.open(
        base + "/relay#" + channel,
        "bridge-" + channel,
        "popup,width=440,height=380",
      )
      setTimeout(() => {
        if (!timer && !stopped)
          badge.textContent =
            "No relay handshake: check popup/COOP · Disconnect"
      }, 7000)
    }
  }
})()
