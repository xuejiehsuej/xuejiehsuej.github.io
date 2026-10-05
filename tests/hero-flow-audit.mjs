import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const b=await chromium.launch({headless:true,channel:'msedge'});
try{
 const p=await b.newPage({viewport:{width:1600,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/index.html');await p.waitForSelector('.hero-flow');await p.waitForTimeout(1300);
 const title=await p.locator('.hero-copy h1').boundingBox();
 const first=await p.locator('.hero-flow').getAttribute('data-frame');await p.screenshot({path:'docs/qa/hero-flow-start.png'});
 await p.waitForTimeout(4000);const second=await p.locator('.hero-flow').getAttribute('data-frame');assert.ok(Number(second)>Number(first));assert.deepEqual(await p.locator('.hero-copy h1').boundingBox(),title);
 await p.screenshot({path:'docs/qa/hero-flow-later.png'});
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(150);assert.equal(await p.locator('.hero-flow').isVisible(),false);
 await p.emulateMedia({reducedMotion:'no-preference'});await p.evaluate(()=>scrollTo(0,document.querySelector('.home-hero').getBoundingClientRect().bottom+scrollY+20));await p.waitForTimeout(1000);const paused=await p.locator('.hero-flow').getAttribute('data-frame');await p.waitForTimeout(400);assert.equal(await p.locator('.hero-flow').getAttribute('data-frame'),paused);
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(800);assert.equal(await p.locator('.hero-flow').isVisible(),true);await p.screenshot({path:'docs/qa/hero-flow-mobile.png'});
 assert.deepEqual(errors,[]);console.log('PASS animated texture frames, stable title, reduced-motion fallback, offscreen pause, mobile and no page errors');
}finally{await b.close()}
