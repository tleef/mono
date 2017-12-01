#!/usr/bin/env node

/**
 * @flow
 */

'use strict';

var program = require('commander');

program.version('1.0.0');

program
  .command('gen <template>')
  .description('generate file with given template')
  .option('-o, --output <file>', 'The generated output file')
  .action(function(template, options){
    console.log('generate file using "%s" saving to "%s"', template, options.output);
  });

program.parse(process.argv);
