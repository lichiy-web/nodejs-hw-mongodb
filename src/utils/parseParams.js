import { parseNumber } from './parseNumber.js';

const parsers = new Map([
  [String, value => value],
  [Number, parseNumber],
  [Boolean, value => ({ true: true, false: false }?.[value])],
]);

export const parseParams = (param, value, schema, defaultValue) => {
  const isString = typeof value === 'string';
  const builtInType = schema.tree?.[param]?.type;
  const parsedValue = isString && parsers.get(builtInType)(value);
  console.log('\n\n param = ', param);
  console.log('value = ', value);
  console.log('parsedValue = ', parsedValue);
  const enumValues = schema.tree?.[param]?.enum;

  const result =
    ((enumValues ? enumValues.includes(parsedValue) : true) && parsedValue) ||
    defaultValue;
  console.log('result = ', result, '\n\n');
  return result;
};
