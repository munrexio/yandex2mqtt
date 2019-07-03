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
        console.log('add device');
        new device(opts);
    });
}

console.log('Connecting to MQTT...');
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
app.post('/provider//v1.0/user/unlink', routes.user.unlink);


httpsServer.listen(3000);


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
        if (statTopic && statTopic) {
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
        console.log('MQTT connected to ' + config.mqtt.host);
        client.subscribe(statPairs.map(pair => pair.topic));
        client.on('message', (topic, message) => {
            const matchedDeviceId = statPairs.findIndex(pair => topic.toLowerCase() === pair.topic.toLowerCase());
            if (matchedDeviceId == -1) return;

            const device = global.devices.find(device => device.data.id == statPairs[matchedDeviceId].deviceId);

            switch (statPairs[matchedDeviceId].topicType) {
                case 'devices.capabilities.on_off':
                    console.log(`Вкл или выкл`);
                    var ind1 = findDevIndex(device.data.custom_data.mqtt, 'devices.capabilities.on_off');
                    device.data.capabilities[ind1].state.value = ['on', '1', 'true'].includes(message.toString().toLowerCase());
                    console.log(`update device ${device.data.name} (${device.data.room}) state: `, device.data.capabilities[ind1].state);
                    break;
                case 'devices.capabilities.range':
                    console.log(`Диммер`);
                    var ind2 = findDevIndex(device.data.custom_data.mqtt, 'devices.capabilities.range');
                    
                    try {

                        device.data.capabilities[ind2].state.value = parseInt(message);
                        console.log(`update device ${device.data.name} (${device.data.room}) state: `, device.data.capabilities[ind2].state);
                    } catch (err) {

                        console.log(`Ошибка`);

                    }
                    
                    break;
                case 'devices.capabilities.color_setting':
                    console.log(`RGB`);
                    var ind3 = findDevIndex(device.data.custom_data.mqtt, 'devices.capabilities.color_setting');
                    try {

                        device.data.capabilities[ind3].state.value = parseInt(message);
                        console.log(`update device ${device.data.name} (${device.data.room}) state: `, device.data.capabilities[ind3].state);
                    } catch (err) {

                        console.log(`Ошибка`);

                    }
                    break;  
                case 'devices.capabilities.mode':
                    console.log(`Режимы`);
                    var ind4 = findDevIndex(device.data.custom_data.mqtt, 'devices.capabilities.mode');
                    try {

                        device.data.capabilities[ind4].state.value = message.toString();
                        console.log(`update device ${device.data.name} (${device.data.room}) state: `, device.data.capabilities[ind4].state);
                    } catch (err) {

                        console.log(`Ошибка`);

                    }
                    break;  
                case 'devices.capabilities.toggle':
                    console.log(`Звук`);
                    var ind5 = findDevIndex(device.data.custom_data.mqtt, 'devices.capabilities.toggle');
                    device.data.capabilities[ind5].state.value = ['on', '1', 'true'].includes(message.toString().toLowerCase());
                    console.log(`update device ${device.data.name} (${device.data.room}) state: `, device.data.capabilities[ind5].state);
                    break;        
                default:

                    console.log(`Не понятно`);
            };




        });
    });

    client.on('offline', () => {
        console.log('MQTT offline');
    });
}

module.exports = app;