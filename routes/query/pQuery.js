const product = require('../model/product')

upload = (query) =>{
    const moment = require('moment-timezone')
    
    const nowDate = moment.tz(new Date(),"Asia/Seoul").format('YYYY-MM-DD hh:mm:ss')
    console.log(nowDate)
    let newProduct = new product()
    newProduct.productName = query.productName;
    newProduct.productState = query.productState;
    newProduct.productPrice = query.productPrice;
    newProduct.productStar = 0;
    newProduct.category = query.category;
    newProduct.productInfo = query.productInfo;
    newProduct.method = query.method;
    newProduct.place = query.place;
    newProduct.sellerId = query.sellerId;
    newProduct.productSelled = false
    newProduct.updateDate = nowDate
    newProduct.sellerName = query.sellerName
    newProduct.sellerPhone = query.sellerPhone
    newProduct.productImg = query.productImg
    newProduct.fileFolder = query.fileFolder    

    return newProduct.save() ? true : false
}

mainList = async() => {
    findList = (kind) => {
        let promise = product.find({"productSelled":false,"category":{$regex:kind,$options:'i'}},{
            "_id":false,
            "productStar":false,
            "productInfo":false,
            "productState":false,
            "method":false,
            "place":false,
            "sellerId":false,
        }).sort({updateDate:'desc'}).limit(10)
        .exec()
        return promise
    }

    let returnArray = ["식권","책","자취방"].map((item)=>{
        return findList(item)
    })

    return Promise.all(returnArray).then((res)=>res)       
}

oneItem = async(productId) => {
    const returnItem = product.findOne({"productId":productId,"productSelled":false}).exec()
    return returnItem.then((res)=>res)
}

search = async(searchName) => {
    const returnItems = product.find({"productName":{$regex:searchName,$options:'i'},"productSelled":false},{
        "_id":false,
        "productStar":false,
        "productInfo":false,
        "productState":false,
        "method":false,
        "place":false,
        "sellerId":false,
    }).exec()

    return returnItems.then((res)=> res)
}

categorySearch = async(searchName,category) => {
    const returnItems = product.find({'productName':{$regex:searchName,$options:'i'},'category':{$regex:category,$options:'i'}},{
        "_id":false,
        "productStar":false,
        "productInfo":false,
        "productState":false,
        "method":false,
        "place":false,
        "sellerId":false,
    }).exec()

    return returnItems.then((res)=>res)
}

userItem = async(sellerId) => {
    const returnItems = product.find({"sellerId":sellerId},{
        "_id":false,
        "productStar":false,
        "productInfo":false,
        "productState":false,
        "method":false,
        "place":false,
    }).sort({updateDate:"desc"}).exec()
    return returnItems.then((res)=>res)
}

category = async(category)=>{
    const returnItems = product.find({"category":{$regex:category,$options:'i'},"productSelled":false},{
        "_id":false,
        "productStar":false,
        "productInfo":false,
        "productState":false,
        "method":false,
        "place":false,
    }).sort({updateDate:"desc"}).exec()

    return returnItems.then((res)=>res)
}

selling = async(productId) => {
    return product.updateOne({"productId":productId},{$set:{productSelled:true}}).exec().then((res)=>res.n)
}

removeOne = async(productId) => {
    const deleteReturn = product.deleteOne({"productId":productId}).exec()
    return deleteReturn.then((res)=>res.n)
}
module.exports = {upload,mainList,oneItem,search,categorySearch,selling,removeOne,userItem,category}