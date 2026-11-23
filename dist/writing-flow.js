/* 文案页：一起写（材料→AI结构建议→自写→AI审稿）与已有稿审稿两条线。
   AI 只给结构建议和修改意见，不替用户写稿。 */
(() => {
  const KEY = "writing-work-v2",
    KEY_OLD = "writing-demo-work-v1",
    ARCHIVE = "writing-results-v2",
    ARCHIVE_OLD = "writing-demo-results-v1";
  function read(k, f) {
    try {
      return JSON.parse(localStorage.getItem(k)) || f;
    } catch {
      return f;
    }
  }
  let d = read(KEY, read(KEY_OLD, {
    mode: "",
    stage: 0,
    material: "",
    outline: "",
    accepted: false,
    text: "",
    original: "",
    review: "",
  }));
  let message = "";
  const e = (s) =>
    String(s ?? "").replace(
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
  function confirmedTopic() {
    try {
      return (
        JSON.parse(localStorage.getItem("topic-confirmed-v2")) ||
        JSON.parse(localStorage.getItem("topic-demo-confirmed-v1"))
      );
    } catch {
      return null;
    }
  }
  function keep() {
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
      if (d.mode) localStorage.setItem(KEY + "-" + d.mode, JSON.stringify(d));
      return true;
    } catch {
      message = "本地保存失败，请先导出。";
      return false;
    }
  }
  function bind(id, fn) {
    document.getElementById(id)?.addEventListener("click", fn);
  }

  const OUTLINE_SYSTEM = `你是中文创作工作台的写作结构助手。根据用户材料和内容形式给出结构建议，不写完整稿。规则：1. 只基于用户提供的真实材料，不虚构经历、数字、引语。2. 给两到三个结构方案，每个用「开头—中段—结尾」分行说明各段讲什么、起什么作用，并标注适合什么情况。3. 口播与配音 Vlog 分开处理：Vlog 可按叙事、观点、情绪的画面组织来安排段落；口播不套画面比例。4. 结尾不强制提问。5. 最后由用户选择或自行修改，你不替他定稿。`;
  const REVIEW_SYSTEM = `你是中文创作工作台的审稿助手。只审用户这篇文稿，不改写全稿。按四个标题输出：总体判断（一两句，先说该保留什么）；值得保留（引用原句并说明作用）；具体修改意见（每条：原句→为什么→建议怎么改，标「先核实／优先考虑／可选调整」优先级，最多五条，抓主要的）；待核事实（数字、身份、时间等需本人核对的点，不擅自改）。规则：保留个人风格与生活细节，不把所有段落改成同一种节奏；不预测流量；区分事实与推断；结尾不必强行提问；口播稿不套 Vlog 标准。`;

  function snapshot() {
    return {
      id: Date.now(),
      time: new Date().toISOString(),
      position: read("persona-confirmed-v1", read("persona-demo-confirmed-v1", null)),
      topic: confirmedTopic(),
      work: { ...d },
    };
  }
  function output(r) {
    const w = r.work || {},
      date = new Date(r.time),
      sections = [
        "文案工作记录",
        "记录时间：" +
          (Number.isNaN(date.getTime())
            ? "未记录"
            : date.toLocaleString("zh-CN")),
      ];
    if (w.material) sections.push("素材\n" + w.material);
    if (w.outline) sections.push("结构方案\n" + w.outline);
    sections.push(
      "保留的原稿\n" + (w.original || "未记录"),
      "当前稿件\n" + (w.text || "未填写"),
    );
    if (w.review) sections.push("AI 审稿意见（非最终判定）\n" + w.review);
    const a = document.createElement("a"),
      url = URL.createObjectURL(
        new Blob(["\uFEFF" + sections.join("\n\n──────────\n\n")], {
          type: "text/plain;charset=utf-8",
        }),
      );
    a.href = url;
    a.download = "文案工作记录_" + r.id + ".txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function archive() {
    return [...read(ARCHIVE, []), ...read(ARCHIVE_OLD, [])].sort(
      (a, b) => new Date(b.time) - new Date(a.time),
    );
  }
  function saveArchive(r) {
    const list = read(ARCHIVE, []);
    list.unshift(r);
    localStorage.setItem(ARCHIVE, JSON.stringify(list));
  }

  function tab(id, label, on) {
    return '<button id="' + id + '" role="tab" class="wf-tab' + (on ? " on" : "") + '" aria-selected="' + on + '">' + label + "</button>";
  }
  function steps() {
    if (!d.mode || d.stage === 9) return "";
    const names = d.mode === "new" ? ["放材料、定结构", "自己写稿、AI 审", "保存结果"] : ["贴稿", "看意见、自己改", "保存结果"];
    const cur = d.stage === 0 ? 0 : d.review ? 2 : 1;
    return '<ol class="wf-steps">' + names.map((n, i) => '<li class="' + (i < cur ? "done" : i === cur ? "cur" : "") + '"><b>' + (i + 1) + "</b>" + n + "</li>").join("") + "</ol>";
  }
  function mount() {
    if (page !== "writing") return;
    const records = archive();
    app.innerHTML =
      '<section class="panel"><div class="eyebrow">03 / 文案</div><h1>写完这一篇，保存结果</h1><p>AI 给结构建议和修改意见，稿由你写。</p><div class="wf-tabs" role="tablist">' +
      tab("wf-new", "帮我一起写", d.stage !== 9 && d.mode === "new") +
      tab("wf-existing", "我已有稿，帮我审", d.stage !== 9 && d.mode === "existing") +
      tab("wf-list", "已保存结果（" + records.length + "）", d.stage === 9) +
      "</div>" +
      steps() +
      (message ? '<p class="wf-msg" role="status">' + e(message) + "</p>" : "") +
      '<div id="wf-body"></div></section>';
    message = "";
    function start(mode) {
      if (d.mode !== mode) {
        if (!keep()) {
          mount();
          return;
        }
        const cached = read(KEY + "-" + mode, null);
        const t = confirmedTopic();
        d =
          cached && cached.mode === mode
            ? cached
            : {
                mode,
                stage: 0,
                material: mode === "new" ? t?.summary || "" : "",
                outline: "",
                text: "",
                original: "",
                review: "",
                accepted: false,
              };
        if (!cached) {
          window.workbenchAI?.reset?.("wf-outline");
          window.workbenchAI?.reset?.("wf-review-" + mode);
        }
      }
      d.stage = 0;
      message =
        d.text || d.outline
          ? "已恢复你上次没写完的内容；不需要可点下方「清空」。"
          : "";
      keep();
      mount();
      document.getElementById("wf-input")?.scrollIntoView({ block: "center" });
    }
    bind("wf-new", () => start("new"));
    bind("wf-existing", () => start("existing"));
    bind("wf-list", () => {
      d.stage = 9;
      keep();
      mount();
    });
    const box = document.getElementById("wf-body");

    if (d.stage === 9) {
      box.innerHTML =
        "<h2>已保存结果</h2><p>保存在此浏览器，不跨设备同步，建议导出备份。</p>" +
        (records.length
          ? records
              .map(
                (r, i) =>
                  '<div class="row">' +
                  e(
                    (r.time || "").slice(0, 10) +
                      " · " +
                      (r.work?.mode === "existing" ? "已有稿" : "一起写") +
                      (r.kind === "demo" || r.work?.kind === "demo"
                        ? " · 旧演示"
                        : ""),
                  ) +
                  ' <button id="open-' +
                  i +
                  '">重新打开</button><button id="export-' +
                  i +
                  '">导出</button></div>',
              )
              .join("")
          : '<p class="empty">还没有保存过结果。</p>');
      records.forEach((r, i) => {
        bind("open-" + i, () => {
          d = { ...r.work, stage: 1 };
          keep();
          mount();
        });
        bind("export-" + i, () => output(r));
      });
      return;
    }
    if (!d.mode) {
      box.innerHTML =
        "<p>从零写稿选「帮我一起写」；已有稿件选「帮我审」，无需重填定位和选题。</p>";
      return;
    }

    /* ---------- 一起写 · 第 0 步：材料 → AI 结构建议 ---------- */
    if (d.mode === "new" && d.stage === 0) {
      box.innerHTML =
        "<h2>先放材料，再定结构</h2>" +
        '<label for="wf-input">你的经历 / 原话 / 已有材料</label><textarea id="wf-input" rows="7" placeholder="把要讲的素材写下来，越具体越好">' +
        e(d.material) +
        '</textarea><label for="wf-form">内容形式</label><select id="wf-form"><option ' +
        (state.form !== "口播" ? "selected" : "") +
        '>配音 Vlog</option><option ' +
        (state.form === "口播" ? "selected" : "") +
        '>口播</option></select><div id="wf-outline-adv"></div><label for="wf-outline">结构方案（可写、可贴 AI 建议中的一版）</label><textarea id="wf-outline" rows="5" placeholder="开头讲什么？中间有哪些事情？最后停在哪里？">' +
        e(d.outline) +
        '</textarea><label><input type="checkbox" id="wf-accept" style="width:auto" ' +
        (d.accepted ? "checked" : "") +
        '>我确认这版结构，可以开始写稿</label><div class="actions"><button id="wf-next" disabled>进入写稿 →</button><button id="wf-clear" class="link">清空重来</button></div>';
      const input = box.querySelector("#wf-input"),
        outlineEl = box.querySelector("#wf-outline"),
        acceptEl = box.querySelector("#wf-accept"),
        nextEl = box.querySelector("#wf-next"),
        formEl = box.querySelector("#wf-form");
      const check = () => {
        nextEl.disabled = !d.accepted || !d.outline.trim();
        nextEl.classList.toggle("primary", !nextEl.disabled);
      };
      input.oninput = () => {
        d.material = input.value;
        keep();
      };
      formEl.onchange = () => {
        state.form = formEl.value;
        save();
      };
      outlineEl.oninput = () => {
        d.outline = outlineEl.value;
        d.accepted = false;
        acceptEl.checked = false;
        keep();
        check();
      };
      acceptEl.onchange = () => {
        d.accepted = acceptEl.checked;
        keep();
        check();
      };
      window.workbenchAI.advisor(box.querySelector("#wf-outline-adv"), {
        id: "wf-outline",
        intro:
          "发送上方材料与内容形式，AI 给两到三个结构方案供你选择或改写，不写完整稿。",
        runLabel: "给我几个结构方案",
        system: OUTLINE_SYSTEM,
        docKey: () => input.value + "|" + formEl.value,
        payload: () =>
          "【内容形式】" +
          formEl.value +
          "\n\n【我的材料】\n" +
          input.value,
        emptyMessage: "先写下你的材料，再让 AI 给结构建议。",
        maxTokens: 1800,
        resultTitle: "结构方案建议",
        exportName: "结构方案_AI建议.md",
      });
      nextEl.onclick = () => {
        d.stage = 1;
        keep();
        mount();
        window.scrollTo(0, 0);
      };
      box.querySelector("#wf-clear").onclick = () => {
        if (!confirm("清空本次的材料、结构和稿件，重新开始？")) return;
        d = { mode: "new", stage: 0, material: "", outline: "", accepted: false, text: "", original: "", review: "" };
        window.workbenchAI.reset("wf-outline");
        window.workbenchAI.reset("wf-review-new");
        keep();
        mount();
      };
      check();
      return;
    }

    /* ---------- 已有稿 · 第 0 步：粘贴原稿 ---------- */
    if (d.mode === "existing" && d.stage === 0) {
      box.innerHTML =
        "<h2>粘贴你的已有稿件</h2><textarea id=\"wf-input\" rows=\"9\" placeholder=\"把已有文稿贴在这里\">" +
        e(d.text) +
        '</textarea><div class="actions"><button id="wf-next" class="primary" ' +
        (d.text.trim() ? "" : "disabled") +
        '>保存原稿，去审稿</button><button id="wf-case" class="link">看看审稿意见长什么样（示例）</button><button id="wf-clear" class="link">清空重填</button></div>';
      const input = box.querySelector("#wf-input");
      input.oninput = () => {
        d.text = input.value;
        keep();
        box.querySelector("#wf-next").disabled = !d.text.trim();
      };
      bind("wf-case", () => window.reviewCase.mount(box));
      box.querySelector("#wf-clear").onclick = () => {
        d = { mode: "existing", stage: 0, material: "", outline: "", accepted: false, text: "", original: "", review: "" };
        window.workbenchAI.reset("wf-review-existing");
        keep();
        mount();
      };
      bind("wf-next", () => {
        d.original = d.text;
        d.stage = 1;
        keep();
        mount();
      });
      return;
    }

    /* ---------- 写稿 + AI 审稿（两种模式共用第 1 步） ---------- */
    box.innerHTML =
      (d.mode === "new"
        ? "<h2>按确认的结构写稿，写完让 AI 审</h2><details><summary>查看已确认的结构</summary><pre style=\"white-space:pre-wrap\">" +
          e(d.outline) +
          "</pre></details>"
        : "<h2>稿件与审稿</h2><details><summary>保留的原稿（只读）</summary><pre style=\"white-space:pre-wrap\">" +
          e(d.original) +
          "</pre></details>") +
      '<label for="wf-text">' +
      (d.mode === "new" ? "在这里写你的逐字稿" : "当前稿件（自行修改）") +
      '</label><textarea id="wf-text" rows="10">' +
      e(d.text) +
      '</textarea><div id="wf-review-adv"></div><div class="actions wf-foot"><button id="wf-save"' + (d.review ? ' class="primary"' : "") + '>保存结果</button><button id="wf-export">导出稿件和意见</button><button id="wf-back" class="link">← 返回上一步</button></div>';
    const textEl = box.querySelector("#wf-text");
    textEl.oninput = () => {
      d.text = textEl.value;
      state.draft = textEl.value;
      save();
      keep();
      clearTimeout(textEl._t);
      textEl._t = setTimeout(() => reviewAdv?.paint(), 400);
    };
    if (d.text && !state.draft) {
      state.draft = d.text;
      save();
    }
    const reviewAdv = window.workbenchAI.advisor(box.querySelector("#wf-review-adv"), {
      id: "wf-review-" + d.mode,
      intro:
        "发送当前稿件" +
        (d.mode === "new" ? "与已确认的结构" : "") +
        "，AI 给逐条修改意见，不替你改稿。",
      runLabel: "审我的稿",
      system: REVIEW_SYSTEM,
      docKey: () => (d.mode === "new" ? d.outline : d.original),
      docText: () => d.text,
      payload: () =>
        (d.mode === "new" && d.outline
          ? "【已确认的结构】\n" + d.outline + "\n\n"
          : "") +
        "【内容形式】" +
        state.form +
        "\n\n【稿件】\n" +
        d.text,
      emptyMessage: "先写出或粘贴稿件内容，再点审稿。",
      maxTokens: 2200,
      resultTitle: "审稿意见",
      onResult: (text) => {
        d.review = text;
        keep();
        document.getElementById("wf-save")?.classList.add("primary");
        document.querySelectorAll(".wf-steps li").forEach((li, i) => (li.className = i < 2 ? "done" : "cur"));
      },
    });
    bind("wf-back", () => {
      d.stage = 0;
      keep();
      mount();
    });
    bind("wf-export", () => output(snapshot()));
    bind("wf-save", () => {
      try {
        saveArchive(snapshot());
        message = "已保存结果，可在「已保存结果」里重新打开和导出。";
        mount();
      } catch {
        message = "保存失败，请先导出备份。";
        mount();
      }
    });
  }
  function references() {
    if (!["topic", "writing", "review"].includes(page)) return;
    const panel = document.createElement("details");
    panel.className = "source";
    panel.innerHTML =
      "<summary>方法参考与本页边界</summary><p>" +
      {
        topic:
          "给谁看、为什么值得看、真实材料与表达，是工作台提出建议时参考的维度，不是要求用户先完成的判断。",
        writing:
          "素材挖掘、结构方案、口播与配音 Vlog、改稿与复查保留为方法参考。口播和 Vlog 分开处理，原稿保留，修改须经用户同意。",
        review:
          "看成片只给修改意见：哪里值得保留、哪个时间点有什么问题、为什么、建议怎么改及优先级。修改后可复查。不直接剪片、不修改工程；自动审片按文稿判断，画面相关的都标注推测。",
      }[page] +
      "</p>";
    app.append(panel);
  }
  const previous = render;
  render = function () {
    previous();
    mount();
    references();
  };
  window.addEventListener("ai-state-change", () => {
    if (page === "writing") mount();
  });
  mount();
  references();
})();
