import test from 'node:test';
import assert from 'node:assert/strict';
import {ScrubMotion} from '../assets/scrub.js';
test('wheel input accumulates while moving so fast scrolling reaches the last node',()=>{const m=new ScrubMotion(7);for(let i=0;i<10;i++)m.push(600);assert.equal(m.target,6);m.step(.016);assert.ok(m.position>0&&m.position<6);for(let i=0;i<140;i++)m.step(.016);assert.equal(m.position,6);});
test('scrubbing can stop between nodes and reverse without a transition lock',()=>{const m=new ScrubMotion(7);m.push(200);for(let i=0;i<150;i++)m.step(.016);assert.ok(m.position>0&&m.position<1);m.push(-200);for(let i=0;i<150;i++)m.step(.016);assert.equal(m.position,0);});
test('selected destinations and wheel deltas stay within the route',()=>{const m=new ScrubMotion(7);m.go(20);assert.equal(m.target,6);m.push(-100000);assert.equal(m.target,0);m.go(3);assert.equal(m.target,3);m.push(NaN);assert.equal(m.target,3);});
