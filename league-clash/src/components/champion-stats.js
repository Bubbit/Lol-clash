import { LitElement, html, css } from 'lit-element';

export class ChampionStats extends LitElement {
  static get properties() {
    return {
      champion: { type: Object },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
      }

      img {
        height: 50px;
        border-radius: 25px;
      }

      .stats {
        display: flex;
        text-align: center;
      }

      .stats > div {
        padding: 2px;
      }
    `
  }

  render() {
    return html`
      <img src="./../assets/champion/${this.champion.name.replace(/\s/g, '')}.png">
      <div class="stats">
        <div>Win: <br />${Math.round((this.champion.wins + Number.EPSILON) * 100)}%</div>
        <div>Games: <br />${this.champion.gamesPlayed}</div>
        <div>K/D/A: <br />${Math.round((this.champion.kills + Number.EPSILON) * 100) / 100} / ${Math.round((this.champion.deaths + Number.EPSILON) * 100) / 100} / ${Math.round((this.champion.assists + Number.EPSILON) * 100) / 100}</div>
        <div>Vision: <br />${Math.round((this.champion.visionScore + Number.EPSILON) * 100) / 100}</div>
      </div>
    `;
  }
}

customElements.define('champion-stats', ChampionStats);
