# src/java-source.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

preprocessJava implements Unicode-escape eligibility using backslash parity and whether the previous character was translated. It records each translated UTF-16 unit's original start/end offsets, then normalizes CR/CRLF to LF while updating those mappings. Architecture import extraction can therefore parse translated Java yet quote the original file accurately.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `cbb40dfb3da2d8ee2c375999d12518781ef1a4871a9e68abde4957733ca0a661`.

This chapter inventories **1 function bodies/callbacks**, **17 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators


## Module execution


## Function index

- [preprocessJava (2:8)](#fn-88)

<a id="fn-88"></a>
### preprocessJava (2:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L3](#l3) <code>chars:string[]</code>: create a new empty array to accumulate ordered results.
- [L3](#l3) <code>starts:number[]</code>: create a new empty array to accumulate ordered results.
- [L3](#l3) <code>ends:number[]</code>: create a new empty array to accumulate ordered results.
- [L3](#l3) <code>issues:string[]</code>: create a new empty array to accumulate ordered results.
- [L4](#l4) <code>slashes</code>: use the literal <code>0</code>.
- [L4](#l4) <code>escaped</code>: use the literal <code>false</code>.
- [L5](#l5) <code>i</code>: use the literal <code>0</code>.
- [L6](#l6) <code>start</code>: evaluate <code>i</code>.
- [L6](#l6) <code>char</code>: read <code>source[i++]</code>; the TypeScript assertion adds no runtime validation.
- [L6](#l6) <code>translated</code>: use the literal <code>false</code>.
- [L9](#l9) <code>digits</code>: select a range without mutating the original array/string: <code>source.slice(i,i+4)</code>.
- [L16](#l16) <code>normalized:string[]</code>: create a new empty array to accumulate ordered results.
- [L16](#l16) <code>rawStarts:number[]</code>: create a new empty array to accumulate ordered results.
- [L16](#l16) <code>rawEnds:number[]</code>: create a new empty array to accumulate ordered results.
- [L17](#l17) <code>i</code>: use the literal <code>0</code>.
- [L18](#l18) <code>start</code>: read <code>starts[i]</code>; the TypeScript assertion adds no runtime validation.
- [L18](#l18) <code>char</code>: read <code>chars[i]</code>; the TypeScript assertion adds no runtime validation.

Execution:

- [L3](#l3) Bind <code>chars:string[]</code>: create a new empty array to accumulate ordered results.
- [L3](#l3) Bind <code>starts:number[]</code>: create a new empty array to accumulate ordered results.
- [L3](#l3) Bind <code>ends:number[]</code>: create a new empty array to accumulate ordered results.
- [L3](#l3) Bind <code>issues:string[]</code>: create a new empty array to accumulate ordered results.
- [L4](#l4) Bind <code>slashes</code>: use the literal <code>0</code>.
- [L4](#l4) Bind <code>escaped</code>: use the literal <code>false</code>.
- [L5](#l5) Initialize <code>let i=0</code>; repeat while <code>i&lt;source.length</code>; after each normal iteration evaluate <code></code>:
  - [L6](#l6) Bind <code>start</code>: evaluate <code>i</code>.
  - [L6](#l6) Bind <code>char</code>: read <code>source[i++]</code>; the TypeScript assertion adds no runtime validation.
  - [L6](#l6) Bind <code>translated</code>: use the literal <code>false</code>.
  - [L7](#l7) If <code>char==='\\' &amp;&amp; (escaped &#124;&#124; slashes%2===0) &amp;&amp; source[i]==='u'</code> is truthy:
    - [L8](#l8) Repeat while <code>source[i]==='u'</code>:
      - [L8](#l8) increment <code>i</code> by one.
    - [L9](#l9) Bind <code>digits</code>: select a range without mutating the original array/string: <code>source.slice(i,i+4)</code>.
    - [L10](#l10) If <code>!/^[0-9a-fA-F]{4}$/.test(digits)</code> is truthy:
      - [L10](#l10) Return to the caller: create an object with 4 property/spread entries: <code>{text:'',starts:[],ends:[],issues:['invalid-java-unicode-escape']}</code>; later properties overwrite earlier spread values.
    - [L11](#l11) update <code>char</code> with <code>String.fromCharCode(parseInt(digits,16))</code> using <code>=</code>; this mutation is visible to later statements.
    - [L11](#l11) update <code>i</code> with <code>4</code> using <code>+=</code>; this mutation is visible to later statements.
    - [L11](#l11) update <code>translated</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
  - [L13](#l13) append values to the existing array: <code>chars.push(char)</code>.
  - [L13](#l13) append values to the existing array: <code>starts.push(start)</code>.
  - [L13](#l13) append values to the existing array: <code>ends.push(i)</code>.
  - [L14](#l14) update <code>slashes</code> with <code>char==='\\'?slashes+1:0</code> using <code>=</code>; this mutation is visible to later statements.
  - [L14](#l14) update <code>escaped</code> with <code>translated</code> using <code>=</code>; this mutation is visible to later statements.
- [L16](#l16) Bind <code>normalized:string[]</code>: create a new empty array to accumulate ordered results.
- [L16](#l16) Bind <code>rawStarts:number[]</code>: create a new empty array to accumulate ordered results.
- [L16](#l16) Bind <code>rawEnds:number[]</code>: create a new empty array to accumulate ordered results.
- [L17](#l17) Initialize <code>let i=0</code>; repeat while <code>i&lt;chars.length</code>; after each normal iteration evaluate <code>i++</code>:
  - [L18](#l18) Bind <code>start</code>: read <code>starts[i]</code>; the TypeScript assertion adds no runtime validation.
  - [L18](#l18) Bind <code>char</code>: read <code>chars[i]</code>; the TypeScript assertion adds no runtime validation.
  - [L19](#l19) If <code>char==='\r' &amp;&amp; chars[i+1]==='\n'</code> is truthy:
    - [L19](#l19) increment <code>i</code> by one.
  - [L20](#l20) append values to the existing array: <code>normalized.push(char==='\r'?'\n':char)</code>.
  - [L20](#l20) append values to the existing array: <code>rawStarts.push(start)</code>.
  - [L20](#l20) append values to the existing array: <code>rawEnds.push(ends[i]!)</code>.
- [L22](#l22) Return to the caller: create an object with 4 property/spread entries: <code>{text:normalized.join(''),starts:rawStarts,ends:rawEnds,issues}</code>; later properties overwrite earlier spread values.

## Directly importing tests

- [java-source.test.ts](../../test/java-source.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | /** JLS 3.3/3.4 translation, with UTF-16 offsets back into the original file. */
   2 | export function preprocessJava(source:string) {
   3 |   const chars:string[]=[],starts:number[]=[],ends:number[]=[],issues:string[]=[];
   4 |   let slashes=0,escaped=false;
   5 |   for(let i=0;i<source.length;) {
   6 |     const start=i;let char=source[i++]!,translated=false;
   7 |     if(char==='\\' && (escaped || slashes%2===0) && source[i]==='u') {
   8 |       while(source[i]==='u')i++;
   9 |       const digits=source.slice(i,i+4);
  10 |       if(!/^[0-9a-fA-F]{4}$/.test(digits))return {text:'',starts:[],ends:[],issues:['invalid-java-unicode-escape']};
  11 |       char=String.fromCharCode(parseInt(digits,16));i+=4;translated=true;
  12 |     }
  13 |     chars.push(char);starts.push(start);ends.push(i);
  14 |     slashes=char==='\\'?slashes+1:0;escaped=translated;
  15 |   }
  16 |   const normalized:string[]=[],rawStarts:number[]=[],rawEnds:number[]=[];
  17 |   for(let i=0;i<chars.length;i++) {
  18 |     const start=starts[i]!,char=chars[i]!;
  19 |     if(char==='\r' && chars[i+1]==='\n')i++;
  20 |     normalized.push(char==='\r'?'\n':char);rawStarts.push(start);rawEnds.push(ends[i]!);
```

<a id="l22"></a>

```text
  21 |   }
  22 |   return {text:normalized.join(''),starts:rawStarts,ends:rawEnds,issues};
  23 | }
  24 | 
```
