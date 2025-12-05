export function createError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}
