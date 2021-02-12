import { LitElement, html, css } from 'lit-element';
import '@lion/accordion/lion-accordion.js';
import './champion-mastery';
import './champion-stats.js';
import './match-data';

const rankEnum = {
  RANKED_FLEX_SR: 'Flex',
  RANKED_SOLO_5x5: 'Solo'
}

export class LeaguePlayer2 extends LitElement {
  static get properties() {
    return {
      player: { type: Object },
      role: { type: String },
      mastery: { type: Object },
      matches: { type: Object },
      analysis: { type: Object },
    };
  }

  static get styles() {
    return css`
    img {
      height: 30px;
    }

    h2 {
      text-align: center;
    }

    .top5 h4 {
      border-bottom: 1px solid #8C6834;
    }

    .top5 img {
      height: 30px;
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

  async connectedCallback() {
    super.connectedCallback();

    console.log(this.analysis);
  }

  selectMatch(event) {
    const gameData = this.matches.find(match => match.metadata.gameId === Number(event.currentTarget.id));
    const matchEvent = new CustomEvent('match', {
      detail: {
        gameId: event.currentTarget.id,
        gameData: gameData.details
      },
      bubbles: true,
      composed: true
    });
    console.log(matchEvent);
    this.dispatchEvent(matchEvent);
  }

  render() {
    console.log(this.player);
    return html`
      <h2>${this.player.name}</h2>
      <div class="position"><img src="./../assets/ranked-positions/PositionGold-${this.role}.png"></div>
      <div class="ranks">
      </div>
      <div>
        <div>${Math.round(this.analysis.statsOverall.winPercentage + Number.EPSILON)}%</div>
        <div>${Math.round((this.analysis.statsOverall.kda + Number.EPSILON) * 100) / 100} KDA</div>
        <div>${Math.round(((this.analysis.statsOverall.visionScore / this.analysis.statsOverall.total) + Number.EPSILON) * 100) / 100} Visionscore</div>
        <div>${Math.round(((this.analysis.statsOverall.creepScore / this.analysis.statsOverall.total) + Number.EPSILON) * 100) / 100} Creepscore</div>
      </div>
      <!-- top 5 -->
      <div class="top5">
        <h4>Top 5 picks (highest winrate)</h4>
        ${this.analysis.statsPerChampion.slice(0, 5).map((champ) => 
          html`
            <div>
              <img src="./../assets/champion/${window.champList[champ.id].name.replace(/[\'\s]/g, '')}.png">
              <span>${Math.round(champ.winRate + Number.EPSILON)}%</span>
              <span>${champ.total} game(s)</span>
            </div>
          `
        )}
      </div>
      <!-- top 5 loses -->
      <div class="top5">
        <h4>Top 5 nemesis (lowest winrate)</h4>
        ${this.analysis.statsOverall.against.slice(0, 5).map((champ) => 
          html`
            <div>
              <img src="./../assets/champion/${window.champList[champ.id].name.replace(/[\'\s]/g, '')}.png">
              <span>${Math.round(champ.winRate + Number.EPSILON)}%</span>
              <span>${champ.total} game(s)</span>
            </div>
          `
        )}
      </div>
      <hr />
      ${this.mastery.map(champ => html`
        <champion-mastery .champion=${champ}></champion-mastery>
      `)}
      <hr />
      ${this.matches.map(match => {
        return html`
        <div class="match" id=${match.metadata.gameId} @click=${this.selectMatch} ?clash=${match.metadata.queue === 700}>
         ${match.playerInfo.championId}
          <img src="./../assets/champion/${window.champList[match.playerInfo.championId].name.replace(/[\'\s]/g, '')}.png">
          ${match.lane !== 'NONE' ? html`<img src="./../assets/ranked-positions/PositionGold-${match.metadata.lane}.png">` : html`<img src="./../assets/lunar_revel2019_pig.png">`}
          <div>${match.playerInfo.stats.win ? 'Won' : 'Lost'}</div>
          <div>${match.playerInfo.stats.kills} / ${match.playerInfo.stats.deaths} / ${match.playerInfo.stats.assists}</div>
        </div>
      `})}
    `;
  }
}

customElements.define('league-player-2', LeaguePlayer2);
