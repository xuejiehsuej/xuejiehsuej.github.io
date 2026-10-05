import test from 'node:test';
import assert from 'node:assert/strict';
import {revealTiming} from '../assets/experience-ripples.js';
test('previous figure is gone before the incoming figure appears',()=>{
 for(const p of [.31,.4,.5]){assert.equal(revealTiming(1+p,2).person,0);assert.equal(revealTiming(p,3).person,0);}
 assert.equal(revealTiming(.52,3).person,0);
 assert.ok(revealTiming(.72,3).person>.4);
 assert.equal(revealTiming(1,3).person,1);
});
test('cards have separate transparent, entering, solid and departing phases',()=>{
 assert.deepEqual(revealTiming(.4,1).cards,[0,0,0]);
 const partial=revealTiming(.65,1).cards;assert.ok(partial[0]>partial[1]);assert.equal(partial[2],0);
 assert.deepEqual(revealTiming(1,1).cards,[1,1,1]);
 const outgoing=revealTiming(1.15,1).cards;assert.ok(outgoing[0]<outgoing[1]&&outgoing[1]<outgoing[2]);
 assert.deepEqual(revealTiming(1.34,1).cards,[0,0,0]);
});
