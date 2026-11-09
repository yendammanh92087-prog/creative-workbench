(()=>{
const KEY='review-today-case-v1';
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
function read(){try{return JSON.parse(localStorage.getItem(KEY))||{choices:{},answer:'',savedAt:null}}catch{return{choices:{},answer:'',savedAt:null}}}
function mount(box){let d=read();
box.innerHTML=`<section aria-label="真实稿件测试"><div class="eyebrow">已有稿审改 · 固定案例测试</div><h2>${title}</h2><p class="notice">这是本次对话已完成的审稿建议，用来测试工具交互；不是网页即时生成。无需 API。只读文字稿，未核对成片。</p><p>只使用文件第二部分“视频口播全稿”。待重录备选没有混入原稿。原稿不会被改动。</p><details><summary>查看测试原稿（只读）</summary><pre style="white-space:pre-wrap;font:inherit">${esc(source)}</pre></details><div class="actions"><button id="rc-show" class="primary">查看这篇的审稿结果</button><button id="rc-open" ${d.savedAt?'':'disabled'}>打开已保存的测试结果</button></div><div id="rc-result"></div><p id="rc-status" role="status"></p></section>`;
const status=t=>box.querySelector('#rc-status').textContent=t;
function persist(save){if(save)d.savedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch{status('浏览器保存失败，请导出结果备份。');return false}}
function show(){box.querySelector('#rc-result').innerHTML=`<h2 style="margin-top:28px">这篇可以保留生活感，先厘清时间与产品作用</h2><h3>值得保留</h3><ul><li>枕边的小玩偶：用动作呈现对孩子的牵挂。</li><li>与客户多聊一个小时：让赶早班机有了具体原因。</li><li>班级通知与清单：具体展示产品如何帮忙。</li><li>陪母亲过生日、和客户吃饭：有人物与生活气息，不因没有直接讲产品就删除。</li></ul><h3>修改建议</h3><p>选择只记录你的处理意向，不会自动改稿，也不表示已经修改完成。</p>${cards.map(c=>`<article class="panel"><span class="tag">${c.level}</span><h3>${c.name}</h3><p><strong>原句：</strong>${esc(c.quote)}</p><p><strong>为什么：</strong>${c.why}</p><p><strong>建议：</strong>${c.how}</p><label for="rc-${c.id}">这条怎么处理</label><select id="rc-${c.id}"><option value="">尚未选择</option><option value="采纳">采纳建议，留待修改</option><option value="暂不处理">暂不处理</option></select></article>`).join('')}<label for="rc-answer">待核事实：1:29 的班级通知，是前一天晚上发生、放在结尾回叙的吗？</label><textarea id="rc-answer" placeholder="测试时可以暂不回答，不会阻止保存。">${esc(d.answer)}</textarea><p class="small">补充内容只记录，不会据此自动重新审稿。音画匹配、语气、实拍隐私未核验。</p><div class="actions"><button id="rc-save" class="primary">保存本轮审稿结果</button><button id="rc-export">导出测试结果</button></div>`;
cards.forEach(c=>{const el=box.querySelector('#rc-'+c.id);el.value=d.choices[c.id]||'';el.onchange=()=>{d.choices[c.id]=el.value;persist(false)}});
box.querySelector('#rc-answer').oninput=ev=>{d.answer=ev.target.value;persist(false)};
box.querySelector('#rc-save').onclick=()=>{if(persist(true)){box.querySelector('#rc-open').disabled=false;status('已保存本轮测试结果。可以关闭后从同一入口重新打开；原稿未改。仅保存在当前浏览器。')}};
box.querySelector('#rc-export').onclick=()=>download(title+'_审稿测试.md','# '+title+'｜固定案例审稿测试\n\n本次对话的预写审稿结果，非网页即时生成。未核成片，原稿未改。\n\n## 测试原稿\n'+source+'\n\n## 建议与处理意向\n'+cards.map(c=>'### '+c.name+'\n原句：'+c.quote+'\n原因：'+c.why+'\n建议：'+c.how+'\n处理意向：'+(d.choices[c.id]||'尚未选择')).join('\n\n')+'\n\n## 待核事实补充\n'+(d.answer||'未补充')+'\n\n保存时间：'+(d.savedAt||'未正式保存'));
}
box.querySelector('#rc-show').onclick=show;box.querySelector('#rc-open').onclick=()=>{d=read();show();status('已恢复此浏览器保存的处理意向和补充内容；没有重新运行分析。')};
}
window.reviewCase={mount};
})();
