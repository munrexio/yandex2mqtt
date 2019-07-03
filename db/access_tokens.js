'use strict';

const tokens = {};
const loki = require('lokijs');
global.dbl = new loki('./loki.json', {
  autoload: true,
  autosave: true,
  autosaveInterval: 5000,
  autoloadCallback() {
    global.authl = global.dbl.getCollection('tokens');
    if (global.authl === null) {
      global.authl = global.dbl.addCollection('tokens');
    }
  }
});

module.exports.find = (key, done) => {
  loadToken(key);
  if (tokens[key]) return done(null, tokens[key]);
  return done(new Error('Token Not Found'));
};

module.exports.findByUserIdAndClientId = (userId, clientId, done) => {
  loadTokenByUserId(userId);
  for (const token in tokens) {
    if (tokens[token].userId === userId && tokens[token].clientId === clientId) return done(null, token);
  }
  return done(new Error('Token Not Found'));
};

module.exports.save = (token, userId, clientId, done) => {
  console.log('Start saving token');
  tokens[token] = { userId, clientId }; 
  var ltoken1 = global.authl.findOne( {'userId': userId} );
  if(ltoken1){
    console.log(ltoken1.userId);
    console.log('User Updated');
    ltoken1.token = token;
    ltoken1.userId = userId;
    ltoken1.clientId = clientId;
    global.authl.update(ltoken1);
  }else{
    console.log('User not Found. Create new...');
    global.authl.insert({
        'type': 'token',
        'token': token,
        'userId': userId,
        'clientId': clientId
      });
  }
  done();
};

function loadTokenByUserId(userId, done) {
  var ltoken = global.authl.findOne( {'userId': userId} );
  if(ltoken){
    console.log('Load token by userId: User found');
    var token = ltoken.token;
    var userId = ltoken.userId;
    var clientId = ltoken.clientId;
    tokens[token] = { userId, clientId };
  }else{
    console.log('User not found');
    return;
  }  
};

function loadToken(token, done) {
  var ltoken2 = global.authl.findOne( {'token': token} );
  if(ltoken2){
    console.log('Token found');
    var token1 = ltoken2.token;
    var userId = ltoken2.userId;
    var clientId = ltoken2.clientId;
    tokens[token1] = { userId, clientId };
  }else{
    console.log('Token not found');
    return;
  }  
};