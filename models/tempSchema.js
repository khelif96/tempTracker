
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let tempSchema = new Schema({
  tempBucket : [
    {
      time: {
        type: Date,
      },
      temp: {
      type: Number,
      required: true,
    },
  }  ],
  humidityBucket: [
    {
      time: {
        type: Date
      },
      humidity: {
      type: Number,
      required: true
    },
  }
  ],


startTime: {
  type: Date,
  required: false
},
endTime: {
  type: Date,
  required: false
},
count: {
  type: Number,
  required: false
},
createdAt: {
  type: Date,
}


});
//
tempSchema.pre('save', function (next) {
let currentDate = new Date().getTime();
if (!this.startTime) {
  this.startTime = currentDate;
}
if(!this.createdAt){
  this.createdAt = currentDate
}
this.endTime = currentDate;
this.count = 1;
next();
});
//
tempSchema.pre('update', function(next) {
  this.endTime = new Date().getTime();
  this.count= this.count + 1;
  next();
})


var tempData = mongoose.model('temp', tempSchema);

module.exports = tempData;
