import { LitElement, html, css } from 'lit-element';
import '@lion/accordion/lion-accordion.js';
import './champion-mastery';
import './champion-stats.js';
import './match-data';
import { getSummonerByID, getMasteryData, getMatches, getRanks, getMatch } from './../util/api';

const rankEnum = {
  RANKED_FLEX_SR: 'Flex',
  RANKED_SOLO_5x5: 'Solo'
}

export class LeaguePlayer extends LitElement {
  static get properties() {
    return {
      player: { type: String },
      champMasteryList: { type: Object },
      allowedQueues: { type: Object },
      top10champs: { type: Object },
    };
  }

  static get styles() {
    return css`
    img {
      height: 50px;
    }

    h2 {
      text-align: center;
    }

    .ranks {
      display: flex;
      justify-content: space-between;
      margin: 10px;
    }

    .match {
      display: flex;
      justify-content: flex-start;
      border-bottom: 1px solid white;
    }

    .match[clash] {
      background-color: ##b77803;
    }

    .match > div {
      margin: 1em 1em;
    }

    .position {
      margin: 0 auto;
      width: 50px;
    }

    .loading {
      height: 20px;
      margin: 5px auto;
      display: block;
    }
    `
  }

  constructor() {
    super();

    this.allowedQueues = [400, 420, 430, 44, 700];
  }

  async connectedCallback() {
    super.connectedCallback();

    this.loading = true;
    const summonerData = await getSummonerByID(this.player.summonerId);
    this.playerName = summonerData.name;
    const summonerID = summonerData.id;
    const accountID = summonerData.accountId;

    const masterylist = await getMasteryData(summonerID);
    this.rankList = await getRanks(summonerID);
    const matchesList = await getMatches(accountID);
    this.champMasteryList = masterylist.splice(0, 5);
    this.matches = matchesList.splice(0, 10);

    this.top10champs = await this.analyzeMatches(this.matches);
    this.loading = false;
  }

  async analyzeMatches(matches) {
    const championData = {};
    const mergedChampionData = [];
    const newMatches = [];
    for(const match in matches) {
      if(this.allowedQueues.some(queueId => queueId === matches[match].queue)) {
        const matchData = await getMatch(matches[match].gameId);
        const playerInfo = matchData.participants.find(participant =>
          participant.championId === matches[match].champion
        );
        championData[playerInfo.championId] ? championData[playerInfo.championId].push(playerInfo) : championData[playerInfo.championId] = [].concat([playerInfo]);
        matches[match].matchData = matchData;
        matches[match].participantInfo = playerInfo;
        newMatches.push(matches[match]);
      }
    };

    this.matches = newMatches;

    Object.keys(championData).forEach(champ => {
      let wins = 0;
      let kills = 0;
      let deaths = 0;
      let assists = 0;
      let visionScore = 0;
      let properMatches = 0;
      championData[champ].forEach((match) => {
        if(match.stats.champLevel > 6) {
          assists += match.stats.assists;
          kills += match.stats.kills;
          deaths += match.stats.deaths;
          visionScore += match.stats.visionScore;
          wins += match.stats.win ? 1 : 0;
          properMatches++;
        }

      });
      if(properMatches) {
        mergedChampionData.push({
          name: window.champList[champ].name,
          wins: wins / properMatches,
          kills: kills / properMatches,
          deaths: deaths / properMatches,
          assists: assists / properMatches,
          visionScore: visionScore / properMatches,
          gamesPlayed: properMatches
        });
      }
    });

    return mergedChampionData.sort((a, b) => {
      return b.wins - a.wins
    });
  }

  selectMatch(event) {
    const gameData = this.matches.find(match => match.gameId === Number(event.currentTarget.id));
    const matchEvent = new CustomEvent('match', {
      detail: {
        gameId: event.currentTarget.id,
        gameData
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(matchEvent);
  }

  render() {
    return html`
      <h2>${this.playerName}</h2>
      <div class="position"><img src="./../assets/ranked-positions/Position_Gold-${this.player.position}.png"> </div>
      ${this.loading ? html`
        <img class="loading" src="./../assets/load01.gif">
      ` : html`
        <div class="ranks">
          ${this.rankList.map(rank => html`
          <div>${rankEnum[rank.queueType]}</div>
          <div>
            <img src="./../assets/ranked-emblems/Emblem_${rank.tier}.png"> ${rank.rank}
          </div>    
        `)}
        </div>
        ${this.champMasteryList.map(champ => html`
          <champion-mastery .champion=${champ}></champion-mastery>
        `)}
        <hr />
        ${this.top10champs.map(champ => html`
          <champion-stats .champion=${champ}></champion-stats>
        `)}
        <hr />
        ${this.matches.map(match => {
          return html`
          <div class="match" id=${match.gameId} @click=${this.selectMatch} ?clash=${match.queue === 700}>
            <img src="./../assets/champion/${window.champList[match.champion].name.replace(/\s/g, '')}.png">
            ${match.lane !== 'NONE' ? html`<img src="./../assets/ranked-positions/Position_Gold-${match.lane}.png">` : html`<img src="./../assets/lunar_revel2019_pig.png">`}
            <div>${match.participantInfo.stats.win ? 'Won' : 'Lost'}</div>
            <div>${match.participantInfo.stats.kills} / ${match.participantInfo.stats.deaths} / ${match.participantInfo.stats.assists}</div>
          </div>

        `})}
      `}
    `;
  }
}

customElements.define('league-player', LeaguePlayer);
