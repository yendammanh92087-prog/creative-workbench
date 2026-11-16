/* Perspective-projected 3D navigation. No network, user data or external runtime. */
window.mountGalaxy3D=function(host,nodes,groups,toggle){
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.append(canvas);
 const ctx=canvas.getContext('2d');if(!ctx){host.textContent='星图暂不可用，请使用目录进入。';return()=>{}}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,yaw=0,pitch=-.36,phase=0,last=0,frame=0,alive=true,drag=null,hover=false,focused=false,w=900,h=600;
 let seed=93;const rand=()=>((seed=seed*16807%2147483647)-1)/2147483646;
 const centers=[[-285,-130,80],[225,-165,-140],[310,110,130],[30,210,180],[-300,170,-130]];
 const major=[0,4,8,14,19];
 const points=nodes.map((n,i)=>{const c=centers[n[3]],root=nodes[major[n[3]]];return {x:c[0]+(n[1]-root[1])*.77,y:c[1]+(n[2]-root[2])*.77,z:c[2]+(major.includes(i)?0:(rand()-.5)*130),color:groups[n[3]].color,r:major.includes(i)?9:2.5}});
 const dust=[];
 centers.forEach((c,k)=>{for(let i=0;i<120;i++){const a=rand()*Math.PI*2,u=rand()*2-1,r=22+rand()*90,s=Math.sqrt(1-u*u);dust.push({x:c[0]+Math.cos(a)*s*r,y:c[1]+u*r*.8,z:c[2]+Math.sin(a)*s*r,color:groups[k].color,r:.5+rand()*1.8})}});
 const stars=Array.from({length:130},()=>({x:rand(),y:rand(),r:rand()*.9+.2,a:rand()*.4+.1}));
 const buttons=points.map((p,i)=>{const b=document.createElement('button');b.className='galaxy-label'+(major.includes(i)?' major':'');b.dataset.node=i;b.textContent=nodes[i][0];b.setAttribute('aria-label',nodes[i][0]+'，进入'+groups[nodes[i][3]].title);b.style.setProperty('--star-color',p.color);host.append(b);return b});
 const reset=document.createElement('button');reset.className='galaxy-reset';reset.textContent='重置视角';host.append(reset);reset.onclick=()=>{yaw=0;pitch=-.36;draw()};
 const hint=document.createElement('span');hint.className='galaxy-drag-hint';hint.textContent='拖动旋转 · 点击进入';host.append(hint);
 function project(p){const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);const x=p.x*cy+p.z*sy,z=-p.x*sy+p.z*cy,y=p.y*cp-z*sp,depth=p.y*sp+z*cp;const s=900/(900+depth),fit=Math.min(w/1050,h/700);return{x:w/2+x*s*fit,y:h/2+y*s*fit,z:depth,s:s*fit,scale:s}}
 function glow(x,y,r,color,alpha=1){ctx.globalAlpha=alpha;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(.15,color+'aa');g.addColorStop(1,color+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
 function orbit(t,k){const radius=160+k*46,a=t+k*.8;return{x:Math.cos(a)*radius,y:Math.sin(a)*radius*.27,z:Math.sin(a)*radius}}
 function draw(){
  ctx.clearRect(0,0,w,h);stars.forEach(s=>{ctx.globalAlpha=s.a;ctx.fillStyle='#bdc9ff';ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=1;
  const center=project({x:0,y:0,z:0});glow(center.x,center.y,170*center.s,'#7054ee',.38);
  const objects=[];
  for(let k=0;k<4;k++)for(let j=0;j<160;j++){const a=project(orbit(j/160*Math.PI*2,k)),b=project(orbit((j+1)/160*Math.PI*2,k));objects.push({z:(a.z+b.z)/2,draw:()=>{ctx.strokeStyle=k%2?'#77a7fa':'#9877ed';ctx.globalAlpha=.14+Math.max(0,1-(a.z+360)/720)*.32;ctx.lineWidth=(k===0?1.5:.8)*a.scale;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1}})}
  dust.concat(points).forEach(p=>{const q=project(p);objects.push({z:q.z,draw:()=>{const r=p.r*q.s;if(r>3)glow(q.x,q.y,r*4,p.color,.7);ctx.globalAlpha=Math.max(.23,Math.min(1,q.scale*.75));ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(q.x,q.y,Math.max(.3,r),0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}})});
  for(let k=0;k<4;k++){const q=project(orbit(phase*(.28+k*.05)+k*1.7,k));objects.push({z:q.z,draw:()=>{glow(q.x,q.y,12*q.s,'#a9c7ff',.9);ctx.fillStyle='#f2f1ff';ctx.beginPath();ctx.arc(q.x,q.y,2.4*q.s,0,Math.PI*2);ctx.fill()}})}
  objects.push({z:0,draw:()=>{const r=33*center.s;glow(center.x,center.y,r*2.5,'#aa71ef',.6);const g=ctx.createRadialGradient(center.x-r*.35,center.y-r*.42,1,center.x,center.y,r);g.addColorStop(0,'#fff8ff');g.addColorStop(.32,'#e6caff');g.addColorStop(.72,'#9375d1');g.addColorStop(1,'#362951');ctx.fillStyle=g;ctx.beginPath();ctx.arc(center.x,center.y,r,0,Math.PI*2);ctx.fill()}});
  objects.sort((a,b)=>b.z-a.z).forEach(o=>o.draw());
  ctx.textAlign='center';ctx.fillStyle='#eee5ff';ctx.font='600 '+Math.max(16,22*center.s)+'px sans-serif';ctx.fillText('创作知识库',center.x,center.y+57*center.s);ctx.fillStyle='#a49abb';ctx.font='10px sans-serif';ctx.fillText('CONTENT GALAXY',center.x,center.y+76*center.s);
  points.forEach((p,i)=>{const q=project(p),b=buttons[i];b.style.left=q.x+'px';b.style.top=(q.y+9*q.s)+'px';b.style.transform='translateX(-50%) scale('+Math.max(.8,Math.min(1.2,q.scale))+')';b.style.opacity=String(Math.max(.5,Math.min(1,q.scale*.85)));b.style.zIndex=String(Math.round(1000-q.z));b.dataset.depth=q.z.toFixed(2)});
  host.dataset.yaw=yaw.toFixed(4);
 }
 function resize(){w=host.clientWidth;h=host.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
 function tick(now){if(!alive)return;const dt=Math.min((now-last)/1000||0,.05);last=now;if(!paused&&!document.hidden&&!drag&&!hover&&!focused){yaw+=dt*.055;phase+=dt;draw()}frame=requestAnimationFrame(tick)}
 function status(){toggle.textContent=paused?'播放动效':'暂停动效';toggle.setAttribute('aria-pressed',String(paused))}
 toggle.onclick=()=>{paused=!paused;status()};const preference=()=>{paused=reduced.matches;status()};reduced.addEventListener('change',preference);status();
 canvas.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing'};
 canvas.onpointermove=e=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.006;pitch=Math.max(-1.15,Math.min(1.15,pitch+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY};draw()};
 canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;canvas.style.cursor='grab'};
 buttons.forEach(b=>{b.addEventListener('pointerenter',()=>hover=true);b.addEventListener('pointerleave',()=>hover=false);b.addEventListener('focus',()=>focused=true);b.addEventListener('blur',()=>focused=false)});
 const observer=new ResizeObserver(resize);observer.observe(host);resize();frame=requestAnimationFrame(tick);
 return()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();reduced.removeEventListener('change',preference);toggle.onclick=null};
};
