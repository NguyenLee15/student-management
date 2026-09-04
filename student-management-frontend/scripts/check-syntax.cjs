const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

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

const standardGlobals = new Set([
  'window', 'document', 'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
  'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback', 'cancelIdleCallback',
  'fetch', 'localStorage', 'sessionStorage', 'navigator', 'location', 'history',
  'alert', 'confirm', 'prompt', 'URL', 'URLSearchParams', 'FormData', 'Blob', 'File', 'FileReader',
  'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent', 'Element', 'HTMLElement',
  'Promise', 'Math', 'Date', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'RegExp',
  'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'BigInt', 'Error', 'TypeError', 'RangeError',
  'Intl', 'encodeURIComponent', 'decodeURIComponent', 'encodeURI', 'decodeURI',
  'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'atob', 'btoa', 'crypto',
  'performance', 'IntersectionObserver', 'MutationObserver', 'ResizeObserver',
  'AbortController', 'Headers', 'Request', 'Response', 'process', 'React'
]);

const srcDir = path.resolve(__dirname, "../src");
const files = walk(srcDir);
let errCount = 0;

console.log(`[Syntax & Scope Check] Scanning ${files.length} JSX/JS files...`);

for (const f of files) {
  const code = fs.readFileSync(f, "utf8");
  try {
    esbuild.transformSync(code, { loader: f.endsWith(".jsx") ? "jsx" : "js" });
  } catch (err) {
    console.error(`❌ SYNTAX ERROR in ${path.relative(srcDir, f)}:\n`, err.message);
    errCount++;
    continue;
  }

  // Full Semantic Scope Verification (Rule 11)
  try {
    const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx"] });
    traverse(ast, {
      Identifier(p) {
        if (p.isReferencedIdentifier() && !p.scope.hasBinding(p.node.name) && !standardGlobals.has(p.node.name)) {
          if (p.parentPath.isMemberExpression() && p.parentPath.node.property === p.node && !p.parentPath.node.computed) {
            return;
          }
          console.error(`❌ UNDEFINED IDENTIFIER in ${path.relative(srcDir, f)}:${p.node.loc?.start.line || '?'}: '${p.node.name}' is referenced but not imported or declared.`);
          errCount++;
        }
      }
    });
  } catch (astErr) {
    console.error(`❌ AST PARSE ERROR in ${path.relative(srcDir, f)}:\n`, astErr.message);
    errCount++;
  }
}

if (errCount === 0) {
  console.log(`✅ ALL ${files.length} FILES PASSED SYNTAX & SCOPE VALIDATION! (0 errors)`);
  process.exit(0);
} else {
  console.error(`❌ Found ${errCount} syntax or scope errors.`);
  process.exit(1);
}