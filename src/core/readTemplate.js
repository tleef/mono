/**
 * @flow
 */


'use strict';

import fs from 'fs'
import yaml from 'js-yaml'
import joi from 'joi'

import type {Template, Params, Param, Files, File, FileParams, TemplateInput} from "./Template";
import validateValue from './validateValue';
import T from './T';

const FileSchema = joi.object().keys({
  text: joi.string(),
  params: joi.object().pattern(/.*/, [
    joi.any().valid(null),
    joi.object().keys({
      required: joi.boolean(),
      default: joi.any(),
      type: joi.string().valid(
        T.string,
        T.int,
        T.float,
        T.bool,
        T.arrayOfStrings,
        T.arrayOfInts,
        T.arrayOfFloats,
        T.arrayOfBools,
      ),
    })
  ]),
  files: joi.array().items(joi.object().keys({
    path: joi.string().required(),
    params: joi.object().pattern(/.*/, joi.string().required())
  })),
  options: joi.object().keys({
    output: [
      joi.string(),
      joi.object({
        file: joi.string(),
        dir: joi.string()
      })
    ],
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
    console.log('ValidateError:', result.error.message);
    return false;
  }

  if (data.params) {
    let paramKeys = Object.keys(data.params);

    if (paramKeys.length) {
      let valid = true;

      paramKeys.forEach((k) => {
        let param = data.params[k];

        if (param && param.hasOwnProperty('default')) {
          let type = param.required ? '' : '?';
          type += param.type || T.string;

          let res = validateValue(param.default, type);

          if (!res.valid) {
            console.log('ValidateError:', `default value, ${param.default}, for param, ${k}, is not valid type, ${param.type || T.string}`);
            valid = false;
          } else {
            param.default = res.value;
          }
        }
      });

      if (!valid) {
        return false;
      }
    }
  }

  return true;
};

const constructTemplate = (data: TemplateInput) => {
  const template: Template = {};

  if (data.hasOwnProperty('text')) {
    template.text = data.text;
  }

  if (data.hasOwnProperty('options')) {
    template.options = data.options;
  }

  if (data.params) {
    const params: Params = {};

    let paramKeys: Array<string> = Object.keys(data.params);

    paramKeys.forEach((k) => {
      const param: Param = {type: T.optionalString};

      let p = data.params && data.params[k];

      // p is optional
      if (p != null) {
        // p is an object of the form { required?, default?, type? }
        if (p.hasOwnProperty('default')) {
          param.default = p.default;
        }

        param.type = p.required ? '' : '?';
        param.type += p.type || T.string;
      }

      params[k] = param;
    });

    template.params = params;
  }

  if (data.files && data.files.length) {
    const files: Files = [];

    data.files.forEach((f) => {
      const file: File = {
        path: f.path,
      };

      if (f.hasOwnProperty('params')) {
        file.params = f.params;
      }

      files.push(file);
    });

    template.files = files;
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

