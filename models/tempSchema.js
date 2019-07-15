
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let tempSchema = new Schema({
temp: {
  type: Number,
  required: true,
},
humidity: {
  type: Number,
  required: true
},
createdAt: {
  type: Date,
  required: false
},

});

tempSchema.pre('save', function (next) {
let currentDate = new Date().getTime();
if (!this.created_at) {
  this.createdAt = currentDate;
}
next();
});


var tempData = mongoose.model('temp', tempSchema);

module.exports = tempData;
