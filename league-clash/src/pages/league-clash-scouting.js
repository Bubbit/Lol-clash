import { LitElement, html, css } from 'lit-element';
import './../components/player';
import './../components/match-data';
import './../components/match-bans';
import { getClashId, getClashTeam, getSummonerByName } from './../util/api';

const positionOrder = {
  TOP: 0,
  JUNGLE: 1,
  MIDDLE: 2,
  UNSELECTED: 3,
  UTILITY: 4
}

export class LeagueClashScouting extends LitElement {
  static get properties() {
    return {
      championMasteryDone: { type: Boolean },
      analysesDone: { type: Boolean },
      playerName1: { type: String },
      selectedMatch: { type: Object }
    };
  }

  static get styles() {
    return css`
      h1 {
        font-size: 80px;
        color: orange;
        -webkit-text-stroke: 2px black;
      }

      h2 {
        font-size: 60px;
        color: orange;
        -webkit-text-stroke: 2px black;
      }

      input {
        height: 20px;
        border-radius: 5px;
        padding: 5px;
      }

      select {
        height: 34px;
        border-radius: 5px;
        padding: 5px;
      }

      button {
        height: 34px;
        border-radius: 5px;
        padding: 5px 15px;
      }

      .search-box {
        display: flex;
        justify-content: center;
        padding: 20px;
      }

      .players {
        display: flex;
        justify-content: space-between;
      }

      league-player {
        width: 20%;
      }

      .selectedMatch {
        width: 750px;
        margin: 0 auto;
      }
    `
  }

  async getData() {
    this.playerName = this.shadowRoot.getElementById('player-name').value;

    const summonerData = await getSummonerByName(this.playerName);
    console.log(summonerData);
    const clashTeamID = await getClashId(summonerData.id);
    console.log(clashTeamID);
    this.clashTeam = await getClashTeam(clashTeamID[0].teamId);

    console.log(this.clashTeam);

    this.players = this.clashTeam.players.sort((player1, player2) => positionOrder[player1.position] - positionOrder[player2.position]);

    this.championMasteryDone = true;
    this.requestUpdate();
  }

  constructor() {
    super();

    this.addEventListener('match', (event) => {
      this.selectedMatch = false;
      this.requestUpdate();

      setTimeout(() => {
        this.selectedMatch = event.detail.gameData;
        this.requestUpdate();
      });
    });
  }

  render() {
    return html`
      ${this.players ? 
        html`
        <match-bans></match-bans>
        <h2 style="text-align: center;">${this.clashTeam.name}</h2>
        <div class="players">
          ${this.players.map(player => html`
            <league-player .player=${player}></league-player>
          `)}
        </div>
        ` : html`
      <div class="search-box">
        <input placeholder="Player" id="player-name"/>
        <button @click=${this.getData}>Analyse</button>
      </div>
      `} 
      </div>
      ${this.selectedMatch ?
        html`<div class="selectedMatch">
          <match-data .match=${this.selectedMatch}></match-data>
        </div>` : html``
      }
    `;
  }
}

customElements.define('league-clash-scouting', LeagueClashScouting);
