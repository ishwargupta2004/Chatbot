(function () {
  // ─── Config ───────────────────────────────────────────────────────
  const API_URL = "https://chatbot-psi-gray.vercel.app/api/chat"; // 👈 apna domain lagao
  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.warn("[Chatbot] data-owner-id not found on script tag.");
    return;
  }

  // ─── Styles ───────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

    /* ── Toggle Button ── */
    #cw-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      color: white;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 99999;
      box-shadow: 0 4px 20px rgba(37,99,235,0.45);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      user-select: none;
    }
    #cw-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(37,99,235,0.55);
    }

    /* ── Chat Box — Desktop ── */
   #cw-box {
  position: fixed;
  bottom: 92px;
  right: 24px;
  width: 360px;
  height: min(520px, calc(100dvh - 120px)); // screen se bahar nahi jaayega
  max-height: 600px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 48px rgba(0,0,0,0.15);
  display: none;
  flex-direction: column;
  z-index: 99998;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  border: 1px solid rgba(0,0,0,0.07);
  animation: cw-pop 0.25s ease;
}

    /* ── Chat Box — Mobile: float above button, fully visible ── */
    @media (max-width: 480px) {
      #cw-box {
        top: auto;
        bottom: 84px;
        left: 10px;
        right: 10px;
        width: auto;
        height: calc(100dvh - 110px);
        max-height: 560px;
        border-radius: 16px;
        animation: cw-slide 0.25s ease;
      }
      #cw-btn {
        bottom: 16px;
        right: 16px;
        width: 52px;
        height: 52px;
      }
    }

    @keyframes cw-pop {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes cw-slide {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Header ── */
    #cw-header {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    #cw-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #cw-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    #cw-title {
      color: white;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.2;
    }
    #cw-subtitle {
      color: rgba(255,255,255,0.75);
      font-size: 12px;
      margin-top: 2px;
    }
    #cw-close {
      background: rgba(255,255,255,0.15);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #cw-close:hover { background: rgba(255,255,255,0.28); }

    /* ── Messages Area ── */
    #cw-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f8fafc;
      scroll-behavior: smooth;
    }
    #cw-messages::-webkit-scrollbar { width: 4px; }
    #cw-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

    /* ── Bubbles ── */
    .cw-bubble {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.55;
      word-break: break-word;
      animation: cw-fade 0.2s ease;
    }
    /* Mobile: slightly larger font for readability */
    @media (max-width: 480px) {
      .cw-bubble { font-size: 15px; max-width: 85%; }
    }

    @keyframes cw-fade {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cw-bubble.user {
      background: #2563eb;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .cw-bubble.ai {
      background: white;
      color: #1e293b;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .cw-bubble.typing {
      background: white;
      color: #94a3b8;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .cw-dots { display: flex; gap: 4px; }
    .cw-dots span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #94a3b8;
      animation: cw-bounce 1.2s infinite ease-in-out;
    }
    .cw-dots span:nth-child(2) { animation-delay: 0.2s; }
    .cw-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cw-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40%           { transform: translateY(-5px); }
    }

    /* ── Footer / Input ── */
    #cw-footer {
      padding: 10px 12px;
      background: white;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    /* Mobile: bigger input area, easier to tap */
    @media (max-width: 480px) {
      #cw-footer { padding: 12px 14px; padding-bottom: max(12px, env(safe-area-inset-bottom)); }
    }
    #cw-input {
      flex: 1;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      color: #1e293b;
      outline: none;
      background: #f8fafc;
      transition: border-color 0.2s;
      min-width: 0; /* important for flex shrink */
    }
    @media (max-width: 480px) {
      #cw-input { font-size: 16px; padding: 12px 14px; } /* 16px prevents iOS zoom */
    }
    #cw-input:focus { border-color: #2563eb; background: white; }
    #cw-input::placeholder { color: #94a3b8; }

    #cw-send {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #2563eb;
      border: none;
      color: white;
      font-size: 17px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s;
    }
    @media (max-width: 480px) {
      #cw-send { width: 44px; height: 44px; } /* bigger tap target on mobile */
    }
    #cw-send:hover { background: #1d4ed8; transform: scale(1.05); }
    #cw-send:disabled { background: #cbd5e1; cursor: not-allowed; transform: none; }
  `;
  document.head.appendChild(style);

  // ─── Toggle Button ────────────────────────────────────────────────
  const button = document.createElement("div");
  button.id = "cw-btn";
  button.innerHTML = "💬";
  document.body.appendChild(button);

  // ─── Chat Box ─────────────────────────────────────────────────────
  const box = document.createElement("div");
  box.id = "cw-box";
  box.innerHTML = `
    <div id="cw-header">
      <div id="cw-header-left">
        <div id="cw-avatar">🤖</div>
        <div>
          <div id="cw-title">Customer Support</div>
          <div id="cw-subtitle">We usually reply instantly</div>
        </div>
      </div>
      <button id="cw-close">✕</button>
    </div>

    <div id="cw-messages"></div>

    <div id="cw-footer">
      <input id="cw-input" type="text" placeholder="Type your message..." autocomplete="off" />
      <button id="cw-send">➤</button>
    </div>
  `;
  document.body.appendChild(box);

  // ─── Elements ─────────────────────────────────────────────────────
  const input = document.getElementById("cw-input");
  const sendBtn = document.getElementById("cw-send");
  const messageArea = document.getElementById("cw-messages");
  const closeBtn = document.getElementById("cw-close");

  // ─── Open / Close ─────────────────────────────────────────────────
  let isOpen = false;

  button.onclick = () => {
    isOpen = !isOpen;
    box.style.display = isOpen ? "flex" : "none";
    button.innerHTML = isOpen ? "✕" : "💬";
    if (isOpen && messageArea.children.length === 0) {
      addMessage("👋 Hi! How can I help you today?", "ai");
    }
  };

  closeBtn.onclick = () => {
    isOpen = false;
    box.style.display = "none";
    button.innerHTML = "💬";
  };

  // ─── Mobile Check ─────────────────────────────────────────────────
  function isMobile() {
    return window.innerWidth <= 480;
  }

  // ─── Add Message ──────────────────────────────────────────────────
  function addMessage(text, from) {
    const bubble = document.createElement("div");
    bubble.className = `cw-bubble ${from}`;
    bubble.textContent = text;
    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
    return bubble;
  }

  // ─── Typing Indicator ─────────────────────────────────────────────
  function addTyping() {
    const bubble = document.createElement("div");
    bubble.className = "cw-bubble typing";
    bubble.id = "cw-typing";
    bubble.innerHTML = `<div class="cw-dots"><span></span><span></span><span></span></div>`;
    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
    return bubble;
  }

  // ─── Send Message ─────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    sendBtn.disabled = true;

    const typing = addTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, ownerId }),
      });

      const data = await res.json();
      messageArea.removeChild(typing);
      addMessage(data.reply || "Sorry, something went wrong.", "ai");

    } catch (error) {
      console.error("[Chatbot] Error:", error);
      messageArea.removeChild(typing);
      addMessage("Network error. Please try again.", "ai");
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // ─── Events ───────────────────────────────────────────────────────
  sendBtn.onclick = sendMessage;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

})();