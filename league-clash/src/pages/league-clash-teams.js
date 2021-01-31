import { LitElement, html, css } from 'lit-element';
import '@lion/accordion/lion-accordion.js';
import '@lion/dialog/lion-dialog.js';
import './../components/player-champion';

export class LeagueClashTeams extends LitElement {
  static get properties() {
    return {
      players: { type: Object },
      filteredChamps: { type: Object },
      team: { type: String },
      comps: { type: Object }
    };
  }

  static get styles() {
    return css`
      h1 {
        padding: 0 10px;
        font-family: Segoe UI Italic;
      }

      img {
        height: 45px;
      }

      #container {
        display: flex;
        justify-content: space-around;
      }

      .players-col {
        width: 40%;
        border: 1px solid white;
      }

      .comps-col {
        width: 40%;
        border: 1px solid white;
      }

      .champs-col {
        width: 20%;
        border: 1px solid white;
      }

      .styled-select {
        background-color: black;
      }

      .comps {
      }

      .player-header {
        border-bottom: 1px solid #8C6834;
        font-size: 21pt;
        display: flex;
        height: 45px;
        align-items: center;
        align-content: flex-start;
      }

      .player-header > div {
        flex-grow: 1;
      }

      .player-header img {
        height: 18px;
        width: 18px;
      }

      .player-champs { 
        display: flex;
        height: 45px;
        align-content: flex-start;
      }

      .player-champs > div {
        height: 45px;
        font-family: Segoe UI Italic;
        flex-grow: 1;
        display: inline-flex;
        align-items: center;
      }

      .comps-header {
        padding: 12px;
      }

      .comp-champs {
        padding: 12px;
      }

      lion-dialog {
        padding-left: 12px;
      }

      .comps {
        padding: 12px;
      }

      .champions {
        padding: 12px;
      }

      .comp {
      }

      .comp h3 {
        text-align: center;
      }

      .draggable {
        height: 50px;
      }

      .add-members {
        padding: 0 10px;
      }

      #add-member {
        width: 210px;
      }

      .players {
        display: flex;
        justify-content: space-between;
      }
      
      .player {
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

      lion-accordion h4 {
        padding: 12px;
      }

      lion-accordion p {
        padding: 12px;
      }

      lion-dialog img {
        height: 50px;
      }
    `
  }

  addMember() {
    const playerName = this.shadowRoot.getElementById('add-member').value;
    const playerRole = this.shadowRoot.getElementById('role').value;
    window.database.ref(`${this.team}/${playerName}`).set({
      playerName: playerName,
      role: playerRole,
      mainChamps : [],
      learningChamps : [],
    });
  }
  
  addChamp(event) {
    const { player, champ, list } = event.detail;
    const playerInfo = this.playersData[player];

    if(list === 'main') {
      if(!(playerInfo.mainChamps && playerInfo.mainChamps.some(champName => champName === champ))) {
        const newChamps = playerInfo.mainChamps ? playerInfo.mainChamps.concat([champ]) : [champ];
        window.database.ref(`${this.team}/${player}`).update({
          mainChamps : newChamps
        });
      }
    } else {
      if(!(playerInfo.learningChamps && playerInfo.learningChamps.some(champName => champName === champ))) {
        const newChamps = playerInfo.learningChamps ? playerInfo.learningChamps.concat([champ]) : [champ];
        window.database.ref(`${this.team}/${player}`).update({
          learningChamps : newChamps
        });
      }
    }
  }

  addComp() {
    const comp = this.shadowRoot.getElementById('addComp').value;
    window.database.ref(`${this.team}_comps/${comp}`).set({
      top: [],
      jungle: [],
      mid: [],
      bot: [],
      support: [],
      name: comp
    });
  }

  addChampToComp(event) {
    event.preventDefault();
    const champ = event.dataTransfer.getData("text");
    const data = event.target.id.split('-');
    const compInfo = this.compsData[data[0]];
    if(compInfo && !(compInfo[data[1]] && compInfo[data[1]].some(champName => champName === champ))) {
      const newChamps = compInfo[data[1]] ? compInfo[data[1]].concat([champ]) : [champ];
      const update = {}
      update[data[1]] = newChamps
      window.database.ref(`${this.team}_comps/${data[0]}`).update(update);
    }
  }

  removeChampFromComp(champ, comp, event, role) {
    const compInfo = this.compsData[comp];
    if(event.button) {
      if(compInfo[role] && compInfo[role].some(champName => champName === champ)) {
        const newChamps = compInfo[role].filter(champName => champ !== champName);
        const update = {}
        update[role] = newChamps
        window.database.ref(`${this.team}_comps/${comp}`).update(update);
      }
    }
  }

  changeChamp(player, champ, list, event) {
    const playerInfo = this.playersData[player];
    if(list === 'main') {
      console.log(event);
      if(event.button) {
        if(playerInfo.mainChamps && playerInfo.mainChamps.some(champName => champName === champ)) {
          const newChamps = playerInfo.mainChamps.filter(champName => champ !== champName);
          window.database.ref(`${this.team}/${player}`).update({
            mainChamps : newChamps
          });
        }
      }
    } else {
      if(event.button) {
        if(playerInfo.learningChamps && playerInfo.learningChamps.some(champName => champName === champ)) {
          const newChamps = playerInfo.learningChamps.filter(champName => champ !== champName);
          window.database.ref(`${this.team}/${player}`).update({
            learningChamps : newChamps
          });
        }
      } else {
        if(!(playerInfo.mainChamps && playerInfo.mainChamps.some(champName => champName === champ))) {
          const newChamps = playerInfo.mainChamps ? playerInfo.mainChamps.concat([champ]) : [champ];
          window.database.ref(`${this.team}/${player}`).update({
            mainChamps : newChamps
          });
        }
        if(playerInfo.learningChamps && playerInfo.learningChamps.some(champName => champName === champ)) {
          const newChamps = playerInfo.learningChamps.filter(champName => champ !== champName);
          window.database.ref(`${this.team}/${player}`).update({
            learningChamps : newChamps
          });
        }
      }
    }
  }

  onDragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  filterChamps() {
    const searchValue = this.shadowRoot.getElementById('search').value;
    this.filteredChamps = this.champs.filter(champName => champName.toLowerCase().includes(searchValue.toLowerCase()));
  }

  async connectedCallback() {
    this.addEventListener('contextmenu', event => event.preventDefault());
    super.connectedCallback();

    this.team = window.location.pathname.split('/')[2];
    const teamRef = window.database.ref(`${this.team}`);
    teamRef.on('value', (snapshot) =>{
      this.playersData = snapshot.val();
      this.players = this.playersData ? Object.keys(this.playersData) : [];
    });

    const teamCompRef = window.database.ref(`${this.team}_comps`);
    teamCompRef.on('value', (snapshot) =>{
      this.compsData = snapshot.val();
      this.comps = this.compsData ? Object.keys(this.compsData) : [];
    });

    const championData = await axios.get('https://ddragon.leagueoflegends.com/cdn/10.23.1/data/en_US/champion.json');
    this.originalChamps = championData.data.data;
    this.champs = Object.keys(this.originalChamps);
    this.filteredChamps = this.champs;
  }

  render() {
    return html`
      <h4>Team</h4>
      <div id="container">
        <div class="players-col">
          <h1>${this.team}</h1>
          <div class="add-members";>
            <input id="add-member" placeholder="Add Member">
            <select id="role" class="styled-select">
              <option value="Top">Top</option>
              <option value="Jungle">Jungle</option>
              <option value="Mid">Mid</option>
              <option value="Bot">Bot</option>
              <option value="Support">Support</option>
            </select>
            <button @click=${this.addMember}>Add</button>
          </div>
          ${this.players && this.players.map(player => html`
            <div class="player-header">
              <div>${this.playersData[player].playerName}</div>
              <div><img class="role" src="./../assets/positions/${this.playersData[player].role}_Icon.png"/></div>
              <div></div>
              <div><img class="role" src="./../assets/positions/${this.playersData[player].role}_Icon.png"/></div>
            </div>
            <div class="player-champs">
              <div>Primary Role:</div>
              <div>
              ${this.playersData[player].mainChamps && this.playersData[player].mainChamps.map(champ => html`
                <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${(event) => this.changeChamp(player, champ, 'main', event)}>
              `)}
              </div>
              <div>Learning:</div>
              <div>
              ${this.playersData[player].learningChamps && this.playersData[player].learningChamps.map(champ => html`
                <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${(event) => this.changeChamp(player, champ, 'learning', event)}>
              `)}
              </div>
            </div>

          `)}
        </div>
        <div class="comps-col">
          <div class="comps-header">
            <h2>Comps</h2>
            <input id="addComp" placeholder="Add Comp"/>
            <button @click=${this.addComp}>Add Comp</button>
          </div>
          <div class="comps">
            ${this.comps && this.comps.map(comp => html`
              <div class="comp" id=${comp}>
                <span>${this.compsData[comp].name}</span>
                <img src="./../assets/ranked-positions/Position_Grandmaster-Top.png"/>
                <img src="./../assets/ranked-positions/Position_Grandmaster-Jungle.png"/>
                <img src="./../assets/ranked-positions/Position_Grandmaster-Mid.png"/>
                <img src="./../assets/ranked-positions/Position_Grandmaster-Bot.png"/>
                <img src="./../assets/ranked-positions/Position_Grandmaster-Support.png"/>
                <div id="${comp}-top" class="role" @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].top && this.compsData[comp].top.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${(event) => this.removeChampFromComp(champ, comp, event, 'top')}>
                  `)}
                </div>
                <div id="${comp}-jungle" class="role" @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].jungle && this.compsData[comp].jungle.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${(event) => this.removeChampFromComp(champ, comp, event, 'jungle')}>
                  `)}
                </div>
                <div id="${comp}-mid" class="role" @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].mid && this.compsData[comp].mid.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${(event) => this.removeChampFromComp(champ, comp, event, 'mid')}>
                  `)}
                </div>
                <div id="${comp}-bot" class="role" @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].bot && this.compsData[comp].bot.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${(event) => this.removeChampFromComp(champ, comp, event, 'bot')}>
                  `)}
                </div>
                <div id="${comp}-support" class="role" @drop=${this.addChampToComp} @dragover=${this.allowDrop}>
                  ${this.compsData[comp].support && this.compsData[comp].support.map(champ => html`
                    <img src="./../assets/champion/${champ.replace(/\s/g, '')}.png" @click=${(event) => this.removeChampFromComp(champ, comp, event, 'support')}>
                  `)}
                </div>
              </div>
            `)}
          </div>
        </div>
        <div class="champs-col">
          <h4>Drag & drop to add</h4>
          <input id="search" placeholder="search" @keydown=${this.filterChamps}/>
          ${this.filteredChamps && this.filteredChamps.map(champName => html`
            <img draggable="true" class="draggable" src="./../assets/champion/${champName.replace(/\s/g, '')}.png" id=${champName} @dragstart=${this.onDragStart}>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('league-clash-teams', LeagueClashTeams);
