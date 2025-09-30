// tools/plop/plopfile.mjs
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (plop) {
  await plop.load(path.join(__dirname, "generators", "entry-advanced.mjs"));
  await plop.load(path.join(__dirname, "generators", "cdk.mjs"));
}
