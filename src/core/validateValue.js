import joi from 'joi'

import {Value} from './Template'

export default (value: Value, type: ?string) => {
  if (type == null) {
    type = '?string';
  }

  if (type.startsWith('?') && value === null) {
    return {
      valid: true,
      value: null,
    }
  }

  if (type === 'string' || type === '?string') {
    let res = joi.string().allow('').validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (type === 'int' || type === '?int') {
    let res = joi.number().validate(value);

    return {
      valid: !res.error,
      value: parseInt(res.value),
    }
  }

  if (type === 'float' || type === '?float') {
    let res = joi.number().validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (type === 'bool' || type === '?bool') {
    let res = joi.boolean().validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (type === 'array<string>' || type === '?array<string>') {
    if (typeof value === 'string') {
      value = parseArray(value);
    }

    let res = joi.array().items(joi.string()).validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (type === 'array<int>' || type === '?array<int>') {
    if (typeof value === 'string') {
      value = parseArray(value);
    }

    let res = joi.array().items(joi.number()).validate(value);

    return {
      valid: !res.error,
      value: res.value.map(n => parseInt(n)),
    }
  }

  if (type === 'array<float>' || type === '?array<float>') {
    if (typeof value === 'string') {
      value = parseArray(value);
    }

    let res = joi.array().items(joi.number()).validate(value);

    return {
      valid: !res.error,
      value: res.value,
    }
  }

  if (type === 'array<bool>' || type === '?array<bool>') {
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