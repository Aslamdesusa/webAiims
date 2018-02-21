var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RepairSchema = new Schema({
	machineid: String,
	phonenumber: Number,
	problemmsg: String,
	createdat:{ type: Date,required: true, default: Date.now },
	status: String
});

const Repair = mongoose.model('Repair', RepairSchema);

module.exports = Repair