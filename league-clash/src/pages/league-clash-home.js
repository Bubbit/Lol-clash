import { LitElement, html, css } from 'lit-element';
import './../components/match-bans';

export class LeagueClashHome extends LitElement {
  static get properties() {
    return {
      champion: { type: Object },
    };
  }

  static get styles() {
    return css`
      .hero {
        margin: 0px;
        padding: 0px;
        width: calc(100vw);
        height: calc(100vh - 45px);

        display: flex;
        justify-content: center;
        align-items: center;

        text-align: center;

        background-image: url(./../assets/league_clash2020.jpg);
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        background-attachment: fixed;
      }

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
    `
  }

  render() {
    return html`
      <div class="hero">
        <div>
          <h1>Virtual Gamer House</h1>
          <h2>Clash website</h2>
        </div>
      </div>
    `;
  }
}

customElements.define('league-clash-home', LeagueClashHome);
