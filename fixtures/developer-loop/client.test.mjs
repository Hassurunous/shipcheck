import {test} from 'node:test';
import assert from 'node:assert/strict';
import {listUsers} from './client.mjs';

test('uses the agreed GET endpoint and returns parsed users without a real request',async()=>{
  const original=globalThis.fetch,users=[{id:'user-1'}],calls=[];
  globalThis.fetch=async(url,options)=>{calls.push({url,method:options?.method ?? 'GET'});return {json:async()=>users};};
  try {
    assert.deepEqual(await listUsers(),users);
    assert.deepEqual(calls,[{url:'https://api.example.test/users',method:'GET'}]);
  } finally {globalThis.fetch=original;}
});
