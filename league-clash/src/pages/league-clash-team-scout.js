import { LitElement, html, css } from 'lit-element';
import './../components/match-bans';
import '@lion/form/lion-form.js';
import '@lion/input/lion-input.js';
import '@lion/fieldset/lion-fieldset.js';
import '@lion/button/lion-button.js';
import './../components/player-new';
import './../components/match-data';
import { Required } from '@lion/form-core';
import { sendClashTeams, getClashAnalysis, updateClashTeam, deleteClashTeam } from './../util/api';

export class LeagueClashTeamScout extends LitElement {
  static get properties() {
    return {
      selectedTeam: { type: Object },
      opponents: { type: Object },
      team: { type: String },
      comps: { type: Object },
      selectedMatch: { type: Object }
    };
  }

  static get styles() {
    return css`
      img {
        display: flex;
        height: 50px;
        margin: auto;
        border-radius: 25px;
        border: 1px solid #8C6834;
      }

      #clash-opponents {
        display: flex;
        border-bottom: 3px solid #8C6834;
      }

      #clash-opponents > div {
        margin: 0 5px;
      }

      #selected-team {
        display: flex;
      }

      #selected-team > league-player-2 {
        width: 20%;
      }

      lion-form {
        padding-top: 20px;
        width: 300px;
        margin: auto;
      }

      .submit {
        background-color: #1F2335;
        border: 1px solid #8C6834;
        margin: auto;
      }
    `;
  }

  async connectedCallback() {
    super.connectedCallback();

    this.team = window.location.pathname.split('/')[2];
    console.log(this.team);
    const teamRef = window.database.ref(`${this.team}/opponents`);
    teamRef.on('value', (snapshot) =>{
      this.opponents = snapshot.val();
    });
  }

  constructor() {
    super();

    this.addEventListener('match', (event) => {
      console.log('event');
      this.selectedMatch = false;
      this.requestUpdate();

      console.log(event);
      setTimeout(() => {
        this.selectedMatch = event.detail.gameData;
        this.requestUpdate();
      });
    });
  }

  async _onSubmit() {
    const fieldSet = this.shadowRoot.querySelector('#teamsFieldSet');
    const validationErrors = fieldSet && fieldSet.validationStates && fieldSet.validationStates.error;
    const invalid = validationErrors && Object.keys(validationErrors).length;
    if(!invalid) {
      const formModelValue = fieldSet.modelValue;
      await sendClashTeams('pizzaTime', formModelValue);
    }
  }

  async _updateSelectedTeam() {
    await updateClashTeam(this.team, this.selectedTeam.name);
    this._getAnalysis(this.selectedTeam.name, this.selectedTeam);
  }

  async _deleteOpponents() {
    if (window.confirm("Do you really want to delete the opponents?")) {
      Object.keys(this.opponents).forEach((opponent) => {
        deleteClashTeam(this.team, this.opponents[opponent].name);
      })
    }
  }

  async _getAnalysis(squadName, selectedTeam) {
    console.log('get it')
    const analysis = await getClashAnalysis(this.team, squadName);
    selectedTeam.players.forEach((player) => player.analysis = analysis.find((playerAnalysis) => playerAnalysis.name === player.summoner.name));
    this.selectedTeam = selectedTeam;
    console.log(this.selectedTeam);
  }

  render() {
    return html`
    ${this.opponents ? 
      html`
      <div id="clash-opponents">
        ${Object.keys(this.opponents).map((opponent) => html`<div @click=${() => { this._getAnalysis(this.opponents[opponent].name, this.opponents[opponent])}}>
          <img src="http://ddragon.leagueoflegends.com/cdn/11.1.1/img/profileicon/${this.opponents[opponent].iconId}.png">
          <!-- <img src="http://ddragon.leagueoflegends.com/cdn/11.1.1/img/profileicon/683.png"> -->
          ${this.opponents[opponent].name}        
        </div>`)}
        <button @click=${this._deleteOpponents}>Delete all info</button>
      </div>
      ${this.selectedTeam ? html`
        <button @click=${this._updateSelectedTeam}>Update</button>
        <h3>${this.selectedTeam.name}</h3>
        <div id="selected-team">
          ${this.selectedTeam.players.map((player) => html`
            <league-player-2 .player=${player.summoner} .role=${player.role} .matches=${player.matches.details} .mastery=${player.mastery} .analysis=${player.analysis}></league-player-2>
          `)}
        </div>
        ${this.selectedMatch ?
          html`<div class="selectedMatch">
            <match-data .match=${this.selectedMatch}></match-data>
          </div>` : html``
        }
      ` : html`Please select an opponent`}
      `
      : html`
         <lion-form>
      <form>
        <lion-fieldset name="teams" id="teamsFieldSet">
          <lion-input
            name="team1"
            label="Team 1 player"
            .validators="${[new Required(null, { getMessage: () => 'Player name pls.' })]}"
          ></lion-input>
          <lion-input
            name="team2"
            label="Team 2 player"
            .validators="${[new Required(null, { getMessage: () => 'Player name pls.' })]}"
          ></lion-input>
          <lion-input
            name="team3"
            label="Team 3 player"
            .validators="${[new Required(null, { getMessage: () => 'Player name pls.' })]}"
          ></lion-input>
          <lion-input
            name="team4"
            label="Team 4 player"
            .validators="${[new Required(null, { getMessage: () => 'Player name pls.' })]}"
          ></lion-input>
          <lion-input
            name="team5"
            label="Team 5 player"
            .validators="${[new Required(null, { getMessage: () => 'Player name pls.' })]}"
          ></lion-input>
          <lion-input
            name="team6"
            label="Team 6 player"
            .validators="${[new Required(null, { getMessage: () => 'Player name pls.' })]}"
          ></lion-input>
          <lion-input
            name="team7"
            label="Team 7 player"
            .validators="${[new Required(null, { getMessage: () => 'Player name pls.' })]}"
          ></lion-input>
        </lion-fieldset>
        <lion-button class="submit" @click=${this._onSubmit}>Submit</lion-button>
      </form>
    </lion-form>
      `}
    `;

  }
}

customElements.define('league-clash-team-scout', LeagueClashTeamScout);
