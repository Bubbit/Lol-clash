import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import { decryptSecret } from './utils';

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    // TODO implement

    const apiKey = await decryptSecret('RIOT_API_KEY');

    const response = {
        statusCode: 200,
        body: JSON.stringify(`Hello from Bub from typescript - ${apiKey}! - ${event.queryStringParameters.summonerName}`),
    };
    return response;
};
