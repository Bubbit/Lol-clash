import { LitElement, html, css } from 'lit-element';
import '@lion/accordion/lion-accordion.js';
import './champion-mastery';
import './champion-stats.js';
import './match-data';
import { 
  darkGrey,
  gold,
  grey,
  offWhite,
} from './../colors';
import { getSummonerByID, getMasteryData, getMatches, getRanks, getMatch } from './../util/api';

const rankEnum = {
  RANKED_FLEX_SR: 'Flex',
  RANKED_SOLO_5x5: 'Solo'
}

export class LeaguePlayer extends LitElement {
  static get properties() {
    return {
      player: { type: String }
    };
  }

  static get styles() {
    return css`
    :host { 
      text-align: center;
    }

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

    .submit {
      margin: 5px auto;
    }

    .match[clash] {
      background-color: ##b77803;
    }

    button {
      height: 34px;
      border-radius: 5px;
      padding: 5px 15px;
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

  loadOPGG() {
    const matchEvent = new CustomEvent('opgg', {
      detail: {
        playerName: this.player.playerName
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(matchEvent);
  }

  render() {
    return html`
      <h2>${this.player.playerName}</h2>
      <div class="position">
        <img src="./../assets/positions/${this.player.position}_Icon.png">
      </div>
      <button class="submit" @click=${this.loadOPGG}>Load OPGG</button>
    `;
  }
}

customElements.define('league-player', LeaguePlayer);
