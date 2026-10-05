import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/86137/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
fs.mkdirSync('docs/qa',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
page.on('pageerror',e=>console.log('PAGE ERROR',e.message));
for(const name of ['index','works','experience','life']){
 await page.goto(`http://127.0.0.1:4173/${name}.html`);await page.waitForTimeout(1000);
 await page.screenshot({path:`docs/qa/${name}-desktop.png`,fullPage:true});
 console.log(name,await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)})));
 if(name==='works'){await page.locator('.crystal-open').click();await page.waitForTimeout(900);await page.screenshot({path:'docs/qa/crystals-front.png'});for(const shard of await page.locator('.crystal-hit').all())await shard.click();await page.waitForTimeout(1100);await page.screenshot({path:'docs/qa/crystals-back.png'});}
}
await page.setViewportSize({width:390,height:844});
for(const name of ['index','works','experience','life']){await page.goto(`http://127.0.0.1:4173/${name}.html`);await page.waitForTimeout(900);await page.screenshot({path:`docs/qa/${name}-mobile.png`,fullPage:true});console.log(name,'mobile',await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth})))}
await browser.close();
