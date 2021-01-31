import { LitElement, html, css } from 'lit-element';

export class MatchData extends LitElement {
  static get properties() {
    return {
      match: { type: Object },
      championID: { type: String },
      playerInfo: { type: Object },
      kills: { type: Object },
    };
  }

  static get styles() {
    return css``
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async connectedCallback() {
    super.connectedCallback();

    this.matchData = await axios.get(`https://euw1.api.riotgames.com/lol/match/v4/matches/${this.match.gameId}?api_key=RGAPI-2420679e-1a94-41c5-9625-2484f1a36e05`);
    this.playerInfo = this.matchData.data.participants.find(participant =>
      participant.championId === this.match.champion
    );
    this.opposingTeamInfo = this.playerInfo.teamId === 100 ? this.matchData.data.teams[1] : this.matchData.data.teams[0];
    this.teamInfo = this.playerInfo.teamId === 100 ? this.matchData.data.teams[0] : this.matchData.data.teams[1];

    this.detailedMatchData = await axios.get(`https://euw1.api.riotgames.com/lol/match/v4/timelines/by-match/${this.match.gameId}?api_key=RGAPI-2420679e-1a94-41c5-9625-2484f1a36e05`);
    await this.sleep(1000);
    this.kills = [];
    this.deaths = [];
    this.detailedMatchData.data.frames.forEach(frame => {
      frame.events.forEach(event => {
        if(event.type === 'CHAMPION_KILL') {
          if(this.playerInfo.teamId === 100) {
            if(event.killerId < 6) {
              this.kills.push(event);
            } else {
              this.deaths.push(event);
            }
          } else {
            if(event.killerId > 5) {
              this.kills.push(event);
            } else {
              this.deaths.push(event);
            }
          }
        }
      });
    });
    this.drawMap(this.kills, 'green');
    this.drawMap(this.deaths, 'red');
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    const canvas = this.shadowRoot.getElementById('map');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    this.ctx = ctx;
    img.onload = function() {
      ctx.drawImage(img, 0, 0, 750, 750);
    }

    img.src = './../../opgg_map.png';
  }


  drawMap(points, colour) {
    this.ctx.fillStyle = colour;

    console.log(points);
    points.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.position.x / 20, 750 - (point.position.y / 20), 5, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  render() {
    return html`
      <hr/>
      <canvas id="map" width="750" height="750"></canvas>
    `;
  }
}

customElements.define('match-data', MatchData);
