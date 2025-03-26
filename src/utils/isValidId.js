export const isValidId = id =>
  typeof id === 'string' && /^[\dabcdef]{24}$/g.test(id);
