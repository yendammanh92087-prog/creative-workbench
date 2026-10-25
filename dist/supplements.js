/* 产品试用模板；知识真源留在 Obsidian。此文件不执行 AI 判断。 */
const supplementVersion='2026-10-25';
const refs={
 deep:{name:'引导问答深挖法',path:'账号底座/references/引导问答深挖法.md',part:'适用范围、§一、§二、§四',scope:'抽象人设／价值判断；缺事实先追问，不替本人编造。不是所有选题的准入门槛。',source:'本轮回读执行文件；融新经验整理，不冒称课程原表',adopt:'原账号已进执行文件；通用产品适配待试用',test:'文件有猎头系列3应用记录；本产品未验证效果'},
 edit:{name:'文案线工作法',path:'账号底座/references/文案线工作法.md',part:'§4第4条、§6.1、§11.1',scope:'删减先看上下文；录制回看须核对事实与原音。账号经验不能直接当普适阈值。',source:'本轮回读正文',adopt:'原账号执行口径；产品模板是 North 整理',test:'有第1期误删纠错记录；不等于所有形式验证通过'},
 frame:{name:'画面方法说明：叙事—观点—情绪',path:'工作区/拆解/拆解包/画面方法说明_叙事观点情绪_1004.md',part:'§〇、总判断器、事件／观点／情绪表',scope:'334用于 Vlog 写作及画面组织，不机械套时长比例，不套进口播；本次按融新确认口径执行。',source:'库内课件整理；本轮未重新逐张核原图',adopt:'融新本轮明确 Vlog 可用；不改写历史文件',test:'本产品尚无成片级验证'},
 xue:{name:'薛辉方法卡候选',path:'工作区/拆解/拆解包/薛辉_网盘盘点_1006/03_薛辉方法卡候选.md',part:'M2–M5、M17、M25',scope:'内容方向、观看价值和自检提示；不把教材核清当成效果验证。',source:'库内已核教材卡；本次沿用此前回读',adopt:'候选方法；不自动提升为通用硬规则',test:'本产品未实测'},
 mu:{name:'木子双身份',path:'工作区/拆解/拆解包/木子_方法证据_1006/02_木子方法卡.md',part:'卡8；D1 3:48:28–3:48:48（仅引用双身份定义）',scope:'社会身份与商业身份挖掘人设；不以单一流量现象自动推断身份问题。',source:'此前回读转写与核验记录',adopt:'定位目录已获融新确认',test:'账号应用记录不等于普适因果证据'},
 zhou:{name:'周百见线收口核验报告',path:'工作区/拆解/拆解包/周百见_收口核验_1007/周百见线收口核验报告_20261007.md',part:'§2.1–2.4',scope:'商业目标明确时，先商业、再内容、后人设；不是强迫全部用户变现。',source:'库内报告；原始咨询逐字稿权限受限，未重听原声',adopt:'用于有商业目标的追问参考',test:'本产品未验证；已填写样例已入库，空白模板原件未取得'},
 liPersona:{name:'Don课程·李老师的人设表达',path:'工作区/拆解/拆解包/don课_广州26.06/提炼笔记/day1_part3.md',part:'day1_9 23:03–23:55；人设与超级符号',scope:'反复呈现具体细节形成记忆点；不是真实性审核规则。讲者为嘉宾老李。',source:'回读提炼笔记与机器转写；未重听原声',adopt:'用于人设表达参考',test:'本产品未验证'},
 li:{name:'Don课程·嘉宾李老师',path:'工作区/拆解/拆解包/don课_广州26.06/提炼笔记/day2_part2.md',part:'讲者说明；day2_5 43:00–43:25（用户、形式、风格与价值定位）',scope:'Don负责内容层，李讲短视频技巧；具体定位讲解注明嘉宾，不署作 Don 本人原话。',source:'此前回读讲者说明与机器转写',adopt:'按融新确认分工引用',test:'未完成全课程逐条署名审计'}
};
const refRoutes={position:['mu','zhou','xue','liPersona','li'],topic:['deep','xue'],writing:['deep','edit','frame','xue'],shoot:['frame','edit'],review:['edit','frame']};
const spec={
 vlog:{title:'配音 Vlog 分镜表',cols:['文案锚点','主要作用：事件／情绪／观点','画面动作或对象','景别／视角','已有素材及出处','补拍／示意说明','预计时长或剪切依据'],why:'锚点避免画面跑题；作用决定拍什么；景别与视角服务表达；素材出处区分真实记录与示意；时长是计划，不是统一硬阈值。',sample:['给猫洗澡花了120元','事件','真实洗护过程或账单，隐私打码','手部近景／平视','需由创作者确认是否存在','没有现场素材不虚构；可本人讲述','依原声和动作完整性决定']},
 spoken:{title:'口播拍摄清单',cols:['段落／台词锚点','不可改的事实或原话','机位／构图','收音与环境','是否需要补充素材','Take／待核问题'],why:'台词锚点便于回看；事实项保护数字与身份；机位和收音为制作准备；补充素材按需，不要求每句话插画面；Take记录保留选择依据。',sample:['开头：120元与39元的对比','金额须按本人确认及实拍口播核对','人物稳定构图，文字预留空间','先试听一小段，确认人声清楚','不强制；有真实账单可候选','未拍摄／待核']},
 writingCheck:{title:'文案修改复查表',cols:['旧版／段落位置','原问题及证据','接受的修改项','新版／对应位置','复查结果','新增问题／保留理由'],why:'只复查已接受的修改；每行记录版本与位置，不能把重新写一遍当成复查。结果填未检查／已解决／未解决／不适用。',sample:['示例旧稿·中段','两句表达同一结论，需结合上下文确认','尚未确认，不执行删减','待填写','未检查','不得自动判定通过']},
 filmCheck:{title:'成片修改复查表',cols:['旧版／时间位置','原问题及证据','接受的修改项','新版／时间位置','复查结果','新增问题／保留理由'],why:'段落评审可记段级时间；精确字幕或切字问题须核原音和词级时间。旧问题、接受项、新版三者齐全才能复查。',sample:['示例旧版·00:10附近','字幕与口播疑似不同，尚未听校','先核原音；未授权自动改事实','待填写','未检查','未查看视频不能宣布已解决']}
};
let rows={};try{rows=JSON.parse(localStorage.getItem('workbench-tables-v1')||'{}')}catch(e){}
function tableSave(){try{localStorage.setItem('workbench-tables-v1',JSON.stringify(rows));$('#status').textContent='模板记录已保存到此浏览器'}catch(e){$('#status').textContent='保存失败，请先导出模板'}}
function tableText(k){const s=spec[k];return '# '+s.title+'\n\nNorth 产品试用模板，非课程原表；尚未验证成片效果。\n\n'+(rows[k]||[]).map((r,i)=>'## 第'+(i+1)+'项\n'+s.cols.map((c,j)=>c+'：'+(r[j]||'待填写')).join('\n')).join('\n\n')}
function editableTable(k){const s=spec[k];rows[k]??=[s.cols.map(()=> '')];return `<section class="panel"><h2>${s.title}<span class="tag">可填写 · 试用模板</span></h2><p>${s.why}</p><div class="table-scroll"><table class="work-table"><thead><tr>${s.cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows[k].map((r,i)=>`<tr>${s.cols.map((c,j)=>`<td><textarea aria-label="${s.title}第${i+1}行${c}" data-table="${k}" data-row="${i}" data-col="${j}">${esc(r[j]||'')}</textarea></td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="actions"><button data-add="${k}">增加一行</button><button data-sample="${k}">追加示范行</button><button data-table-export="${k}">导出这张表</button></div><p class="small">示范行为 North 编写的填写示例，不是已拍素材或已验证案例；追加不覆盖已有内容。</p></section>`}
function sourcesPanel(keys){return `<details class="panel"><summary>方法依据与适用边界（后台明细）</summary><p>只登记出处和产品适配摘要，不复制课程正文。知识真源仍在 Obsidian，当前不是实时检索。</p>${keys.map(k=>{const r=refs[k];return `<div class="row"><h3>${r.name}</h3><p>${r.scope}</p><p class="small" style="overflow-wrap:anywhere">出处：${r.path} · ${r.part}</p><p class="small">来源核验：${r.source}<br>采用状态：${r.adopt}<br>应用验证：${r.test}</p></div>`}).join('')}</details>`}
function passagePanel(){return `<details class="panel"><summary>段落怎么取舍？查看依据与判断提示</summary><p>先看整段的作用和上下文，再提出保留、删除、压缩或挪位建议。这里提供依据，不自动判留删。</p>
<div class="row"><h3>保留：这几秒是否让情绪或人物被看见？</h3><p>笔记原文：“停顿非常重要”“让张力悬置”“让观众充分反应”。</p><p class="small">出处：23时间的语法.txt · 横向上的时间。提示（分析归纳）：停顿可能有功能，但不能据此认为每个停顿都该留。</p></div>
<div class="row"><h3>删除：这段与当前主线有什么关系？</h3><p>笔记原文：“任何不强相关的信息都会削弱势能”。</p><p class="small">出处：15结构的精细化处理（骨架）.txt · 势能意识。提示（分析归纳）：先核主题、人物、情绪和前后衔接；说明删掉会失去什么，不以字数或单一标签判定。</p></div>
<div class="row"><h3>压缩：该展开体验，还是概述带过？</h3><p>笔记原文：“时长和叙事密度（详ＶＳ略／旁白概述ＶＳ现场展开）”。</p><p class="small">出处：23时间的语法.txt。提示（分析归纳）：比较展开与概述的作用，不把高密度等同于越短越好，不能切掉必要前提和反应。</p></div>
<div class="row"><h3>挪位：顺序是否让人更容易进入、愿意往下看？</h3><p>笔记原文：“大多数时候为了高效叙事，直接就是问题和危机出现而非舒缓的人物登场”。</p><p class="small">出处：21故事性思维.txt · 激励事件。提示（分析归纳）：这是故事叙事的可选路径，不要求所有口播或Vlog强造冲突。笔记也讨论并列切片，不能把并列自动判成错误。</p></div>
<p class="notice">以上引号内已对照库内课程笔记 TXT，不等于已核老师录音。四种动作的归类及提示是产品整理／分析推断，不冒称老师完整原版框架；方法讲解已补，逐段改片示范及产品效果验证仍待补。</p>
<p class="small">来源根目录：工作区/拆解/拆解包/薛辉_选题_素材/薛辉和安先生笔记/安老师网盘4.0课程总结/。整理件：工作区/拆解/拆解包/薛辉_网盘盘点_1006/05_段落取舍依据_结构精细化处理_原话整理.md。知识真源保留在 Obsidian。</p>
<p class="small">Don 的“留删难以描述”提示保留人工判断，不据此断言无法辅助分析。“删前三问”的极性歧义未解决，不用作自动删减规则。融新的作品只作偏好与应用样本，不是好作品标准。</p></details>`}

const renderBase=render;
render=function(){renderBase();let html='';
if(page==='topic')html+=`<section class="panel"><h2>什么情况下先追问？</h2><div class="row">只有方向：可以先列探索方向，但不宣称选题已经成立。</div><div class="row">抽象能力或人设判断：追问具体条件、行动与证据；六格仅在适用时调用。</div><div class="row">数字、身份、引用不确定：标待核，不替本人填事实。</div><div class="row">生活观察或情绪：可以从真实场景继续挖，不强制补成就数字。一次只问当前最关键的一件事。</div><p class="small">产品追问路由试用版；不是新的课程硬规则。</p></section>`;
if(page==='writing'){html+=`<details class="panel"><summary>当前形式的使用边界</summary><p>${state.form==='口播'?'口播：先核真实材料、口语表达和衔接；不套334、不套Vlog比例。':state.form==='配音 Vlog'?'配音Vlog：334可以用于写作及画面组织，分别考虑事件、情绪、观点如何呈现；不是固定时长比例。':'请选择口播或配音 Vlog。'}</p></details>`;if(step===3)html+=editableTable('writingCheck')+passagePanel()}
if(page==='shoot'){if(['口播','配音 Vlog'].includes(state.form))html+=editableTable(state.form==='口播'?'spoken':'vlog');html+=`<details class="panel"><summary>模板来源说明</summary><p>分镜字段参考《画面方法说明》的文案与画面对位、景别视角、已有素材／补拍逻辑。口播表是 North 依据制作需求和《文案线工作法》§6.1录制回看整理的执行模板，不冒称老师原表。</p><p>库内有小剧场逐镜方案，但与通用实拍不同。本版先给可填写模板与明确标识的示例，等待真实拍摄验证。</p></details>`}
if(page==='review')html+=editableTable('filmCheck')+passagePanel()+`<details class="panel"><summary>自动检查与人工判断的边界</summary><div class="row">本版已实现：本地视频播放、插入当前时间、记录与导出；不分析视频内容。</div><div class="row">可开发的确定性检查（未实现）：字幕时间范围、重叠、空白、越界。需要可读取的字幕和媒体元数据。</div><div class="row">模型辅助、人工复核（未实现）：转写差异、字幕同步、噪音、可能遮脸等，不能直接当作最终结论。</div><div class="row">人工决定：段落删留、气口舒适度、情绪作用、人物表达、最终事实核准。</div><p class="small">无需发布数据即可审内容；数据归因另需真实发布数据，本版未加入。</p></details>`;
if(refRoutes[page])html+=sourcesPanel(refRoutes[page]);
if(page==='gaps'){app.innerHTML=hero('补件状态 / '+supplementVersion,'已补什么，还缺什么','本轮补产品模板与证据边界；不改视觉风格，不修改 Obsidian。')+`<section class="panel"><div class="row"><h3>已落地</h3><p>五入口来源指路及三态说明；选题追问边界；口播与Vlog分流；两张拍摄模板；两张修改复查表；段落取舍的课程笔记依据与自动化能力边界。表格支持增加、保存和导出。</p></div><div class="row"><h3>仍需小拆核补</h3><p>老师逐段改片示范与作品应用验证（优先课程案例，不要求融新的作品作标准）；拍摄模板应用样本；“删前三问”极性歧义；周百见咨询表的空白模板原件（已填写样例已入库，不再作为缺件）。只补依据与案例，不重做目录。</p></div><div class="row"><h3>North 技术待实现</h3><p>AI生成与分析、实时Obsidian检索、自动审片、跨设备同步、安装方案。模板可用不等于这些能力已接入。</p></div><div class="row"><h3>待用户验收</h3><p>试用模板是否顺手、是否需要字段调整；风格尚未选择，本轮未改。</p></div><button id="suppExport">导出补缺状态与依据</button></section>`;}
app.insertAdjacentHTML('beforeend',html);
document.querySelectorAll('[data-table]').forEach(e=>e.oninput=()=>{rows[e.dataset.table][+e.dataset.row][+e.dataset.col]=e.value;tableSave()});
document.querySelectorAll('[data-add]').forEach(e=>e.onclick=()=>{rows[e.dataset.add].push(spec[e.dataset.add].cols.map(()=>''));tableSave();render()});
document.querySelectorAll('[data-sample]').forEach(e=>e.onclick=()=>{rows[e.dataset.sample].push([...spec[e.dataset.sample].sample]);tableSave();render()});
document.querySelectorAll('[data-table-export]').forEach(e=>e.onclick=()=>download(spec[e.dataset.tableExport].title+'.md',tableText(e.dataset.tableExport)));
if($('#suppExport'))$('#suppExport').onclick=()=>download('工作台补缺状态_1025.md',app.innerText+'\n\n'+Object.values(refs).map(r=>r.name+'\n'+r.path+' '+r.part+'\n'+r.scope+'\n来源：'+r.source+'\n采用：'+r.adopt+'\n验证：'+r.test).join('\n\n'));
};
const originalRecord=record;record=function(){return originalRecord()+'\n\n'+Object.keys(spec).map(k=>tableText(k)).join('\n\n')};
const css=document.createElement('style');css.textContent='.table-scroll{overflow-x:auto}.work-table{border-collapse:collapse;width:100%;min-width:860px}.work-table th,.work-table td{padding:8px;text-align:left;border:1px solid var(--line);vertical-align:top}.work-table th{font-size:12px;background:var(--light)}.work-table textarea{min-width:110px;min-height:110px;font-size:13px;padding:8px}';document.head.appendChild(css);render();
