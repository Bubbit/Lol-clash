import { LitElement, html, css } from 'lit-element';

export class MatchBans extends LitElement {
  static get properties() {
    return {
      chosenChamps: { type: Object },
      round1Bans: { type: Object },
      round2Bans: { type: Object },
    };
  }

  static get styles() {
    return css`
      img {
        height: 50px;
      }
    `
  }

  async connectedCallback() {
    super.connectedCallback();

    const championData = await axios.get('https://ddragon.leagueoflegends.com/cdn/10.23.1/data/en_US/champion.json');
    this.originalChamps = championData.data.data;
    this.champs = Object.keys(this.originalChamps);
    this.chosenChamps = this.champs;

    this.round1Bans = [];
    this.round2Bans = [];
  }

  addBan(champion) {
    if(this.round1Bans.length < 3) {
      this.round1Bans.push(champion);
    } else {
      this.round2Bans.push(champion);
    }
    this.chosenChamps = this.chosenChamps.filter(champName => champName !== champion);
    this.champs = this.champs.filter(champName => champName !== champion);
    this.requestUpdate();
  }

  removeBan(champion) {
    this.round1Bans = this.round1Bans.filter(champName => champName !== champion);
    this.round2Bans = this.round2Bans.filter(champName => champName !== champion);
    this.chosenChamps.push(champion);
    this.champs.push(champion);
    this.chosenChamps.sort();
    this.champs.sort();
  }

  filterChamps() {
    const searchValue = this.shadowRoot.getElementById('search').value;
    this.chosenChamps = this.champs.filter(champName => champName.toLowerCase().includes(searchValue.toLowerCase()));
  }

  render() {
    return html`
      <div>
        <h3>Round 1</h3>
        ${this.round1Bans.map(champName => html`
          <img src="./../assets/champion/${champName.replace(/\s/g, '')}.png" @click=${() => this.removeBan(champName)}>
        `)}
      </div>
      <div>
        <h3>Round 2</h3>
      ${this.round2Bans.map(champName => html`
          <img src="./../assets/champion/${champName.replace(/\s/g, '')}.png" @click=${() => this.removeBan(champName)}>
        `)}
      </div>
      <input id="search" placeholder="search" @keydown=${this.filterChamps}/>
      <div class="champions">
        ${this.chosenChamps.map(champName => html`
          <img src="./../assets/champion/${champName.replace(/\s/g, '')}.png" @click=${() => this.addBan(champName)}>
        `)}
      </div>
    `;
  }
}

customElements.define('match-bans', MatchBans);
