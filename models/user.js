var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    username: {type: String, required: true, maxlength: 100},
    password: { type: String, required: true },
    admin: {type: Boolean, default: false},
    member: {type: Boolean, default: false},
  }
);

// Virtual for user's full name
UserSchema
.virtual('fullname')
.get(function () {
// To avoid errors in cases where a user does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
  var fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.first_name + ' ' + this.family_name
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }
  return fullname;
});

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/users/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);