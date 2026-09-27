import fs from 'node:fs/promises';
import { resolve } from 'node:path';

export const MAX_FILE_BYTES = 1024 * 1024;

export async function validateRoot(target: string): Promise<string> {
  const root = resolve(target);
  const stat = await fs.lstat(root);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error(`Repository target must be a directory, not a file or symlink: ${root}`);
  }
  // Ancestor aliases are allowed, but all subsequent inspection uses one
  // canonical root. The explicitly selected final directory cannot be a link.
  return fs.realpath(root);
}

/** For stable local trees; not a defense against concurrent path replacement. */
export async function readBoundedConfig(path: string): Promise<string | undefined> {
  let stat;
  try { stat = await fs.lstat(path); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('Configuration must be a regular file, not a symlink or directory.');
  if (stat.size > MAX_FILE_BYTES) throw new Error(`Configuration exceeds the ${MAX_FILE_BYTES}-byte read limit.`);
  const handle = await fs.open(path, 'r');
  try {
    if (!(await handle.stat()).isFile()) throw new Error('Configuration is no longer a regular file.');
    const bytes = Buffer.alloc(MAX_FILE_BYTES + 1);
    let length = 0;
    while (length < bytes.length) {
      const result = await handle.read(bytes, length, bytes.length - length, null);
      if (result.bytesRead === 0) break;
      length += result.bytesRead;
    }
    if (length > MAX_FILE_BYTES) throw new Error(`Configuration exceeds the ${MAX_FILE_BYTES}-byte read limit.`);
    const content = bytes.subarray(0, length);
    if (content.includes(0)) throw new Error('Configuration must be UTF-8 text.');
    return new TextDecoder('utf-8', {fatal: true}).decode(content);
  } finally { await handle.close(); }
}
