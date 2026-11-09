(()=>{
const KEY='review-today-case-v2';
const title='40+创业宝妈工作生活怎么不掉链子';
const source=`0:00 40+创业宝妈，一个月有一半时间都在出差。怎么把工作和生活都安排好？我用两天时间告诉你。
0:08 这两天要陪老妈过生日，安排好孩子学校琐碎的事，还要赶第二天的早班机去见客户，哪个掉链子都不行。
0:16 我的 AI 私人助理 Today，连着我的日历。路上和家里的事，都交给它了。
0:22 上午先去奥莱，给老妈买生日礼物。下午去地坛看银杏，晚上陪她吃饭。
0:29 父母从来不跟我提任何要求，总是默默付出。但我也尽量不想错过他们的重要时刻。
0:35 以前忙起来最怕的就是孩子学校的事顾不上。一天忙完再看手机，经常会发现错过了老师要求的截止时间。现在有了 Today，感觉从容多了。
0:46 第二天出门的时候，孩子还在睡。我就在她枕边放了一个小玩偶。这次出差又要两周多，希望这个小可爱能替我陪陪她。
0:55 5 点半出门，天还没亮，7 点半的飞机去广州。
1:00 上午见到客户，中午他请我吃了顿桑拿鸡。客户说这是广州招待客人的最高规格。
1:07 下午我们又深聊了一个多小时。虽然赶早班机很辛苦，但是能多留出点时间给客户就值得。毕竟很多隐藏的问题，都是聊着聊着才浮出水面的。
1:19 4 点我又得去赶回深圳的火车了。从早上 5 点半出门，到晚上 7 点多回到深圳的家，一天三个城市，14 个小时，总算过完了。
1:29 老师在群里发了通知，我随手转给 Today，通知刚转过去，它就先说了：因为明天我出差不在家，孩子 7 点半进班，这事今晚得交代好。水壶、小袋子这些必须要带的东西，也一起列好了。
1:44 工作没耽误，家里也没掉链子。不是我能干，是有人替我盯着。
1:51 是谁在替你托底？`;
const cards=[
{id:'time',level:'先核实',name:'时间顺序需要说清',quote:'0:46「出差又要两周多」；1:19「回到深圳的家」；1:29「明天我出差不在家」',why:'仅看文字，读者不清楚最后一段是不是回叙，不能据此判定事实错误。',how:'先确认班级通知的真实发生时间，再决定是否加一个简短时间提示；不擅自改成“前一晚”。'},
{id:'promise',level:'优先考虑',name:'产品作用说得比案例展示的更大',quote:'0:16「路上和家里的事，都交给它了」；1:44「有人替我盯着」',why:'文稿展示的是提醒、列清单、提前安排，不是产品代替你实际完成家务或照顾孩子。',how:'把表达落到“不用我一个人记了”这一类实际作用；这里只选建议，不自动替换原话。'},
{id:'opening',level:'可选调整',name:'开头承诺可以更聚焦',quote:'0:00「怎么把工作和生活都安排好？」',why:'整篇最具体的帮助是出差前不遗漏家里要交代的事，不是解释所有工作生活安排。',how:'可把承诺缩到“人在出差，家里的事怎么不漏”；保留具体生活，不改成教程。'},
{id:'ending',level:'可选调整',name:'结尾不必硬拉互动',quote:'1:51「是谁在替你托底？」',why:'“托底”比提醒记事更宽泛；生活里的真实矛盾本身可以引发讨论。',how:'若无品牌要求，可停在前面的生活感受；如保留提问，也不算必须修改项。'}];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const keeps=['枕边的小玩偶，用动作呈现对孩子的牵挂。','与客户多聊一个小时，让赶早班机有具体原因。','班级通知与清单，具体展示产品如何帮忙。','陪母亲过生日、与客户吃饭，有人物和生活气息，不因没有直接讲产品就删除。'];
function empty(){return{choices:{},answer:'',confirmed:null,savedAt:null}}
function read(){try{return JSON.parse(localStorage.getItem(KEY))}catch{return null}}
function txt(name,text){const a=document.createElement('a'),u=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}));a.href=u;a.download=name+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function report(){return title+'｜审核意见（固定案例测试）\n\n本次对话的预写建议，非网页即时生成。只审文字，未核成片。原稿未改。\n这是一份意见报告，不包含用户修改决定，不代表用户已采纳。\n\n值得保留\n'+keeps.map((s,i)=>(i+1)+'. '+s).join('\n')+'\n\n审核建议\n'+cards.map((c,i)=>(i+1)+'. '+c.name+'（'+c.level+'）\n原句：'+c.quote+'\n原因：'+c.why+'\n建议：'+c.how).join('\n\n')+'\n\n待核事实\n1:29 的班级通知是否为前一天晚上发生的回叙？尚未确认，不擅自改写。\n\n测试原稿（只读）\n'+source}
function mount(box){
 let d=empty(); // Fresh visit never inherits old test decisions.
 const saved=read();
 box.innerHTML='<section><div class="eyebrow">固定案例测试 · 先看意见，再决定</div><h2>'+title+'</h2><p class="notice">以下是本次对话的预写审核意见，不是网页实时分析。原稿不会被修改。</p><p>本轮默认没有任何修改决定。旧版测试选择不自动带入。</p><details><summary>查看原稿（只读）</summary><pre style="white-space:pre-wrap;font:inherit">'+esc(source)+'</pre></details><div class="actions"><button id="rc-export" class="primary">只导出审核意见（TXT）</button><button id="rc-open" '+(saved?'':'disabled')+'>恢复上次明确保存的记录</button></div><h3 style="margin-top:24px">值得保留</h3><ul>'+keeps.map(s=>'<li>'+s+'</li>').join('')+'</ul>'+cards.map(c=>'<article class="panel"><span class="tag">'+c.level+'</span><h3>'+c.name+'</h3><p>原句：'+esc(c.quote)+'</p><p>原因：'+c.why+'</p><p>建议：'+c.how+'</p></article>').join('')+'<details id="rc-decisions"><summary>我想决定哪些要改（可稍后处理）</summary><p>选项只是草稿。只有点击“确认本轮修改决定”，才会生成确认清单；确认也不会自动改稿。</p><div id="rc-fields"></div><label for="rc-answer">待核事实补充（可不填）</label><p>1:29 的班级通知，是前一天晚上发生、放在结尾回叙的吗？</p><textarea id="rc-answer"></textarea><div class="actions"><button id="rc-save">保存选择草稿（不确认）</button><button id="rc-confirm" class="primary">确认本轮修改决定</button><button id="rc-export-decisions" disabled>导出已确认清单（TXT）</button></div><p id="rc-decision-status" role="status"></p><p>未选择的项保持待决定；先核实的事实仍待核实，不因采纳建议而自动变成事实。</p></details><p id="rc-status" role="status"></p></section>';
 const q=id=>box.querySelector('#'+id),status=t=>q('rc-status').textContent=t;
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch{status('保存失败，请保留本页并导出可用内容。');return false}}
 function sync(){q('rc-export-decisions').disabled=!d.confirmed;q('rc-confirm').disabled=!Object.values(d.choices).some(Boolean);q('rc-decision-status').textContent=d.confirmed?'已明确确认本轮决定；原稿未改。':'尚未确认修改决定。当前选择只作草稿。'}
 function dirty(){d.confirmed=null;sync();status('选择已变化，旧确认不再用于当前清单；需要重新确认。')}
 function fields(){q('rc-fields').innerHTML=cards.map(c=>'<label for="rc-'+c.id+'">'+c.name+'</label><select id="rc-'+c.id+'"><option value="">尚未决定</option><option value="采纳">采纳建议，留待修改</option><option value="暂不处理">暂不处理</option></select>').join('');cards.forEach(c=>{q('rc-'+c.id).value=d.choices[c.id]||'';q('rc-'+c.id).onchange=ev=>{d.choices[c.id]=ev.target.value;dirty()}});q('rc-answer').value=d.answer;sync()}
 q('rc-answer').oninput=ev=>{d.answer=ev.target.value;dirty()};
 q('rc-export').onclick=()=>txt(title+'_审核意见',report());
 q('rc-save').onclick=()=>{d.savedAt=new Date().toISOString();d.confirmed=null;sync();if(persist()){q('rc-open').disabled=false;status('已保存选择草稿，未确认任何修改决定。仅保存在此浏览器。')}};
 q('rc-confirm').onclick=()=>{if(!Object.values(d.choices).some(Boolean))return;d.confirmed={choices:{...d.choices},answer:d.answer,time:new Date().toISOString()};d.savedAt=d.confirmed.time;if(persist()){q('rc-open').disabled=false;sync();status('已确认本轮选择。未选择项仍待决定，尚未执行改稿。')}else{d.confirmed=null;sync()}};
 q('rc-export-decisions').onclick=()=>{if(!d.confirmed)return;const c=d.confirmed;txt(title+'_已确认修改决定',title+'｜用户已确认修改决定（测试）\n\n确认时间：'+new Date(c.time).toLocaleString('zh-CN')+'\n只记录决定，尚未执行改稿；事实核实不因确认而完成。\n\n'+cards.map(x=>x.name+'：'+(c.choices[x.id]||'尚未决定')).join('\n')+'\n\n用户补充（未经独立核实）：\n'+(c.answer||'未补充'))};
 q('rc-open').onclick=()=>{const r=read();if(!r)return;d={...empty(),...r,choices:r.choices||{}};fields();q('rc-decisions').open=true;status(d.confirmed?'已恢复明确确认的记录。修改选择后须重新确认。':'已恢复选择草稿，尚未确认。')};
 fields();
}
window.reviewCase={mount};
})();
