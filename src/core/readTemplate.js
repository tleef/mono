/**
 * @flow
 */


'use strict';

import fs from 'fs'
import yaml from 'js-yaml'
import joi from 'joi'

import type {Template, Params, Param, TemplateInput} from "./Template";

const FileSchema = joi.object().keys({
  text: joi.string().required(),
  params: joi.object().pattern(/.*/, [
    joi.any().valid(null),
    joi.object().keys({
      required: joi.boolean(),
      default: joi.string(),
    })
  ]),
  options: joi.object().keys({
    output: joi.string(),
  }),
});

const readYaml = (path: string) => {
  try {
    return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    console.log(e);
  }

  return null;
};

const validateData = (data: any) => {
  const result = joi.validate(data, FileSchema);

  if (result.error !== null) {
    console.log(result.error);
    return false;
  }

  return true;
};

const constructTemplate = (data: TemplateInput) => {
  const template: Template = {
    text: data.text,
  };

  if (data.hasOwnProperty('options')) {
    template.options = data.options;
  }

  if (data.params) {
    const params: Params = {};

    let keys: Array<string> = Object.keys(data.params);

    keys.forEach((k) => {
      const param: Param = {};

      let p = data.params && data.params[k];

      // p is optional
      if (p != null) {
        // p is an object of the form { required?, default? }
        if (p.hasOwnProperty('required')) {
          param.required = p.required;
        }
        if (p.hasOwnProperty('default')) {
          param.default = p.default;
        }
      }

      params[k] = param;
    });

    template.params = params;
  }

  return template
};

export default (path: string) => {
  const data = readYaml(path);
  const valid = validateData(data);

  if (!data || !valid) {
    process.exit(1);
    return;
  }

  return constructTemplate(data);
}

