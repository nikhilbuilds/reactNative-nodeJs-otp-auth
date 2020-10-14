var express = require('express')
var router = express.Router()
var auth = require('../../middlewares/apiAuth')
const User = require('../../models/User')

router.get('/', (req, res) => {
    res.send('<h1>Index Page</h1>')
})

router.get('/api/user', auth, async(req, res) => {
    try{
        console.log(req.user.id);
        
        const user = await User.findById(req.user.id).populate('user',['name', 'email'])
        if(!user) return res.status(400).json({msg: "User Not Found"})
        res.json(user)

    } catch(err){
        console.log(err.message);
        
        res.status(500).send('Server Error')
    }
})

module.exports = router