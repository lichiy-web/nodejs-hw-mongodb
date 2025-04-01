import { parseNumber } from './parseNumber.js';

const parseValueOfType = (value, type) => {
  if (![String, Number, Boolean].includes(type)) return;

  const parsers = new Map([
    [String, value => value],
    [Number, parseNumber],
    [Boolean, value => ({ true: true, false: false }?.[value])],
  ]);

  return parsers.get(type)(value);
};

export const parseParams = (param, value, schema, defaultValue) => {
  if (typeof value !== 'string') return;

  const builtInType = schema.tree?.[param]?.type;
  const parsedValue = parseValueOfType(value, builtInType);
  const enumValues = schema.tree?.[param]?.enum;

  const result = !enumValues
    ? parsedValue
    : enumValues.includes(parsedValue)
    ? parsedValue
    : defaultValue;

  return result;
};
