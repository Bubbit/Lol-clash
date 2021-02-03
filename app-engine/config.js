const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

console.log(serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://league-clash-7a1b0.firebaseio.com/'
});

class Config {
  constructor() {
    this.db = admin.database();

    const configRef = this.db.ref('config');
    configRef.on('value', async (snapshot) =>{
      this.config = snapshot.val();
      if(this.config.keys) {
        this.resetKeys(this.config.keys);
      }
    });
  }

  mainKey() {
    return this.config.mainKey;
  }

  getDatabase() {
    return this.db;
  }

  getKey() {
    let key = this.keys.find(key => !key.used);
    if(!key) {
      this.resetKeys(this.config.keys);
      key = this.keys.find(key => !key.used);
    }
    return key.key;
  }

  getKeys() {
    return this.keys;
  }

  setKeyUsed(key) {
    const foundKey = this.keys.find(keyStored => keyStored.key === key);
    foundKey.used = true;
  }

  resetKeys(newKeys) {
    this.keys = newKeys.map((key) => {
      return {
        used: false,
        key: key.key
      }      
    });
  }
}

class Singleton {

  constructor() {
      if (!Singleton.instance) {
          Singleton.instance = new Config();
      }
  }

  getInstance() {
      return Singleton.instance;
  }

}

module.exports = Singleton;