/** Syntax observations only: adapters never execute clients or resolve runtime values. */
export type CallObservation={line:number;excerpt:string;url?:string;method?:string;reason?:string;queryNames?:string[];observationKind?:'request-call'|'request-construction'};
export type CallExtraction={calls:CallObservation[];issues:string[]};
export type ContractAdapter={id:string;language:string;extensions:readonly string[];extract:(content:string,path:string)=>CallExtraction};
