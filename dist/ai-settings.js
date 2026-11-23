/* 自带密钥（BYOK）AI 服务层：密钥只存内存，浏览器直连，不经过任何代理。
   对外接口：window.workbenchAI = { isReady, open, ask, advisor }
   各页面用 workbenchAI.advisor(host, opts) 挂一张统一的「AI 建议卡」。 */
(() => {
  const STORE = "workbench-ai-config-v1";
  let config = { base: "", model: "" },
    key = "",
    ready = false,
    busy = false,
    controller = null,
    status = "",
    storageOK = true;
  try {
    const x = JSON.parse(localStorage.getItem(STORE) || "null");
    if (typeof x?.base === "string" && typeof x?.model === "string")
      config = { base: x.base, model: x.model };
  } catch {
    storageOK = false;
  }
  const esc = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  const PRESETS = [
    {
      id: "deepseek",
      name: "DeepSeek",
      base: "https://api.deepseek.com",
      model: "deepseek-chat",
      hint: "在 platform.deepseek.com 注册、充值（几元起）后，到 API Keys 页创建密钥。",
    },
    {
      id: "bailian",
      name: "阿里百炼 · 通义",
      base: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      model: "qwen-flash",
      hint: "在阿里云百炼控制台开通服务后创建 API-KEY。",
    },
    {
      id: "moonshot",
      name: "Moonshot · Kimi",
      base: "https://api.moonshot.cn/v1",
      model: "kimi-k2-0905-preview",
      hint: "在 platform.moonshot.cn 的 API Key 管理页创建密钥。",
    },
    {
      id: "ark",
      name: "火山方舟 · 豆包",
      base: "https://ark.cn-beijing.volces.com/api/v3",
      model: "",
      hint: "模型 ID 填火山方舟控制台里创建的「推理接入点」ID（ep- 开头）。",
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      base: "https://openrouter.ai/api/v1",
      model: "",
      hint: "在 openrouter.ai/keys 创建密钥；模型 ID 从站内模型列表复制。",
    },
    {
      id: "custom",
      name: "自定义 · OpenAI 兼容接口",
      base: "",
      model: "",
      hint: "填服务商提供的 HTTPS Base URL 和模型 ID，不是聊天网页地址。",
    },
  ];
  const presetOf = (base) =>
    PRESETS.find((p) => p.id !== "custom" && p.base === base) || PRESETS.at(-1);

  function normalize(base) {
    let u;
    try {
      u = new URL(base.trim());
    } catch {
      throw Error("请填写完整的 HTTPS API 服务地址，不是聊天网页网址。");
    }
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      u.search ||
      u.hash
    )
      throw Error("地址必须使用 HTTPS，不能包含账号、密码、查询参数或锚点。");
    if (
      u.hostname === "localhost" ||
      /^127\.|^0\.|^10\.|^192\.168\.|^169\.254\./.test(u.hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(u.hostname) ||
      u.hostname.startsWith("[")
    )
      throw Error("本版只支持公网 HTTPS API，不支持本机或内网接口。");
    u.pathname = u.pathname
      .replace(/\/+$/, "")
      .replace(/\/chat\/completions$/, "");
    return u.href.replace(/\/$/, "");
  }
  function persist() {
    try {
      localStorage.setItem(STORE, JSON.stringify(config));
      storageOK = true;
    } catch {
      storageOK = false;
    }
  }
  function errorText(e) {
    if (e.name === "AbortError")
      return "请求停止或超时，可能已产生用量，请向服务商核对；不会自动重试。";
    if (["401", "403"].includes(e.message))
      return "认证或权限未通过，请核对 API Key、服务地址和账户权限。";
    if (e.message === "402")
      return "服务提示额度不足，请到自己的服务商账户处理。";
    if (e.message === "429") return "服务限流或额度受限，请稍后手动重试。";
    if (["400", "404", "422"].includes(e.message))
      return "接口、模型或参数不兼容，请核对服务地址和模型 ID。本版只支持 Chat Completions。";
    if (e.message === "empty")
      return "服务没有返回可用文字，尚不能确认模型可用。";
    if (e.message === "format")
      return "返回内容不是兼容的 JSON 聊天结果，请核对接口。";
    return "请求未完成：可能是网络、跨域（CORS）、重定向限制或服务异常。网页直连需要服务商允许跨域；未转交代理，也不会自动重试。";
  }
  async function request(messages, limit) {
    controller = new AbortController();
    const timer = setTimeout(() => controller?.abort(), 90000);
    try {
      const r = await fetch(config.base + "/chat/completions", {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        redirect: "error",
        referrerPolicy: "no-referrer",
        headers: {
          Authorization: "Bearer " + key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          max_tokens: limit,
          stream: false,
        }),
        signal: controller.signal,
      });
      if (!r.ok) throw Error(String(r.status));
      let d;
      try {
        d = await r.json();
      } catch {
        throw Error("format");
      }
      const t = d.choices?.[0]?.message?.content;
      if (typeof t !== "string" || !t.trim()) throw Error("empty");
      return key ? t.split(key).join("[密钥已隐藏]") : t;
    } finally {
      clearTimeout(timer);
      controller = null;
    }
  }
  function notify() {
    window.dispatchEvent(new Event("ai-state-change"));
  }

  /* ---------- 设置对话框 ---------- */
  const dialog = document.createElement("dialog");
  dialog.id = "ai-settings";
  dialog.setAttribute("aria-labelledby", "ai-title");
  dialog.innerHTML = `<div class="ai-head"><h2 id="ai-title">连接你自己的 AI</h2><button id="ai-close" aria-label="关闭AI设置">×</button></div><p>工作台免费，模型调用费用由你的服务商收取。</p><label for="ai-preset">选择服务商</label><select id="ai-preset">${PRESETS.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")}</select><p class="small" id="ai-preset-hint"></p><label for="ai-key">API Key</label><input id="ai-key" type="password" autocomplete="off" spellcheck="false" placeholder="粘贴服务商后台创建的密钥"><details id="ai-advanced"><summary>高级：服务地址与模型（已按所选服务商填好）</summary><label for="ai-base">API 服务地址（Base URL）</label><input id="ai-base" type="url" autocomplete="off" spellcheck="false" placeholder="https://你的服务商地址/v1"><label for="ai-model">模型 ID</label><input id="ai-model" autocomplete="off" spellcheck="false" placeholder="复制服务商提供的模型 ID 或接入点 ID"></details><p class="small">地址和模型记在本机。密钥只保留在当前页面内存，刷新后需重填；不上传任何服务器，不进入文案、导出或日志。</p><div class="ai-permission"><strong>发送给：<span id="ai-recipient"></span></strong><label class="ai-check"><input type="checkbox" id="ai-consent"><span>我确认此地址可信，同意向它发送密钥及请求，并使用自己的额度。测试只发送固定短消息，可能产生少量费用；点击各页面的 AI 按钮时才发送对应材料。</span></label></div><div class="actions"><button id="ai-test" class="primary">测试连接并使用</button><button id="ai-clear">清除连接设置</button></div><p id="ai-settings-status" role="status"></p><details><summary>哪些接口能用？</summary><p>支持 HTTPS、Bearer API Key 鉴权的 OpenAI 兼容 Chat Completions 文本接口，且服务商需允许网页跨域调用。预设里的服务商已实测允许浏览器直连；自定义接口能否使用以连接测试为准。</p><p>工作台不会绕过跨域限制，也不会把密钥转交代理。清除设置只清除本页密钥和本机配置，不撤销服务商后台的密钥。</p></details>`;
  document.body.appendChild(dialog);

  const presetSel = dialog.querySelector("#ai-preset"),
    hintEl = dialog.querySelector("#ai-preset-hint"),
    advanced = dialog.querySelector("#ai-advanced");
  function applyPreset(id) {
    const p = PRESETS.find((x) => x.id === id) || PRESETS[0];
    presetSel.value = p.id;
    hintEl.textContent = p.hint;
    dialog.querySelector("#ai-base").value = p.base;
    dialog.querySelector("#ai-model").value = p.model;
    dialog.querySelector("#ai-model").placeholder = p.model
      ? p.model
      : "复制服务商提供的模型 ID 或接入点 ID";
    dialog.querySelector("#ai-key").value = "";
    key = "";
    advanced.open = p.id === "custom" || p.id === "ark" || p.id === "openrouter";
    invalidate();
  }
  function open() {
    if (dialog.open) return;
    if (!config.base) applyPreset("deepseek");
    else {
      const p = presetOf(config.base);
      presetSel.value = p.id;
      hintEl.textContent = p.hint;
      advanced.open = p.id === "custom";
      dialog.querySelector("#ai-base").value = config.base;
      dialog.querySelector("#ai-model").value = config.model;
    }
    dialog.querySelector("#ai-key").value = "";
    dialog.querySelector("#ai-consent").checked = ready;
    dialog.querySelector("#ai-recipient").textContent =
      config.base || "尚未填写地址";
    dialog.querySelector("#ai-settings-status").textContent = status;
    dialog.showModal();
  }
  function feedback(t) {
    status = t;
    dialog.querySelector("#ai-settings-status").textContent = t;
    notify();
  }
  function lock() {
    dialog
      .querySelectorAll("input,select,button")
      .forEach((el) => (el.disabled = busy && el.id !== "ai-close"));
    notify();
  }
  async function test() {
    if (busy) return;
    try {
      const base = normalize(dialog.querySelector("#ai-base").value),
        model = dialog.querySelector("#ai-model").value.trim(),
        secret = dialog.querySelector("#ai-key").value.trim() || key;
      if (!model || model.length > 200 || /[\r\n]/.test(model))
        throw Error("请填写服务商提供的模型 ID 或接入点 ID。");
      if (!secret || /[\r\n]/.test(secret))
        throw Error("请填写有效 API Key，密钥只保留在当前页面。");
      if (!dialog.querySelector("#ai-consent").checked)
        throw Error("请先确认地址可信，并同意使用自己的额度。");
      config = { base, model };
      key = secret;
      ready = false;
      dialog.querySelector("#ai-key").value = "";
      persist();
    } catch (e) {
      feedback(e.message);
      return;
    }
    busy = true;
    lock();
    feedback("正在发送固定短消息测试，不发送创作材料…");
    try {
      await request([{ role: "user", content: "只回复 OK。" }], 32);
      ready = true;
      feedback("连接测试通过，关闭设置即可在各页面使用 AI。");
    } catch (e) {
      ready = false;
      feedback(errorText(e));
    } finally {
      busy = false;
      lock();
    }
  }
  dialog.querySelector("#ai-close").onclick = () => dialog.close();
  dialog.addEventListener(
    "close",
    () => (dialog.querySelector("#ai-key").value = ""),
  );
  dialog.querySelector("#ai-test").onclick = test;
  dialog.querySelector("#ai-clear").onclick = () => {
    key = "";
    config = { base: "", model: "" };
    ready = false;
    try {
      localStorage.removeItem(STORE);
    } catch {}
    dialog.querySelectorAll("input").forEach((el) => {
      el.value = "";
      if (el.type === "checkbox") el.checked = false;
    });
    dialog.querySelector("#ai-recipient").textContent = "尚未填写地址";
    feedback("连接设置已清除，创作材料和已返回建议不受影响。");
  };
  function invalidate() {
    ready = false;
    dialog.querySelector("#ai-consent").checked = false;
    dialog.querySelector("#ai-recipient").textContent =
      dialog.querySelector("#ai-base").value.trim() || "尚未填写地址";
    notify();
  }
  ["ai-base", "ai-model", "ai-key"].forEach((id) =>
    dialog.querySelector("#" + id).addEventListener("input", () => {
      if (id === "ai-base") {
        key = "";
        dialog.querySelector("#ai-key").value = "";
      }
      invalidate();
    }),
  );
  presetSel.onchange = (e) => applyPreset(e.target.value);
  dialog.querySelector("#ai-consent").onchange = (e) => {
    if (!e.target.checked) {
      ready = false;
      notify();
    }
  };

  /* ---------- 全局入口：顶栏 AI 设置按钮 ---------- */
  const button = document.createElement("button");
  button.id = "global-ai-settings";
  button.textContent = "AI 设置";
  button.onclick = open;
  button.style.cssText =
    "white-space:nowrap;flex-shrink:0;padding:7px 12px;font-size:13px";
  document.querySelector(".topbar")?.append(button);

  /* ---------- 共享 AI 建议卡 ---------- */
  const cards = new Map();
  /**
   * workbenchAI.advisor(host, opts) — 在 host 元素里挂一张 AI 建议卡。
   * opts = {
   *   id:           稳定标识（必填）；同一 id 重挂载时保留结果与复查上下文
   *   intro:        说明文字（告诉用户会发送什么）
   *   runLabel:     首次按钮文字（默认「帮我看看」）
   *   system:       系统提示词
   *   payload:      () => string   返回本次要发送的用户消息；空串视为材料不足
   *   docKey:       () => string   可选：当前材料/文稿的标识。标识变化时视为新材料，
   *                                不复查旧上下文，旧建议标注「上一份材料」。
   *   maxTokens:    默认 2000
   *   resultTitle:  结果标题
   *   exportName:   导出文件名（可选，给了才有导出按钮）
   *   onResult:     (text, ctl) => {}  拿到结果后的回调（可填表、存定位等）
   * }
   * 返回 ctl = { result(), busy(), reset(), refresh() }
   */
  function advisor(host, opts) {
    const cid = opts.id || host.id || opts.resultTitle || "default";
    let card = cards.get(cid);
    if (!card) {
      card = { result: "", lastPayload: "", resultModel: "", msg: "" };
      cards.set(cid, card);
    }
    card.host = host;
    card.opts = opts;
    async function run() {
      if (busy) return;
      if (!ready) {
        open();
        return;
      }
      const payload = opts.payload();
      if (!String(payload).trim()) {
        card.msg =
          opts.emptyMessage || "先填一点材料，再点 AI 按钮。";
        paint();
        return;
      }
      const dk = opts.docKey ? String(opts.docKey()) : card.docKey;
      const docText = opts.docText ? String(opts.docText()) : payload;
      const sameDoc = isSameDoc(card, dk, docText);
      const messages = [{ role: "system", content: opts.system }];
      if (card.result && card.lastPayload && sameDoc)
        messages.push(
          { role: "user", content: card.lastPayload },
          { role: "assistant", content: card.result },
        );
      messages.push({
        role: "user",
        content:
          (card.result && sameDoc
            ? "这是更新后的材料，请对照上次建议复查：\n"
            : "") + payload,
      });
      busy = true;
      card.msg = "正在分析你的材料…";
      paint();
      lock();
      try {
        const next = await request(messages, opts.maxTokens || 2000);
        card.result = next;
        card.lastPayload = payload;
        card.docKey = dk;
        card.lastDoc = docText;
        card.resultModel = config.model;
        card.msg = "建议已返回。先看优先修改项，再决定是否采用。";
        opts.onResult?.(next, ctl);
      } catch (e) {
        card.msg = errorText(e);
      } finally {
        busy = false;
        lock();
        paint();
      }
    }
    function paint() {
      const h = card.host;
      if (!h || !h.isConnected) return;
      const o = card.opts,
        canRun = !busy;
      const dkNow = o.docKey ? String(o.docKey()) : card.docKey;
      let now = "";
      try { now = (o.docText ? o.docText() : o.payload?.()) || ""; } catch {}
      const stale = !!card.result && !isSameDoc(card, dkNow, now);
      h.innerHTML = `<div class="ai-actions"><button class="primary" data-ai="run" ${canRun ? "" : "disabled"}>${busy ? "正在处理…" : ready ? (stale ? o.runLabel || "帮我看看" : card.result ? "看看这次改得怎样" : o.runLabel || "帮我看看") : "先连接我的 AI"}</button><button data-ai="open">AI 设置</button>${busy ? '<button data-ai="stop">停止等待</button>' : ""}</div><p class="small">${esc(o.intro || "")}</p><p class="small">${ready ? "将发送到 " + esc(config.base) + " · " + esc(config.model) : "首次配置后本页即可使用；不连接时仍可按页面提示整理材料。刷新后需重填密钥。"}</p><p role="status">${esc(card.msg)}</p>${!storageOK ? "<p>配置未能保存在浏览器，下次需重新填写。</p>" : ""}${card.result ? `<section class="ai-result"><h3>${esc(o.resultTitle || "AI 建议")}</h3><p class="small">AI 建议，最终由你决定 · 模型：${esc(card.resultModel)}</p>${stale ? '<p class="notice">当前材料和上次分析的不是同一份。以下是上一份的建议，点击按钮获得针对当前材料的分析。</p>' : ""}<pre>${esc(card.result)}</pre><div class="actions">${o.exportName ? '<button data-ai="export">导出这份建议</button>' : ""}<button data-ai="new" ${busy ? "disabled" : ""}>清除 AI 上下文，重新分析</button></div><p class="small">结果只在当前页面保留，刷新前请导出。修改材料后可再次点击复查。</p></section>` : ""}`;
      h.querySelector('[data-ai="run"]').onclick = run;
      h.querySelector('[data-ai="open"]').onclick = open;
      h.querySelector('[data-ai="stop"]')?.addEventListener("click", () =>
        controller?.abort(),
      );
      h.querySelector('[data-ai="export"]')?.addEventListener("click", () =>
        download(
          o.exportName,
          "# AI建议（非最终判定）\n\n" + card.result,
        ),
      );
      h.querySelector('[data-ai="new"]')?.addEventListener("click", () => {
        if (
          busy ||
          !confirm(
            "清除本次 AI 建议和复查上下文？输入材料不会删除，请先导出需要保留的建议。",
          )
        )
          return;
        card.result = "";
        card.lastPayload = "";
        card.msg = "已清除 AI 上下文，可在修改材料后重新分析。";
        paint();
      });
    }
    const ctl = {
      run,
      paint,
      result: () => card.result,
      busy: () => busy,
      reset: () => {
        card.result = "";
        card.lastPayload = "";
        card.msg = "";
      },
      refresh: paint,
    };
    paint();
    return ctl;
  }

  /* 材料相似度：字符二元组重合率，低于阈值视为换了一份新材料 */
  function similarity(a, b) {
    const grams = (t) => {
      const g = new Set();
      t = String(t).replace(/\s+/g, "");
      for (let i = 0; i < t.length - 1; i++) g.add(t.slice(i, i + 2));
      return g;
    };
    const A = grams(a), B = grams(b);
    if (!A.size || !B.size) return 0;
    let n = 0;
    for (const x of A) if (B.has(x)) n++;
    return n / Math.min(A.size, B.size);
  }
  function isSameDoc(card, dk, payload) {
    if (!card.result || !card.lastPayload) return false;
    if (card.docKey !== undefined && card.docKey !== dk) return false;
    return similarity(card.lastDoc ?? card.lastPayload, payload) >= 0.5;
  }
  window.workbenchAI = {
    isReady: () => ready,
    busy: () => busy,
    config: () => ({ ...config }),
    open,
    ask: request,
    advisor,
    reset: (id) => {
      const c = cards.get(id);
      if (c) {
        c.result = "";
        c.lastPayload = "";
        c.docKey = undefined;
        c.msg = "";
      }
    },
  };

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "ai-settings.css";
  document.head.appendChild(css);
})();
