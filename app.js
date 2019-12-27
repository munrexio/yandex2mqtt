'use strict';

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const config = require('./config');
const mqtt = require('mqtt');
const device = require('./device');
const fs = require('fs');
const app = express();
const https = require('https');
const privateKey = fs.readFileSync(config.https.privateKey, 'utf8');
const certificate = fs.readFileSync(config.https.certificate, 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate
};
const httpsServer = https.createServer(credentials, app);
global.devices = [];

if (config.devices) {
    config.devices.forEach(opts => {
        new device(opts);
    });
}

const client = mqtt.connect(`mqtt://${config.mqtt.host}`, {
    port: config.mqtt.port,
    username: config.mqtt.user,
    password: config.mqtt.password
});

app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('views'));
app.use(cookieParser());
app.use(bodyParser.json({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(errorHandler());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./auth');
app.get('/', routes.site.index);
app.get('/login', routes.site.loginForm);
app.post('/login', routes.site.login);
app.get('/logout', routes.site.logout);
app.get('/account', routes.site.account);
app.get('/dialog/authorize', routes.oauth2.authorization);
app.post('/dialog/authorize/decision', routes.oauth2.decision);
app.post('/oauth/token', routes.oauth2.token);
app.get('/api/userinfo', routes.user.info);
app.get('/api/clientinfo', routes.client.info);
app.get('/provider/v1.0', routes.user.ping);
app.get('/provider', routes.user.ping);
app.get('/provider/v1.0/user/devices', routes.user.devices);
app.post('/provider/v1.0/user/devices/query', routes.user.query);
app.post('/provider/v1.0/user/devices/action', routes.user.action);
app.post('/provider/v1.0/user/unlink', routes.user.unlink);
httpsServer.listen(config.https.port);


function findDevIndex(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type === elem) {
            return i;
        }
    }
    return false;
}


const statPairs = [];

global.devices.forEach(device => {
    device.client = client;
    device.data.custom_data.mqtt.forEach(mqtt => {
        const statType = mqtt.type || false;
        const statTopic = mqtt.stat || false;
        if (statTopic && statType) {
            statPairs.push({
                deviceId: device.data.id,
                topic: statTopic,
                topicType: statType
            });
        }
    });
});

if (statPairs) {
    client.on('connect', () => {
        client.subscribe(statPairs.map(pair => pair.topic));
        client.on('message', (topic, message) => {
            const matchedDeviceId = statPairs.findIndex(pair => topic.toLowerCase() === pair.topic.toLowerCase());
            if (matchedDeviceId == -1) return;

            const device = global.devices.find(device => device.data.id == statPairs[matchedDeviceId].deviceId);
            var devindx;
            switch (statPairs[matchedDeviceId].topicType) {
                case 'on':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.on_off')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = ['on', '1', 'true'].includes(message.toString().toLowerCase());
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case 'mute':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.toggle')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = ['on', '1', 'true'].includes(message.toString().toLowerCase());
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case 'hsv':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.color_setting')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = JSON.parse(message);
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case 'rgb':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.color_setting')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = JSON.parse(message);
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case 'temperature_k':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.color_setting')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = JSON.parse(message);
                    } catch (err) {
                        console.log(err);
                    }
                    break;        
                case 'thermostat':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.mode')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = JSON.parse(message);
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case 'fan_speed':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.mode')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = JSON.parse(message);
                    } catch (err) {
                        console.log(err);
                    }
                    break;    
                case 'brightness':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.range')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = JSON.parse(message);
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case 'temperature':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.range')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = JSON.parse(message);
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case 'volume':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.range')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = JSON.parse(message);
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case 'channel':
                    try {
                        devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.range')
                        device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
                        device.data.capabilities[devindx].state.value = JSON.parse(message);
                    } catch (err) {
                        console.log(err);
                    }
                    break;                        
                default:
                    console.log('Unknown topic Type: ' + statPairs[matchedDeviceId].topicType);
            };
        });
    });

    client.on('offline', () => {
    });
}
module.exports = app;