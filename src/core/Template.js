/**
 * @flow
 */

'use strict';

/**
 * Valid param types
 */
export type Value =
  string
  | number
  | boolean
  | Array<string>
  | Array<number>
  | Array<boolean>

/**
 * A plain object representation of a ParamInput.
 */
export type ParamInput = {
  required?: boolean,
  default?: Value,
  type?: string,
};

/**
 * A plain object representation of ParamsInput.
 */
export type ParamsInput = { [key: string]: ?ParamInput };

/**
 * A plain object representation of TemplateInput.
 */
export type TemplateInput = {
  params?: ParamsInput,
  options?: Options,
  files?: Files,
  text?: string,
};

/**
 * A plain object representation of a Param.
 */
export type Param = {
  default?: Value,
  value?: Value,
  type: string,
};

/**
 * A map of Param objects.
 */
export type Params = { [key: string]: Param };

/**
 * Output param types
 */
export type Output =
  string
  | { file: string, dir: string }

/**
 * A plain object representation of Options.
 */
export type Options = {
  output?: Output,
}

/**
 * A map of File params.
 */
export type FileParams = { [key: string]: string }

/**
 * A plain object representation of a File.
 */
export type File = {
  path: string,
  params?: FileParams
}

/**
 * An array of File objects.
 */
export type Files = Array<File>

/**
 * A plain object representation of a Template.
 */
export type Template = {
  params?: Params,
  options?: Options,
  files?: Files,
  text?: string
};