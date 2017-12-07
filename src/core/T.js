const string = 'string';
const optionalString = `?${string}`;
const int = 'int';
const optionalInt = `?${int}`;
const float = 'float';
const optionalFloat = `?${float}`;
const bool = 'bool';
const optionalBool = `?${bool}`;
const array = 'array';
const arrayOfStrings = `${array}<${string}>`;
const optionalArrayOfStrings = `?${arrayOfStrings}`;
const arrayOfInts = `${array}<${int}>`;
const optionalArrayOfInts = `?${arrayOfInts}`;
const arrayOfFloats = `${array}<${float}>`;
const optionalArrayOfFloats = `?${arrayOfFloats}`;
const arrayOfBools = `${array}<${bool}>`;
const optionalArrayOfBools= `?${arrayOfBools}`;

const is = (type: string, value: string, strict: boolean) => {
  if (type === 'optional') {
    return value.startsWith('?')
  }

  if (type === 'required') {
    return !is('optional', value);
  }

  if (strict) {
    return value.startsWith(type);
  }

  return value.startsWith(type) || value.startsWith(`?${type}`);
};

const getArrayType = (type) => {
  const r = /\??array<(.*)>/g;
  return r.exec(type)[1];
};

export default {
  string,
  optionalString,
  int,
  optionalInt,
  float,
  optionalFloat,
  bool,
  optionalBool,
  array,
  arrayOfStrings,
  optionalArrayOfStrings,
  arrayOfInts,
  optionalArrayOfInts,
  arrayOfFloats,
  optionalArrayOfFloats,
  arrayOfBools,
  optionalArrayOfBools,

  is,
  getArrayType
}