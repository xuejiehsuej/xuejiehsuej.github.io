import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const b=await chromium.launch({headless:true,channel:'msedge'});
try{
const p=await b.newPage({viewport:{width:1600,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:4173/works.html');await p.waitForTimeout(1000);await p.locator('.crystal-open').click();await p.waitForTimeout(850);
assert.equal(await p.locator('.crystal-hit').count(),6);
const stage=await p.locator('#worksStage').boundingBox(),dialog=await p.locator('#detailDialog').boundingBox();assert.ok(Math.abs(stage.width-dialog.width)<3);assert.ok(Math.abs(stage.y-dialog.y)<3);
assert.equal(await p.locator('#detailDialog').evaluate(e=>e.matches(':modal')),false);
await p.screenshot({path:'docs/qa/facets-expanded.png'});
await p.locator('[data-shard="0"]').click();assert.equal(await p.locator('[data-shard="0"]').getAttribute('aria-pressed'),'true');
await p.locator('[data-project="2"]').click();await p.waitForTimeout(1800);assert.equal(await p.locator('[data-project="2"]').getAttribute('aria-pressed'),'true');assert.ok(await p.locator('#detailDialog').evaluate(e=>e.open));
await p.keyboard.press('Escape');await p.waitForTimeout(300);assert.equal(await p.locator('#detailDialog').evaluate(e=>e.open),false);
await p.goto('http://127.0.0.1:4173/experience.html');await p.waitForTimeout(1000);
const progress=()=>p.locator('#experienceStage').getAttribute('data-progress');
const art=p.locator('.character-scene').first(),box=await art.boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.wheel(490,0);await p.waitForTimeout(1200);
const mid=Number(await progress());assert.ok(mid>0&&mid<1);const reveal=Number(await p.locator('[data-scene="0"]').evaluate(e=>e.style.getPropertyValue('--subject-reveal')));assert.ok(reveal>0&&reveal<1);
await p.screenshot({path:'docs/qa/experience-mid-reveal.png'});
await p.mouse.wheel(-490,0);await p.waitForTimeout(1400);assert.ok(Number(await progress())<.01);
await p.locator('[data-node="4"]').click();await p.waitForTimeout(1500);await p.screenshot({path:'docs/qa/experience-chapter-five.png'});
assert.deepEqual(errors,[]);console.log('PASS inline facets, flip, project switching, Escape, fractional reveal and reversal, no page errors');
}finally{await b.close()}
