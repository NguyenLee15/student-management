const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith(".jsx") || file.endsWith(".js")) {
      results.push(file);
    }
  });
  return results;
}

const srcDir = path.resolve(__dirname, "../src");
const files = walk(srcDir);
let errCount = 0;

console.log(`[Syntax Check] Scanning ${files.length} JSX/JS files...`);

for (const f of files) {
  const code = fs.readFileSync(f, "utf8");
  try {
    esbuild.transformSync(code, { loader: f.endsWith(".jsx") ? "jsx" : "js" });
  } catch (err) {
    console.error(`❌ SYNTAX ERROR in ${path.relative(srcDir, f)}:\n`, err.message);
    errCount++;
  }
}

if (errCount === 0) {
  console.log(`✅ ALL ${files.length} FILES PASSED SYNTAX & AST VALIDATION! (0 errors)`);
  process.exit(0);
} else {
  console.error(`❌ Found ${errCount} files with errors.`);
  process.exit(1);
}