import { LitElement, html, css } from 'lit-element';

export class ChampionMastery extends LitElement {
  static get properties() {
    return {
      champion: { type: Object },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: flex-start;
      }

      img {
        height: 50px;
        border-radius: 25px;
      }
    `
  }

  render() {
    return html`
      <img src="./../assets/champion/${window.champList[this.champion.championId].name.replace(/[\'\s]/g, '')}.png">
      <div style="margin-left: 20px">
        <div>Level: ${this.champion.championLevel}</div>
        <div>Days ago played: ${Math.round((new Date() - this.champion.lastPlayTime) / (1000*60*60*24))}</div>
      </div>   
    `;
  }
}

customElements.define('champion-mastery', ChampionMastery);
