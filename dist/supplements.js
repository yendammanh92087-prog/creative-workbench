/* 方法依据与工作表模板。依据为工作台内置整理，不执行 AI 判断；
   拍摄页与审片页的 AI 建议卡在此挂载。 */
const supplementVersion = "1.0";
const refs = {
  deep: {
    name: "提问与深挖",
    scope:
      "面对抽象人设或价值判断时，先追问具体事实再下结论；缺事实先问，不替本人编造。不是所有选题的准入门槛。",
  },
  edit: {
    name: "文案修改工作法",
    scope:
      "删减先看上下文；改稿保留原稿与修改记录，复查只核对已接受的修改项。",
  },
  frame: {
    name: "画面叙事方法（叙事—观点—情绪）",
    scope:
      "用于配音 Vlog 的写作及画面组织，不机械套时长比例，不套进口播。",
  },
  xue: {
    name: "内容与受众自检",
    scope:
      "内容方向、观看价值和自检提示的参考维度；自检通过不等于效果验证。",
  },
  mu: {
    name: "双身份定位法",
    scope:
      "从社会身份与商业身份两条线看人设；不以单一流量现象自动推断身份问题。",
  },
  zhou: {
    name: "商业定位方法",
    scope:
      "商业目标明确时，可先想商业、再想内容、最后完善人设；不是强迫所有人变现。",
  },
  liPersona: {
    name: "人设记忆点方法",
    scope:
      "通过反复呈现真实细节形成记忆点；是表达建议，不是真实性审核规则。",
  },
};
const refRoutes = {
  position: ["mu", "zhou", "xue", "liPersona"],
  topic: ["deep", "xue"],
  writing: ["deep", "edit", "frame", "xue"],
  shoot: ["frame", "edit"],
  review: ["edit", "frame"],
};
const spec = {
  vlog: {
    title: "配音 Vlog 分镜表",
    cols: [
      "文案锚点",
      "主要作用：事件／情绪／观点",
      "画面动作或对象",
      "景别／视角",
      "已有素材及出处",
      "补拍／示意说明",
      "预计时长或剪切依据",
    ],
    why: "锚点避免画面跑题；作用决定拍什么；景别与视角服务表达；素材出处区分真实记录与示意；时长是计划，不是统一硬阈值。",
    sample: [
      "给猫洗澡花了120元",
      "事件",
      "真实洗护过程或账单，隐私打码",
      "手部近景／平视",
      "需由创作者确认是否存在",
      "没有现场素材不虚构；可本人讲述",
      "依原声和动作完整性决定",
    ],
  },
  spoken: {
    title: "口播拍摄清单",
    cols: [
      "段落／台词锚点",
      "不可改的事实或原话",
      "机位／构图",
      "收音与环境",
      "是否需要补充素材",
      "Take／待核问题",
    ],
    why: "台词锚点便于回看；事实项保护数字与身份；机位和收音为制作准备；补充素材按需，不要求每句话插画面；Take记录保留选择依据。",
    sample: [
      "开头：120元与39元的对比",
      "金额须按本人确认及实拍口播核对",
      "人物稳定构图，文字预留空间",
      "先试听一小段，确认人声清楚",
      "不强制；有真实账单可候选",
      "未拍摄／待核",
    ],
  },
  writingCheck: {
    title: "文案修改复查表",
    cols: [
      "旧版／段落位置",
      "原问题及证据",
      "接受的修改项",
      "新版／对应位置",
      "复查结果",
      "新增问题／保留理由",
    ],
    why: "只复查已接受的修改；每行记录版本与位置，不能把重新写一遍当成复查。结果填未检查／已解决／未解决／不适用。",
    sample: [
      "示例旧稿·中段",
      "两句表达同一结论，需结合上下文确认",
      "尚未确认，不执行删减",
      "待填写",
      "未检查",
      "不得自动判定通过",
    ],
  },
  filmCheck: {
    title: "成片修改复查表",
    cols: [
      "旧版／时间位置",
      "原问题及证据",
      "接受的修改项",
      "新版／时间位置",
      "复查结果",
      "新增问题／保留理由",
    ],
    why: "段落评审可记段级时间；精确字幕或切字问题须核原音和词级时间。旧问题、接受项、新版三者齐全才能复查。",
    sample: [
      "示例旧版·00:10附近",
      "字幕与口播疑似不同，尚未听校",
      "先核原音；未授权自动改事实",
      "待填写",
      "未检查",
      "未查看视频不能宣布已解决",
    ],
  },
};
let rows = {};
try {
  rows = JSON.parse(localStorage.getItem("workbench-tables-v1") || "{}");
} catch (e) {}
function tableSave() {
  try {
    localStorage.setItem("workbench-tables-v1", JSON.stringify(rows));
    $("#status").textContent = "模板记录已保存到此浏览器";
  } catch (e) {
    $("#status").textContent = "保存失败，请先导出模板";
  }
}
function tableText(k) {
  const s = spec[k];
  return (
    "# " +
    s.title +
    "\n\n工作台模板，按需调整使用。\n\n" +
    (rows[k] || [])
      .map(
        (r, i) =>
          "## 第" +
          (i + 1) +
          "项\n" +
          s.cols.map((c, j) => c + "：" + (r[j] || "待填写")).join("\n"),
      )
      .join("\n\n")
  );
}
function editableTable(k) {
  const s = spec[k];
  rows[k] ??= [s.cols.map(() => "")];
  return `<section class="panel"><h2>${s.title}<span class="tag">可填写</span></h2><p>${s.why}</p><div class="table-scroll"><table class="work-table"><thead><tr>${s.cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows[k].map((r, i) => `<tr>${s.cols.map((c, j) => `<td><textarea aria-label="${s.title}第${i + 1}行${c}" data-table="${k}" data-row="${i}" data-col="${j}">${esc(r[j] || "")}</textarea></td>`).join("")}</tr>`).join("")}</tbody></table></div><div class="actions"><button data-add="${k}">增加一行</button><button data-sample="${k}">追加示范行</button><button data-table-export="${k}">导出这张表</button></div><p class="small">示范行为填写示例，不是已拍素材或已验证案例；追加不覆盖已有内容。</p><div id="ai-table-${k}"></div></section>`;
}
function sourcesPanel(keys) {
  return `<details class="panel"><summary>方法依据与适用边界</summary><p>以下为工作台内置整理的方法方向，供 AI 建议和你的判断参考；不是课程原文，也不保证效果。</p>${keys
    .map((k) => {
      const r = refs[k];
      return `<div class="row"><h3>${r.name}</h3><p>${r.scope}</p></div>`;
    })
    .join("")}</details>`;
}
function passagePanel() {
  return `<details class="panel"><summary>段落怎么取舍？查看依据与判断提示</summary><p>先看整段的作用和上下文，再提出保留、删除、压缩或挪位建议。这里提供依据，不自动判留删。</p>
<div class="row"><h3>保留：这几秒是否让情绪或人物被看见？</h3><p>方法笔记：“停顿非常重要”“让张力悬置”“让观众充分反应”。</p><p class="small">提示：停顿可能有功能，但不能据此认为每个停顿都该留。</p></div>
<div class="row"><h3>删除：这段与当前主线有什么关系？</h3><p>方法笔记：“任何不强相关的信息都会削弱势能”。</p><p class="small">提示：先核主题、人物、情绪和前后衔接；说明删掉会失去什么，不以字数或单一标签判定。</p></div>
<div class="row"><h3>压缩：该展开体验，还是概述带过？</h3><p>方法笔记：注意时长和叙事密度——详写与略写、旁白概述与现场展开的区别。</p><p class="small">提示：比较展开与概述的作用，不把高密度等同于越短越好，不能切掉必要前提和反应。</p></div>
<div class="row"><h3>挪位：顺序是否让人更容易进入、愿意往下看？</h3><p>方法笔记：多数时候为了高效叙事，可以直接让问题和危机先出现，而非舒缓的人物登场。</p><p class="small">提示：这是故事叙事的可选路径，不要求所有口播或 Vlog 强造冲突；并列切片也不能自动判成错误。</p></div>
<p class="notice">四种动作的归类及提示是工作台整理，不冒称任何课程原版框架；留删仍由创作者决定。</p></details>`;
}

/* AI 建议填表：把返回文本解析成表格行（JSON 数组，元素可为数组或按列名取值的对象）。 */
function rowsFromAI(text, cols) {
  const m = String(text).match(/\[[\s\S]*\]/);
  if (!m) return null;
  let a;
  try {
    a = JSON.parse(m[0]);
  } catch {
    return null;
  }
  if (!Array.isArray(a)) return null;
  const parsed = a
    .map((r) =>
      Array.isArray(r)
        ? cols.map((c, j) => String(r[j] ?? ""))
        : cols.map((c) => String(r?.[c] ?? "")),
    )
    .filter((r) => r.some((x) => x.trim()));
  return parsed.length ? parsed : null;
}
function draftText() {
  if (state.draft?.trim()) return state.draft;
  try {
    const w = JSON.parse(localStorage.getItem("writing-work-v2"));
    if (w?.text?.trim()) return w.text;
  } catch {}
  try {
    const a = JSON.parse(localStorage.getItem("writing-results-v2"));
    if (a?.[0]?.work?.text?.trim()) return a[0].work.text;
  } catch {}
  return state.material || "";
}
const SHOOT_SYSTEM = (cols) =>
  `你是中文创作工作台的拍摄准备助手。根据稿件与内容形式，把稿件拆成可执行的准备表。只输出 JSON 数组，不要其他文字：每项对应一行，字段依次为「${cols.join("」「")}」。规则：按稿件段落顺序；素材不确定是否存在时写「需本人确认」，不虚构素材；口播不要求每句插画面；配音 Vlog 按文案锚点对位画面作用；时长写估计，不当硬规则。最多 10 行。`;
const FILM_SYSTEM = `你是中文创作工作台的审片助手。用户提供带时间码的文稿或字幕（可能附人工记录）。你没有看到画面，只能按文字判断。按四个标题输出：总体判断；值得保留（引用时间点与原句）；具体修改意见（每条：时间点／原句→问题→建议，标「先核实／优先考虑／可选调整」）；待核事实（需要回看成片或本人确认的点，注明「未看成片，仅按文字判断」）。规则：涉及画面、节奏、气口的判断都标注为推测；不预测流量；不替用户决定删留。`;

function mountShootAI() {
  if (page !== "shoot" || !["口播", "配音 Vlog"].includes(state.form)) return;
  const k = state.form === "口播" ? "spoken" : "vlog";
  const host = document.getElementById("ai-table-" + k);
  if (!host) return;
  window.workbenchAI.advisor(host, {
    id: "shoot-" + k,
    intro:
      "发送当前稿件与形式，AI 按表格列给出建议行，自动追加到上表（不覆盖已有行），你可再修改。",
    runLabel: "按稿件建议填表",
    system: SHOOT_SYSTEM(spec[k].cols),
    payload: () =>
      "【内容形式】" + state.form + "\n\n【稿件】\n" + draftText(),
    emptyMessage:
      "还没有可用稿件。先在「03 文案」写好稿，或在此页的拍摄清单里手动记录。",
    maxTokens: 2400,
    resultTitle: "建议行（已追加到上表）",
    onResult: (text, ctl) => {
      const parsed = rowsFromAI(text, spec[k].cols);
      if (!parsed) {
        return;
      }
      rows[k].push(...parsed);
      tableSave();
      setTimeout(render, 50);
    },
  });
}
function mountFilmAI() {
  if (page !== "review") return;
  if (document.getElementById("film-ai-panel")) return;
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.id = "film-ai-panel";
  panel.innerHTML =
    '<h2>按文稿审片</h2><p>粘贴带时间码的文稿或字幕，AI 按文字给修改意见；画面相关结论会标注为推测。视频仍在上方本地播放，不上传。</p><label for="film-transcript">文稿 / 字幕（带时间码更好）</label><textarea id="film-transcript" rows="8" placeholder="例如：&#10;0:00 开头第一句话……&#10;0:08 第二句……"></textarea><div id="film-advisor"></div>';
  const insertBefore = app.querySelector(".two");
  app.insertBefore(panel, insertBefore || null);
  const t = panel.querySelector("#film-transcript");
  try {
    t.value = localStorage.getItem("film-transcript-v1") || "";
  } catch {}
  t.oninput = () => {
    try {
      localStorage.setItem("film-transcript-v1", t.value);
    } catch {}
  };
  window.workbenchAI.advisor(panel.querySelector("#film-advisor"), {
    id: "film-review",
    intro: "发送上方文稿。AI 没有看到视频画面，只按文字判断。",
    runLabel: "按文稿审片",
    system: FILM_SYSTEM,
    payload: () => "【文稿 / 字幕】\n" + t.value,
    emptyMessage: "先粘贴文稿或字幕，再点审片。",
    maxTokens: 2400,
    resultTitle: "审片意见",
    exportName: "审片意见_AI建议.md",
  });
}

const renderBase = render;
render = function () {
  renderBase();
  let html = "";
  if (page === "topic")
    html += `<section class="panel"><h2>什么情况下先追问？</h2><div class="row">只有方向：可以先列探索方向，但不宣称选题已经成立。</div><div class="row">抽象能力或人设判断：追问具体条件、行动与证据。</div><div class="row">数字、身份、引用不确定：标待核，不替本人填事实。</div><div class="row">生活观察或情绪：可以从真实场景继续挖，不强制补成就数字。一次只问当前最关键的一件事。</div></section>`;
  if (page === "shoot") {
    if (["口播", "配音 Vlog"].includes(state.form))
      html += editableTable(state.form === "口播" ? "spoken" : "vlog");
    html += `<details class="panel"><summary>模板使用说明</summary><p>分镜字段按文案与画面对位、景别视角、已有素材与补拍的逻辑设计。口播表按制作准备与回看核对的需求整理；是工作台模板，可增删行，不是必须照填的表单。</p></details>`;
  }
  if (page === "review")
    html +=
      editableTable("filmCheck") +
      passagePanel() +
      `<details class="panel"><summary>自动检查与人工判断的边界</summary><div class="row">本页已实现：本地视频播放、插入当前时间、文稿审片建议、记录与导出；不分析视频文件本身。</div><div class="row">AI 文稿审片：只看文字，画面相关的判断会标注为推测。</div><div class="row">人工决定：段落删留、气口舒适度、情绪作用、人物表达、最终事实核准。</div></details>`;
  if (refRoutes[page]) html += sourcesPanel(refRoutes[page]);
  if (page === "help") {
    app.innerHTML =
      hero(
        "使用说明",
        "这个工作台怎么帮你",
        "免费使用；AI 调用走你自己的服务商额度，也可以先不连接、只当整理工具。",
      ) +
      `<section class="panel">
      <h3>五步流程</h3>
      <div class="row"><strong>01 定位</strong>　五问加四段自我介绍，AI 帮你分析哪里清楚、哪里要补，给一版暂定定位。</div>
      <div class="row"><strong>02 选题</strong>　四个问题把想法说清楚，或直接把已有选题交给 AI 判断。</div>
      <div class="row"><strong>03 文案</strong>　AI 给结构方案供你选择，稿由你写；写完 AI 逐条提修改意见。</div>
      <div class="row"><strong>04 准备拍摄</strong>　按口播或配音 Vlog，AI 建议填写拍摄清单，你确认后执行。</div>
      <div class="row"><strong>05 看成片</strong>　本地播放视频，粘贴文稿让 AI 按文字审；删留由你决定。</div>
      <h3>关于 AI 与费用</h3>
      <div class="row">点右上角「AI 设置」，选一个服务商填入自己的 API Key 即可。工作台本身免费，模型调用费用由你的服务商收取（文本分析通常每条几分钱以内，具体看服务商价目）。</div>
      <div class="row">没有 API Key 也能用：所有填写、整理、导出、本地播放都能用，只是 AI 建议不会出现。</div>
      <h3>隐私与边界</h3>
      <div class="row">材料保存在你的浏览器本地；只有你点 AI 按钮时，对应当前步骤的材料才会发给你设置的服务商。密钥只存在页面内存，刷新需重填。</div>
      <div class="row">AI 只给建议：不替你写稿、不预测流量、不下分数；事实类内容它会标「待核」由你确认。导出功能在每一步的页面里。</div>
      </section>`;
  }
  app.insertAdjacentHTML("beforeend", html);
  mountShootAI();
  mountFilmAI();
  document.querySelectorAll("[data-table]").forEach(
    (e) =>
      (e.oninput = () => {
        rows[e.dataset.table][+e.dataset.row][+e.dataset.col] = e.value;
        tableSave();
      }),
  );
  document.querySelectorAll("[data-add]").forEach(
    (e) =>
      (e.onclick = () => {
        rows[e.dataset.add].push(spec[e.dataset.add].cols.map(() => ""));
        tableSave();
        render();
      }),
  );
  document.querySelectorAll("[data-sample]").forEach(
    (e) =>
      (e.onclick = () => {
        rows[e.dataset.sample].push([...spec[e.dataset.sample].sample]);
        tableSave();
        render();
      }),
  );
  document
    .querySelectorAll("[data-table-export]")
    .forEach(
      (e) =>
        (e.onclick = () =>
          download(
            spec[e.dataset.tableExport].title + ".md",
            tableText(e.dataset.tableExport),
          )),
    );
};
const originalRecord = record;
record = function () {
  return (
    originalRecord() +
    "\n\n" +
    Object.keys(spec)
      .map((k) => tableText(k))
      .join("\n\n")
  );
};
const css = document.createElement("style");
css.textContent =
  ".table-scroll{overflow-x:auto}.work-table{border-collapse:collapse;width:100%;min-width:860px}.work-table th,.work-table td{padding:8px;text-align:left;border:1px solid var(--line);vertical-align:top}.work-table th{font-size:12px;background:var(--light)}.work-table textarea{min-width:110px;min-height:110px;font-size:13px;padding:8px}";
document.head.appendChild(css);
window.addEventListener("ai-state-change", () => {
  if (page === "shoot" || page === "review") render();
});
render();
