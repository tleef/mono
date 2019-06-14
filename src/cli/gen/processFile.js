import path from 'path'

import readTemplate from "../../core/readTemplate";
import processText from "./processText";
import processOptions from "./processOptions";
import processParams from "./processParams";
import processFiles from "./processFiles"

export default async (templatePath, options, settings) => {
  let t = readTemplate(templatePath);

  // override options
  t = processOptions(t, options, templatePath);

  if (settings) {
    t.params = settings.params;
  } else {
    // edit params
    t = await processParams(t, options);
  }

  if (t.text) {
    // generate text
    processText(t, options);
  }

  if (t.files && t.files.length) {
    let pwd = path.dirname(templatePath);

    await processFiles(t, pwd);
  }
}