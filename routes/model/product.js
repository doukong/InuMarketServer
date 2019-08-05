var mongoose = require('mongoose')
var shortid = require('shortid')
var Schema = mongoose.Schema

var productSchema = new Schema({
    productName : String,
    productPrice : Number,
    productStar : Number,
    productInfo : String,
    productState : String,
    productSelled : false,
    method : String,
    place : String,
    category : String,
    sellerId : String,
    sellerName : String,
    sellerPhone : String,
    productId : {
        type : String,
        unique : true,        
        default: shortid.generate
},
    productImg : [],
    updateDate : String,
    fileFolder : String
});


module.exports = mongoose.model('pform',productSchema)