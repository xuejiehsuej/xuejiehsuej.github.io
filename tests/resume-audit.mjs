import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir='docs/qa/resume';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});
const results={checks:[],errors:[],externalFailures:[]};
try{
 const page=await browser.newPage({viewport:{width:1600,height:900}});
 page.on('pageerror',e=>results.errors.push(e.message));
 page.on('requestfailed',r=>{(r.url().startsWith('http://127.0.0.1:4173')?results.errors:results.externalFailures).push(r.url()+': '+r.failure()?.errorText)});
 const visit=async name=>{await page.goto(`http://127.0.0.1:4173/${name}.html`,{waitUntil:'domcontentloaded'});await page.waitForTimeout(700)};
 const settle=async n=>page.waitForFunction(n=>Math.abs(Number(document.querySelector('#experienceStage').dataset.progress)-n)<.002,n);
 await visit('experience');
 const rotation=()=>page.locator('.character-disc').first().evaluate(e=>getComputedStyle(e,'::before').transform);
 const before=await rotation();await page.waitForTimeout(350);assert.notEqual(await rotation(),before);results.checks.push('disc rotation changes actual transform');
 await page.mouse.move(800,400);
 for(let i=0;i<10;i++)await page.mouse.wheel(0,600);
 await settle(6);
 assert.equal(await page.locator('.timeline-rail .active').getAttribute('data-node'),'6');
 const sync=await page.evaluate(()=>{const walker=document.querySelector('.timeline-walker');const end=document.querySelector('[data-node="6"]');return {actual:parseFloat(walker.style.left),expected:end.offsetLeft+7}});
 assert.ok(Math.abs(sync.actual-sync.expected)<1);results.checks.push('rapid wheel reaches last scene and synchronized walker');
 for(const n of [1,4,6]){await page.locator(`[data-node="${n}"]`).click();await settle(n);await page.screenshot({path:`${dir}/portrait-${n}.png`,fullPage:true})}
 await page.keyboard.press('ArrowLeft');await settle(5);results.checks.push('reverse keyboard navigation');
 await visit('life');assert.equal(await page.locator('[data-life]').count(),7);
 for(const theme of ['dark','light']){
  if(await page.locator('html').getAttribute('data-theme')!==theme){await page.locator('#theme').click();await page.waitForTimeout(1100)}
  for(let i=0;i<7;i++){await page.locator(`[data-life="${i}"]`).click();await page.waitForTimeout(750);assert.equal(await page.locator('dialog').evaluate(e=>e.open),true);assert.ok(await page.locator('#dialogTitle').innerText());await page.screenshot({path:`${dir}/life-${i}-${theme}.png`});await page.keyboard.press('Escape')}
 }results.checks.push('all seven Life details open and close in both themes');
 await page.setViewportSize({width:390,height:844});
 for(const name of ['index','works','experience','life']){await visit(name);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name} horizontal overflow`);await page.screenshot({path:`${dir}/${name}-mobile.png`,fullPage:true})}
 results.checks.push('all four mobile pages have no horizontal overflow');
 assert.deepEqual(results.errors,[]);
}finally{fs.writeFileSync(`${dir}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close()}
