module.exports = {

    mqtt: {
        host: 'localhost',
        port: 1883,
        user: '',
        password: ''
    },

    https: {
        privateKey: '/mnt/data/root/node-key2.pem',
        certificate: '/mnt/data/root/munrexio.crt',
        port: 443
    },

    clients: [
    {
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
            password: 'root',
            name: 'Administrator'
        },
    ],

    devices: [
    //_______________Первое устройство______________//
        {
            name: 'Свет',
            room: 'Комната',
            type: 'devices.types.light',
            mqtt: [
                 {
                    type: 'on',
                    set: '/devices/yandex/controls/light1/on',
                    stat: '/devices/yandex/controls/light1'
                },
                {
                    type: 'rgb',
                    set: '/devices/yandex/controls/light3/on',
                    stat: '/devices/yandex/controls/light3'
                },
                {
                    type: 'temperature_k',
                    set: '/devices/yandex/controls/light4/on',
                    stat: '/devices/yandex/controls/light4'
                },
                {
                    type: 'brightness',
                    set: '/devices/yandex/controls/light5/on',
                    stat: '/devices/yandex/controls/light5'
                },
            ],
            capabilities: [
                {
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
                            max: 8500,
                            precision: 500,
                        }
                    },
                    state: {
                        instance: 'rgb',
                        value: 0
                    },
                },
            ]
        },
    //__________Конец первого устройства__________//
    


    // ________ Второе устройство___________//
        {
            name: 'Телевизор',
            room: 'Комната',
            type: 'devices.types.media_device.tv',
            mqtt: [
                 {
                    type: 'on',
                    set: '/devices/yandex/controls/light6/on',
                    stat: '/devices/yandex/controls/light6'
                },
                {
                    type: 'mute',
                    set: '/devices/yandex/controls/light2/on',
                    stat: '/devices/yandex/controls/light2'
                },
                {
                    type: 'volume',
                    set: '/devices/yandex/controls/light7/on',
                    stat: '/devices/yandex/controls/light7'
                },
                {
                    type: 'channel',
                    set: '/devices/yandex/controls/light8/on',
                    stat: '/devices/yandex/controls/light8'
                },
            ],
            capabilities: [
                {
                    type: 'devices.capabilities.on_off',
                    retrievable: true,
                    state: {
                        instance: 'on',
                        value: true
                    }
                },
                {
                    type: 'devices.capabilities.toggle',
                    retrievable: true,
                    parameters: {
                        instance: 'mute'
                    },
                    state: {
                        instance: 'mute',
                        value: true
                    },
                },

                {
                    type: 'devices.capabilities.range',
                    retrievable: true,

                    parameters: {
                        instance: 'channel',
                    },
                    state: {
                        instance: 'channel',
                        value: 1,
                    },
                },
                {
                    type: 'devices.capabilities.range',
                    retrievable: true,

                    parameters: {
                        instance: 'volume',
                        range: {
                            min: 0,
                            max: 100,
                            precision: 1
                        }
                    },
                    state: {
                        instance: 'volume',
                        value: 10,
                    },
                },
            ]
        },
    //_________конец второго устройства_________//


    //______Третье устройство____//

        {
            name: 'Кондиционер',
            room: 'Комната',
            type: 'devices.types.thermostat.ac',
            mqtt: [
                 {
                    type: 'on',
                    set: '/devices/yandex/controls/light9/on',
                    stat: '/devices/yandex/controls/light9'
                },
                {
                    type: 'temperature',
                    set: '/devices/yandex/controls/light10/on',
                    stat: '/devices/yandex/controls/light10'
                },
            ],
            capabilities: [
                {
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
                        instance: 'temperature',
                        unit: 'unit.temperature.celsius',
                        range: {
                            min: 16,
                            max: 40,
                            precision: 1
                        }
                    },
                    state: {
                        instance: 'temperature',
                        value: 25,
                    },
                },
            ]
        },
    //____конец третьего устройства___//




    ]
}