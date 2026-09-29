import {z} from 'zod';
import {valid,validRange,satisfies} from 'semver';
export const versionRangeSchema=z.string().trim().min(1).max(256).refine(value=>validRange(value)!==null,'Expected an npm semantic version range.');
export function versionIssue(actual:string|undefined,expected?:string,range?:string,declared?:string):string|undefined {
  if(declared!==undefined && declared!==actual)return 'Configured reference version conflicts with provider metadata.';
  if(expected!==undefined && expected!==actual)return 'Provider version does not match the exact version pin.';
  if(range && (!actual || !valid(actual)))return 'Provider version is not a semantic version; range compatibility is unresolved.';
  if(range && !satisfies(actual!,range))return 'Provider version does not satisfy the configured semantic version range.';
}
