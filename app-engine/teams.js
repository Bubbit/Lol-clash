const fetch = require('node-fetch');
const Config = require('./config');
const playerService = require('./player');

const config = new Config().getInstance();

const positionOrder = {
  TOP: 0,
  JUNGLE: 1,
  MIDDLE: 2,
  BOTTOM: 3,
  UTILITY: 4,
  UNSELECTED: 5,
  FILL: 6,
}

const otherPositionNames = {
  MIDDLE: 'MID',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  JUNGLE: 'JUNGLE'
}

const allowedQueues = [400, 420, 430, 440, 700];

const getTeam = async (playerName, teamName) => {
  const mainKey = config.mainKey();
  console.log(mainKey);
  const captain = await playerService.getSummonerData(playerName);
  // Get clashID

  console.log(captain);
  const clashID = await fetch(`https://euw1.api.riotgames.com/lol/clash/v1/players/by-summoner/${captain.id}?api_key=${mainKey}`).then(res => res.json());
  // console.log(clashID);
  // const clashTeam = await fetch(`https://euw1.api.riotgames.com/lol/clash/v1/teams/${clashID[0].teamId}?api_key=${mainKey}`).then(res => res.json());
  
  // let clashTeam;
  if(playerName === 'bubbit') {
    clashTeam = {
      players: [{
        summonerId: '-aCtSbhMWy1JufsAjA1qoIl798XfcuMCTw7kdng0kZOhpQA',
        position: 'TOP'
      },
      {
        summonerId: 'yZgCwPa2ngGbInI17Kz8t3T567b1pKgjMfbl4pzA_Jfsfow',
        position: 'UTILITY'
      },
      {
        summonerId: 'GbG-Eq4EzJ3WmkFTd2s11FTqQH2nSOtvIwU3A2RNi0W-2Bw',
        position: 'MIDDLE'
      },
      {
        summonerId: 'ioONalJKPn2Idi8s_T0WoKaDgLT3PlSGtJUgs_csudjnPq9y',
        position: 'UNSELECTED'
      },
      {
        summonerId: 'F4U7ncZDHzrqa6o0qFhvZUHey3g0dcNs-JyhrSx30QbuI4Y',
        position: 'JUNGLE'
      }],
      name: 'potatoSquad',
      iconId: 4831
    }
  } else if (playerName === 'thegreyspy') {
    clashTeam = {
      players: [{
        summonerId: '4F8As0hZUNu8ORV3jC5Zo7KzuSLYo-vLcf4HkWg8x47G5Eo',
        position: 'TOP'
      },
      {
        summonerId: 'QXRdwQoFavtBgZGy39L8fVPDQXfjVEhmq_LvB78bJE_vUS0',
        position: 'UTILITY'
      },
      {
        summonerId: 'V-a4J5lPCWJikhMVddxnVoKAk24Fgf2wzjD3LvRN2673-c09',
        position: 'MIDDLE'
      },
      {
        summonerId: 'tMUIhaXoqyyuf0aG7GZF5wlMnWDIj90-_Q2cg2DlfgphAZV9',
        position: 'UNSELECTED'
      },
      {
        summonerId: 'dGX-B6Z6llF06OYWSxISqMSuN9y8xqTi-6KVcjf2ckG5xSM',
        position: 'JUNGLE'
      }],
      name: 'ZiggsSquad',
      iconId: 4281
    }
  } else if (playerName === 'panthersoap') {
    clashTeam = {
      players: [{
        summonerId: '4F8As0hZUNu8ORV3jC5Zo7KzuSLYo-vLcf4HkWg8x47G5Eo',
        position: 'TOP'
      },
      {
        summonerId: 'QXRdwQoFavtBgZGy39L8fVPDQXfjVEhmq_LvB78bJE_vUS0',
        position: 'UTILITY'
      },
      {
        summonerId: 'V-a4J5lPCWJikhMVddxnVoKAk24Fgf2wzjD3LvRN2673-c09',
        position: 'MIDDLE'
      },
      {
        summonerId: 'tMUIhaXoqyyuf0aG7GZF5wlMnWDIj90-_Q2cg2DlfgphAZV9',
        position: 'UNSELECTED'
      },
      {
        summonerId: 'dGX-B6Z6llF06OYWSxISqMSuN9y8xqTi-6KVcjf2ckG5xSM',
        position: 'JUNGLE'
      }],
      name: 'vapeSquad',
      iconId: 4281
    }
  } else if (playerName === 'jemjem') {
    clashTeam = {
      players: [{
        summonerId: '4F8As0hZUNu8ORV3jC5Zo7KzuSLYo-vLcf4HkWg8x47G5Eo',
        position: 'TOP'
      },
      {
        summonerId: 'QXRdwQoFavtBgZGy39L8fVPDQXfjVEhmq_LvB78bJE_vUS0',
        position: 'UTILITY'
      },
      {
        summonerId: 'V-a4J5lPCWJikhMVddxnVoKAk24Fgf2wzjD3LvRN2673-c09',
        position: 'MIDDLE'
      },
      {
        summonerId: 'tMUIhaXoqyyuf0aG7GZF5wlMnWDIj90-_Q2cg2DlfgphAZV9',
        position: 'UNSELECTED'
      },
      {
        summonerId: 'dGX-B6Z6llF06OYWSxISqMSuN9y8xqTi-6KVcjf2ckG5xSM',
        position: 'JUNGLE'
      }],
      name: 'asianSquad',
      iconId: 4281
    }
  } else if (playerName === 'renee') {
    clashTeam = {
      players: [{
        summonerId: '4F8As0hZUNu8ORV3jC5Zo7KzuSLYo-vLcf4HkWg8x47G5Eo',
        position: 'TOP'
      },
      {
        summonerId: 'QXRdwQoFavtBgZGy39L8fVPDQXfjVEhmq_LvB78bJE_vUS0',
        position: 'UTILITY'
      },
      {
        summonerId: 'V-a4J5lPCWJikhMVddxnVoKAk24Fgf2wzjD3LvRN2673-c09',
        position: 'MIDDLE'
      },
      {
        summonerId: 'tMUIhaXoqyyuf0aG7GZF5wlMnWDIj90-_Q2cg2DlfgphAZV9',
        position: 'UNSELECTED'
      },
      {
        summonerId: 'dGX-B6Z6llF06OYWSxISqMSuN9y8xqTi-6KVcjf2ckG5xSM',
        position: 'JUNGLE'
      }],
      name: 'bonkSquad',
      iconId: 4281
    }
  } else if (playerName === 'julia') {
    clashTeam = {
      players: [{
        summonerId: '4F8As0hZUNu8ORV3jC5Zo7KzuSLYo-vLcf4HkWg8x47G5Eo',
        position: 'TOP'
      },
      {
        summonerId: 'QXRdwQoFavtBgZGy39L8fVPDQXfjVEhmq_LvB78bJE_vUS0',
        position: 'UTILITY'
      },
      {
        summonerId: 'V-a4J5lPCWJikhMVddxnVoKAk24Fgf2wzjD3LvRN2673-c09',
        position: 'MIDDLE'
      },
      {
        summonerId: 'tMUIhaXoqyyuf0aG7GZF5wlMnWDIj90-_Q2cg2DlfgphAZV9',
        position: 'UNSELECTED'
      },
      {
        summonerId: 'dGX-B6Z6llF06OYWSxISqMSuN9y8xqTi-6KVcjf2ckG5xSM',
        position: 'JUNGLE'
      }],
      name: 'QuinnSquad',
      iconId: 4281
    }
  } else if (playerName === 'tom') {
    clashTeam = {
      players: [{
        summonerId: '4F8As0hZUNu8ORV3jC5Zo7KzuSLYo-vLcf4HkWg8x47G5Eo',
        position: 'TOP'
      },
      {
        summonerId: 'QXRdwQoFavtBgZGy39L8fVPDQXfjVEhmq_LvB78bJE_vUS0',
        position: 'UTILITY'
      },
      {
        summonerId: 'V-a4J5lPCWJikhMVddxnVoKAk24Fgf2wzjD3LvRN2673-c09',
        position: 'MIDDLE'
      },
      {
        summonerId: 'tMUIhaXoqyyuf0aG7GZF5wlMnWDIj90-_Q2cg2DlfgphAZV9',
        position: 'UNSELECTED'
      },
      {
        summonerId: 'dGX-B6Z6llF06OYWSxISqMSuN9y8xqTi-6KVcjf2ckG5xSM',
        position: 'JUNGLE'
      }],
      name: 'JungleSquad',
      iconId: 4281
    }
  } else if (playerName === 'rob') {
    clashTeam = {
      players: [{
        summonerId: '4F8As0hZUNu8ORV3jC5Zo7KzuSLYo-vLcf4HkWg8x47G5Eo',
        position: 'TOP'
      },
      {
        summonerId: 'QXRdwQoFavtBgZGy39L8fVPDQXfjVEhmq_LvB78bJE_vUS0',
        position: 'UTILITY'
      },
      {
        summonerId: 'V-a4J5lPCWJikhMVddxnVoKAk24Fgf2wzjD3LvRN2673-c09',
        position: 'MIDDLE'
      },
      {
        summonerId: 'tMUIhaXoqyyuf0aG7GZF5wlMnWDIj90-_Q2cg2DlfgphAZV9',
        position: 'UNSELECTED'
      },
      {
        summonerId: 'dGX-B6Z6llF06OYWSxISqMSuN9y8xqTi-6KVcjf2ckG5xSM',
        position: 'JUNGLE'
      }],
      name: 'BrotherSquad',
      iconId: 4281
    }
  }

  console.log(playerName);
  console.log(clashTeam);

  const players = clashTeam.players.sort((player1, player2) => positionOrder[player1.position] - positionOrder[player2.position]);

  const team = {
    name: playerName,
    players: [],
    iconId: clashTeam.iconId
  }

  for(let player of players) {
    const playerInfo = await playerService.getMetadataPlayer(player.summonerId);
    playerInfo.role = player.position;
    team.players.push(playerInfo);
  }

  const db = config.getDatabase();
  db.ref(`${teamName}/opponents/${playerName}`).set(team);
  return team;
}

const getDetailPlayerInfoPerTeam = async (teamName, amountOfMatches) => {
  return new Promise((resolve, reject) => {
    const db = config.getDatabase();
    db.ref(teamName).once('value', async (snapshot) =>{
      team = snapshot.val();
      for(let player of team.players) {
        let totalMatches = 0;
        let totalCorrectMatches = 0;
        player.matches.details = [];
        while(totalCorrectMatches < amountOfMatches && totalMatches < player.matches.matches.length) {
          if(allowedQueues.some(queueId => queueId === player.matches.matches[totalMatches].queue)) {
            const matchData = {
              metadata: player.matches.matches[totalMatches]
            };
            const key = config.getKey();
            const matchDetails = await fetch(`https://euw1.api.riotgames.com/lol/match/v4/matches/${matchData.metadata.gameId}?api_key=${key}`).then(res => res.json());
            if(matchDetails?.status) {
              config.setKeyUsed(key);
            } else {
              matchData.details = matchDetails;
              matchData.playerInfo = matchDetails.participants.find(participant =>
                participant.championId === matchData.metadata.champion
              );
              player.matches.details.push(matchData);
              totalCorrectMatches++;
              totalMatches++;
            }
          } else {
            totalMatches++;
          }
        }
      }
      db.ref(teamName).set(team);
      resolve();
    });
  });
}

const updateSquad = async (teamName) => {
  const mainKey = config.mainKey();
  return new Promise((resolve, reject) => {
    const db = config.getDatabase();
    db.ref(teamName).once('value', async (snapshot) =>{
      team = snapshot.val();
      for(let player of team.players) {
        let totalMatches = 0;
        let newMatches = await fetch(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${player.summoner.accountId}?endIndex=5&api_key=${mainKey}`).then(res => res.json());
        newMatches.matches = newMatches.matches.reverse();
        while(totalMatches < newMatches.matches.length) {
          if(player.matches.matches[0].gameId !== newMatches.matches[totalMatches].gameId) {
            if(allowedQueues.some(queueId => queueId === newMatches.matches[totalMatches].queue)) {
              const matchData = {
                metadata: newMatches.matches[totalMatches]
              };
              const key = config.getKey();
              const matchDetails = await fetch(`https://euw1.api.riotgames.com/lol/match/v4/matches/${matchData.metadata.gameId}?api_key=${key}`).then(res => res.json());
              if(matchDetails?.status) {
                config.setKeyUsed(key);
              } else {
                matchData.details = matchDetails;
                matchData.playerInfo = matchDetails.participants.find(participant =>
                  participant.championId === matchData.metadata.champion
                );
                player.matches.matches.unshift(newMatches.matches[totalMatches])
                player.matches.details.unshift(matchData);
                totalMatches++;
              }
            } else {
              totalMatches++;
            }
          } else {
            totalMatches = Infinity;
          }
        }
      }
      db.ref(teamName).set(team);
      resolve();
    });
  });
}

const analyzeSquad = (teamName) => {
  return new Promise((resolve, reject) => {
    const db = config.getDatabase();
    db.ref(teamName).once('value', async (snapshot) =>{
      team = snapshot.val();
      const teamData = [];
      for(let player of team.players) {
        const playerData = {
          name: player.summoner.name,
          statsPerChampion: [],
          statsOverall: {
            wins: 0,
            loses: 0,
            against: [],
            total: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
            visionScore: 0,
            creepScore: 0
          }
        }
        for(let match of player.matches.details) {
          if (allowedQueues.some(queueId => queueId === match.metadata.queue)) {
            const playerInfo = match.details.participants.find(participant =>
              participant.championId === match.metadata.champion
            );
            playerData.statsOverall.wins += playerInfo.stats.win ? 1 : 0;
            playerData.statsOverall.loses += playerInfo.stats.win ? 0 : 1;
            playerData.statsOverall.total++;
            playerData.statsOverall.kills += playerInfo.stats.kills;
            playerData.statsOverall.deaths += playerInfo.stats.deaths;
            playerData.statsOverall.assists += playerInfo.stats.assists;
            playerData.statsOverall.visionScore += playerInfo.stats.visionScore;
            playerData.statsOverall.creepScore += playerInfo.stats.totalMinionsKilled;
            const opponentInfo = match.details.participants.find(participant => {
              if(match.metadata.lane === 'BOTTOM') {
                return otherPositionNames[participant.timeline.lane] === match.metadata.lane && participant.timeline.role === match.metadata.role && participant.teamId !== playerInfo.teamId
              } else {
                return otherPositionNames[participant.timeline.lane] === match.metadata.lane && participant.teamId !== playerInfo.teamId
              }
            });
            if(opponentInfo) {
              const againstData = playerData.statsOverall.against.find((champ) => champ.id === opponentInfo.championId);
              if(againstData) {
                if(playerInfo.stats.win) {
                  againstData.wins++;
                  againstData.total++;
                } else {
                  againstData.loses++;
                  againstData.total++;
                }
              } else {
                playerData.statsOverall.against.push({
                  id: opponentInfo.championId,
                  wins: playerInfo.stats.win ? 1 : 0,
                  loses: playerInfo.stats.win ? 0 : 1,
                  total: 1
                });
              }
            }
            const championData = playerData.statsPerChampion.find((champ) => champ.id === playerInfo.championId);
            if(championData) {
              championData.wins += playerInfo.stats.win ? 1 : 0;
              championData.loses += playerInfo.stats.win ? 0 : 1;
              championData.kills += playerInfo.stats.kills;
              championData.total++;
              championData.deaths += playerInfo.stats.deaths;
              championData.assists += playerInfo.stats.assists;
              championData.visionScore += playerInfo.stats.visionScore;
              championData.creepScore += playerInfo.stats.totalMinionsKilled;
              if(opponentInfo) {
                const againstData = championData.against.find((champ) => champ.id === opponentInfo.championId);
                if(againstData) {
                  if(playerInfo.stats.win) {
                    againstData.wins++;
                    againstData.total++;
                  } else {
                    againstData.loses++;
                    againstData.total++;
                  }
                } else {
                  championData.against.push({
                    id: opponentInfo.championId,
                    wins: playerInfo.stats.win ? 1 : 0,
                    loses: playerInfo.stats.win ? 0 : 1,
                    total: 1
                  });
                }
              }
            } else {
              let champData = {
                id: playerInfo.championId,
                wins: playerInfo.stats.win ? 1 : 0,
                loses: playerInfo.stats.win ? 0 : 1,
                total: 1,
                against: [],
                kills: playerInfo.stats.kills,
                deaths: playerInfo.stats.deaths,
                assists: playerInfo.stats.assists,
                visionScore: playerInfo.stats.visionScore,
                creepScore: playerInfo.stats.totalMinionsKilled
              }
              if(opponentInfo) {
                champData.against.push({
                  id: opponentInfo.championId,
                  wins: playerInfo.stats.win ? 1 : 0,
                  loses: playerInfo.stats.win ? 0 : 1,
                  total: 1
                });
              }
              playerData.statsPerChampion.push(champData);
            }
          }
        }
        playerData.statsOverall.winPercentage = playerData.statsOverall.wins * 100 / playerData.statsOverall.total;
        playerData.statsOverall.averageKills = playerData.statsOverall.kills / playerData.statsOverall.total;
        playerData.statsOverall.averageDeaths = playerData.statsOverall.deaths / playerData.statsOverall.total;
        playerData.statsOverall.averageAssists = playerData.statsOverall.assists / playerData.statsOverall.total;
        playerData.statsOverall.kda = (playerData.statsOverall.averageKills + playerData.statsOverall.averageAssists) / playerData.statsOverall.averageDeaths;
        playerData.statsOverall.against.forEach((champ) => champ.winRate = champ.wins * 100 / champ.total);
        playerData.statsOverall.against = playerData.statsOverall.against.sort((a, b) => b.total - a.total).sort((a, b) => a.winRate - b.winRate);
        playerData.statsPerChampion.forEach((champ) => {
          champ.against.forEach((againstChamp) => againstChamp.winRate = againstChamp.wins * 100 / againstChamp.total);
          champ.against = champ.against.sort((a, b) => b.total - a.total).sort((a, b) => a.winRate - b.winRate);
          champ.winRate = champ.wins * 100 / champ.total;
        });
        playerData.statsPerChampion = playerData.statsPerChampion.sort((a, b) => b.winRate - a.winRate).sort((a, b) => b.total - a.total);
        teamData.push(playerData);
      }
      resolve(teamData);
    });
  });
}

const addSquad = async (squadName) => {
  const db = config.getDatabase();
  const result = await db.ref(`test/${squadName}`).set({ potato: true });
  return result;
}

const cleanSquad = async (squadName) => {
  const db = config.getDatabase();
  const result = await db.ref(`${squadName}`).remove();
  return result;
}

module.exports = {
  getTeam,
  getDetailPlayerInfoPerTeam,
  cleanSquad,
  addSquad,
  updateSquad,
  analyzeSquad
}