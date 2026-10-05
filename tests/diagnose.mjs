import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const{chromium}=require('C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1600,height:900}});
await page.goto('http://127.0.0.1:4173/index.html');await page.waitForTimeout(1000);
console.log(await page.evaluate(()=>[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,cls:e.className,r:e.getBoundingClientRect().right,l:e.getBoundingClientRect().left})).filter(x=>x.r>innerWidth+1||x.l< -1)));
await page.goto('http://127.0.0.1:4173/works.html');await page.waitForTimeout(1000);await page.locator('[data-project="1"]').click();await page.waitForTimeout(100);console.log('transition100',await page.locator('.incoming').evaluate(e=>({animations:e.getAnimations().map(a=>({time:a.currentTime,fill:a.effect.getTiming().fill})),clip:getComputedStyle(e).clipPath})));await page.waitForTimeout(250);await page.screenshot({path:'docs/qa/works-transition-before.png'});
await browser.close();
