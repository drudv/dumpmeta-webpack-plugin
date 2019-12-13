import fs from 'fs';
import { Compiler, Stats } from 'webpack';

interface IPluginOptions {
  filename: string;
  prepare: (stats: Stats) => { [k: string]: any };
}

export type UserOptions = Partial<IPluginOptions>;

export class DumpMetaPlugin {
  options: IPluginOptions;

  constructor(options?: UserOptions) {
    this.options = {
      filename: 'meta.json',
      prepare: (stats: Stats) => ({ hash: stats.hash }),
      ...options,
    };
  }

  apply(compiler: Compiler) {
    compiler.hooks.done.tap(this.constructor.name, stats => {
      const json = JSON.stringify(this.options.prepare(stats));
      return new Promise((resolve, reject) => {
        fs.writeFile(this.options.filename, json, 'utf8', error => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    });
  }
}
