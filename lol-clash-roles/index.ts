import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import { decryptSecret } from './utils';
import * as fetch from 'node-fetch';

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    // TODO implement

    const apiKey = await decryptSecret('RIOT_API_KEY');

    const summonerdata = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${event.queryStringParameters.summonerName}?api_key=${apiKey}`).then(res => res.json())
    const response = {
        statusCode: 200,
        body: JSON.stringify(summonerdata),
    };
    return response;
};
