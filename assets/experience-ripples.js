const palettes=[['#152c39','#76bbcd','#e0e8d0'],['#233d42','#9dbe91','#e5eed4'],['#19374a','#83bcda','#dbbce6'],['#292840','#aca2d9','#e9c6a9'],['#353247','#c5a8db','#ece4d8'],['#203d49','#8db7cb','#d9e6c0'],['#214a50','#a0d4cf','#f1e7c9']];
const portraits=[0,2,2,0,1,1,0];
function subject(i){return `${i===3?'<div class="portrait-halo"></div>':''}<div class="ripple-portrait" style="--portrait:${portraits[i]}" aria-hidden="true"></div>`}
function props(i){
 if(i===0)return `<div class="record-object"><i></i><b></b><em></em></div><div class="ghost-portrait" style="--portrait:0"></div><span class="art-script">BEGIN /<br>LISTEN TO THE WORLD</span>`;
 if(i===1)return `<div class="portrait-cards">${[0,2,1].map((n,j)=>`<div class="portrait-card object-${j}"><i style="--portrait:${n}"></i><small>OBSERVATION / 0${j+1}</small></div>`).join('')}</div>`;
 if(i===2)return `<div class="floating-window object-0"><i></i><i></i><i></i><b>IDEA ↗</b></div><div class="floating-book object-1"><span>FIELD<br>NOTES</span></div><span class="art-script object-2">CONNECT<br>THE UNSEEN</span>`;
 if(i===3)return `<div class="sanctuary-disc"></div><div class="sanctuary-window object-0"></div><div class="sanctuary-window object-1"></div>`;
 if(i===4)return `<div class="print-disc"></div><div class="proof-sheet object-0"><span>EDITION 05</span><i></i><i></i><i></i></div>`;
 if(i===5)return `<div class="archive-pages object-0"><i></i><i></i><i></i></div><span class="art-script object-1">COLLECT /<br>REFLECT</span>`;
 return `<div class="horizon-gate"></div><div class="horizon-line"></div><span class="art-script object-0">STILL<br>BECOMING</span>`;
}
function art(i){return `<div class="ripple-environment">${props(i)}</div>${i===1?'':`<div class="ripple-person">${subject(i)}</div>`}<span class="ripple-caption">SOVUE / CHAPTER 0${i+1}</span>`}
export function renderRippleStage(){return `<div class="ripple-stage" aria-hidden="true">${palettes.map(([ink,tone,paper],i)=>`<div class="ripple-scene ripple-${i}" data-ripple="${i}" style="--ink:${ink};--tone:${tone};--paper:${paper};z-index:${i}"><div class="ripple-paint">${art(i)}</div><div class="ripple-recolor" style="--ink:${ink};--tone:${paper};--paper:${tone}">${art(i)}</div></div>`).join('')}</div>`}
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const lastDraw=new WeakMap();
// A complete interval deliberately contains a figure-free beat before the next entrance.
export function revealTiming(local,index=0){
 const arrival=index===0?1:ease((local-.52)/.40);
 const departure=1-ease((local-1.02)/.28);
 return {arrival,departure,person:arrival*departure,cards:[0,1,2].map(n=>(index===0?1:ease((local-.44-n*.12)/.22))*(1-ease((local-1.02-n*.055)/.20)))};
}
export function drawRipples(stage,p,reduced){
 const signature=`${p}:${stage.clientWidth}:${stage.clientHeight}:${reduced}`;
 if(lastDraw.get(stage)===signature)return;
 lastDraw.set(stage,signature);
 const width=stage.clientWidth,height=stage.clientHeight,radius=Math.hypot(width,height);
 const origins=[[.85,.15],[.72,.5],[.90,.75],[.88,.08],[.72,.65],[.93,.93],[.92,.10]];
 stage.querySelectorAll('.ripple-scene').forEach((el,i)=>{
  const local=p-i+1,shown=i===0?1:clamp(local);
  el.style.visibility=local<0||local>=2?'hidden':'visible';
  const [x,y]=origins[i];
  const timing=revealTiming(local,i),sweep=ease((shown-.10)/.48),diagonal=i===2||i===5;
  const leading=-35+sweep*170;
  // Establish the colored space before revealing its inhabitants.
  el.style.clipPath=shown>=.999?'none':diagonal?`polygon(${100-leading}% 0,100% 0,100% 100%,${125-leading}% 100%)`:`circle(${radius*sweep}px at ${x*100}% ${y*100}%)`;
  el.style.setProperty('--emerge',reduced?1:timing.arrival);
  el.style.setProperty('--depart',reduced?1:timing.departure);
  el.style.setProperty('--person-opacity',reduced?1:timing.person);
  el.querySelectorAll('.ripple-person').forEach(person=>{person.style.clipPath=timing.arrival>=.999?'none':`circle(${radius*ease((shown-.51)/.39)}px at ${i%2?80:25}% ${i%2?10:85}%)`;});
  el.style.setProperty('--travel',`${(1-shown)*95-Math.max(0,local-1)*75}px`);
  el.querySelector('.ripple-recolor').style.clipPath=`circle(${radius*ease((shown-.76)/.24)}px at ${(i%2?.95:.64)*100}% ${(i%2?.12:.86)*100}%)`;
  el.querySelectorAll('[class*="object-"]').forEach(obj=>{const n=Number(obj.className.match(/object-(\d)/)?.[1]||0);obj.style.setProperty('--object-show',reduced?1:timing.cards[n%3]);});
  let ring=el.querySelector(':scope>.transition-ring');
  if(!ring){ring=document.createElement('div');ring.className='transition-ring';el.append(ring);}
  ring.style.cssText=`left:${x*100}%;top:${y*100}%;width:${radius*sweep*2}px;height:${radius*sweep*2}px;opacity:${diagonal?0:Math.sin(Math.PI*clamp((shown-.10)/.52))*.8};`;
  let band=el.querySelector(':scope>.transition-band');
  if(!band){band=document.createElement('div');band.className='transition-band';el.append(band);}
  band.style.left=`${106-leading}%`;band.style.opacity=diagonal?Math.sin(Math.PI*clamp((shown-.10)/.52))*.65:0;
 });
}
