import { ajax } from '@lion/ajax';

const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class LeagueAPI  {
  constructor() {
    this.tokens = [
    {
      key: 'RGAPI-8917a711-f24a-480d-bcee-af04c324bd96',
      calls: 0,
      lastUsed: Date.now()
    },
    {
      key: 'RGAPI-578d07f4-7303-4662-b793-f16cea814d22',
      calls: 0,
      lastUsed: Date.now()
    },
  ];
    this.activeToken = this.tokens[0];
    this.accountToken = 'RGAPI-659d9cbc-f3f2-4c9a-8930-003fb2463093';
  }

  setNewActiveToken() {
    const timeNow = Date.now();
    const newKey = this.tokens.find(token => (timeNow - token.lastUsed) > 2000 || token.calls === 0);
    this.activeToken = newKey;
    this.activeToken.calls = 0;
  }

  getActiveToken() {
    if(this.activeToken.calls > 19) {
      this.setNewActiveToken();
    }

    this.activeToken.calls++;
    this.activeToken.lastUsed = Date.now();
    return this.activeToken.key;
  }

  async get(url) {
    try {
      const result = await ajax.get(`${url}?api_key=${this.getActiveToken()}`);
      return result.data;
    } catch (e) {
      console.log(e);
    }
  }

  async getAccount(url) {
    try {
      const result = await ajax.get(`${url}?api_key=${this.accountToken}`);
      return result.data;
    } catch (e) {
      console.log(e);
    }
  }
}

window.leagueAPI = window.leagueAPI ? window.leagueAPI : new LeagueAPI();

export async function getSummonerByName(name) {
  await sleep(100);
  const data = await window.leagueAPI.getAccount(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`);
  return data;
}

export async function getSummonerByID(id) {
  await sleep(100);
  const data = await window.leagueAPI.getAccount(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/${id}`);
  return data;
}

export async function getRanks(summonerID) {
  await sleep(100);
  const data = await window.leagueAPI.getAccount(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}`);
  return data;
}

export async function getDetailedMatch(matchID) {
  await sleep(50);
  const data = await window.leagueAPI.get(`https://euw1.api.riotgames.com/lol/match/v4/timelines/by-match/${matchID}`);
  return data;
}

export async function getMatch(matchID) {
  await sleep(500);
  const data = await window.leagueAPI.get(`https://euw1.api.riotgames.com/lol/match/v4/matches/${matchID}`);
  return data;
}

export async function getMatches(accountID) {
  await sleep(100);
  const data = await window.leagueAPI.getAccount(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountID}`);
  return data.matches;
}

export async function getClashId(summonerID) {
  await sleep(100);
  const data = await window.leagueAPI.getAccount(`https://euw1.api.riotgames.com/lol/clash/v1/players/by-summoner/${summonerID}`);
  return data;
}

export async function getClashTeam(clashID) {
  await sleep(100);
  const data = await window.leagueAPI.getAccount(`https://euw1.api.riotgames.com/lol/clash/v1/teams/${clashID}`);
  return data;
}

export async function getMasteryData(summonerID) {
  await sleep(100);
  const data = await window.leagueAPI.getAccount(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerID}`);
  return data;
}

export async function sendClashTeams(teamName, opponentTeams) {
  const result = await ajax.post(`https://remco-clash.ew.r.appspot.com/clash/${teamName}/`, opponentTeams);
  console.log(result.data);
}

export async function getClashAnalysis(teamName, opponentTeamName) {
  const result = await ajax.get(`https://remco-clash.ew.r.appspot.com/clash/${teamName}/${opponentTeamName}`);
  return result.data;
}

export async function updateClashTeam(teamName, opponentTeamName) {
  const result = await ajax.get(`https://remco-clash.ew.r.appspot.com/clash/update/${teamName}/${opponentTeamName}`);
  return result.data;
}

export async function deleteClashTeam(teamName, opponentTeamName) {
  const result = await ajax.get(`https://remco-clash.ew.r.appspot.com/clash/clean/${teamName}/${opponentTeamName}`);
  return result.data;
}