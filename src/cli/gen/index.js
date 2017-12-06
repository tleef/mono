import processOptions from './processOptions'
import processParams from './processParams'

import readTemplate from '../../core/readTemplate';
import generateText from '../../core/generateText'

export default (program) => {
  program
    .command('gen <template>')
    .description('generate file with given template')
    .option('-o, --output <file>', 'The generated output file')
    .action(async (template, options) => {
      let t = readTemplate(template);

      // override options
      t = processOptions(options, t);
      // edit params
      t = await processParams(t);
      // generate text
      const text = generateText(t);
      console.log(text);
    });
}