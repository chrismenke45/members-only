var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true, maxlength: 100},
    password: { type: String, required: true },
    admin: {type: Boolean, default: false},
  }
);


// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/users/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);