(()=>{
const KEY='writing-demo-work-v1',ARCHIVE='writing-demo-results-v1';
const original='新本子买回来一个星期，我一页也没写。挑颜色、挑纸张，倒花了一个晚上。\n我总觉得，要等一个完整的下午。\n后来等咖啡的时候，我在旧收据背面写了三句话。\n所以做事一定要立刻行动，永远不要拖延。';
const revised=original.replace('所以做事一定要立刻行动，永远不要拖延。','那天回家，我把收据夹进新本子。第一页，总算有东西了。');
const outline='开头：新本子一页没写的反差。\n经过：一直等完整的下午。\n转折：等咖啡时，在收据上写下三句话。\n结尾：回到一个具体动作，不扩大成普遍教训。';
function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
let d=read(KEY,{mode:'',stage:0,outline,text:'',original:'',accepted:false}),message='';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function keep(){try{localStorage.setItem(KEY,JSON.stringify(d));if(d.mode)localStorage.setItem(KEY+'-'+d.mode,JSON.stringify(d));return true}catch{message='本地保存失败，请先导出。';return false}}
function bind(id,fn){document.getElementById(id)?.addEventListener('click',fn)}
function snapshot(){return {id:Date.now(),time:new Date().toISOString(),kind:'demo',position:read('persona-demo-confirmed-v1',null),topic:read('topic-demo-confirmed-v1',null),work:{...d}}}
function output(r){
 const w=r.work||{},isNew=w.mode==='new',date=new Date(r.time);
 const sections=['文案工作记录（流程测试）','记录时间：'+(Number.isNaN(date.getTime())?'未记录':date.toLocaleString('zh-CN')),
 '使用说明\n'+(isNew?'这是虚构案例的流程演示，不是根据用户材料自动生成的稿件。':'这里只保存你输入的稿件。网页尚未自动审稿，没有针对这篇稿件的分析结果。')];
 if(w.outline)sections.push('结构方案\n'+w.outline);
 sections.push('保留的原稿\n'+(w.original||'未记录'),'当前稿件\n'+(w.text||'未填写'));
 sections.push('修改记录\n'+(isNew?'预写建议：结尾回到具体动作，不从单一经历推出普遍教训。\n'+(w.edited?'已点击采用演示修改；请以当前稿件为准。':'未点击采用演示修改。'):'原稿未被自动分析或改写。当前稿件如有变化，来自编辑区的手动修改。'));
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob(['\uFEFF'+sections.join('\n\n──────────\n\n')],{type:'text/plain;charset=utf-8'}));
 a.href=url;a.download='文案工作记录_'+r.id+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function mount(){if(page!=='writing')return;const records=read(ARCHIVE,[]);app.innerHTML='<section class="panel"><div class="eyebrow">文案 · 流程演示 / 不接 API</div><h1>写完这一篇，保存结果</h1><p>演示稿是独立虚构案例，不是根据你的材料生成。原有稿件不会被覆盖。</p><div class="actions"><button id="wf-new">帮我一起写（演示）</button><button id="wf-existing">我已有稿，帮我看看</button><button id="wf-list">已保存结果（'+records.length+'）</button></div><div id="wf-body"></div><p role="status">'+e(message)+'</p></section>';
function start(mode){if(d.mode!==mode){if(!keep()){mount();return}const cached=read(KEY+'-'+mode,null);d=cached&&cached.mode===mode?cached:{mode,stage:0,outline:mode==='new'?outline:'',text:mode==='new'?original:(state.draft||''),original:mode==='new'?original:'',accepted:false}}d.stage=0;message=mode==='existing'?'已进入已有稿入口，请在下方粘贴正文。两个入口各自保存，不覆盖旧稿。':'';keep();mount();const input=document.getElementById('wf-input');if(input){input.scrollIntoView({block:'center'});input.focus({preventScroll:true})}}
bind('wf-new',()=>start('new'));bind('wf-existing',()=>start('existing'));bind('wf-list',()=>{d.stage=9;keep();mount()});const box=document.getElementById('wf-body');
if(d.stage===9){box.innerHTML='<h2>已保存结果</h2><p>保存在此浏览器，不跨设备同步，建议导出备份。</p>'+records.map((r,i)=>'<div class="row">'+e(r.time)+' · 演示 <button id="open-'+i+'">重新打开</button><button id="export-'+i+'">导出</button></div>').join('');records.forEach((r,i)=>{bind('open-'+i,()=>{d={...r.work,stage:1};keep();mount()});bind('export-'+i,()=>output(r))});return}
if(!d.mode){box.innerHTML='<p>从零写稿，或直接粘贴已有稿件；已有稿无需重填定位和选题。</p>';return}
if(d.mode==='existing'){box.insertAdjacentHTML('beforebegin','<div class="panel"><h3>本轮测试：40+创业宝妈</h3><p>直接载入刚才的稿件与审稿结果，测试选择建议、保存和重新打开。当前输入不会被覆盖。</p><button id="wf-case" class="primary">载入本轮测试案例</button></div>');bind('wf-case',()=>window.reviewCase.mount(box));}
if(d.stage===0){box.innerHTML='<h2>'+(d.mode==='new'?'确认演示结构：开始记录生活':'直接粘贴已有稿件')+'</h2><textarea id="wf-input" aria-label="'+(d.mode==='new'?'结构':'原稿')+'">'+e(d.mode==='new'?d.outline:d.text)+'</textarea>'+(d.mode==='new'?'<label><input type="checkbox" id="wf-accept" '+(d.accepted?'checked':'')+'>确认结构</label>':'<p>这里只测试审稿入口，不会伪造对你原稿的分析。</p>')+'<button id="wf-next" class="primary">'+(d.mode==='new'?'进入稿件':'保存原稿，核对正文')+'</button>';
const check=()=>{document.getElementById('wf-next').disabled=d.mode==='new'?(!d.accepted||!d.outline.trim()):!d.text.trim()};check();document.getElementById('wf-input').oninput=x=>{if(d.mode==='new'){d.outline=x.target.value;d.accepted=false;document.getElementById('wf-accept').checked=false}else d.text=x.target.value;keep();check()};document.getElementById('wf-accept')?.addEventListener('change',x=>{d.accepted=x.target.checked;keep();check()});bind('wf-next',()=>{if(d.mode==='existing')d.original=d.text;d.stage=1;keep();mount()});return}
box.innerHTML='<h2>'+(d.mode==='new'?'稿件与建议（虚构演示）':'稿件已收好，尚未开始审稿')+'</h2><details><summary>保留的原稿</summary><pre style="white-space:pre-wrap">'+e(d.original)+'</pre></details><label for="wf-text">当前稿件（可自行编辑）</label><textarea id="wf-text">'+e(d.text)+'</textarea>'+(d.mode==='new'?'<h3>预写审稿样例（虚构演示）</h3><p>建议调整：结尾回到具体动作，不从单一经历推出普遍教训。新增动作属于虚构案例，不是用户经历。</p><button id="wf-revise">采用演示修改</button>':'<div class="notice"><h3>这篇稿件尚未分析</h3><p>当前版本只能保存和导出稿件，真实审稿服务尚未接通。这里没有针对你这篇稿件的审稿结果；保存或导出不会启动分析。</p></div>')+'<div class="actions"><button id="wf-back">返回调整</button><button id="wf-save" class="primary">'+(d.mode==='new'?'确认并保存结果':'保存稿件')+'</button><button id="wf-export">'+(d.mode==='new'?'导出当前结果（TXT）':'导出稿件（TXT）')+'</button></div>';
document.getElementById('wf-text').oninput=x=>{d.text=x.target.value;keep()};bind('wf-back',()=>{d.stage=0;keep();mount()});bind('wf-revise',()=>{if(d.text!==original&&!confirm('替换编辑区为演示修改稿？原稿保留；手动修改请先导出。'))return;d.text=revised;d.edited=true;keep();mount()});bind('wf-export',()=>output(snapshot()));bind('wf-save',()=>{try{records.unshift(snapshot());localStorage.setItem(ARCHIVE,JSON.stringify(records));message=d.mode==='new'?'已保存演示结果，可重新打开和导出。':'稿件已保存；尚未审稿。可导出 TXT 备份。';mount()}catch{message='保存失败，请导出备份。';mount()}});
}
function references(){if(!['topic','writing','review'].includes(page))return;const panel=document.createElement('details');panel.className='source';panel.innerHTML='<summary>方法参考与本页边界</summary><p>'+({topic:'给谁看、为什么值得看、真实材料与表达，是工作台提出建议时参考的维度，不是要求用户先完成的判断。',writing:'素材挖掘、结构方案、口播与配音 Vlog、改稿与复查保留为方法参考。口播和 Vlog 分开处理，原稿保留，修改须经用户同意。',review:'看成片只给修改意见：哪里值得保留、哪个时间点有什么问题、为什么、建议怎么改及优先级。修改后可复查。不直接剪片、不修改工程；当前仍未接入自动审片。'})[page]+'</p>';app.append(panel)}
const previous=render;render=function(){previous();mount();references()};mount();references();
})();
