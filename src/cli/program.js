#!/usr/bin/env node

/**
 * @flow
 */

'use strict';
import program from 'commander';

import gen from './gen';

program.version('1.0.0');
gen(program);

program.parse(process.argv);
