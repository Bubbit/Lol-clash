'use strict';

const express = require('express');
const fetch = require('node-fetch');
const Config = require('./config');
const playerService = require('./player');
const teamService = require('./teams');

const config = new Config().getInstance();

const app = express();

app.use(express.json());

app.get('/testkeys', (req, res) => {
  console.log(config.getKeys());

  const key = config.getKey()
  console.log(key);
  config.setKeyUsed(key);
  console.log(config.getKeys());
  config.resetKeys(config.keys);
  console.log(config.getKeys());
  res.status(200).send('done').end();
});

app.post('/clash/:teamName/', async (req, res) => {
  let hrstart = process.hrtime();
  // Get team 1 - limit to 30 matches
  const team1 = await teamService.getTeam(req.body.team1, req.params.teamName);
  await teamService.getDetailPlayerInfoPerTeam(`${req.params.teamName}/opponents/${team1.name}`, 30);
  
  let hrend = process.hrtime(hrstart);
  console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000);
  res.status(200).send('ok').end();
  // Get other teams - limit to 100 matches
  const team2 = await teamService.getTeam(req.body.team2, req.params.teamName);
  await teamService.getDetailPlayerInfoPerTeam(`${req.params.teamName}/opponents/${team2.name}`, 100);
  console.log(team2.name)

  const team3 = await teamService.getTeam(req.body.team3, req.params.teamName);
  await teamService.getDetailPlayerInfoPerTeam(`${req.params.teamName}/opponents/${team3.name}`, 100);
  console.log(team3.name)

  const team4 = await teamService.getTeam(req.body.team4, req.params.teamName);
  await teamService.getDetailPlayerInfoPerTeam(`${req.params.teamName}/opponents/${team4.name}`, 100);
  console.log(team4.name)

  const team5 = await teamService.getTeam(req.body.team5, req.params.teamName);
  await teamService.getDetailPlayerInfoPerTeam(`${req.params.teamName}/opponents/${team5.name}`, 100);
  console.log(team5.name)

  const team6 = await teamService.getTeam(req.body.team6, req.params.teamName);
  await teamService.getDetailPlayerInfoPerTeam(`${req.params.teamName}/opponents/${team6.name}`, 100);
  console.log(team6.name)

  const team7 = await teamService.getTeam(req.body.team7, req.params.teamName);
  await teamService.getDetailPlayerInfoPerTeam(`${req.params.teamName}/opponents/${team7.name}`, 100);
  console.log(team7.name)
});

app.get('/clash/update/:teamName/:opponentTeamName', async (req, res) => {
  let hrstart = process.hrtime()
  const details = await teamService.updateSquad(`${req.params.teamName}/opponents/${req.params.opponentTeamName}`);
  let hrend = process.hrtime(hrstart);
  console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
  res.status(200).send(details).end();
});

app.get('/clash/clean/:teamName/:opponentTeamName', async (req, res) => {
  try {
    await teamService.cleanSquad(`${req.params.teamName}/opponents/${req.params.opponentTeamName}`);
    res.status(200).send('ok').end();
  } catch (e) {
    res.status(500).send(e).end();
  }
});

app.get('/clash/add/:teamName', async (req, res) => {
  try {
    await teamService.addSquad(req.params.teamName);
    res.status(200).send('ok').end();
  } catch (e) {
    res.status(500).send(e).end();
  }
});

app.get('/clash/:teamName/:opponent', async (req, res) => {
  let hrstart = process.hrtime()
  const details = await teamService.analyzeSquad(`${req.params.teamName}/opponents/${req.params.opponent}`);
  let hrend = process.hrtime(hrstart);
  console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
  res.status(200).send(details).end();
});

app.get('/summoner/:summonerName/:matches', async (req, res) => {
  try {
    const summonerData = await playerService.getSummonerData(req.params.summonerName);
    const summoner = await playerService.getMetadataPlayer(summonerData.id);
    let i = 0;
    while(summoner.matches.details.length != req.params.matches) {
      const key = config.getKey();
      const matchData = await fetch(`https://euw1.api.riotgames.com/lol/match/v4/matches/${summoner.matches.matches[i].gameId}?api_key=${key}`).then(res => res.json());
      if(matchData.gameId) {
        i++;
        summoner.matches.details.push(matchData);
      } else {
        console.log(matchData);
      }
    }

    res.status(200).send(JSON.stringify(summoner)).end();
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message).end();
  }
});

app.get('/keys/:name/:key', async (req, res) => {
  const db = config.getDatabase();
  const configRef = db.ref('config');
  let keys = [];
  configRef.on('value', (snapshot) =>{
    keys = snapshot.val().keys;
  });
  let newKeys = [];
  if(keys) {
    newKeys = keys.filter((key) => key.owner !== req.params.name);
  }
  newKeys.push({
    owner: req.params.name,
    key: req.params.key
  });
  configRef.set({
    mainKey: config.mainKey(),
    keys: newKeys
  });
  res.status(200).send('Added key!').end();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;