const express=require("express")


const router=express.Router()

const orderModel=require("../model/orderModel")


router.post("/",(req,res)=>{
    let orderData=req.body
    orderModel.create(orderData)
    .then((data)=>{
        res.send({success:true,message:"your order has created"})
    })
    .catch((err)=>{
        console.log(err)
        res.send({success:false,message:"please try again later"})
    })
})



router.get("/:id",(req,res)=>{
    let userID=req.params.id;
    orderModel.find({userid:userID}).populate({path: 'order',populate: { path: 'foodid' }})
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        console.log(err)
        res.send({success:false,message:"please try again later"})
    })
})







module.exports=router;