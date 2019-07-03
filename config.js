module.exports = {

    mqtt: {
        host: 'localhost',
        port: 1883,
        user: '',
        password: ''
    },

    https: {
        privateKey: '/mnt/data/root/node-key2.pem',
        certificate: '/mnt/data/root/munrexio.crt'
    },

    clients: [{
        id: '1',
        name: 'Yandex',
        clientId: 'yandex-smarthome12345',
        clientSecret: 'secret12345',
        isTrusted: false
    	},
    ],

    users: [{
            id: '1',
            username: 'admin',
            password: 'admin',
            name: 'Administrator'
        },
        {
            id: '2',
            username: 'root',
            password: 'wirenboard',
            name: 'Administrator'
        },
    ],

    devices: [{
            name: 'Свет',
            room: 'Комната',
            type: 'devices.types.light',
            mqtt: [{
                    type: 'devices.capabilities.on_off',
                    set: '/devices/yandex/controls/light1/on',
                    stat: '/devices/yandex/controls/light1'
                },
                {
                    type: 'devices.capabilities.range',
                    set: '/devices/yandex/controls/light5/on',
                    stat: '/devices/yandex/controls/light5'
                },
                {
                    type: 'devices.capabilities.color_setting',
                    set: '/devices/yandex/controls/light4/on',
                    stat: '/devices/yandex/controls/light4'
                },
            ],
            capabilities: [{
                    type: 'devices.capabilities.on_off',
                    retrievable: true,
                    state: {
                        instance: 'on',
                        value: true
                    }
                },
                {
                    type: 'devices.capabilities.range',
                    retrievable: true,

                    parameters: {
                        instance: 'brightness',
                        unit: 'unit.percent',
                        range: {
                            min: 0,
                            max: 100,
                            precision: 1
                        }
                    },
                    state: {
                        instance: 'brightness',
                        value: 10,
                    },
                },
                {
                    type: 'devices.capabilities.color_setting',
                    retrievable: true,
                    parameters: {
                        color_model: 'rgb',
                        temperature_k: {
                            min: 2000,
                            max: 9000,
                            precision: 500,
                        }
                    },
                    state: {
                        instance: 'rgb',
                        value: 0,
                    },
                },
            ]
        },
        {
            name: 'Печка',
            room: 'Комната',
            type: 'devices.types.thermostat',
            mqtt: [{
                    type: 'devices.capabilities.mode',
                    set: '/devices/yandex/controls/light3/on',
                    stat: '/devices/yandex/controls/light3'
                },
                {
                    type: 'devices.capabilities.range',
                    set: '/devices/yandex/controls/light7/on',
                    stat: '/devices/yandex/controls/light7'
                },
            ],
            capabilities: [
                {
                    type: 'devices.capabilities.mode',
                    retrievable: true,
                    parameters: {
                        instance: 'thermostat',
                        modes: [{
                            value: 'auto',
                        }],
                        ordered: true
                    },
                    state: {
                        instance: 'thermostat',
                        value: 'auto',
                    },
                },
                {
                    type: 'devices.capabilities.range',
                    retrievable: true,

                    parameters: {
                        instance: 'temperature',
                        unit: 'unit.temperature.celsius',
                        range: {
                            min: 0,
                            max: 100,
                            precision: 1
                        }
                    },
                    state: {
                        instance: 'temperature',
                        value: 10,
                    },
                },
            ]
        },
        {
            name: 'Телевизор',
            room: 'Комната',
            type: 'devices.types.media_device',
            mqtt: [{
                type: 'devices.capabilities.toggle',
                set: '/devices/yandex/controls/light6/on',
                stat: '/devices/yandex/controls/light6'
            }],
            capabilities: [{
                type: 'devices.capabilities.toggle',
                retrievable: true,
                parameters: {
                    instance: 'mute'
                },
                state: {
                    instance: 'mute',
                    value: true
                },
            }]
        }
    ]
}