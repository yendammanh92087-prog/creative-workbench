(()=>{
const key='topic-demo-v1';let draft={answers:['','','',''],details:['','','',''],cursor:0};
try{const v=JSON.parse(localStorage.getItem(key));if(v&&v.answers?.length===4&&v.details?.length===4)draft=v}catch{}
const questions=[
 ['这次想讲哪一种事？',['亲身经历','生活观察','专业经验','一个观点','还没想好'],'用一句话说具体是哪件事（选填）'],
 ['这次主要讲给谁听？',['沿用定位中的受众','有相似经历的人','遇到同类问题的人','潜在客户','还没想好'],'可以补充具体是哪类人（选填）'],
 ['手里已经有什么材料？',['亲身经历和细节','拍过的画面','可核对的数据或记录','目前只有想法'],'写一个已有细节，没有可以留空'],
 ['准备怎么呈现？',['口播','配音 Vlog','还没决定'],'有什么拍摄限制或偏好（选填）']
 ];
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function persist(){try{localStorage.setItem(key,JSON.stringify(draft));return true}catch{return false}}
function position(){try{return JSON.parse(localStorage.getItem('persona-demo-confirmed-v1'))}catch{return null}}
function mount(){
 if(page==='writing'){let v;try{v=JSON.parse(localStorage.getItem('topic-demo-confirmed-v1'))}catch{}if(v&&!document.getElementById('topic-writing-context')){const box=document.createElement('section');box.id='topic-writing-context';box.className='panel';box.innerHTML='<h3>已带入选题（演示）</h3><p>仅作为本次写作参考，原有稿件和素材没有被覆盖。</p><pre style="white-space:pre-wrap">'+e(v.summary)+'</pre>';app.prepend(box)}return}
 if(page!=='topic')return;
 const p=position();const i=Math.max(0,Math.min(4,Number(draft.cursor)||0));draft.cursor=i;
 app.innerHTML='<section class="panel" id="topic-flow"><div class="eyebrow">02 / 选题 · 流程演示</div><h1>把想法变成一个选题</h1><p>无需 API，不发送材料。演示结果不代表 AI 分析。</p><details><summary>已带入的定位</summary><pre style="white-space:pre-wrap">'+e(p?.summary||'尚未确认定位，也可以先测试选题。')+'</pre></details><div id="topic-step"></div><p id="topic-status" role="status"></p></section>';
 const box=document.getElementById('topic-step');
 if(i<4){const q=questions[i];box.innerHTML='<p>第 '+(i+1)+' / 4 题</p><fieldset style="border:0;padding:0"><legend><h2>'+q[0]+'</h2></legend>'+q[1].map(a=>'<label style="display:flex;gap:12px;padding:12px"><input style="width:auto" type="radio" name="topic-choice" value="'+e(a)+'" '+(draft.answers[i]===a?'checked':'')+'>'+a+'</label>').join('')+'</fieldset><label for="topic-detail">'+q[2]+'</label><textarea id="topic-detail" rows="3">'+e(draft.details[i])+'</textarea><div class="actions"><button id="topic-prev" '+(i===0?'disabled':'')+'>上一题</button><button id="topic-next" class="primary" '+(!draft.answers[i]?'disabled':'')+'>'+(i===3?'查看演示结果':'保存并继续')+'</button></div>';
 box.querySelectorAll('[name="topic-choice"]').forEach(x=>x.onchange=()=>{draft.answers[i]=x.value;persist();box.querySelector('#topic-next').disabled=false});box.querySelector('#topic-detail').oninput=x=>{draft.details[i]=x.target.value;persist()};
 box.querySelector('#topic-prev').onclick=()=>{draft.cursor--;persist();mount()};box.querySelector('#topic-next').onclick=()=>{if(!draft.answers[i])return;draft.cursor++;if(!persist()){draft.cursor--;document.getElementById('topic-status').textContent='保存失败，请不要刷新。';return}mount();window.scrollTo(0,0)};return}
 const summary=questions.map((q,j)=>q[0]+' '+draft.answers[j]+(draft.details[j]?'：'+draft.details[j]:'')).join('\n');
 box.innerHTML='<h2>选题结果（演示）</h2><p class="notice">以下是材料整理与展示格式，不是质量判断，不预测流量。</p><pre style="white-space:pre-wrap">'+e(summary)+'</pre><h3>哪里值得讲</h3><p>正式分析会说明受众为什么在意，并引用材料；本次未调用 AI，暂不下结论。</p><h3>还缺什么</h3><p>'+(draft.answers[2]==='目前只有想法'?'你选择了“目前只有想法”。可以先补充一件真实事件或可核对的记录，不需要编故事。':'你已选择材料类型；是否足以支撑选题仍待正式分析。')+'</p><h3>怎么切入（固定示例，不是推荐结论）</h3><p>发生了什么 → 哪个细节值得讲 → 你从中看到了什么。后续应根据真实材料调整。</p><div class="actions"><button id="topic-adjust">调整选题</button><button id="topic-confirm" class="primary">确认，进入文案</button></div>';
 box.querySelector('#topic-adjust').onclick=()=>{draft.cursor=0;persist();mount()};box.querySelector('#topic-confirm').onclick=()=>{try{localStorage.setItem('topic-demo-confirmed-v1',JSON.stringify({kind:'demo',summary,position:p,answers:draft.answers,details:draft.details}));}catch{document.getElementById('topic-status').textContent='保存失败，暂未跳转。';return}page='writing';step=0;render();window.scrollTo(0,0)};
}
const previous=render;render=function(){previous();mount()};mount();
})();
