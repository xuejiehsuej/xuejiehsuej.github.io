import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const b=await chromium.launch({headless:true,channel:'msedge'}),dir='docs/qa/feedback';
try{
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('http://127.0.0.1:4173/index.html');await p.waitForTimeout(1000);await p.locator('#portals').scrollIntoViewIfNeeded();
 const perf=await p.evaluate(async()=>{const frames=[];let last=performance.now();for(let i=0;i<100;i++){await new Promise(requestAnimationFrame);const now=performance.now();frames.push(now-last);last=now;if(i%25===0)document.querySelectorAll('.portal')[i/25%3|0].focus()}frames.sort((a,b)=>a-b);return {medianFrameMs:frames[50],p95FrameMs:frames[95],svgNodes:document.querySelectorAll('.cosmic-portal svg *').length}});
 fs.writeFileSync(`${dir}/performance.json`,JSON.stringify(perf,null,2));console.log(perf);
 await p.goto('http://127.0.0.1:4173/life.html');await p.waitForTimeout(1000);await p.locator('#theme').click();await p.waitForTimeout(1100);await p.locator('#language').click();await p.waitForTimeout(700);
 for(const i of [0,3,5]){await p.locator(`[data-life="${i}"]`).click();await p.waitForTimeout(900);await p.screenshot({path:`${dir}/life-${i}-light-en.png`});await p.locator('.life-note summary').first().click();await p.waitForTimeout(450);assert.ok((await p.locator('.life-note-body p').first().innerText()).length>350);await p.locator('.life-note').first().scrollIntoViewIfNeeded();await p.screenshot({path:`${dir}/life-${i}-expanded-light-en.png`});await p.keyboard.press('Escape');await p.waitForTimeout(250)}
 await p.setViewportSize({width:390,height:844});await p.locator('[data-life="5"]').click();await p.waitForTimeout(900);await p.screenshot({path:`${dir}/coast-mobile-boundary.png`});await p.locator('.life-note summary').first().click();await p.waitForTimeout(450);await p.screenshot({path:`${dir}/coast-mobile-note.png`});await p.keyboard.press('Escape');
 await p.goto('http://127.0.0.1:4173/experience.html');await p.waitForTimeout(1000);await p.locator('[data-node="4"]').click();await p.waitForTimeout(900);await p.screenshot({path:`${dir}/experience-mobile-light-en.png`,fullPage:true});
}finally{await b.close()}
