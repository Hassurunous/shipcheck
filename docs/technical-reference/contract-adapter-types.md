# src/contract-adapter-types.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The language-neutral interfaces are compile-time contracts. CallObservation contains location/excerpt plus optional URL/method/query names or a reason inference failed. CallExtraction keeps general parser/coverage issues separate from calls. A ContractAdapter binds an ID, language and extensions to an offline extraction function.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `c92479d886cd3c00d139d6fe602e9ebccfa2d299f016fa7e1cc32a35fc62b11f`.

This chapter inventories **0 function bodies/callbacks**, **0 variable declarations**, and **3 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators


## Module execution


## Function index


## Compile-time data contracts

### CallObservation

```typescript
type CallObservation={line:number;excerpt:string;url?:string;method?:string;reason?:string;queryNames?:string[];observationKind?:'request-call'|'request-construction'};
```

Declared at [L2](#l2). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### CallExtraction

```typescript
type CallExtraction={calls:CallObservation[];issues:string[]};
```

Declared at [L3](#l3). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### ContractAdapter

```typescript
type ContractAdapter={id:string;language:string;extensions:readonly string[];extract:(content:string,path:string)=>CallExtraction};
```

Declared at [L4](#l4). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>

```text
   1 | /** Syntax observations only: adapters never execute clients or resolve runtime values. */
   2 | export type CallObservation={line:number;excerpt:string;url?:string;method?:string;reason?:string;queryNames?:string[];observationKind?:'request-call'|'request-construction'};
   3 | export type CallExtraction={calls:CallObservation[];issues:string[]};
   4 | export type ContractAdapter={id:string;language:string;extensions:readonly string[];extract:(content:string,path:string)=>CallExtraction};
   5 | 
```
