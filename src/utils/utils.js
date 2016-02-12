// Bound log function. Useful for .catch(log) in promise chains.
export const log = console.log.bind(console);

export const noop = () => {};
