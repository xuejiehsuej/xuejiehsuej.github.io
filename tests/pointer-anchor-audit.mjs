import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir='docs/qa/pointer-anchor';fs.mkdirSync(dir,{recursive:true});const b=await chromium.launch({headless:true,channel:'msedge'});
try{const p=await b.newPage({viewport:{width:1600,height:1000}});await p.goto('http://127.0.0.1:4173/index.html');await p.waitForTimeout(1000);const header=await p.locator('.site-header').boundingBox();assert.equal(header.x,0);assert.equal(header.width,1600);await p.locator('#portals').scrollIntoViewIfNeeded();await p.locator('.portal').nth(1).hover();await p.waitForTimeout(1400);await p.screenshot({path:`${dir}/inclined-atlas.png`});
await p.goto('http://127.0.0.1:4173/life.html');await p.waitForTimeout(900);await p.locator('[data-life="5"]').click();await p.waitForTimeout(900);
for(let i=0;i<3;i++){const row=p.locator('.life-note summary').nth(i),note=p.locator('.life-note').nth(i);await p.mouse.move(5,5);await p.waitForTimeout(250);await row.scrollIntoViewIfNeeded();const box=await row.boundingBox(),x=box.x+box.width*.5,y=box.y+box.height*.5;await p.mouse.move(x,y);await p.waitForTimeout(450);assert.equal(await note.evaluate(e=>e.open),true);assert.ok(Math.abs((await row.boundingBox()).y-box.y)<1);await p.mouse.click(x,y);await p.mouse.move(5,5);await p.waitForTimeout(250);assert.equal(await note.getAttribute('data-pinned'),'true');assert.equal(await note.evaluate(e=>e.open),true);await row.click()}
console.log('PASS full-width header, side-view atlas, all three hover rows stay at the same Y and pin with stationary click');
}finally{await b.close()}
