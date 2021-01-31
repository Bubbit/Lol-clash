const fetch = require('node-fetch');
let hrstart = process.hrtime()

const run = async () => {
  let i = 0;
  while (i < 110) {
    console.log(i);
      const summonerData = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/bubbit?api_key=RGAPI-0eb9e6db-b4e5-43ea-94d0-739522edee4d`).then(res => res.json())
      console.log(summonerData);
      if(summonerData?.status) {
        console.log(summonerData.status);
      } else {
        i++;
      }
  }

  let hrend = process.hrtime(hrstart);
  console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
}

run();