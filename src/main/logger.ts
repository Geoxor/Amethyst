/* eslint-disable no-console */

import chalk from "chalk";

export class Logger {
  public static printColor(...msg: string[]) {
    console.log(chalk.hex("#6669D3")(...msg));
  } 

  public static print(...msg: string[]) {
    console.log(chalk.hex("#6669D3")(" ➜ "), ...msg);
  }

  public static error(...msg: string[]) {
    console.log(chalk.hex("#ff0000")(" ➜ "), ...msg);
  }

  public static fn(name: string, params?: Object, ...msg: string[]) {
    console.log(chalk.hex("#933ce8")(" ✭ "), "Function:", chalk.hex("#933ce8")(`${name}()`), chalk.hex("#6669D3")(msg[0] ? " ➜ " : ""), ...msg);
    if (params) {
      console.log(chalk.gray(`    Parameters: 
     ${Object.entries(params).map(([name, value]) => ` ${chalk.hex("#933ce8")("↳")} ${chalk.magenta(name)}: "${value}"`)}
    `));
    }
  }

  public static handle(name: string, params?: Object, ...msg: string[]) {
    console.log(chalk.hex("#42adf5")(" 🛈"), "IPC Handle Function:", chalk.hex("#42adf5")(`"${name}"`), chalk.hex("#6669D3")(msg[0] ? " ➜ " : ""), ...msg);
    if (params) {
      console.log(chalk.gray(`    Parameters: 
     ${Object.entries(params).map(([name, value]) => ` ${chalk.hex("#42adf5")("↳")} ${chalk.magenta(name)}: "${value}"`)}
    `));
    }
  }
} 
