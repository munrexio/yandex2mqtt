class device {
  constructor(options) {
    var id = global.devices.length;
    this.data = {
      id: String(id),
      name: options.name || 'Без названия',
      description: options.description || '',
      room: options.room || '',
      type: options.type || 'devices.types.light',
      custom_data: {
        mqtt: options.mqtt || [{}]
      },
      capabilities: options.capabilities,
    }
    global.devices.push(this);
  }
  getInfo() {
    return this.data;
  };
  

  findDevIndex(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type === elem) {
            return i;
        }
    }
    return false;
};



  setState(val, type) {
    var int;   
    var topic; 
    switch (type) {
      case 'devices.capabilities.on_off':
          console.log(`Вкл или выкл`); 
          int = val ? '1' : '0';
          this.data.capabilities[this.findDevIndex(this.data.capabilities, 'devices.capabilities.on_off')].state.value = val;
          topic = this.data.custom_data.mqtt[this.findDevIndex(this.data.custom_data.mqtt, 'devices.capabilities.on_off')].set || false;
          break;
      case 'devices.capabilities.range':
          console.log(`Диммер`);
          int = val.toString().toLowerCase();
          this.data.capabilities[this.findDevIndex(this.data.capabilities, 'devices.capabilities.range')].state.value = val;
          topic = this.data.custom_data.mqtt[this.findDevIndex(this.data.custom_data.mqtt, 'devices.capabilities.range')].set || false;
          break;
      case 'devices.capabilities.color_setting':
          console.log(`Диммер RGB`);
          int = val.toString().toLowerCase();
          this.data.capabilities[this.findDevIndex(this.data.capabilities, 'devices.capabilities.color_setting')].state.value = val;
          topic = this.data.custom_data.mqtt[this.findDevIndex(this.data.custom_data.mqtt, 'devices.capabilities.color_setting')].set || false;
          break;    
      case 'devices.capabilities.mode':
          console.log(`Режимы`);
          int = val.toString().toLowerCase();
          this.data.capabilities[this.findDevIndex(this.data.capabilities, 'devices.capabilities.mode')].state.value = val;
          topic = this.data.custom_data.mqtt[this.findDevIndex(this.data.custom_data.mqtt, 'devices.capabilities.mode')].set || false;
          break;   
      case 'devices.capabilities.toggle':
          console.log(`Звук`);
          int = val.toString().toLowerCase();
          this.data.capabilities[this.findDevIndex(this.data.capabilities, 'devices.capabilities.toggle')].state.value = val;
          topic = this.data.custom_data.mqtt[this.findDevIndex(this.data.custom_data.mqtt, 'devices.capabilities.toggle')].set || false;
          break;      
      default:
          topic = false;
          console.log(`Не понятно`);
    };

    if (topic) {
      console.log(`mqtt: ${topic} ${int}`);
      this.client.publish(topic, int);
    }
    return [
      {
        'state': {
          'instance': this.data.capabilities[0].state.instance,
          'action_result': {
            'status': 'DONE'
          }
        }
      }
    ];
  };












}
module.exports = device;
