import { Router } from '@vaadin/router';
import './pages/league-clash-home';
import './pages/league-clash-teams';
import './pages/league-clash-team-scout';
import './pages/league-clash-scouting';
import './pages/league-clash-404';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/database";

const getChampionData = async function() {
  const championData = await axios.get('https://ddragon.leagueoflegends.com/cdn/11.4.1/data/en_US/champion.json');
  for(const entry in championData.data.data) {
    championData.data.data[championData.data.data[entry].key] = championData.data.data[entry]
  };
  return championData.data.data;
}

const setup = async function() {
  const outlet = document.getElementById('outlet');
  const router = new Router(outlet);


  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  window.database = firebase.database();
  
  router.setRoutes([
    {path: '/', component: 'league-clash-home'},
    {path: '/scouting', component: 'league-clash-scouting'},
    {path: '/teams/:teamid', component: 'league-clash-teams'},
    {path: '/scouting-new/:teamid', component: 'league-clash-team-scout'},
    {path: '(.*)', component: 'league-clash-404'},
  ])
  
  window.champList = await getChampionData();
}

setup();
