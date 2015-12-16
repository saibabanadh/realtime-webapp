/**
  * Mongoose Models and their Schema
  **/

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var OrderSchema   = new Schema({
    orderId: {type:String, unique:true},
    source: {type:String, required:true},
    destination: {type:String, required:true},
    email: {type:String, required:true},
    contact: {type:String, required:true},
    itemInfo: {type:String, required:true},
    updatedAt :{ type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
