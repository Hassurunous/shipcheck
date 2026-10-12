import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {scoreEffectiveness} from '../dist/src/effectiveness.js';
if(process.argv.length!==3)throw Error('Usage: node scripts/score-effectiveness.mjs <evaluation.json>');
const corpus=await readFile(new URL('../fixtures/effectiveness/cases.json',import.meta.url),'utf8');
const evidence=JSON.parse(await readFile(process.argv[2],'utf8'));
if(evidence.corpusSha256!==createHash('sha256').update(corpus).digest('hex'))throw Error('Corpus hash mismatch; do not reuse labels across changed fixtures.');
if(!['offline','live'].includes(evidence.mode))throw Error('Invalid evaluation mode');
console.log(JSON.stringify(scoreEffectiveness(JSON.parse(corpus),evidence.runs,evidence.assessments,evidence.mode),null,2));
