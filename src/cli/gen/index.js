import processOptions from './processOptions'
import processParams from './processParams'

import readTemplate from '../../core/readTemplate';
import generateText from '../../core/generateText'

export default (program) => {
  program
    .command('gen <template>')
    .description('generate file with given template')
    .option('-o, --output <file>', 'The generated output file')
    .action(function(template, options){
      let t = readTemplate(template);

      // override options
      t = processOptions(options, t);
      // edit params
      t = processParams(t);

      // console.log(t);
    });
}