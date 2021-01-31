import { LitElement, html, css } from 'lit-element';

export class PlayerChampion extends LitElement {
  static get properties() {
    return {
      players: { type: Object },
      champs: { type: Object },
      chosenChamps: { type: Object }
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        max-width: 90vw;
        width: 1200px;
        background-color: #a2a2a2;
        padding: 20px;
        border-radius: 20px;
      }

      img {
        height: 50px;
      }

      select {
        height: 34px;
        border-radius: 5px;
        padding: 5px;
      }
    `
  }

  async connectedCallback() {
    super.connectedCallback();

    this.chosenChamps = this.champs;
  }

  handleClick(champ) {
    const player = this.shadowRoot.getElementById('addPlayer').value;
    const list = this.shadowRoot.getElementById('champList').value;

    const pickEvent = new CustomEvent('pick-champ', {
      detail: {
        player,
        list,
        champ
      },
      bubbles: true 
    });
    this.dispatchEvent(pickEvent);
  }

  filterChamps() {
    const searchValue = this.shadowRoot.getElementById('search').value;
    this.chosenChamps = this.champs.filter(champName => champName.toLowerCase().includes(searchValue.toLowerCase()));
  }

  closeOverlay() {
    const closeEvent = new CustomEvent('close-it', { bubbles: true });
    this.dispatchEvent(closeEvent);
  }

  render() {
    return html`
      <div class="champions">
        <select id="addPlayer">
          ${this.players && this.players.map(player => html`
            <option value=${player}>${player}</option>
          `)}
        </select>
        <select id="champList">
          <option value="main">Main</option>
          <option value="learning">Learning</option>
        </select>
        <button style="float: right" @click=${this.closeOverlay}>X</button>
        <input id="search" placeholder="search" @keydown=${this.filterChamps}/>
        <div style="padding-top: 10px">
        ${this.chosenChamps && this.chosenChamps.map(champName => html`
          <img src="./../assets/champion/${champName.replace(/\s/g, '')}.png" 
          @click=${() => this.handleClick(champName)}>
        `)}
        </div>
      </div>
    `;
  }
}

customElements.define('player-champion', PlayerChampion);
