import { LitElement, html, css } from 'lit-element';
import './../components/player';
import './../components/match-data';
import './../components/match-bans';
import { 
  darkGrey,
  gold,
  grey,
  offWhite,
} from './../colors';
import { nothing } from '@lion/core';
import { ajax } from '@lion/ajax';

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
      players: { type: Object },
      selectedPlayerName: { type: String }
    };
  }

  static get styles() {
    return css`
      h1 {
        margin-top: 0px;
        padding: 0 10px;
        font-family: Segoe UI Italic;
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

      .submit {
        background-color: #1F2335;
        border: 1px solid #8C6834;
        margin: auto;
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

      iframe {
        width: 100%;
        height: 800px;
      }

      button {
        height: 34px;
        border-radius: 5px;
        padding: 5px 15px;
      }

      input {
        border: 0;
        height: 24px;
        width: 210px;
        background-color: ${darkGrey};
        border-radius: 0;
        color: ${offWhite};
        font-family: Segoe UI italic;
        padding: 5px;
      }

      input::placeholder {
        color: ${grey};
        font-family: Segoe UI italic;
      }
    `
  }

  constructor() {
    super();

    this.addEventListener('opgg', (event) => {
      this.selectedPlayerName = undefined;

      setTimeout(() => {
        this.selectedPlayerName = event.detail.playerName;
      });
    });
  }

  async getData() {
    const playerName = this.shadowRoot.getElementById('player-name').value;

    const result = await ajax.get(`https://uawjfhb1o5.execute-api.eu-west-2.amazonaws.com/default/lol-clash-roles?summonerName=${playerName}`);

    this.clashTeam = result.data;

    this.players = this.clashTeam.players.sort((player1, player2) => positionOrder[player1.position] - positionOrder[player2.position]);
  }

  render() {
    return html`
      ${this.players ? 
        html`
          <match-bans></match-bans>
          <h1 style="text-align: center;">${this.clashTeam.name}</h1>
          <div class="players">
            ${this.players.map(player => html`
              <league-player .player=${player}></league-player>
            `)}
          </div>
        ` : html`
          <div class="search-box">
            <input placeholder="Player" id="player-name"/>
            <button class=".submit" @click=${this.getData}>Search</button>
          </div>
      `} 
      ${this.selectedPlayerName ? 
        html`<iframe .src="https://euw.op.gg/summoner/userName=${this.selectedPlayerName}"></iframe>` : nothing 
      }
    `;
  }
}

customElements.define('league-clash-scouting', LeagueClashScouting);
