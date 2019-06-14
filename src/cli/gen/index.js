import processFile from './processFile'

export default (program) => {
  program
    .command('gen <template>')
    .description('generate file with given template')
    .option('-o, --output <file>', 'The generated output file')
    .option('-p, --preview', 'Preview output')
    .action(async (path, options) => {
      await processFile(path, options);
    });
}