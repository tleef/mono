import path from 'path'

import processOptions from './processOptions'
import processParams from './processParams'

import readTemplate from '../../core/readTemplate';
import generateText from '../../core/generateText';
import writeFile from '../../core/writeFile';

export default (program) => {
  program
    .command('gen <template>')
    .description('generate file with given template')
    .option('-o, --output <file>', 'The generated output file')
    .option('-p, --preview', 'Preview output')
    .action(async (template, options) => {
      let t = readTemplate(template);

      // override options
      t = processOptions(options, t);
      // edit params
      t = await processParams(t);
      // generate text
      const text = generateText(t);

      if (options.preview) {
        console.log(text);
      } else {
        // resolve path
        let output = t.options && t.options.output;
        if (!output) {
          const parts = path.parse(template);
          console.log(parts);
          output = `${parts.name}.txt`
        }

        writeFile(output, text);
      }
    });
}