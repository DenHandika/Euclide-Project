import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Degree, validateChoices, evaluateTarget } from '../src/lib/snbtChoices';

const selection=(degrees:Degree[])=>degrees.map((degree,i)=>({id:`p-${i}`,degree}));
const degrees:Degree[]=['S1','D4','D3'];

test('all 120 ordered combinations of 1–4 choices follow the 2026 composition rule',()=>{
  let checked=0;
  const check=(list:Degree[])=>{
    if (list.length) {
      const academic=list.filter(d=>d==='S1').length;
      const hasD3=list.includes('D3');
      const expected=list.length<=2 || (list.length===3 && (academic===1||academic===2||(academic===0&&hasD3))) || (list.length===4 && (academic===1||academic===2)&&hasD3);
      assert.equal(validateChoices(selection(list)).valid,expected,list.join(','));
      checked++;
    }
    if (list.length<4) degrees.forEach(d=>check([...list,d]));
  };
  check([]);
  assert.equal(checked,120);
});

test('empty, duplicate and more than four programs fail',()=>{
  assert.equal(validateChoices([]).valid,false);
  assert.equal(validateChoices([{id:'same',degree:'S1'},{id:'same',degree:'D3'}]).valid,false);
  assert.equal(validateChoices(selection(['S1','S1','D4','D3','D3'])).valid,false);
});

test('evaluation boundaries and missing target are explicit',()=>{
  assert.equal(evaluateTarget(700,700).status,'aman');
  assert.equal(evaluateTarget(665,700).status,'kompetitif');
  assert.equal(evaluateTarget(664.99,700).status,'kritis');
  assert.equal(evaluateTarget(700,null).status,'unavailable');
});
