/**
 * @flow
 */


'use strict';

import fs from 'fs'
import yaml from 'js-yaml'
import joi from 'joi'

import type {Param} from './Params'
import type {Template} from "./Template";

const FileSchema = joi.object().keys({
  text: joi.string().required(),
  params: joi.array().items(
    joi.string(),
    joi.object().length(1).pattern(/.*/, joi.object().keys({
      required: joi.boolean(),
      default: joi.string()
    }))
  )
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

const constructTemplate = (data: { params?: Array<string|{}>, text: string }) => {
  const template: Template = {
    text: data.text,
  };

  if (data.params) {
    template.params = data.params.map((o) => {
      if (typeof o === 'string') {
        return { key: o };
      }

      // its an object of the form { key: { required?, default? } }
      const key = Object.keys(o)[0];
      const param: Param = { key: key };
      if (o[key].hasOwnProperty('required')) {
        param.required = o[key].required;
      }
      if (o[key].hasOwnProperty('default')) {
        param.defaultValue = o[key].default;
      }

      return param;
    })
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

