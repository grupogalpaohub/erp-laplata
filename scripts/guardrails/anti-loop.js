/* eslint-disable no-console */
const { execSync } = require("child_process");
function fail(m){ console.error("\n❌ "+m+"\n"); process.exit(2); }
try{
  const diff = execSync("git diff --cached --unified=0",{stdio:["ignore","pipe","ignore"]}).toString();
  const sig = diff.split("\n").filter(l=>/^[+-]/.test(l)).filter(l=>!/^\s*(\/\/|\/\*|\*|--)/.test(l)).filter(l=>!/^\s*$/.test(l));
  if (!sig.length) fail("Commit bloqueado: alterações sem efeito (anti-loop).");
  console.log("✅ anti-loop OK.");
}catch{ console.log("ℹ️ anti-loop: skip."); }