/**
 * @flow
 */

'use strict';

/**
 * A plain object representation of a Param.
 */
export type Param = {
  key: string,
  defaultValue?: string,
  value?: string,
};

export type Params = {[key: string]: Param};