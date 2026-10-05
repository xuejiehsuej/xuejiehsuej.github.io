import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import {lifeNotes} from '../assets/life-notes.js';
import {journal} from '../assets/journal.js';
import {journalExtra} from '../assets/journal-extra.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
for(const entries of Object.values(lifeNotes))for(const pair of entries){assert.ok(pair[0].length>=180);assert.ok(pair[1].length>=350)}
for(let i=0;i<7;i++)for(let j=0;j<2;j++)assert.ok((journal[i][j][2]+journalExtra[i][j][0]).length>=200);
const dir='docs/qa/feedback';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[],checks=[];
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 const visit=async name=>{await page.goto(`http://127.0.0.1:4173/${name}.html`,{waitUntil:'domcontentloaded'});await page.waitForTimeout(850)};
 for(const name of ['index','life']){await visit(name);await page.evaluate(()=>scrollTo(0,500));await page.waitForTimeout(150);assert.ok(Math.abs((await page.locator('.site-header').boundingBox()).y)<1)}checks.push('Home and Life headers remain at viewport top');
 await visit('index');await page.locator('#portals').scrollIntoViewIfNeeded();assert.equal(await page.locator('.portal .figure,.portal-letter,.portal-word').count(),0);await page.locator('.portal').nth(1).hover();await page.waitForTimeout(1200);const widths=await page.locator('.portal').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));assert.ok(widths[1]>widths.reduce((a,b)=>a+b)/2);await page.screenshot({path:`${dir}/home-cosmos.png`});checks.push('three cosmic portals retain squeeze interaction');
 const boundary=async stacked=>{const art=await page.locator('.detail-art').boundingBox(),close=await page.locator('.dialog-close').boundingBox();assert.ok(Math.abs((stacked?close.y+close.height/2:close.x+close.width/2)-(stacked?art.y+art.height:art.x+art.width))<2);assert.equal(await page.locator('.dialog-close').evaluate(e=>getComputedStyle(e).boxShadow),'none')};
 await visit('life');
 for(let i=0;i<7;i++){
  await page.locator(`[data-life="${i}"]`).click();await page.waitForTimeout(850);assert.equal(await page.locator('.life-note').count(),3);
  for(let j=0;j<3;j++){const note=page.locator('.life-note').nth(j);await note.locator('summary').click();assert.equal(await note.evaluate(e=>e.open),true);assert.ok((await note.locator('p').innerText()).length>=180)}
  await boundary(i===2||i>=4);await page.locator('dialog').evaluate(e=>e.scrollTop+=220);await boundary(i===2||i>=4);
  if(i===5)await page.screenshot({path:`${dir}/coast-expanded.png`});await page.keyboard.press('Escape');
 }checks.push('21 Life notes expand; close button follows artwork boundary in all seven layouts');
 await visit('experience');assert.equal(await page.locator('.scene-full').count(),0);
 for(let i=0;i<7;i++){await page.locator(`[data-node="${i}"]`).click();await page.waitForFunction(i=>Math.abs(Number(document.querySelector('#experienceStage').dataset.progress)-i)<.002,i);await page.mouse.move(1550,950);await page.screenshot({path:`${dir}/chapter-${i}.png`,fullPage:true})}
 await page.locator('[data-node="0"]').click();await page.waitForTimeout(900);await page.locator('[data-scene="0"] .scene-note summary').first().click();await page.locator('[data-scene="0"] .scene-note').evaluateAll(es=>es.forEach(e=>e.open=true));await page.locator('[data-scene="0"] .experience-copy').hover();const p=await page.locator('#experienceStage').getAttribute('data-progress');await page.mouse.wheel(0,500);await page.waitForTimeout(500);assert.equal(await page.locator('#experienceStage').getAttribute('data-progress'),p);await page.screenshot({path:`${dir}/experience-notes.png`});checks.push('Experience uses only head or half portraits and long notes scroll independently');
 await page.mouse.move(1100,400);await page.mouse.wheel(0,300);await page.waitForTimeout(600);await page.screenshot({path:`${dir}/chapter-between.png`});
 await page.setViewportSize({width:390,height:844});await visit('life');await page.locator('[data-life="5"]').click();await page.waitForTimeout(850);await page.locator('.life-note summary').first().click();await boundary(true);await page.screenshot({path:`${dir}/life-mobile.png`,fullPage:true});await page.keyboard.press('Escape');
 await visit('experience');await page.screenshot({path:`${dir}/experience-mobile.png`,fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-node="6"]').click();await page.waitForTimeout(100);assert.equal(await page.locator('#experienceStage').getAttribute('data-progress'),'6.0000');checks.push('mobile layout and reduced motion navigation');assert.deepEqual(errors,[]);
}finally{await browser.close();fs.writeFileSync(`${dir}/results.json`,JSON.stringify({checks,errors},null,2));console.log({checks,errors})}
