const express = require('express')
const multer = require('multer')
const randomstring = require('randomstring')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const productquery = require('./query/pQuery')
const router = express.Router()
const fileFolder = randomstring.generate(7)
const storage = multer.diskStorage({   
    destination : (req,file,cb)=> {
        fs.mkdir('./files/'+req.decoded.id+fileFolder,()=>{
                cb(null,'files/'+req.decoded.id+fileFolder+'/')
        })
    },
    filename : (req,file,cb)=>{
        let extension = path.extname(file.originalname)
        let basename = path.basename(file.originalname, extension)
        cb(null,basename+extension)
    }
})
const upload = multer({storage: storage})
const authMiddleware = require('./function/auth')

router.use('/',authMiddleware)

const sendSuccess = (res) => {
    res.status(200).send("success")
}

const sendFail = (res) => {
    res.status(400).send("fail")
}

router.post('/upload',upload.array('userFile',8),async (req,res)=>{
    const fileArray = []
    await req.files.map(Data => fileArray.push(Data.filename))
    const sendQuery = {
        productName : req.body.productName,
        productState : req.body.productState,
        productPrice : req.body.productPrice,
        category : req.body.category,
        productInfo : req.body.productInfo,
        method : req.body.method,
        place : req.body.place,
        fileFolder : fileFolder,
        sellerId : req.decoded.id,
        sellerName : req.decoded.name,
        sellerPhone : req.decoded.tel,
        productImg : fileArray
    }
    await productquery.upload(sendQuery) ? sendSuccess(res) : sendFail(res)
})

router.get('/mainList',async (req,res)=>{
    res.status(200).send(await productquery.mainList())
})

router.get('/oneItem',async(req,res)=>{
    res.status(200).send(await productquery.oneItem(req.body.productId))
})

router.get('/search',async(req,res)=>{
    res.status(200).send(await productquery.search(req.query.searchName))
})

router.get('/categorySearch',async(req,res)=>{
    res.status(200).send(await productquery.categorySearch(req.query.searchName,req.query.category))
})

router.get('/userItem',async(req,res)=>{
    res.status(200).send(await productquery.userItem(req.body.userId))
})

router.get('/category',async(req,res)=>{
    res.status(200).send(await productquery.category(req.body.category))
})

router.put('/selling',async(req,res)=>{
    await productquery.selling(req.body.productId)? sendSuccess(res) : sendFail(res)
})

router.delete('/',async(req,res)=>{
   if(await productquery.removeOne(req.body.productId))
   {
       rimraf.sync(`./files/${req.decoded.id}${req.body.fileFolder}`) 
       sendSuccess(res)
    }else{
        sendFail(res)
    }
})

module.exports = router