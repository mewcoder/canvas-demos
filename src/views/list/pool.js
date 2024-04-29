export default class WorkerPool {
  constructor(workerScript, poolSize) {
    this.poolSize = poolSize;
    this.workerScript = workerScript;
    this.workers = [];
    this.tasks = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.poolSize; i++) {
      let worker = new Worker(this.workerScript);
      this.workers.push({ worker: worker, busy: false });
    }
  }

  runTask(data, callback) {
    const workerInfo = this.workers.find((w) => !w.busy);
    if (workerInfo) {
      workerInfo.busy = true;
      workerInfo.worker.onmessage = (e) => {
        callback(e.data.result);
        workerInfo.busy = false;
        this.runNextTask();
      };
      workerInfo.worker.postMessage(...data);
    } else {
      this.tasks.push({ data, callback });
    }
  }

  runNextTask() {
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      this.runTask(task.data, task.callback);
    }
  }

  terminate() {
    for (const workerInfo of this.workers) {
      workerInfo.worker.terminate();
    }
    this.workers = [];
  }
}
