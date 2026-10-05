import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const b=await chromium.launch({headless:true,channel:'msedge'});
try{
 const p=await b.newPage({viewport:{width:1600,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/experience.html');await p.waitForTimeout(1000);
 assert.equal(await p.locator('.ripple-scene').count(),7);
 for(const i of [0,1,3,4,6]){await p.locator(`[data-node="${i}"]`).click();await p.waitForTimeout(1100);await p.screenshot({path:`docs/qa/ripple-chapter-${i}.png`});}
 await p.locator('[data-node="2"]').click();await p.waitForTimeout(1200);
 const box=await p.locator('#experienceStage').boundingBox(),x=box.x+box.width*.85,y=box.y+box.height*.5;
 await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x-box.width*.45,y,{steps:20});await p.mouse.up();await p.waitForTimeout(800);
 const progress=Number(await p.locator('#experienceStage').getAttribute('data-progress'));assert.ok(progress>2.4&&progress<2.5);
 const halo=p.locator('[data-ripple="3"]');assert.match(await halo.evaluate(e=>e.style.clipPath),/^circle/);const emerge=Number(await halo.evaluate(e=>e.style.getPropertyValue('--emerge')));assert.ok(emerge>0&&emerge<1);
 await p.screenshot({path:'docs/qa/ripple-halo-emerging.png'});
 await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x-box.width*.3,y,{steps:15});await p.mouse.up();await p.waitForTimeout(700);await p.screenshot({path:'docs/qa/ripple-halo-recolor.png'});
 await p.locator('[data-node="2"]').click();await p.waitForTimeout(1200);assert.equal(await p.locator('[data-ripple="2"]').evaluate(e=>e.style.clipPath),'none');
 await p.locator('.experience-copy').nth(2).locator('summary').first().hover();assert.ok(await p.locator('.experience-copy').nth(2).locator('details').first().evaluate(e=>e.open));
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(500);await p.screenshot({path:'docs/qa/ripple-mobile.png'});
 await p.setViewportSize({width:1600,height:1000});await p.locator('#theme').click();await p.waitForTimeout(1000);await p.screenshot({path:'docs/qa/ripple-light.png'});
 for(const page of ['works','life']){await p.goto(`http://127.0.0.1:4173/${page}.html`);await p.waitForTimeout(1000);const bg=p.locator('.universe-image'),before=await bg.evaluate(e=>getComputedStyle(e).transform);await p.waitForTimeout(300);assert.notEqual(await bg.evaluate(e=>getComputedStyle(e).transform),before);}
 assert.deepEqual(errors,[]);console.log('PASS seven scenes, drag-driven circular reveal, partial emergence, recolor, reverse, notes, mobile and no page errors');
}finally{await b.close()}
