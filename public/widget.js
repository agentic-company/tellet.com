(function () {
  "use strict";

  var TELLET_API = "https://tellet.com/api/widget";
  var container = null;
  var chatOpen = false;
  var messages = [];
  var conversationId = null;
  var config = null;
  var sessionId =
    sessionStorage.getItem("tellet_session") ||
    Math.random().toString(36).slice(2);
  sessionStorage.setItem("tellet_session", sessionId);

  function init(opts) {
    if (!opts || !opts.companyId) {
      console.error("[Tellet] companyId is required");
      return;
    }

    fetch(TELLET_API + "/config?company_id=" + opts.companyId)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (!data.agent) {
          console.error("[Tellet] No active customer-facing agent found");
          return;
        }
        config = {
          companyId: opts.companyId,
          agentId: data.agent.id,
          agentName: data.agent.name,
          companyName: data.company.name,
          theme: opts.theme || "dark",
          position: opts.position || "bottom-right",
        };
        render();
      })
      .catch(function (err) {
        console.error("[Tellet] Init failed:", err);
      });
  }

  function render() {
    if (container) container.remove();
    container = document.createElement("div");
    container.id = "tellet-widget";
    document.body.appendChild(container);
    buildStyles();
    buildButton();
  }

  function toggleChat() {
    chatOpen = !chatOpen;
    // Clear container and rebuild
    while (container.firstChild) container.removeChild(container.firstChild);
    buildStyles();
    if (chatOpen) {
      buildChatWindow();
    }
    buildButton();
  }

  function buildStyles() {
    var isDark = config.theme === "dark";
    var bg = isDark ? "#0a0a0a" : "#ffffff";
    var bgSecondary = isDark ? "#1a1a1a" : "#f5f5f5";
    var text = isDark ? "#e5e5e5" : "#171717";
    var textSecondary = isDark ? "#a3a3a3" : "#737373";
    var border = isDark ? "#262626" : "#e5e5e5";
    var accent = "#8b5cf6";
    var pos = config.position === "bottom-left" ? "left:20px" : "right:20px";

    var style = document.createElement("style");
    style.textContent =
      '#tellet-widget{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;line-height:1.5;z-index:99999}' +
      "#tellet-toggle{position:fixed;bottom:20px;" + pos + ";width:56px;height:56px;border-radius:50%;background:" + accent + ";color:#fff;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(139,92,246,.4);display:flex;align-items:center;justify-content:center;z-index:100000;transition:transform .2s}" +
      "#tellet-toggle:hover{transform:scale(1.08)}" +
      "#tellet-toggle svg{width:24px;height:24px}" +
      ".tellet-chat{position:fixed;bottom:88px;" + pos + ";width:380px;max-height:520px;background:" + bg + ";border:1px solid " + border + ";border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.2);display:flex;flex-direction:column;z-index:100000;overflow:hidden}" +
      ".tellet-header{padding:16px;border-bottom:1px solid " + border + ";display:flex;align-items:center;justify-content:space-between}" +
      ".tellet-header h3{margin:0;font-size:15px;font-weight:600;color:" + text + "}" +
      ".tellet-header span{font-size:12px;color:" + textSecondary + "}" +
      ".tellet-close{background:none;border:none;color:" + textSecondary + ";cursor:pointer;font-size:18px;padding:4px}" +
      ".tellet-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;min-height:300px}" +
      ".tellet-msg-user{align-self:flex-end;background:" + accent + ";color:#fff;padding:8px 14px;border-radius:16px 16px 4px 16px;max-width:80%;word-wrap:break-word}" +
      ".tellet-msg-agent{align-self:flex-start;background:" + bgSecondary + ";color:" + text + ";padding:8px 14px;border-radius:16px 16px 16px 4px;max-width:80%;word-wrap:break-word;white-space:pre-wrap}" +
      ".tellet-inputbar{padding:12px;border-top:1px solid " + border + ";display:flex;gap:8px}" +
      ".tellet-input{flex:1;border:1px solid " + border + ";border-radius:8px;padding:8px 12px;background:" + bgSecondary + ";color:" + text + ";outline:none;font-size:14px;resize:none}" +
      ".tellet-input::placeholder{color:" + textSecondary + "}" +
      ".tellet-send{background:" + accent + ";color:#fff;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:14px;font-weight:500}" +
      ".tellet-send:hover{opacity:.9}" +
      ".tellet-powered{text-align:center;padding:6px;font-size:11px;color:" + textSecondary + "}" +
      ".tellet-powered a{color:" + accent + ";text-decoration:none}";
    container.appendChild(style);
  }

  function buildButton() {
    var btn = document.createElement("button");
    btn.id = "tellet-toggle";
    if (chatOpen) {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    } else {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';
    }
    btn.addEventListener("click", toggleChat);
    container.appendChild(btn);
  }

  function buildChatWindow() {
    var chat = document.createElement("div");
    chat.className = "tellet-chat";

    // Header
    var header = document.createElement("div");
    header.className = "tellet-header";
    var headerInfo = document.createElement("div");
    var h3 = document.createElement("h3");
    h3.textContent = config.agentName;
    var span = document.createElement("span");
    span.textContent = config.companyName;
    headerInfo.appendChild(h3);
    headerInfo.appendChild(span);
    var closeBtn = document.createElement("button");
    closeBtn.className = "tellet-close";
    closeBtn.textContent = "\u00d7";
    closeBtn.addEventListener("click", toggleChat);
    header.appendChild(headerInfo);
    header.appendChild(closeBtn);
    chat.appendChild(header);

    // Messages
    var msgList = document.createElement("div");
    msgList.className = "tellet-messages";
    msgList.id = "tellet-messages";
    chat.appendChild(msgList);

    // Input bar
    var inputBar = document.createElement("div");
    inputBar.className = "tellet-inputbar";
    var input = document.createElement("input");
    input.className = "tellet-input";
    input.id = "tellet-input";
    input.placeholder = "Type a message...";
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    var sendBtn = document.createElement("button");
    sendBtn.className = "tellet-send";
    sendBtn.textContent = "Send";
    sendBtn.addEventListener("click", sendMessage);
    inputBar.appendChild(input);
    inputBar.appendChild(sendBtn);
    chat.appendChild(inputBar);

    // Powered by
    var powered = document.createElement("div");
    powered.className = "tellet-powered";
    powered.textContent = "Powered by ";
    var link = document.createElement("a");
    link.href = "https://tellet.com";
    link.target = "_blank";
    link.textContent = "tellet";
    powered.appendChild(link);
    chat.appendChild(powered);

    container.appendChild(chat);
    renderMessages();
  }

  function sendMessage() {
    var input = document.getElementById("tellet-input");
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;

    messages.push({ role: "user", content: text });
    input.value = "";
    renderMessages();

    messages.push({ role: "assistant", content: "" });
    var idx = messages.length - 1;

    fetch(TELLET_API + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        agent_id: config.agentId,
        company_id: config.companyId,
        session_id: sessionId,
      }),
    })
      .then(function (response) {
        var reader = response.body.getReader();
        var decoder = new TextDecoder();

        function read() {
          reader.read().then(function (result) {
            if (result.done) return;
            var chunk = decoder.decode(result.value);
            var lines = chunk.split("\n");
            for (var i = 0; i < lines.length; i++) {
              var line = lines[i];
              if (line.startsWith("data: ")) {
                try {
                  var data = JSON.parse(line.slice(6));
                  if (data.text) {
                    messages[idx].content += data.text;
                    renderMessages();
                  }
                  if (data.conversation_id) {
                    conversationId = data.conversation_id;
                  }
                } catch (e) {
                  // ignore parse errors for partial chunks
                }
              }
            }
            read();
          });
        }
        read();
      })
      .catch(function () {
        messages[idx].content = "Sorry, something went wrong. Please try again.";
        renderMessages();
      });
  }

  function renderMessages() {
    var list = document.getElementById("tellet-messages");
    if (!list) return;

    // Clear existing messages using DOM methods
    while (list.firstChild) list.removeChild(list.firstChild);

    for (var i = 0; i < messages.length; i++) {
      var m = messages[i];
      var div = document.createElement("div");
      div.className = m.role === "user" ? "tellet-msg-user" : "tellet-msg-agent";
      div.textContent = m.content;
      list.appendChild(div);
    }

    list.scrollTop = list.scrollHeight;
  }

  // Expose global
  window.Tellet = { init: init };
})();
