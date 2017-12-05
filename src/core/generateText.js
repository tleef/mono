/**
 * @flow
 */

'use strict';

import doT from 'dot'

import type {Template, Params, Param} from './Template'

const processPrams = (params?: Params) => {
  const data = {};

  if (params) {
    const keys: Array<string> = Object.keys(params);

    keys.forEach((k) => {
      const p: Param = params && params[k] || {};

      data[k] = p.hasOwnProperty('value') ? p.value : p.default;
    })
  }

  return data;
};

export default (template: Template) => {
  const templateFn = doT.template(template.text);
  return templateFn(processPrams(template.params));
}