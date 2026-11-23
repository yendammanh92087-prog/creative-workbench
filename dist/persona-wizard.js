(()=>{
let stage='questions',introPage=0,preview=true,restored=false;
const css=document.createElement('style');css.textContent='#persona-body [hidden],#app > [hidden]{display:none!important}';document.head.append(css);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mount(){
// Keep the optional global connection entry visible; never gate the wizard on it.
const badge=document.querySelector('.badge');if(badge)badge.textContent='流程测试 · 无需 API';
if(page==='topic'&&!document.getElementById('demo-position-context')){let accepted;try{accepted=JSON.parse(localStorage.getItem('persona-demo-confirmed-v1'))}catch{}if(accepted){const panel=document.createElement('section');panel.id='demo-position-context';panel.className='panel';panel.innerHTML='<h3>已带入定位 · 演示测试</h3><p>这是测试定位，不是真实 AI 结论。下面可以继续测试选题，不用重填定位。</p><pre style="white-space:pre-wrap"></pre>';panel.querySelector('pre').textContent=accepted.summary;app.prepend(panel);}}
const body=document.getElementById('persona-body');if(!body||!document.getElementById('persona-guide'))return;
if(!restored){restored=true;const d=window.personaStructuredInput();if(d.choices.every(x=>x.answer!=='待补充')&&d.introduction.every(x=>x.answer!=='待补充'))stage='review';}
let host=document.getElementById('guided-flow');if(!host){host=document.createElement('section');host.id='guided-flow';body.prepend(host)}
const guide=document.getElementById('persona-guide'),bio=document.getElementById('persona-introduction'),service=document.getElementById('persona-service');
if(!body.dataset.copyFlowWired){body.dataset.copyFlowWired='1';body.addEventListener('input',e=>{if(e.target.id.startsWith('intro-')){const n=document.getElementById('intro-next'),t=document.getElementById('intro-'+introPage),s=document.getElementById('intro-skip-'+introPage);if(n&&t&&s)n.disabled=!(s.checked||t.value.trim())}});guide.addEventListener('click',e=>{if(e.target.closest('#guide-prev'))mount()});}
const module=document.getElementById('persona-module');if(module)module.parentElement.querySelectorAll(':scope > *').forEach(el=>{if(el!==module)el.hidden=true});
body.querySelectorAll(':scope > *').forEach(x=>x.hidden=true);host.hidden=false;
document.querySelectorAll('#persona-module > .actions').forEach(x=>x.hidden=true);
const heading=module?.querySelector('h2');if(heading)heading.textContent='整理你的定位材料';
const eyebrow=module?.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='人设定位 / 流程测试 · 不连接 API';
const guideStatus=guide.querySelector('#guide-status');if(guideStatus)guideStatus.textContent='不需要自己打分。填完后，在工作台内获取分析、补充和复查。';
const questionHelp=guide.querySelector('p');if(questionHelp)questionHelp.textContent=questionHelp.textContent.replace('不确定可以跳过。','选择符合自己的情况后继续。');
if(stage==='connect'){host.innerHTML='<h3>第一步 · 连接 AI 或先体验</h3><p>想先测试填写流程？不需要密钥，也不会产生模型费用。</p><button id="flow-preview" class="primary">暂不连接，先体验流程</button><button id="flow-connect">连接我的 AI</button><button id="flow-start" '+(window.workbenchAI.isReady()?'':'disabled')+'>连接成功，开始填写</button><p class="small">体验模式只填写、核对材料，不生成 AI 分析。</p>';host.querySelector('#flow-preview').onclick=()=>{preview=true;stage='questions';mount()};host.querySelector('#flow-connect').onclick=()=>window.workbenchAI.open();host.querySelector('#flow-start').onclick=()=>{if(window.workbenchAI.isReady()){preview=false;stage='questions';mount()}};return}
host.innerHTML='<p>流程测试：无需 API，不发送材料。填完后查看明确标注的演示结果，再进入选题。</p>';
if(stage==='questions'){guide.hidden=false;const next=guide.querySelector('#guide-next'),other=guide.querySelector('#guide-answer');const valid=()=>guide.querySelectorAll('[name="choice"]:checked').length>0&&(![...guide.querySelectorAll('[name="choice"]:checked')].some(x=>x.value==='其他')||other.value.trim());next.disabled=!valid();next.textContent='保存并继续';if(!next.dataset.wired){const original=next.onclick;next.dataset.wired='1';next.onclick=()=>{if(!valid())return;const last=guide.querySelector('p').textContent.includes('5 / 5');if(last){stage='intro';introPage=0}else original();mount()};guide.addEventListener('change',()=>{next.disabled=!valid()});other.addEventListener('input',()=>{next.disabled=!valid()})}return}
if(stage==='intro'){bio.hidden=false;for(let i=0;i<4;i++){const t=bio.querySelector('#intro-'+i),h=bio.querySelector('#intro-help-'+i),l=bio.querySelector('label[for="intro-'+i+'"]'),skip=bio.querySelector('#intro-skip-'+i).parentElement;[t,h,l,skip].forEach(x=>x.hidden=i!==introPage)}
host.innerHTML+=`<h3>自我介绍 ${introPage+1} / 4</h3>`;let nav=bio.querySelector('#intro-nav');if(!nav){nav=document.createElement('div');nav.id='intro-nav';bio.append(nav)}nav.innerHTML='<button id="intro-back">上一页</button><button id="intro-next" class="primary">保存并继续</button>';const t=bio.querySelector('#intro-'+introPage),skip=bio.querySelector('#intro-skip-'+introPage),n=nav.querySelector('#intro-next');const valid=()=>skip.checked||t.value.trim();n.disabled=!valid();t.addEventListener('input',()=>n.disabled=!valid(),{once:true});skip.addEventListener('change',()=>mount(),{once:true});nav.querySelector('#intro-back').onclick=()=>{if(introPage>0)introPage--;else stage='questions';mount()};n.onclick=()=>{if(!valid())return;if(introPage<3)introPage++;else stage='review';mount()};return}
const data=window.personaStructuredInput();
const summary=data.choices.map(x=>x.question+' '+x.answer+(x.other?'；'+x.other:'')).join('\n');
host.innerHTML+='<h3>定位结果（演示）</h3><p class="notice">仅演示结果页和按钮流程，不是 AI 对你的定位判断。以下原样整理已填选项，不推断能力、身份或商业结论。</p><pre style="white-space:pre-wrap">'+esc(summary)+'</pre><details><summary>查看四段介绍</summary>'+data.introduction.map(x=>'<h4>'+esc(x.section)+'</h4><p>'+esc(x.answer)+'</p>').join('')+'</details><h4>正式分析将呈现</h4><p>哪里清楚 → 哪里需要补充 → 优先改什么。测试阶段不虚构这些判断。</p><label for="demo-followup">补充或调整（选填，仅保存，不调用 AI）</label><textarea id="demo-followup" rows="3"></textarea><p id="demo-save-status" role="status"></p><div class="actions"><button id="demo-adjust">调整定位</button><button id="demo-confirm" class="primary">确认，进入选题</button></div>';
const extra=host.querySelector('#demo-followup');try{extra.value=localStorage.getItem('persona-demo-extra-v1')||''}catch{}
extra.oninput=()=>{try{localStorage.setItem('persona-demo-extra-v1',extra.value);host.querySelector('#demo-save-status').textContent='补充已保存（演示，没有生成新判断）。'}catch{host.querySelector('#demo-save-status').textContent='浏览器无法保存，请暂勿刷新。'}};
host.querySelector('#demo-adjust').onclick=()=>{stage='questions';mount()};
host.querySelector('#demo-confirm').onclick=()=>{try{localStorage.setItem('persona-demo-confirmed-v1',JSON.stringify({kind:'demo',summary,materials:data,extra:extra.value}));}catch{host.querySelector('#demo-save-status').textContent='保存失败，暂未跳转，避免丢失材料。';return}page='topic';render();window.scrollTo(0,0)};
return;
const rows=[...data.choices.map(x=>[x.question,x.answer+(x.other?'；'+x.other:'')]),...data.introduction.map(x=>[x.section,x.answer])];
const old=document.getElementById('persona-material').value.trim();
if(old)rows.push(['以前保存的补充材料（请核对是否仍适用）',old]);
const packet='请帮我梳理短视频账号定位。先分析，不替我编经历，不直接写脚本。\n\n【分析要求】\n1. 分清社会身份、商业身份和内容方向；不要把人设只理解成职业。没有商业目标时，不强行安排变现。\n2. 告诉我哪些地方清楚、有真实材料支持；哪些地方模糊；优先改什么。每条意见对应我的具体回答，不给虚构分数。\n3. 给出一版暂定定位：我是谁、主要给谁看、能持续讲什么、凭什么讲。缺证据标【待补】，最多先追问一个最关键的问题。\n4. 不强制反常识，不夸大专业能力，不虚构案例或收入。新旧材料冲突时先问我，不能自行选版本。\n5. 等我确认定位后，再进入选题；后续区分口播和配音 Vlog，不能把 Vlog 的叙事/观点/情绪比例套在口播上。\n\n【边界】\n以上是工作台采用的执行要求，不是老师逐字原话。本材料包不包含完整课程知识库；不得声称读过未提供的课程或看过未提供的视频，也不代表已经安装了 Skill。\n\n【我的材料】\n'+rows.map(([q,a])=>q+'\n'+a).join('\n\n');
host.innerHTML+='<h3>核对材料，在这里分析</h3><details><summary>查看已填材料</summary>'+rows.map(([q,a])=>`<h4>${esc(q)}</h4><p style="white-space:pre-wrap">${esc(a)}</p>`).join('')+'</details><button id="review-back">返回修改</button><button id="download-packet">下载材料备份</button><p>无需切换软件。下方连接并分析，结果会直接显示在这里。</p>';
host.querySelector('#review-back').onclick=()=>{stage='intro';introPage=3;mount()};
host.querySelector('#download-packet').onclick=()=>download('我的定位材料与分析要求.txt',packet);
service.hidden=false;
const follow=document.getElementById('persona-answer');if(follow){const container=follow.closest('details');if(container){container.hidden=false;container.open=true;const label=container.querySelector('summary');if(label)label.textContent='补充回答 / 告诉 AI 需要调整什么';}}
}
const previous=render;render=function(){previous();mount()};window.addEventListener('ai-state-change',mount);mount();
})();
