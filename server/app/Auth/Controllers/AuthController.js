const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const {generateOTP, verifyOTP, resendVerificationOTP} = require('../Controllers/UserVerification')
const Users = require('../../models/User')

//validation
inputValidate = [
        check('name','Name is Required').not().isEmpty(),
        check('email','Provide valid email').isEmail(),
        check('phone').isLength({ min: 10, max: 10 }).isInt(), 
]

inputloginValidate = [
    check('phone').isLength({ min: 10, max: 10 }).isInt(), 
]

inputverifyValidate = [
    check('phone').isLength({ min: 10, max: 10 }).isInt(), 
    check('otp').isLength({ min: 4, max: 4 }).isInt(), 
]


//for registering user
register = async(req, res) => {
    
    ///check errors
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
    try {
        const {name, email, phone} = req.body

        //find user
        let user = await Users.findOne({email})

        //if user already exist
        if(user) return res.status(400).json({error: [{message: 'user already exsit'}]})

        //creating instanse
        user = new Users({
            name,
            email,
            phone
        })
        //save user
        await user.save()

        //generate otp
        await generateOTP(user.phone)
        
        return res.status(200).json({message:'user registered, please login to verify your phone'})
      
    } catch (err) {
        console.log(err);
        return res.status(500).send('server error')
    }
  
  
}

//for login, generate and send otp
login = async(req, res) => {
    
    //check for errors
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const { phone } = req.body

        //generate otp and get status
        let generateOTPStatus = await generateOTP(phone)

        //if status is true
        if(generateOTPStatus.status){
            return res.status(200).json(generateOTPStatus.message)
        }else{
            return res.status(400).json(generateOTPStatus.message.error)
        }

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message:'server error'})
    }
}

//for verifying otp with db
verifyLogin = async(req, res) => {

    //check for errors
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    

    try {
        const {phone, otp} = req.body

        //verify otp and get status
        let verifyStatus = await verifyOTP(phone, otp)

        //if status is true
        if(verifyStatus.status){

            //create payload
            const payload = {
                user:{
                    id: verifyStatus.user_id,
                }
            }

            //sign json
            jwt.sign(
                payload, 
                config.get('jwtSecret'), 
                {expiresIn: 36000},
                (err, token) => {
                if(err) throw err;           
                return res.status(200).json({token})
                }
            )

        }else{
            return res.status(400).json(verifyStatus.message.error)
        }
     
        
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message:'server error'})
    }
}

//resending OTP
resendOTP = async(req, res) => {

    //check for errors
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const {phone} = req.body

        //resend OTP and get status
        let resendOTPStatus = await resendVerificationOTP(phone)

        //if status is true
        if(resendOTPStatus.status){
            return res.status(200).json(resendOTPStatus.message)
        }else{
            return res.status(400).json(resendOTPStatus.message.error)
        }
        
    }catch(err){
        console.log(err.message)
        return res.status(500).json({message: 'server error'})
        
    }
}

module.exports = {
    register,
    login,
    inputValidate,
    inputloginValidate,
    inputverifyValidate
}