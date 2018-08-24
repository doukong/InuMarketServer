const express = require('express')
const router = express.Router()
const letter = require('./model/letter')
const account = require('./model/account')
const product = require('./model/product')

router.post('/send',async (req,res)=>{
    const sellerLetter = new letter() //판매자에게 가는 쪽지
    const customerLetter = new letter() //구매자에게 가는 쪽지
    const nowDate = new Date()

    sellerLetter.sendId = req.body.custId
    sellerLetter.reciveId = req.body.sellerId
    sellerLetter.sellBuy = true //판매중인상품
    sellerLetter.letterRead = false
    sellerLetter.productId = req.body.productId
    sellerLetter.productName = req.body.productName
    sellerLetter.productSelled = false
    sellerLetter.sendDate = nowDate
    
    customerLetter.sendId = req.body.sellerId
    customerLetter.reciveId = req.body.custId
    customerLetter.sellBuy = false//구매중인상품
    customerLetter.letterRead = false
    customerLetter.productId = req.body.productId
    customerLetter.productName = req.body.productName
    customerLetter.productSelled = false
    customerLetter.sendDate = nowDate

    if(req.body.sellerId == req.body.custId){
        res.json({ans:false})
    }else{
    await account.find({"id":req.body.custId}).exec(
        async (err,docs)=>{
            if(err) throw err
            else{
                sellerLetter.senderPhone = await docs[0].tel
                sellerLetter.senderName = await docs[0].name
                console.log(sellerLetter)
                await sellerLetter.save(async (err,docs)=>{
                    if(err){
                        console.log(err);
                        throw err
                    }
                    else{
                        await account.update({"id":docs.sendId},
                        {$push:{letterNum:docs.letterId}},
                        {upsert:true})
                        console.log("to"+req.body.sellerId+"from"+req.body.custId)
                    }
            
            
                })
            }
        }
    )
    
    await account.find({"id":req.body.sellerId}).exec(
        async (err,docs)=>{
            if(err) throw err
            else{
                customerLetter.senderPhone = await docs[0].tel
                customerLetter.senderName = await docs[0].name
                console.log(docs[0])
                await customerLetter.save(async(err,docs)=>{
                    if(err){
                        console.log(err)
                        throw err
                    }
                    else{
                        await account.update({"id":docs.sendId},
                        {$push:{letterNum:docs.letterId}},
                        {upsert:true})
                        console.log("to"+req.body.custId+"from"+req.body.sellerId)
                    }
                })
            }
        }
    )
    
    await product.update({"productId" : req.body.productId},{$inc:{productStar:1}}).exec((err,docs) => {
        if(err){
            throw err
        }
    })

    res.json({ans:true})
}
})

router.post('/list',async (req,res)=>{
    letter.find({"reciveId":req.body.id}).sort({sendDate:"desc"}).exec((err,docs)=>{
        if(err){
            throw err
            res.json({ans:"false"})
        }
        else{
            res.send(docs)
        }
    })
})

router.post('/buyList',async (req,res)=>{
    letter.find({"reciveId":req.body.id,"sellBuy":false}).sort({sendDate:"desc"}).exec((err,docs)=>{
        if(err){
            throw err
            res.json({ans:"false"})
        }
        else{
            res.send(docs)
        }
    })
})

router.post('/sellList',async (req,res)=>{
    letter.find({"reciveId":req.body.id,"sellBuy":true }).sort({sendDate:"desc"}).exec((err,docs)=>{
        if(err){
            throw err
            res.json({ans:"false"})
        }
        else{
            res.send(docs)
        }
    })
})

router.post('/delete',async (req,res)=>{
    await letter.remove({"letterId":req.body.letterId}).exec((err)=>{
        if(err){
            res.json({ans:false})
        }
    })

    await account.update({"id":req.body.id},{$pull:{letterNum:req.body.letterId}}).exec((err)=>{
        if(err){
            res.json({ans:false})
        }
        else{
            res.json({ans:true})
        }
    })
})

module.exports = router