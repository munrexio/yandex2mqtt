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



  setState(val, type, inst) {
    var int;   
    var topic; 
    switch (inst) {
      case 'on':
          try {
            int = val ? '1' : '0';
            this.data.capabilities[this.findDevIndex(this.data.capabilities, type)].state.instance = inst;
            this.data.capabilities[this.findDevIndex(this.data.capabilities, type)].state.value = val;
            topic = this.data.custom_data.mqtt[this.findDevIndex(this.data.custom_data.mqtt, inst)].set || false;
            break; 
          } 
          catch (err) {              
            topic = false;
            console.log(err);
          }
      case 'mute':
          try {
            int = val ? '1' : '0';
            this.data.capabilities[this.findDevIndex(this.data.capabilities, type)].state.instance = inst;
            this.data.capabilities[this.findDevIndex(this.data.capabilities, type)].state.value = val;
            topic = this.data.custom_data.mqtt[this.findDevIndex(this.data.custom_data.mqtt, inst)].set || false;
            break; 
          } 
          catch (err) {              
            topic = false;
            console.log(err);
          }          
      default:
          try {
            int = JSON.stringify(val);
            this.data.capabilities[this.findDevIndex(this.data.capabilities, type)].state.instance = inst;
            this.data.capabilities[this.findDevIndex(this.data.capabilities, type)].state.value = val;
            topic = this.data.custom_data.mqtt[this.findDevIndex(this.data.custom_data.mqtt, inst)].set || false; 
          } 
          catch (err) {              
            topic = false;
            console.log(err);
          }  
    };

    if (topic) {
      this.client.publish(topic, int);
    }
    return [
      {
        'state': {
          'instance': inst,
          'action_result': {
            'status': 'DONE'
          }
        }
      }
    ];
  };
}
module.exports = device;
