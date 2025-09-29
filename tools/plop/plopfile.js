// tools/plop/plopfile.js
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (plop) {
  await plop.load(path.join(__dirname, "generators", "entry.js"));
}
