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
  text: string,
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
 * A array of Param objects.
 */
export type Params = { [key: string]: Param };

/**
 * A plain object representation of Options.
 */
export type Options = {
  output?: string,
}

/**
 * A plain object representation of a Template.
 */
export type Template = {
  params?: Params,
  options?: Options,
  text: string
};