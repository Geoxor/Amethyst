import chalk from "chalk";

export class Logger {
  public static printColor(...msg: string[]) {
    console.log(chalk.hex("#6669D3")(...msg))
  }

  public static print(...msg: string[]) {
    console.log(chalk.hex("#6669D3")(" ➜ "), ...msg)
  }
} 
