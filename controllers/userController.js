const secrets = require('../config/secrets.js');
const User = require('../model/User')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const router = require('../Routes/userRoutes')
const key = secrets.jwtSecret
const singup = async(req,res,next) => {
    const {name, email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email:email})
    } catch (err) {
        console.log(err)
    }
    if (existingUser) {
        return res.status(400).json({message:"Existing User"})
    }

    const hashedPassword = bycrypt.hashSync(password)
    const user = new User({
        name,
        email,
        password: hashedPassword
    })

    try {
        await user.save();
    } catch (err) {



    }
    return res.status(201).json({message:user})
}
const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email:email})
    } catch (err){
        return new Error(err)
    }
    if (!existingUser) {
        return res.status(400).json({message:"Signup please"})
    }
    const isPasswordCorret = bycrypt.compareSync(password,existingUser.password)
    if (!isPasswordCorret) {
        return res.status(400).json({message:'Invalid email or password'})
    }
    const token = jwt.sign({id: existingUser._id}, key, {
        expiresIn: "3d"
    })
    return res.status(200).json({message:"Logged in!", user: existingUser, token})
}   

const verifyToken = (req,res,next) => {
    const headers = req.headers['authorization']
    const token = headers.split(" ")[1]
    if (!token) {
        res.status(404).json({message: "No token"})
    }
    jwt.verify(String(token), key, (err, user) => {
        if (err) {
            return res.status(400).json({message:"Invalid token"})
        }
        console.log(user.id)
        req.id = user.id
    })
    next()
    //headers look like bearer token------------------------------
    //so split
    // console.log(headers)
}

const getuser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-password")
    } catch (err) {
        return new Error(err)
    }
    if (!user) {
        return res.status(404).json({message:"User not found"})
    }
    return res.status(200).json({user})
}
exports.singup = singup
exports.login = login
exports.verifyToken = verifyToken
exports.getuser = getuser