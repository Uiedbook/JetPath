import type { _JetPath_paths } from "./functions";
import type { JetPluginExecutor, JetPluginExecutorInitParams } from "./types";



export class JetPlugin {
  name?: string;
  version?: string;
  JetPathServer?: any;
  hasServer?: boolean;
  executor: JetPluginExecutor;
  constructor({
    executor,
  }: {
    executor: JetPluginExecutor;
  }) {
    this.executor = executor;
  }
  _setup(init: JetPluginExecutorInitParams): any {
    return this.executor.call(this, init);
  }
}




export class Log {
  // Define ANSI escape codes for colors and styles
  static colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fgBlack: "\x1b[30m",
    fgRed: "\x1b[31m",
    fgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m",

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
  };
  static log(message: any, color: string) {
    console.log(`${color}%s${Log.colors.reset}`, `Jetpath: ${message}`);
  }

  static info(message: string) {
    Log.log(message, Log.colors.fgBlue);
  }

  static warn(message: string) {
    Log.log(message, Log.colors.fgYellow);
  }

  static error(message: string) {
    Log.log(message, Log.colors.fgRed);
  }

  static success(message: string) {
    Log.log(message, Log.colors.fgGreen);
  }
} 