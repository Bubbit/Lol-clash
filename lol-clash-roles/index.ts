import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    // TODO implement

    const secret1 = '[first secret]';
    const secret2 = '[second secret]';

    const response = {
        statusCode: 200,
        body: JSON.stringify(`Hello from Bub from typescript - ${secret1} - ${secret2}!`),
    };
    return response;
};
