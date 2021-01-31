import { LitElement, html, css } from 'lit-element';
import { getDetailedMatch } from './../util/api';

export class MatchData extends LitElement {
  static get properties() {
    return {
      match: { type: Object },
      playerInfo: { type: Object },
      mainFocus: { type: String },
      mainDeaths: { type: String },
    };
  }

  static get styles() {
    return css`
      img {
        height: 40px; 
      }
      
      .player-info {
        display: flex;
      }

      .player {
        margin-right: 20px;
      }
    `
  }

  async connectedCallback() {
    console.log('doit');
    super.connectedCallback();

    this.playerInfo = this.match.participantInfo;
    this.opposingTeamInfo = this.playerInfo.teamId === 100 ? this.match.matchData.teams[1] : this.match.matchData.teams[0];
    this.teamInfo = this.playerInfo.teamId === 100 ? this.match.matchData.teams[0] : this.match.matchData.teams[1];
    this.teamMembers = this.playerInfo.teamId === 100 ? this.match.matchData.participants.splice(0, 5) : this.match.matchData.participants.splice(5, 10);

    this.detailedMatchData = await getDetailedMatch(this.match.gameId);
    this.kills = [];
    this.deaths = [];
    this.topLaneKills = [];
    this.topLaneDeaths = [];
    this.midLaneKills = [];
    this.midLaneDeaths = [];
    this.botLaneKills = [];
    this.botLaneDeaths = [];
    this.detailedMatchData.frames.forEach(frame => {
      if(frame.timestamp < 900000) {
        frame.events.forEach(event => {
          if(event.type === 'CHAMPION_KILL') {
            if(this.playerInfo.teamId === 100) {
              if(event.killerId < 6) {
                this.kills.push(event);
                if(this.determineKillLane(event) === 'TOP') {
                  this.topLaneKills.push(event);
                }
                if(this.determineKillLane(event) === 'MID') {
                  this.midLaneKills.push(event);
                }
                if(this.determineKillLane(event) === 'BOT') {
                  this.botLaneKills.push(event);
                }
              } else {
                this.deaths.push(event);
                if(this.determineKillLane(event) === 'TOP') {
                  this.topLaneDeaths.push(event);
                }
                if(this.determineKillLane(event) === 'MID') {
                  this.midLaneDeaths.push(event);
                }
                if(this.determineKillLane(event) === 'BOT') {
                  this.botLaneDeaths.push(event);
                }
              }
            } else {
              if(event.killerId > 5) {
                this.kills.push(event);
                if(this.determineKillLane(event) === 'TOP') {
                  this.topLaneKills.push(event);
                }
                if(this.determineKillLane(event) === 'MID') {
                  this.midLaneKills.push(event);
                }
                if(this.determineKillLane(event) === 'BOT') {
                  this.botLaneKills.push(event);
                }
              } else {
                this.deaths.push(event);
                if(this.determineKillLane(event) === 'TOP') {
                  this.topLaneDeaths.push(event);
                }
                if(this.determineKillLane(event) === 'MID') {
                  this.midLaneDeaths.push(event);
                }
                if(this.determineKillLane(event) === 'BOT') {
                  this.botLaneDeaths.push(event);
                }
              }
            }
          }
        });
      }
    });

    this.drawMap(this.topLaneKills, 'green');
    this.drawMap(this.topLaneDeaths, 'red');
    this.drawMap(this.midLaneKills, 'cyan');
    this.drawMap(this.midLaneDeaths, 'orange');
    this.drawMap(this.botLaneKills, 'blue');
    this.drawMap(this.botLaneDeaths, 'yellow');

    const percentageTopKills = (this.topLaneKills.length * 100) / this.kills.length;
    const percentageTopDeaths = (this.topLaneDeaths.length * 100) / this.deaths.length;
    const percentageMidKills = (this.midLaneKills.length * 100) / this.kills.length;
    const percentageMidDeaths = (this.midLaneDeaths.length * 100) / this.deaths.length;
    const percentageBotKills = (this.botLaneKills.length * 100) / this.kills.length;
    const percentageBotDeaths = (this.botLaneDeaths.length * 100) / this.deaths.length;

    this.determineMainFocus(percentageTopKills, percentageMidKills, percentageBotKills);
    this.determineMainDeaths(percentageTopDeaths, percentageMidDeaths, percentageBotDeaths);
  }

  determineMainFocus(top, mid, bot) {
    if(top > 50) {
      this.mainFocus = 'Top';
    } else if (mid > 50) {
      this.mainFocus = 'Mid';
    } else if (bot > 50) {
      this.mainFocus = 'Bot';
    } else {
      this.mainFocus = 'nowhere';
    }
  }

  determineMainDeaths(top, mid, bot) {
    if(top > 50) {
      this.mainDeaths = 'Top';
    } else if (mid > 50) {
      this.mainDeaths = 'Mid';
    } else if (bot > 50) {
      this.mainDeaths = 'Bot';
    } else {
      this.mainDeaths = 'nowhere';
    }
  }

  determineKillLane(kill) {
    if(kill.position.y > 10000 && kill.position.x < 5000) {
      return 'TOP';
    } else if(5000 < kill.position.y && kill.position.y < 10000 && 5000 < kill.position.x && kill.position.x < 10000) {
      return 'MID';
    } else if(kill.position.y < 5000 && kill.position.x > 10000) {
      return 'BOT';
    } else {
      return 'JUNGLE';
    }
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    const canvas = this.shadowRoot.getElementById(`map-${this.match.gameId}`);
    if(canvas) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      this.ctx = ctx;
      img.onload = function() {
        ctx.drawImage(img, 0, 0, 750, 750);
      }
  
      img.src = './../assets/opgg_map.png';
    }
  }


  drawMap(points, colour) {
    this.ctx.fillStyle = colour;

    points.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.position.x / 20, 750 - (point.position.y / 20), 5, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  renderMap() {
    return html`
      <canvas id="map-${this.match.gameId}" width="750" height="750"></canvas>`;
  }

  renderData() {
    return html`
    <div class="game-info">
      <h3>Game info:</h3>
      <p>${this.playerInfo.stats.win ? 'Won' : 'Lost'}</p>
      <p>Duration: ${Math.round(this.match.matchData.gameDuration / 60)} minutes</p>
      <p>Bans</p>
      ${this.opposingTeamInfo.bans.map(ban => html`
        <img src="./../assets/champion/${window.champList[ban.championId].name.replace(/\s/g, '')}.png">
      `)}
    </div>

      <h3>Players info:</h3>
      <div class="player-info">
      ${this.teamMembers.map(player => html`
        <div class="player">
          <img src="./../assets/champion/${window.champList[player.championId].name.replace(/\s/g, '')}.png">
          ${player.timeline.lane !== 'NONE' ? html`<img src="./../assets/ranked-positions/Position_Gold-${player.timeline.lane}.png">` : html`<img src="./../assets/lunar_revel2019_pig.png">`}
          <p>${this.match.matchData.participantIdentities[player.participantId - 1].player.summonerName}</p>
          <div>${player.stats.kills} / ${player.stats.deaths} / ${player.stats.assists}</div>
          <p>Vision score: ${player.stats.visionScore}</p>
          <p>Wards placed: ${player.stats.wardsPlaced}</p>
          <p>Wards killed: ${player.stats.wardsKilled}</p>
        </div>
      `)}  
    </div>
    <div class="team-info">
      <h3>Team info:</h3>
      <p>${this.teamInfo.firstBlood ? 'Team got first blood' : 'Team did not get first blood'}</p>
      <p>${this.teamInfo.firstTower ? 'Team got first tower' : 'Team did not get first tower'}</p>
      <p>Dragonkills: ${this.teamInfo.dragonKills} - ${this.opposingTeamInfo.dragonKills}</p>
      <p>Baronkills: ${this.teamInfo.baronKills} - ${this.opposingTeamInfo.baronKills}</p>
      <p>
        The main focus of the team was ${this.mainFocus}.
      </p>
      <p>
        The main deaths of the team were ${this.mainDeaths}.
      </p>
    </div>
`;
  }

  render() {
    return html`${
      this.renderData()
    }${this.renderMap()}
    `;
  }
}



customElements.define('match-data', MatchData);
