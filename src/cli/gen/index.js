import readTemplate from "../../core/readTemplate";

export default (program) => {
  program
    .command('gen <template>')
    .description('generate file with given template')
    .option('-o, --output <file>', 'The generated output file')
    .action(function(template, options){
      readTemplate(template);
    });
}