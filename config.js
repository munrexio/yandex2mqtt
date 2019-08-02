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
          
    ]
}