import test from 'node:test';
import assert from 'node:assert/strict';
import {SceneController} from '../assets/motion.js';
test('invalid and duplicate selections never run transitions',async()=>{
  let calls=0; const c=new SceneController(6,async()=>{calls++});
  await c.go(-1); await c.go(6); await c.go(0); await c.go(NaN);
  assert.equal(calls,0); assert.equal(c.index,0);
});
test('rapid selections keep only the latest destination without overlapping scenes',async()=>{
  const releases=[];const changes=[];let active=0,max=0;
  const c=new SceneController(6,async(a,b)=>{active++;max=Math.max(max,active);changes.push([a,b]);await new Promise(r=>releases.push(r));active--});
  const first=c.go(1); c.go(2); c.go(5);
  assert.equal(c.busy,true);releases.shift()();await new Promise(r=>setTimeout(r,0));
  assert.deepEqual(changes,[[0,1],[1,5]]);releases.shift()();await first;
  assert.equal(c.index,5);assert.equal(max,1);assert.equal(c.busy,false);
});
test('failed animation releases the lock and does not change selected scene',async()=>{
  const c=new SceneController(3,async()=>{throw Error('interrupted')});
  await assert.rejects(c.go(1));assert.equal(c.busy,false);assert.equal(c.index,0);
});
