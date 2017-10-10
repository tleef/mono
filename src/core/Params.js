/**
 * @flow
 */

'use strict';

/**
 * A plain object representation of a Param.
 */
export type Param = {
  key: string,
  required?: boolean,
  defaultValue?: string,
  value?: string,
};

export type Params = Array<Param>;