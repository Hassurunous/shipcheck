import {it,expect} from 'vitest';
import {preprocessJava} from '../src/java-source.js';
import {extractDependencyImports} from '../src/dependency-imports.js';
it.each([
  [String.raw`\u005a`,'Z'],[String.raw`\uuuu005a`,'Z'],
  [String.raw`\\u005a`,String.raw`\\u005a`],
  [String.raw`\\\u005a`,String.raw`\\Z`],
  [String.raw`\u005cu005a`,String.raw`\u005a`],
  [String.raw`\u005c\u005a`,String.raw`\Z`],
  [String.raw`\u000d\u000a`,'\n'],['a\rb\r\nc','a\nb\nc'],
  [String.raw`\uD83D\uDE00`,'😀'],
])('translates Java lexical input %s without recursive expansion',(raw,text)=>{
  const result=preprocessJava(raw);expect(result.issues).toEqual([]);expect(result.text).toBe(text);
  expect(result.starts).toHaveLength(text.length);expect(result.ends.at(-1)).toBe(raw.length);
});
it.each([String.raw`\u00xx`,String.raw`\uu123`,String.raw`// \u000g`])('rejects malformed eligible escapes %s',raw=>{
  expect(extractDependencyImports(raw,'A.java').issues).toContain('invalid-java-unicode-escape');
});
it.each([String.raw`// \u000a `,String.raw`// \uu000d `,String.raw`\u002f\u002a comment \u002a\u002f `,'/* 😀 */ '])('retains original evidence through Java preprocessing %s',prefix=>{
  const excerpt=String.raw`\u0069mport ui.\u0046oo;`;
  const raw='package core;\r\n'+prefix+excerpt+'\nclass A {}';
  expect(extractDependencyImports(raw,'A.java')).toEqual({issues:[],imports:[{line:2,excerpt,specifier:'ui.Foo'}]});
});
it('does not expose an import hidden behind an ineligible escape',()=>{
  expect(extractDependencyImports(String.raw`// \\u000a import ui.Foo;`+'\nclass A {}','A.java')).toEqual({issues:[],imports:[]});
});
