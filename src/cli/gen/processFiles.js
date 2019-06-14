import path from 'path'

import processFile from './processFile'

export default async (template, pwd) => {
  const files = template.files;

  for (let f of files) {
    await (async () => {
      let settings = {};

      if (!path.isAbsolute(f.path)) {
        f.path = path.join(pwd, f.path);
      }

      if (f.params) {
        settings.params = {};

        let paramsKeys = Object.keys(f.params);

        paramsKeys.forEach((k) => {
          let valueKey = f.params[k];

          settings.params[k] = template.params[valueKey];
        })
      }

      await processFile(f.path, {}, settings);
    })()
  }
}