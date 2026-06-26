const meta = require("/home/dev/AI_Workflow/logs/pipelines/PAOS/PIPE-26-06-2026---12-42/META.json");
const layout = require("/home/dev/AI_Workflow/logs/pipelines/PAOS/PIPE-26-06-2026---12-42/builder-layout.json");

const results = [];

// Check 1: builder field
results.push({
  check: "builder field is true",
  pass: meta.builder === true,
  detail: meta.builder === true ? "builder: true" : `builder: ${meta.builder}`
});

// Check 2: builderLayout exists
results.push({
  check: "builderLayout exists in META.json",
  pass: !!meta.builderLayout,
  detail: meta.builderLayout ? "present" : "missing"
});

// Check 3: nodes array
results.push({
  check: "builderLayout.nodes is an array with >= 1 node",
  pass: Array.isArray(meta.builderLayout.nodes) && meta.builderLayout.nodes.length >= 1,
  detail: `${meta.builderLayout.nodes?.length || 0} nodes`
});

// Check 4: Each node has required fields
const requiredFields = ["id", "type", "position", "data"];
const nodeErrors = [];
meta.builderLayout.nodes.forEach((n, i) => {
  requiredFields.forEach(f => {
    if (!(f in n)) nodeErrors.push(`Node ${i} (id="${n.id}") missing field: ${f}`);
  });
});
results.push({
  check: "Each node has required fields (id, type, position, data)",
  pass: nodeErrors.length === 0,
  detail: nodeErrors.length > 0 ? nodeErrors.join("; ") : `all ${meta.builderLayout.nodes.length} nodes valid`
});

// Check 5: position has x and y
const posErrors = [];
meta.builderLayout.nodes.forEach((n, i) => {
  if (!n.position || typeof n.position.x !== "number" || typeof n.position.y !== "number") {
    posErrors.push(`Node ${i} (id="${n.id}") has invalid position`);
  }
});
results.push({
  check: "Each node.position has valid x, y coordinates",
  pass: posErrors.length === 0,
  detail: posErrors.length > 0 ? posErrors.join("; ") : "all positions valid"
});

// Check 6: data has label
const labelErrors = [];
meta.builderLayout.nodes.forEach((n, i) => {
  if (!n.data || !n.data.label) {
    labelErrors.push(`Node ${i} (id="${n.id}") missing data.label`);
  }
});
results.push({
  check: "Each node.data has label",
  pass: labelErrors.length === 0,
  detail: labelErrors.length > 0 ? labelErrors.join("; ") : "all nodes have labels"
});

// Check 7: edges array
results.push({
  check: "builderLayout.edges is an array",
  pass: Array.isArray(meta.builderLayout.edges),
  detail: `${meta.builderLayout.edges?.length || 0} edges`
});

// Check 8: Each edge connects valid node IDs
const nodeIds = new Set(meta.builderLayout.nodes.map(n => n.id));
const edgeErrors = [];
meta.builderLayout.edges.forEach((e, i) => {
  if (!e.source || !e.target) {
    edgeErrors.push(`Edge ${i} (id="${e.id}") missing source or target`);
  } else {
    if (!nodeIds.has(e.source)) edgeErrors.push(`Edge ${i}: source "${e.source}" not found in nodes`);
    if (!nodeIds.has(e.target)) edgeErrors.push(`Edge ${i}: target "${e.target}" not found in nodes`);
  }
});
results.push({
  check: "Each edge connects valid node IDs",
  pass: edgeErrors.length === 0,
  detail: edgeErrors.length > 0 ? edgeErrors.join("; ") : `all ${meta.builderLayout.edges.length} edges valid`
});

// Check 9: No duplicate node IDs
const seenIds = new Set();
const dupErrors = [];
meta.builderLayout.nodes.forEach(n => {
  if (seenIds.has(n.id)) dupErrors.push(`Duplicate node ID: ${n.id}`);
  seenIds.add(n.id);
});
results.push({
  check: "No duplicate node IDs",
  pass: dupErrors.length === 0,
  detail: dupErrors.length > 0 ? dupErrors.join("; ") : `all ${meta.builderLayout.nodes.length} IDs unique`
});

// Check 10: Topological sort (cycle detection)
const adj = {};
meta.builderLayout.nodes.forEach(n => { adj[n.id] = []; });
meta.builderLayout.edges.forEach(e => {
  if (adj[e.source]) adj[e.source].push(e.target);
});
const visited = new Set();
const recStack = new Set();
let hasCycle = false;
function dfs(id) {
  visited.add(id);
  recStack.add(id);
  for (const next of (adj[id] || [])) {
    if (!visited.has(next)) { if (dfs(next)) return true; }
    else if (recStack.has(next)) return true;
  }
  recStack.delete(id);
  return false;
}
for (const id of meta.builderLayout.nodes.map(n => n.id)) {
  if (!visited.has(id) && dfs(id)) { hasCycle = true; break; }
}
results.push({
  check: "Topological sort — no cycles in edge graph",
  pass: !hasCycle,
  detail: hasCycle ? "CYCLE DETECTED in edge graph" : "acyclic (valid DAG)"
});

// Check 11: Layout consistency between META.json and builder-layout.json
const metaStr = JSON.stringify(meta.builderLayout);
const layoutStr = JSON.stringify(layout);
results.push({
  check: "builder-layout.json matches builderLayout in META.json",
  pass: metaStr === layoutStr,
  detail: metaStr === layoutStr ? "identical" : "MISMATCH between files"
});

// Check 12: node type is valid
const validTypes = ["agentNode", "default", "input", "output", "group"];
const typeErrors = [];
meta.builderLayout.nodes.forEach((n, i) => {
  if (!validTypes.includes(n.type)) {
    typeErrors.push(`Node ${i} (id="${n.id}") has unrecognized type: ${n.type}`);
  }
});
results.push({
  check: "Each node has a valid type",
  pass: typeErrors.length === 0,
  detail: typeErrors.length > 0 ? typeErrors.join("; ") : "all types recognized"
});

// Print report
const passCount = results.filter(r => r.pass).length;
const totalCount = results.length;
console.log("=".repeat(60));
console.log("BUILDER LAYOUT DATA INTEGRITY VALIDATION REPORT");
console.log("=".repeat(60));
console.log(`Pipeline: PIPE-26-06-2026---12-42`);
console.log(`Result: ${passCount}/${totalCount} checks passed`);
console.log();
results.forEach((r, i) => {
  const icon = r.pass ? "PASS" : "FAIL";
  console.log(`[${icon}] Check ${i+1}: ${r.check}`);
  console.log(`     ${r.detail}`);
});
console.log();
console.log("=".repeat(60));
console.log(passCount === totalCount ? "ALL CHECKS PASSED" : `${totalCount - passCount} CHECK(S) FAILED`);
console.log("=".repeat(60));

// Save report
const fs = require("fs");
const outputPath = "/home/dev/AI_Workflow/logs/pipelines/PAOS/PIPE-26-06-2026---12-42/phases/n1/output/validation-report.txt";
const reportLines = results.map((r, i) => `[${r.pass ? "PASS" : "FAIL"}] Check ${i+1}: ${r.check} — ${r.detail}`);
fs.writeFileSync(outputPath,
  reportLines.join("\n") + `\n\n${passCount}/${totalCount} checks passed\n`, "utf8");
console.log(`\nReport saved to: ${outputPath}`);
