/* Fixed factual prompts; never overwrite existing material without confirmation. */
(()=>{
const questions=[
 ['你目前的工作状态？',['上班','自己做生意','自由职业','暂未工作','在校','退休','其他'], '其他情况，一句话即可'],
 ['你主要想分享哪方面？',['工作经验','专业技能','生活日常','兴趣爱好','个人转变','还不确定','其他'], '其他情况，一句话即可'],
 ['别人通常因为什么找你？',['专业解答','办事解决问题','推荐东西','倾听建议','暂时没有','其他'], '其他情况，一句话即可'],
 ['你想让哪些人看到你？',['同行','客户','有相似经历的人','还没想好','其他'], '可以补充具体是哪一类人'],
 ['你做账号希望得到什么？',['记录分享','认识同行','获得客户','销售产品或服务','还没想好','其他'], '有现成产品或服务，可以简单说一句']
];
let step=0,answers=questions.map(()=>({choice:'',text:''}));
try{const a=JSON.parse(localStorage.getItem('persona-guide-closed-v2'));if(Array.isArray(a)&&a.length===5)answers=a.map(x=>({choice:String(x.choice||''),text:String(x.text||'')}))}catch{}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sections=[['我的经历','你做过哪些工作，或有过哪些重要的生活经历？选一两段说说，不用从小到大写。'],['我能帮别人什么','你比较熟悉或擅长什么？别人曾找你解决过什么问题？举一个小例子，没有也可以如实写。'],['生活中的我','除了工作，你喜欢做什么？朋友通常怎么形容你？选一个特点，用一件小事说明，不必只写优点。'],['我为什么想做这个账号','五问里已经选了目标，这里补充：是什么事情让你开始有这个想法？有什么内容，是你自己特别想讲的？']];
let intro=sections.map(()=>({text:'',skip:false}));
try{const v=JSON.parse(localStorage.getItem('persona-intro-v1'));if(Array.isArray(v)&&v.length===4)intro=v.map(x=>({text:typeof x?.text==='string'?x.text:'',skip:x?.skip===true}))}catch{}
window.personaStructuredInput=()=>({choices:questions.map((q,i)=>({question:q[0],answer:answers[i].choice||'待补充',other:answers[i].choice.includes('其他')?answers[i].text:''})),introduction:sections.map((s,i)=>({section:s[0],answer:intro[i].skip?'暂时想不到':intro[i].text||'待补充'}))});
function mount(){const material=document.getElementById('persona-material');if(!material||document.getElementById('persona-guide'))return;
const panel=document.createElement('section');panel.id='persona-guide';panel.className='panel';material.before(panel);
const details=document.createElement('details');details.innerHTML='<summary>已有介绍 / 查看整理的材料（选用）</summary>';panel.after(details);const label=document.querySelector('label[for="persona-material"]');if(label)details.append(label);details.append(material);
const bio=document.createElement('section');bio.className='panel';bio.id='persona-introduction';details.before(bio);
bio.innerHTML='<h3>四段自我介绍 · 让我们认识你</h3><p>每段一到三句话即可，不用写成简历，不必重复五问中的答案。没有就选“暂时想不到”。</p>'+sections.map((s,i)=>`<label for="intro-${i}">${i+1}. ${esc(s[0])}</label><p class="small" id="intro-help-${i}">${esc(s[1])}</p><textarea id="intro-${i}" rows="3" aria-describedby="intro-help-${i}" ${intro[i].skip?'disabled':''}>${esc(intro[i].text)}</textarea><label style="display:flex;gap:8px;align-items:center"><input style="width:auto" type="checkbox" id="intro-skip-${i}" ${intro[i].skip?'checked':''}>暂时想不到</label>`).join('')+'<p id="intro-status" role="status">选择与四段介绍会一起交给 AI，旧材料不会被覆盖。</p>';
sections.forEach((s,i)=>{const field=bio.querySelector('#intro-'+i),check=bio.querySelector('#intro-skip-'+i);function saveIntro(){intro[i]={text:field.value,skip:check.checked};field.disabled=check.checked;try{localStorage.setItem('persona-intro-v1',JSON.stringify(intro));bio.querySelector('#intro-status').textContent='四段介绍已保存在此浏览器。点击下方 AI 按钮时才发送。'}catch{bio.querySelector('#intro-status').textContent='浏览器无法保存，请先复制保留文字，刷新可能丢失。'}}field.oninput=saveIntro;check.onchange=saveIntro});
function draw(){const q=questions[step],a=answers[step],multi=step===1||step===2;panel.innerHTML=`<h3>点选五问 · 先聊聊你自己</h3><p>第 ${step+1} / 5 问 · ${multi?'可多选':'单选'}，不确定可以跳过。</p><fieldset style="border:0;padding:0"><legend>${esc(q[0])}</legend>${q[1].map(x=>`<label style="display:flex;align-items:center;gap:12px;border:1px solid #555;padding:12px;border-radius:8px;margin:8px 0"><input style="width:auto;margin:0" name="choice" type="${multi?'checkbox':'radio'}" value="${esc(x)}" ${a.choice.split('、').includes(x)?'checked':''}>${esc(x)}</label>`).join('')}</fieldset><textarea id="guide-answer" rows="2" ${a.choice.includes('其他')?'':'hidden'} placeholder="其他情况，一句话即可">${esc(a.text)}</textarea><div class="actions"><button id="guide-prev" ${step===0?'disabled':''}>上一问</button><button id="guide-next">${step===4?'整理到我的材料':'下一问 / 暂时跳过'}</button></div><p class="small" id="guide-status">不需要自己打分。整理后点击下方 AI 按钮，获取分析。</p>`;
const save=()=>{answers[step]={choice:[...panel.querySelectorAll('[name="choice"]:checked')].map(x=>x.value).join('、'),text:panel.querySelector('textarea').value};try{localStorage.setItem('persona-guide-closed-v2',JSON.stringify(answers))}catch{}};
panel.querySelector('textarea').oninput=save;panel.querySelectorAll('[name="choice"]').forEach(el=>el.onchange=()=>{save();panel.querySelector('textarea').hidden=!answers[step].choice.includes('其他')});
panel.querySelector('#guide-prev').onclick=()=>{save();step--;draw()};
panel.querySelector('#guide-next').onclick=()=>{save();if(step<4){step++;draw();return}const value=questions.map((q,i)=>q[0]+'\n'+([answers[i].choice,answers[i].choice.includes('其他')?answers[i].text:''].filter(Boolean).join('；')||'待补充')).join('\n\n');if(material.value.trim()&&material.value!==value&&!confirm('下方已有材料。用这五问的回答替换吗？取消可保留原材料。'))return;material.value=value;material.dispatchEvent(new Event('input',{bubbles:true}));panel.querySelector('#guide-status').textContent='已整理到材料。点击下方 AI 按钮开始分析，未连接时会先打开设置。'};
}draw();}
const previous=render;render=function(){previous();mount()};mount();
})();
