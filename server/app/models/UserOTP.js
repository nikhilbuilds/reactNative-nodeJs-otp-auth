const mongoose = require('mongoose')

const UserOTPSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },

    otp:{
        type: Number,
        required: true,
        unique: true
    },
    counter:{
        type: Number,
        required: true,
        default:0
    },
    status:{
        type: Number,
        default: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    },
    deleted_at:{
        type: Date,
    }

    
})
module.exports = mongoose.model('userOTP', UserOTPSchema);

