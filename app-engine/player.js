const fetch = require('node-fetch');
const Config = require('./config');

const config = new Config().getInstance();

const getSummonerData = async (summonerName) => {
  return await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${config.mainKey()}`).then(res => res.json())
}

const getMetadataPlayer = async (summonerId) => {
  const mainKey = config.mainKey();
  const summonerData = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/${summonerId}?api_key=${mainKey}`).then(res => res.json())
  // get MasteryData
  console.log(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/${summonerId}?api_key=${mainKey}`);
  console.log(summonerData);
  const masteryData = await fetch(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?api_key=${mainKey}`).then(res => res.json())
  console.log(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?api_key=${mainKey}`);
  console.log(masteryData);
  // get Ranks

  const ranks = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${mainKey}`).then(res => res.json())
  console.log(ranks);
  // get Matches
  const matches = await fetch(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerData.accountId}?api_key=${mainKey}`).then(res => res.json())
  
  const summoner = {
    summoner: summonerData,
    mastery: masteryData.splice(0, 10),
    ranks: ranks,
    matches: {
      totalGames: matches.totalGames,
      matches: matches.matches,
      details: []
    }
  };

  return summoner;
}

module.exports = {
  getMetadataPlayer,
  getSummonerData
}