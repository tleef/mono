/**
 * @flow
 */

'use strict';

import doT from 'dot'

import type {Template} from './Template'
import type {Params} from './Params'

const processPrams = (params?: Params) => {
  const data = {};

  if (params) {
    params.forEach((param) => {
      data[param.key] = param.value !== undefined ? param.value : param.defaultValue;
    })
  }

  return data;
};

export default (template: Template) => {
  const tempFn = doT.template(template.text);
  return tempFn(processPrams(template.params));
}