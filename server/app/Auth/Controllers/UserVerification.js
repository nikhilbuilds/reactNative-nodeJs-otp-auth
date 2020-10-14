var express = require('express')
const config = require('config')
const User = require('../../models/User')
const UserOTP = require('../../models/UserOTP')
var AWS = require('aws-sdk');


generateOTP = async(phone) =>{

    //find User
    let user = await User.findOne({phone})
    console.log(user);
    
    if(!user) return {
        status: false,
        message: {
            error: 'user does not exist, need to register'
        }
    }
    
    
    //check otp generate attempts
    let userOTPCount = await UserOTP.count({user: user.id, status: true})
    console.log('otp_count:' + userOTPCount);
    
    if(userOTPCount > 3){
        
        //get latest otp details of user
        let userOTPdetails = await UserOTP.findOne({user: user.id, status: true}).sort({created_at: -1})

         //check if otp is expired
         let now =  Date.now() 
         let otpDate = new Date(userOTPdetails.created_at)
         let diff = Math.abs(now - otpDate);
         var minutes = Math.floor((diff/1000)/60);
         console.log('time1:' + minutes);

 
        //disable after 5mins
        if(minutes > 4)  await UserOTP.updateMany({user: user.id},{status: false,  deleted_at: Date.now()})

        return {
            status: false,
            message: {
                error: `Time Limit Exceeds, try after ${5 - minutes} mins`
            }
        }
    }

    //create random 4 digit otp
    const otp = Math.floor(Math.random() * (999)) + 1000
    
    //create message
    let message =   `Hi  ${user.name} , OTP to verify your account is  ${otp}. OTP will expire in 5 minutes. Do not share with anyone.`

    console.log(message);
    
    //send message
    const smsStatus = true
    //const smsStatus = sendSMS(user.phone, message)

    //message status, if true
    if(smsStatus){

         //save in database 
         let userOTP = new UserOTP({otp, user: user.id})
         await userOTP.save()
 
         return {
            status: true,
            message: 'generated successfully'
         }
    }
    
}

sendSMS = (phone, message) => {

    //if phone number is 10 digit then add +91
    // dealing with only indian number

    if (phone.toString().length == 10) {
        phone = '+91'+phone;
    }

    AWS.config.update({
        region: "ap-south-1",
        accessKeyId: config.awscredentials.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.awscredentials.AWS_SECRET_ACCESS_KEY,
    })

     // Create publish parameters
     var params = {
        Message: message, 
        PhoneNumber: phone,
        Subject: 'SUBJECT',
        MessageAttributes:{
        'AWS.SNS.SMS.SenderID':{
            'DataType' : 'String',
            'StringValue': 'appname'
        },
        'AWS.SNS.SMS.SMSType': {
            'DataType':'String',
            'StringValue': 'Transactional'
        },
    }
    };


     // Create promise and SNS service object
     var publishTextPromise = new AWS.SNS({apiVersion: 'latest'}).publish(params).promise();

      // Handle promise's fulfilled/rejected states
      publishTextPromise.then(
        function(data) {
            console.log(`Message ${params.Message} send sent to the topic ${params.PhoneNumber}`);
            console.log("MessageID is " + data.MessageId);
          
        }).catch(
            function(err) {
            console.error(err, err.stack);
            return false
        });
        
        return true
        
}

verifyOTP = async(phone, received_otp) => {

        //find if user exist
        const user = await User.findOne({phone})
        
        if(!user) return {
            status: false,
            message: {
                error: 'user not found, need to register'
            }
        }
        
    
        //get otp details
        let userOTP = await UserOTP.findOne({user: user.id, status: true }).sort({created_at: -1})
        
        if(!userOTP) return {
            status:false,
            message:{
                error: 'OTP not found'
            }
        }

        //check if otp is expired
        let now =  Date.now() 
        let otpDate = new Date(userOTP.created_at)
        let diff = Math.abs(now - otpDate);
        var minutes = Math.floor((diff/1000)/60);
        console.log('time2:' + minutes);

        {/* 
            review needed 
        */}
        if(userOTP.counter > 3){
            let update = await UserOTP.findOneAndUpdate({user: user.id, otp: received_otp},{status: false, deleted_at: now})
            console.log('limit exceeds');

            return {
                status:false,
                message:{
                    error:'limit exceeds, try after 5mins'
                }
            }
        }

        if(received_otp === userOTP.otp){
            let updateOTP = await UserOTP.findOneAndUpdate({user: user.id, otp: received_otp},{status: false, deleted_at: now})

            return {
                status:true,
                message:'user authenticated',
                user_id: user.id
            }
        }else{

            return {
                status:false,
                message:{
                    error: 'OTP not found'
                },
            }
        }
   
}

resendVerificationOTP = async(phone) => {

    //find User
    let user =  await User.findOne({phone})
    
    if(!user) return {
        status: false,
        message: {
            error: 'user not found, need to register'
        }
    }

    //find OTP details
    let userOTP = await UserOTP.findOne({user: user.id, status: true }).sort({created_at: -1})

 
    if(!userOTP){
     generateOTP(phone)
        return {
            status:false,
            message:{
                error: 'OTP not found, generating new OTP'
            },
        } 
    }
    
    //check otp counter limit
    if(userOTP.counter >= 2){
    
          //check if otp is expired
          let now =  Date.now() 
          let otpDate = new Date(userOTP.created_at)
          let diff = Math.abs(now - otpDate);
          var minutes = Math.floor((diff/1000)/60);
          console.log('time3:' + minutes);

          //disable after 5 minutes
          if(minutes > 4){
            await UserOTP.findOneAndUpdate({user: user.id, otp: userOTP.otp},{status: false,  deleted_at: Date.now()})
            return {
                status:false,
                message:{
                    error:`Try Again..`
                }
            }
          }

          return {
            status:false,
            message:{
                error:`Attempt exceeds, try after ${5 - minutes} minutes`
            }
        }

    }
    
    //fetch OTP
    console.log(userOTP.otp);
    
    //create message
    let message =   `Hi  ${user.name} , OTP to verify your account is  ${userOTP.otp}. OTP will expire in 5 minutes. Do not share with anyone.`

    //send otp and get status
    const smsStatus = true
    //const smsStatus = sendSMS(user.phone, message)

    //update OTP details
    if(smsStatus){
        let update = await UserOTP.findOneAndUpdate({user: user.id, otp: userOTP.otp},{ $inc: { counter: 1 } })
        console.log(update);
        
    }
   
    return {
        status:true,
        message: 'OTP resend successfully'
    }
    
    
}

module.exports = {
    generateOTP,
    verifyOTP,
    resendVerificationOTP
}