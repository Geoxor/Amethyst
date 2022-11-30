import { ElectronEventManager } from "@/electronEventManager";
import { Store } from "@/state";

export class CPUUsageMonitor {
  public timer: NodeJS.Timer | undefined;

  constructor(public state: Store, public electron: ElectronEventManager) {
    this.start();
  }

  public stop = () => {
    this.timer && clearInterval(this.timer);
  };

  public start = () => {
    this.timer = setInterval(() => this.getCpuData(), 1000);
  };

  private getCpuData = async () => {
    this.electron.getCpuUsage()
      .then(usage => this.state.state.cpuUsage = usage as {node: number, renderer: number})
      .catch(console.error);
  };
}