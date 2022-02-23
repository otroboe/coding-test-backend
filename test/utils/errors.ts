export const expectNotFoundError = (
  response: Record<string, any>,
  message = 'Not Found Exception',
): void => {
  const { data, errors } = response;
  expect(data).toBeNull();
  expect(Array.isArray(errors)).toBe(true);
  expect(errors.length).toEqual(1);
  expect(errors[0].message.includes(message)).toBe(true);
  expect(errors[0].extensions.response.statusCode).toEqual(404);
};

export const expectForbiddenError = (
  response: Record<string, any>,
  message = 'Forbidden resource',
): void => {
  const { data, errors } = response;
  expect(data).toBeNull();
  expect(Array.isArray(errors)).toBe(true);
  expect(errors.length).toEqual(1);
  expect(errors[0].message.includes(message)).toBe(true);
  expect(errors[0].extensions.response.statusCode).toEqual(403);
};

export const expectValidationError = (response: Record<string, any>): void => {
  const { data, errors } = response;
  expect(data).toBeNull();
  expect(Array.isArray(errors)).toBe(true);
  expect(errors.length).toEqual(1);
  expect(errors[0].extensions.exception.status).toEqual(400);
};
