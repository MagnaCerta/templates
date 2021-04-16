import { readdirSync, statSync } from "fs";
import * as path from "path";

// return recursive list of .proto files in the given directory
export default function getTemplates(baseDir: string): string[] {
  const subdirs = readdirSync(baseDir);
  return subdirs.reduce((accF: string[], subdir: string) => {
    const res = path.resolve(baseDir, subdir);

    if (statSync(res).isDirectory()) {
      if (path.basename(res) == ".git") return accF;
      return [...accF, ...getTemplates(res)];
    } else {
      return [...accF, res];
    }
  }, []);
}
