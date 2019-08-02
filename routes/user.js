'use strict';

const passport = require('passport');

module.exports.info = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    response.json({ user_id: request.user.id, name: request.user.name, scope: request.authInfo.scope });
  }
];


module.exports.ping = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    response.status(200);
    response.send('OK');
  }
];

module.exports.devices = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
  var r = {
    request_id: "1",
    payload: {
      user_id: "1",
      devices: []
    }
  };
  for (var i in global.devices) {
    r.payload.devices.push(global.devices[i].getInfo());
  }
  
  response.status(200);
  response.send(r);
  }
];

module.exports.query = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
  const r = {
    request_id: '1',
    payload: {
      devices: []
    }
  };
  for (let i in request.body.devices) {
    r.payload.devices.push(global.devices[request.body.devices[i].id].getInfo());
  }
  response.send(r);
  }
];

module.exports.action = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
  var r = {
    request_id: "1",
    payload: {
      devices: []
    }
  };
  for (var i in request.body.payload.devices) {
    var id = request.body.payload.devices[i].id;
    try {

        var capabilities = global.devices[id].setState(request.body.payload.devices[i].capabilities[0].state.value , request.body.payload.devices[i].capabilities[0].type, request.body.payload.devices[i].capabilities[0].state.instance);
           
    } catch (err) {

        var capabilities = global.devices[id].setState(true , request.body.payload.devices[i].capabilities[0].type, 'mute');
    }
    
    r.payload.devices.push({ id: id, capabilities: capabilities });
  }
  response.send(r);
  }
];

module.exports.unlink = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
  response.status(200);
  }
];