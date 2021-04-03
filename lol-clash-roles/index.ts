import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import { decryptSecret } from './utils';
import * as fetch from 'node-fetch';

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    const apiKey = await decryptSecret('RIOT_API_KEY');

    // Get summonerID
    const summonerdata = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${event.queryStringParameters.summonerName}?api_key=${apiKey}`).then(res => res.json())
    // Get clashTeamID
    const clashID = await fetch(`https://euw1.api.riotgames.com/lol/clash/v1/players/by-summoner/${summonerdata.id}?api_key=${apiKey}`).then(res => res.json());
    // Get teamsetup
    const clashTeam = await fetch(`https://euw1.api.riotgames.com/lol/clash/v1/teams/${clashID[0].teamId}?api_key=${apiKey}`).then(res => res.json());
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(clashTeam),
    };
    return response;
};
