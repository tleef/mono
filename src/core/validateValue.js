import joi from 'joi'

import {Value} from './Template';
import T from './T';

export default (value: Value, type: ?string) => {
  if (type == null) {
    type = T.optionalString;
  }

  if (T.is('optional', type) && value === null) {
    return {
      valid: true,
      value: null,
    }
  }

  if (T.is(T.string, type)) {
    let res = joi.string().validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (T.is(T.int, type)) {
    let res = joi.number().validate(value);

    return {
      valid: !res.error,
      value: parseInt(res.value),
    }
  }

  if (T.is(T.float, type)) {
    let res = joi.number().validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (T.is(T.bool, type)) {
    let res = joi.boolean().validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (T.is(T.arrayOfStrings, type)) {
    if (typeof value === 'string') {
      value = parseArray(value);
    }

    let res = joi.array().items(joi.string()).validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (T.is(T.arrayOfInts, type)) {
    if (typeof value === 'string') {
      value = parseArray(value);
    }

    let res = joi.array().items(joi.number()).validate(value);

    return {
      valid: !res.error,
      value: res.value.map(n => parseInt(n)),
    }
  }

  if (T.is(T.arrayOfFloats, type)) {
    if (typeof value === 'string') {
      value = parseArray(value);
    }

    let res = joi.array().items(joi.number()).validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (T.is(T.arrayOfBools, type)) {
    if (typeof value === 'string') {
      value = parseArray(value);
    }

    let res = joi.array().items(joi.boolean()).validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  throw new Error('Invalid type');
}

const parseArray = (s) => {
  if (!s) {
    return [];
  }

  return s.split(',').map(i => i.trim());
};