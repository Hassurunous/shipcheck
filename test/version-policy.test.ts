import {it,expect} from 'vitest';
import {versionIssue,versionRangeSchema} from '../src/version-policy.js';
it.each([
  ['1.2.3','^1.0.0',true],['2.0.0','^1.0.0',false],['0.2.9','^0.2.1',true],['0.3.0','^0.2.1',false],
  ['1.2.9','~1.2.0',true],['1.3.0','~1.2.0',false],['2.1.0','>=1.0.0 <3.0.0',true],
  ['1.2.3-beta.1','^1.0.0',false],['1.2.3-beta.2','>=1.2.3-beta.1 <1.2.3',true],['release-1','^1',false],
])('evaluates provider version %s against %s', (version,range,compatible)=>expect(versionIssue(version,undefined,range)===undefined).toBe(compatible));
it('retains exact pins for non-semver APIs and distinguishes metadata conflicts',()=>{
  expect(versionIssue('2026-09','2026-09')).toBeUndefined();expect(versionIssue('1.2.3','1.2.3',undefined,'9.0.0')).toContain('conflicts');
  expect(versionIssue(undefined,undefined,'*')).toContain('unresolved');expect(versionRangeSchema.safeParse('garbage').success).toBe(false);
});
