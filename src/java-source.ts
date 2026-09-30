/** JLS 3.3/3.4 translation, with UTF-16 offsets back into the original file. */
export function preprocessJava(source:string) {
  const chars:string[]=[],starts:number[]=[],ends:number[]=[],issues:string[]=[];
  let slashes=0,escaped=false;
  for(let i=0;i<source.length;) {
    const start=i;let char=source[i++]!,translated=false;
    if(char==='\\' && (escaped || slashes%2===0) && source[i]==='u') {
      while(source[i]==='u')i++;
      const digits=source.slice(i,i+4);
      if(!/^[0-9a-fA-F]{4}$/.test(digits))return {text:'',starts:[],ends:[],issues:['invalid-java-unicode-escape']};
      char=String.fromCharCode(parseInt(digits,16));i+=4;translated=true;
    }
    chars.push(char);starts.push(start);ends.push(i);
    slashes=char==='\\'?slashes+1:0;escaped=translated;
  }
  const normalized:string[]=[],rawStarts:number[]=[],rawEnds:number[]=[];
  for(let i=0;i<chars.length;i++) {
    const start=starts[i]!,char=chars[i]!;
    if(char==='\r' && chars[i+1]==='\n')i++;
    normalized.push(char==='\r'?'\n':char);rawStarts.push(start);rawEnds.push(ends[i]!);
  }
  return {text:normalized.join(''),starts:rawStarts,ends:rawEnds,issues};
}
