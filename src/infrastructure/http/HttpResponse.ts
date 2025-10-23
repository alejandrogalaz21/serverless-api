/**
 * Helper to create API Gateway HTTP responses.
 */
export function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  };
}

export function noContent() {
  return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };
}
