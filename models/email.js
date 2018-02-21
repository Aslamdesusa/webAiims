var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');

var Schema = mongoose.Schema;

var EmailSchema = new Schema({
    emailaddress:{type:Email, required:true, unique:true},
    companyname: String,
    createat: { type: Date,required: true, default: Date.now }
});

const email = mongoose.model('email', EmailSchema)

module.exports = email;