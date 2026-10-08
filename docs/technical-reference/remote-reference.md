# src/remote-reference.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Public-address blocklists supplement URL validation. readRemoteReference rejects literal IP hosts, races DNS against a shared ten-second deadline, rejects the entire DNS answer if any address is nonpublic, and pins the HTTPS connection to the first accepted answer. It accepts only HTTP 200 with identity encoding, never follows redirects, and bounds streamed bytes. The caller separately enforces origin permission and the expected hash.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `3d9e7ad2eed2a93d724e3f7497393b47234422248567872ce9169d83ff00f93a`.

This chapter inventories **13 function bodies/callbacks**, **15 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:dns/promises</code>: <code>lookup</code>.
- <code>node:https</code>: <code>get</code>.
- <code>node:net</code>: <code>BlockList</code>, <code>isIP</code>.
- <code>node:net</code>: <code>LookupFunction</code> (type only).
- <code>./reference-access.js</code>: <code>referenceUrlSchema</code>.

## Module execution

- [L7](#l7) Bind <code>deniedV4</code>: construct <code>BlockList</code> using <code></code>; this creates the local instance used below.
- [L7](#l7) Bind <code>deniedV6</code>: construct <code>BlockList</code> using <code></code>; this creates the local instance used below.
- [L8](#l8) Bind <code>globalV6</code>: construct <code>BlockList</code> using <code></code>; this creates the local instance used below.
- [L8](#l8) call the named operation with the supplied arguments: <code>globalV6.addSubnet('2000::',3,'ipv6')</code>.
- [L9](#l9) Iterate <code>[['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]] as const</code> values, binding <code>const [network,bits]</code> for each iteration:
  - [L9](#l9) call the named operation with the supplied arguments: <code>deniedV4.addSubnet(network,bits,'ipv4')</code>.
- [L10](#l10) Iterate <code>[['::',128],['::1',128],['::ffff:0:0',96],['64:ff9b::',96],['100::',64],['2001:db8::',32],['fc00::',7],['fe80::',10],['ff00::',8]] as const</code> values, binding <code>const [network,bits]</code> for each iteration:
  - [L10](#l10) call the named operation with the supplied arguments: <code>deniedV6.addSubnet(network,bits,'ipv6')</code>.
- [L11](#l11) call the named operation with the supplied arguments: <code>deniedV4.addSubnet('192.88.99.0',24,'ipv4')</code>.
- [L12](#l12) Iterate <code>[['2001::',23],['2002::',16],['3fff::',20]] as const</code> values, binding <code>const [network,bits]</code> for each iteration:
  - [L12](#l12) call the named operation with the supplied arguments: <code>deniedV6.addSubnet(network,bits,'ipv6')</code>.

## Function index

- [publicReferenceAddress (13:8)](#fn-1064)
- [readRemoteReference (17:8)](#fn-1395)
- [Promise callback (22:90)](#fn-1829)
- [deadline.addEventListener callback (23:39)](#fn-1882)
- [addresses.some callback (25:42)](#fn-1983)
- [pinnedLookup (27:37)](#fn-2134)
- [Promise callback (30:22)](#fn-2284)
- [get callback (31:169)](#fn-2473)
- [response.on callback (36:26)](#fn-2775)
- [response.on callback (37:25)](#fn-2936)
- [response.on callback (38:27)](#fn-3000)
- [response.on callback (39:29)](#fn-3071)
- [request.on callback (41:24)](#fn-3146)

<a id="fn-1064"></a>
### publicReferenceAddress (13:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>address:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L14](#l14) <code>family</code>: call the named operation with the supplied arguments: <code>isIP(address)</code>.

Execution:

- [L14](#l14) Bind <code>family</code>: call the named operation with the supplied arguments: <code>isIP(address)</code>.
- [L14](#l14) Return to the caller: evaluate <code>family!==0 &amp;&amp; (family!==6 &#124;&#124; globalV6.check(address,'ipv6')) &amp;&amp; !(family===4?deniedV4:deniedV6).check(address,family===4?'ipv4':'ipv6')</code> left to right with falsy short-circuiting.

<a id="fn-1395"></a>
### readRemoteReference (17:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>input:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>limit:number</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L18](#l18) <code>url</code>: construct <code>URL</code> using <code>referenceUrlSchema.parse(input)</code>; this creates the local instance used below.
- [L21](#l21) <code>deadline</code>: call the named operation with the supplied arguments: <code>AbortSignal.timeout(10000)</code>.
- [L22](#l22) <code>addresses</code>: wait for <code>Promise.race([lookup(url.hostname,{all:true}),new Promise&lt;never&gt;((_,reject)=&gt;{ deadline.addEventListener('abort',()=&gt;reject(Error('remote-timeout')),{once:true}); })])</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L26](#l26) <code>chosen</code>: read <code>addresses[0]</code>; the TypeScript assertion adds no runtime validation.
- [L27](#l27) <code>pinnedLookup:LookupFunction</code>: create [pinnedLookup (27:37)](#fn-2134); its body runs when called, not when this value is created.

Execution:

- [L18](#l18) Bind <code>url</code>: construct <code>URL</code> using <code>referenceUrlSchema.parse(input)</code>; this creates the local instance used below.
- [L19](#l19) If <code>isIP(url.hostname.replace(/^\[&#124;\]$/g,''))</code> is truthy:
  - [L19](#l19) Throw <code>Error('remote-address-denied')</code>; normal execution stops until an enclosing catch handles it.
- [L21](#l21) Bind <code>deadline</code>: call the named operation with the supplied arguments: <code>AbortSignal.timeout(10000)</code>.
- [L22](#l22) Bind <code>addresses</code>: wait for <code>Promise.race([lookup(url.hostname,{all:true}),new Promise&lt;never&gt;((_,reject)=&gt;{ deadline.addEventListener('abort',()=&gt;reject(Error('remote-timeout')),{once:true}); })])</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L25](#l25) If <code>!addresses.length &#124;&#124; addresses.some(item=&gt;!publicReferenceAddress(item.address))</code> is truthy:
  - [L25](#l25) Throw <code>Error('remote-address-denied')</code>; normal execution stops until an enclosing catch handles it.
- [L26](#l26) Bind <code>chosen</code>: read <code>addresses[0]</code>; the TypeScript assertion adds no runtime validation.
- [L27](#l27) Bind <code>pinnedLookup:LookupFunction</code>: create [pinnedLookup (27:37)](#fn-2134); its body runs when called, not when this value is created.
- [L30](#l30) Return to the caller: construct <code>Promise</code> using <code>(resolve,reject)=&gt;{ const request=get(url,{lookup:pinnedLookup,agent:false,signal:deadline,headers:{Accept:'application/json, text/plain, text/markdown','Accept-Encoding':'identity'}},response=&gt;{ if(response.statusCode!==200 &#124;&#124; response.headers['content-enc…</code>; this creates the local instance used below.

<a id="fn-1829"></a>
### Promise callback (22:90)

Synchronous function. Lexically inside [readRemoteReference (17:8)](#fn-1395). 

Parameters:

- <code>_</code>: supplied by the caller; usage is shown in the steps below.
- <code>reject</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L23](#l23) call the named operation with the supplied arguments: <code>deadline.addEventListener('abort',()=&gt;reject(Error('remote-timeout')),{once:true})</code>.

<a id="fn-1882"></a>
### deadline.addEventListener callback (23:39)

Synchronous function. Lexically inside [Promise callback (22:90)](#fn-1829). Passed to <code>deadline.addEventListener</code>; the receiving API determines when/how often it runs.

Execution:

[L23](#l23) Implicitly return: call the named operation with the supplied arguments: <code>reject(Error('remote-timeout'))</code>.

<a id="fn-1983"></a>
### addresses.some callback (25:42)

Synchronous function. Lexically inside [readRemoteReference (17:8)](#fn-1395). Passed to <code>addresses.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L25](#l25) Implicitly return: apply <code>!</code> to <code>publicReferenceAddress(item.address)</code>.

<a id="fn-2134"></a>
### pinnedLookup (27:37)

Synchronous function. Lexically inside [readRemoteReference (17:8)](#fn-1395). 

Parameters:

- <code>_host</code>: supplied by the caller; usage is shown in the steps below.
- <code>options</code>: supplied by the caller; usage is shown in the steps below.
- <code>callback</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L28](#l28) If <code>options.all</code> is truthy:
  - [L28](#l28) call the named operation with the supplied arguments: <code>callback(null,[chosen])</code>.
- [L28](#l28) Otherwise:
  - [L28](#l28) call the named operation with the supplied arguments: <code>callback(null,chosen.address,chosen.family)</code>.

<a id="fn-2284"></a>
### Promise callback (30:22)

Synchronous function. Lexically inside [readRemoteReference (17:8)](#fn-1395). 

Parameters:

- <code>resolve</code>: supplied by the caller; usage is shown in the steps below.
- <code>reject</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L31](#l31) <code>request</code>: call the named operation with the supplied arguments: <code>get(url,{lookup:pinnedLookup,agent:false,signal:deadline,headers:{Accept:'application/json, text/plain, text/markdown','Accept-Encoding':'identity'}},response=&gt;{ if(response.statusCode!==200 &#124;&#124; response.headers['content-encoding'] &amp;&amp; response.headers['conte…</code>.

Execution:

- [L31](#l31) Bind <code>request</code>: call the named operation with the supplied arguments: <code>get(url,{lookup:pinnedLookup,agent:false,signal:deadline,headers:{Accept:'application/json, text/plain, text/markdown','Accept-Encoding':'identity'}},response=&gt;{ if(response.statusCode!==200 &#124;&#124; response.headers['content-encoding'] &amp;&amp; response.headers['conte…</code>.
- [L41](#l41) call the named operation with the supplied arguments: <code>request.on('error',()=&gt;reject(Error('remote-read-failed')))</code>.

<a id="fn-2473"></a>
### get callback (31:169)

Synchronous function. Lexically inside [Promise callback (30:22)](#fn-2284). Passed to <code>get</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>response</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L35](#l35) <code>chunks:Buffer[]</code>: create a new empty array to accumulate ordered results.
- [L35](#l35) <code>bytes</code>: use the literal <code>0</code>.

Execution:

- [L32](#l32) If <code>response.statusCode!==200 &#124;&#124; response.headers['content-encoding'] &amp;&amp; response.headers['content-encoding']!=='identity'</code> is truthy:
  - [L33](#l33) call the named operation with the supplied arguments: <code>response.destroy()</code>.
  - [L33](#l33) call the named operation with the supplied arguments: <code>reject(Error('remote-response-rejected'))</code>.
  - [L33](#l33) Return undefined immediately; remaining statements in this function do not execute.
- [L35](#l35) Bind <code>chunks:Buffer[]</code>: create a new empty array to accumulate ordered results.
- [L35](#l35) Bind <code>bytes</code>: use the literal <code>0</code>.
- [L36](#l36) call the named operation with the supplied arguments: <code>response.on('data',(chunk:Buffer)=&gt;{bytes+=chunk.length;if(bytes&gt;limit){response.destroy();reject(Error('remote-size-limit'));}else chunks.push(chunk);})</code>.
- [L37](#l37) call the named operation with the supplied arguments: <code>response.on('end',()=&gt;resolve(Buffer.concat(chunks)))</code>.
- [L38](#l38) call the named operation with the supplied arguments: <code>response.on('error',()=&gt;reject(Error('remote-read-failed')))</code>.
- [L39](#l39) call the named operation with the supplied arguments: <code>response.on('aborted',()=&gt;reject(Error('remote-read-failed')))</code>.

<a id="fn-2775"></a>
### response.on callback (36:26)

Synchronous function. Lexically inside [get callback (31:169)](#fn-2473). Passed to <code>response.on</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>chunk:Buffer</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L36](#l36) update <code>bytes</code> with <code>chunk.length</code> using <code>+=</code>; this mutation is visible to later statements.
- [L36](#l36) If <code>bytes&gt;limit</code> is truthy:
  - [L36](#l36) call the named operation with the supplied arguments: <code>response.destroy()</code>.
  - [L36](#l36) call the named operation with the supplied arguments: <code>reject(Error('remote-size-limit'))</code>.
- [L36](#l36) Otherwise:
  - [L36](#l36) append values to the existing array: <code>chunks.push(chunk)</code>.

<a id="fn-2936"></a>
### response.on callback (37:25)

Synchronous function. Lexically inside [get callback (31:169)](#fn-2473). Passed to <code>response.on</code>; the receiving API determines when/how often it runs.

Execution:

[L37](#l37) Implicitly return: call the named operation with the supplied arguments: <code>resolve(Buffer.concat(chunks))</code>.

<a id="fn-3000"></a>
### response.on callback (38:27)

Synchronous function. Lexically inside [get callback (31:169)](#fn-2473). Passed to <code>response.on</code>; the receiving API determines when/how often it runs.

Execution:

[L38](#l38) Implicitly return: call the named operation with the supplied arguments: <code>reject(Error('remote-read-failed'))</code>.

<a id="fn-3071"></a>
### response.on callback (39:29)

Synchronous function. Lexically inside [get callback (31:169)](#fn-2473). Passed to <code>response.on</code>; the receiving API determines when/how often it runs.

Execution:

[L39](#l39) Implicitly return: call the named operation with the supplied arguments: <code>reject(Error('remote-read-failed'))</code>.

<a id="fn-3146"></a>
### request.on callback (41:24)

Synchronous function. Lexically inside [Promise callback (30:22)](#fn-2284). Passed to <code>request.on</code>; the receiving API determines when/how often it runs.

Execution:

[L41](#l41) Implicitly return: call the named operation with the supplied arguments: <code>reject(Error('remote-read-failed'))</code>.

## Module bindings

- [L7](#l7) <code>deniedV4</code>: construct <code>BlockList</code> using <code></code>; this creates the local instance used below.
- [L7](#l7) <code>deniedV6</code>: construct <code>BlockList</code> using <code></code>; this creates the local instance used below.
- [L8](#l8) <code>globalV6</code>: construct <code>BlockList</code> using <code></code>; this creates the local instance used below.
- [L9](#l9) <code>[network,bits]</code>: receive the next iterable value from <code>[['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]] as const</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L10](#l10) <code>[network,bits]</code>: receive the next iterable value from <code>[['::',128],['::1',128],['::ffff:0:0',96],['64:ff9b::',96],['100::',64],['2001:db8::',32],['fc00::',7],['fe80::',10],['ff00::',8]] as const</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L12](#l12) <code>[network,bits]</code>: receive the next iterable value from <code>[['2001::',23],['2002::',16],['3fff::',20]] as const</code> at the start of each loop iteration; destructure that value into the displayed names.

## Directly importing tests

- [remote-reference.test.ts](../../test/remote-reference.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>

```text
   1 | import {lookup} from 'node:dns/promises';
   2 | import {get} from 'node:https';
   3 | import {BlockList,isIP} from 'node:net';
   4 | import type {LookupFunction} from 'node:net';
   5 | import {referenceUrlSchema} from './reference-access.js';
   6 | 
   7 | const deniedV4=new BlockList(),deniedV6=new BlockList();
   8 | const globalV6=new BlockList();globalV6.addSubnet('2000::',3,'ipv6');
   9 | for(const [network,bits] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]] as const)deniedV4.addSubnet(network,bits,'ipv4');
  10 | for(const [network,bits] of [['::',128],['::1',128],['::ffff:0:0',96],['64:ff9b::',96],['100::',64],['2001:db8::',32],['fc00::',7],['fe80::',10],['ff00::',8]] as const)deniedV6.addSubnet(network,bits,'ipv6');
  11 | deniedV4.addSubnet('192.88.99.0',24,'ipv4');
  12 | for(const [network,bits] of [['2001::',23],['2002::',16],['3fff::',20]] as const)deniedV6.addSubnet(network,bits,'ipv6');
  13 | export function publicReferenceAddress(address:string) {
  14 |   const family=isIP(address);return family!==0 && (family!==6 || globalV6.check(address,'ipv6')) && !(family===4?deniedV4:deniedV6).check(address,family===4?'ipv4':'ipv6');
  15 | }
  16 | /** Bounded HTTPS GET, pinned to a public DNS result; no redirects, cookies, auth or proxy. */
  17 | export async function readRemoteReference(input:string,limit:number):Promise<Buffer> {
  18 |   const url=new URL(referenceUrlSchema.parse(input));
  19 |   if(isIP(url.hostname.replace(/^\[|\]$/g,'')))throw Error('remote-address-denied');
  20 |   // Bound DNS and the entire response together, not just socket idle time.
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>

```text
  21 |   const deadline=AbortSignal.timeout(10000);
  22 |   const addresses=await Promise.race([lookup(url.hostname,{all:true}),new Promise<never>((_,reject)=>{
  23 |     deadline.addEventListener('abort',()=>reject(Error('remote-timeout')),{once:true});
  24 |   })]);
  25 |   if(!addresses.length || addresses.some(item=>!publicReferenceAddress(item.address)))throw Error('remote-address-denied');
  26 |   const chosen=addresses[0]!;
  27 |   const pinnedLookup:LookupFunction=(_host,options,callback)=>{
  28 |     if(options.all)callback(null,[chosen]);else callback(null,chosen.address,chosen.family);
  29 |   };
  30 |   return new Promise((resolve,reject)=>{
  31 |     const request=get(url,{lookup:pinnedLookup,agent:false,signal:deadline,headers:{Accept:'application/json, text/plain, text/markdown','Accept-Encoding':'identity'}},response=>{
  32 |       if(response.statusCode!==200 || response.headers['content-encoding'] && response.headers['content-encoding']!=='identity') {
  33 |         response.destroy();reject(Error('remote-response-rejected'));return;
  34 |       }
  35 |       const chunks:Buffer[]=[];let bytes=0;
  36 |       response.on('data',(chunk:Buffer)=>{bytes+=chunk.length;if(bytes>limit){response.destroy();reject(Error('remote-size-limit'));}else chunks.push(chunk);});
  37 |       response.on('end',()=>resolve(Buffer.concat(chunks)));
  38 |       response.on('error',()=>reject(Error('remote-read-failed')));
  39 |       response.on('aborted',()=>reject(Error('remote-read-failed')));
  40 |     });
```

<a id="l41"></a>

```text
  41 |     request.on('error',()=>reject(Error('remote-read-failed')));
  42 |   });
  43 | }
  44 | 
```
