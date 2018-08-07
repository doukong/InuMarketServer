const mongoose = require('mongoose');
const Schema = mongoose.Schema
const shortid = require('shortid')

const letterSchema = new Schema({
    sendId : String,
    reciveId : String,
    sellBuy : Boolean, //true면 판매중인상품 false면 구매중인상품
    letterRead : Boolean,
    productId : String,
    productName : String,
    letterId : {
        type : String,
        unique : true,        
        default: shortid.generate
}
})

module.exports = mongoose.model('Lform',letterSchema)