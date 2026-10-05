import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const p=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/experience.html');await p.waitForTimeout(900);
 const opacity=selector=>p.locator(selector).evaluateAll(nodes=>nodes.map(n=>Number(getComputedStyle(n).opacity)));
 async function at(value,label){const base=Math.floor(value);await p.locator(`[data-node="${base}"]`).click();await p.waitForTimeout(1000);if(value>base){const box=await p.locator('#experienceStage').boundingBox(),x=box.x+box.width*.96,y=box.y+box.height*.48;await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x-box.width*(value-base),y,{steps:24});await p.mouse.up();await p.waitForTimeout(800);}if(label)await p.screenshot({path:`docs/qa/${label}.png`});}
 await at(.4,'cards-before-entrance');assert.deepEqual(await opacity('.ripple-1 .portrait-card'),[0,0,0,0,0,0]);
 await at(.65,'cards-staggered-entrance');const cards=await opacity('.ripple-1 .ripple-paint .portrait-card');assert.ok(cards[0]>.9&&cards[1]>.2&&cards[1]<.6&&cards[2]===0);
 await at(1,'cards-solid');assert.deepEqual(await opacity('.ripple-1 .portrait-card'),[1,1,1,1,1,1]);
 await at(1.15,'cards-staggered-exit');const exit=await opacity('.ripple-1 .ripple-paint .portrait-card');assert.ok(exit[0]<exit[1]&&exit[1]<exit[2]);
 await at(1.34,'cards-gone');assert.deepEqual(await opacity('.ripple-1 .portrait-card'),[0,0,0,0,0,0]);
 await at(2.4,'ring-before-person');assert.deepEqual(await opacity('.ripple-2 .ripple-person,.ripple-3 .ripple-person'),[0,0,0,0]);
 await at(2.72,'ring-person-emerging');const emerging=await opacity('.ripple-3 .ripple-person');assert.ok(emerging.every(n=>n>.4&&n<.6));
 await at(3,'matching-halo-portrait');assert.equal(await p.locator('.halo-person').count(),0);assert.equal(await p.locator('.ripple-3 .ripple-portrait').count(),2);
 await at(2.4);assert.deepEqual(await opacity('.ripple-3 .ripple-person'),[0,0]);
 assert.deepEqual(errors,[]);console.log('PASS rendered opacity: cards 0 -> stagger -> 1 -> stagger -> 0, figure-free transition beat, delayed masked figure and reversible exit');
}finally{await browser.close()}
