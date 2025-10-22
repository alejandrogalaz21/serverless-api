import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Por ahora, un handler básico; lo expandiremos con la lógica de la API
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'API de TaxDown lista!' }),
  };
};