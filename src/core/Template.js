/**
 * @flow
 */

'use strict';

import type {Params} from './Params'

/**
 * A plain object representation of a Template.
 */
export type Template = {
  params?: Params,
  text: string
};