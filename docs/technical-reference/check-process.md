# src/check-process.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

terminateCheckTree uses taskkill.exe /T /F on Windows and a negative process-group PID with SIGKILL on POSIX. Failure falls back to killing the direct child and returns false so the report does not claim confirmed descendant cleanup. The SystemRoot-derived executable path avoids looking up an arbitrary taskkill command on PATH.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `92d9e157a0590179208b8ed8ac5b811779361a72ab377b57b29ebed15b801a79`.

This chapter inventories **1 function bodies/callbacks**, **1 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:child_process</code>: <code>execFile</code>, <code>ChildProcess</code> (type only).
- <code>node:path</code>: <code>join</code>.
- <code>node:util</code>: <code>promisify</code>.

## Module execution

- [L4](#l4) Bind <code>exec</code>: call the named operation with the supplied arguments: <code>promisify(execFile)</code>.

## Function index

- [terminateCheckTree (7:8)](#fn-266)

<a id="fn-266"></a>
### terminateCheckTree (7:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>child:ChildProcess</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L8](#l8) If <code>!child.pid</code> is truthy:
  - [L8](#l8) Return to the caller: use the literal <code>false</code>.
- [L9](#l9) Run the protected block:
  - [L10](#l10) If <code>process.platform==='win32'</code> is truthy:
    - [L11](#l11) If <code>!process.env.SystemRoot</code> is truthy:
      - [L11](#l11) Throw <code>new Error('System root unavailable.')</code>; normal execution stops until an enclosing catch handles it.
    - [L12](#l12) wait for <code>exec(join(process.env.SystemRoot,'System32','taskkill.exe'),['/PID',String(child.pid),'/T','/F'], {windowsHide:true,timeout:5000,maxBuffer:65536})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L10](#l10) Otherwise:
    - [L14](#l14) call the named operation with the supplied arguments: <code>process.kill(-child.pid,'SIGKILL')</code>.
  - [L15](#l15) Return to the caller: use the literal <code>true</code>.
- [L9](#l9) If it throws:
  - [L16](#l16) call the named operation with the supplied arguments: <code>child.kill('SIGKILL')</code>.
  - [L16](#l16) Return to the caller: use the literal <code>false</code>.

## Module bindings

- [L4](#l4) <code>exec</code>: call the named operation with the supplied arguments: <code>promisify(execFile)</code>.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>

```text
   1 | import {execFile,type ChildProcess} from 'node:child_process';
   2 | import {join} from 'node:path';
   3 | import {promisify} from 'node:util';
   4 | const exec=promisify(execFile);
   5 | 
   6 | /** Best-effort descendant cleanup, not a sandbox against deliberately detached processes. */
   7 | export async function terminateCheckTree(child:ChildProcess):Promise<boolean> {
   8 |   if(!child.pid)return false;
   9 |   try {
  10 |     if(process.platform==='win32') {
  11 |       if(!process.env.SystemRoot)throw new Error('System root unavailable.');
  12 |       await exec(join(process.env.SystemRoot,'System32','taskkill.exe'),['/PID',String(child.pid),'/T','/F'],
  13 |         {windowsHide:true,timeout:5000,maxBuffer:65536});
  14 |     } else process.kill(-child.pid,'SIGKILL');
  15 |     return true;
  16 |   } catch {child.kill('SIGKILL');return false;}
  17 | }
  18 | 
```
