import {timeline} from './data.js';
import {journal} from './journal.js';
import {journalExtra} from './journal-extra.js';
export function renderExperienceScene(i,lang){
 const s=timeline[i],variant=['head','profile','head','head','head','head','profile'][i],portrait=[0,2,2,2,1,1,0][i];
 const t=(a,b)=>lang?b:a,pair=a=>a[lang];
 return `<article class="experience-scene scene-${variant} chapter-${i}" data-scene="${i}" style="--accent:${s.color};--portrait:${portrait}">
  <div class="scene-handoff" aria-hidden="true"></div><div class="experience-year" aria-hidden="true">${s.year}</div>
  <div class="experience-copy"><div class="eyebrow"><i></i>${t('轨迹','TRACE')} / ${String(i+1).padStart(2,'0')}</div><div class="experience-tag">${pair(s.label)}</div><h1>${pair(s.title)}</h1><p>${pair(s.body)}</p>
  <div class="experience-notes">${journal[i].map((n,j)=>`<details class="scene-note"><summary><span>0${j+1}</span><b>${n[lang]}</b><i>＋</i></summary><div class="scene-note-body"><p>${n[lang+2]}</p><p>${journalExtra[i][j][lang]}</p></div></details>`).join('')}</div>
  <div class="scene-annotation"><span>FIELD RECORD / ${s.year}</span><span>${t('划过条目，展开札记','HOVER TO OPEN THE NOTES')}</span></div></div>
  <div class="character-scene"><div class="character-disc"></div><div class="character-rings"></div><div class="character-word">${s.label[1]}</div>
  <div class="portrait-figure" aria-hidden="true"></div>
  <div class="chapter-marks" aria-hidden="true">${'<i></i>'.repeat(i===6?4:5)}</div><span class="character-id">SOVUE / TRACE ${String(i+1).padStart(2,'0')}<br>FRAGMENT OF A JOURNEY</span></div></article>`;
}
