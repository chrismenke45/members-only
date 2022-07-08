//Require Mongoose
var mongoose = require('mongoose');
const { DateTime } = require("luxon");
//Define a schema
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  text: {type: String, required: true, maxLength: 1000},
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  timestamp: {type: Date, default: Date.now}
});
//Virtual for messages specific url
MessageSchema
.virtual('url')
.get(function () {
  return '/messages/' + this._id;
});
MessageSchema
.virtual('postTime')
.get(function () {
  console.log(typeof this.timestamp)
  return this.timestamp.toLocaleString('en-US', {timeZone: 'America/Los_Angeles', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'})
    //return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_SHORT,'en-US', {timeZone: 'America/New York'})
})

module.exports = mongoose.model('Message', MessageSchema);