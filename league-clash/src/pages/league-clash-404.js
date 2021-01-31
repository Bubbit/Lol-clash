import { LitElement, html, css } from 'lit-element';

export class LeagueClash404 extends LitElement {
  static get properties() {
    return {
      champion: { type: Object },
    };
  }

  static get styles() {
    return css``
  }

  render() {
    return html`
      <div>404</div>
    `;
  }
}

customElements.define('league-clash-404', LeagueClash404);
