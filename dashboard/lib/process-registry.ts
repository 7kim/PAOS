// Process registry — tracks spawned Hermes agent terminal sessions
const processes = new Map<string, {
  pid: number;
  agent: string;
  label: string;
  startTime: string;
  pipelineId: string;
  nodeId: string;
  output: string[];
  status: "running" | "completed" | "failed";
  cmd: string;
}>();

export const registry = {
  register(pid: number, agent: string, label: string, pipelineId: string, nodeId: string, cmd: string) {
    const id = `proc_${pid}_${Date.now()}`;
    processes.set(id, {
      pid,
      agent,
      label,
      startTime: new Date().toISOString(),
      pipelineId,
      nodeId,
      output: [],
      status: "running",
      cmd,
    });
    return id;
  },

  appendOutput(procId: string, text: string) {
    const proc = processes.get(procId);
    if (proc) {
      proc.output.push(text);
      if (proc.output.length > 1000) proc.output.shift();
    }
  },

  setStatus(procId: string, status: "running" | "completed" | "failed") {
    const proc = processes.get(procId);
    if (proc) proc.status = status;
  },

  getByPid(pid: number) {
    for (const [, proc] of processes) {
      if (proc.pid === pid) return proc;
    }
    return null;
  },

  getAll() {
    return Array.from(processes.entries()).map(([id, proc]) => ({ id, ...proc }));
  },
};
