import {extname} from 'node:path';
import {extractJavascriptHttpCalls} from './axios-calls.js';
import {extractPythonCalls} from './python-calls.js';
import type {ContractAdapter} from './contract-adapter-types.js';
import {extractGoCalls} from './go-http-calls.js';
import {extractCsharpCalls} from './csharp-http-calls.js';
import {extractJavaCalls} from './java-http-calls.js';

/** Bundled offline adapters; no repository-supplied code or plugins are loaded. */
export const contractAdapters:readonly ContractAdapter[]=[
  {id:'javascript-http',language:'javascript',extensions:['.js','.mjs','.cjs'],extract:extractJavascriptHttpCalls},
  {id:'typescript-http',language:'typescript',extensions:['.ts','.mts','.cts','.tsx'],extract:extractJavascriptHttpCalls},
  {id:'python-http',language:'python',extensions:['.py'],extract:extractPythonCalls},
  {id:'go-net-http',language:'go',extensions:['.go'],extract:extractGoCalls},
  {id:'csharp-httpclient',language:'csharp',extensions:['.cs'],extract:extractCsharpCalls},
  {id:'java-http-request',language:'java',extensions:['.java'],extract:extractJavaCalls},
];
export const contractAdapterFor=(path:string)=>contractAdapters.find(adapter=>adapter.extensions.includes(extname(path)));
