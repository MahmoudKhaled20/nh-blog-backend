const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email}).exec((err, user) => {

    if (user) {
      return res.status(400).json({error: 'Email is already taken'});
    }

    const {name, email, password, userType} = req.body;

    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;
    let newUser = new User({name, email, password, userType, profile, username});

    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({ error: err});
      }

      //res.json({ user: success});
      res.json({message: 'Signup success, please sign in..'});
    });
  });
};

exports.signin = (req, res) => {

  const {email, password} = req.body;
  //check if user exist
  User.findOne({ email}).exec((err, user)=>{
    if(err || !user){
      return res.status(400).json({ error: 'User does not exist. please signup or try to signin again later.'});
    }

    //authenticate
    if(!user.authenticate(password)){
      return res.status(400).json({ error: 'Email and password do not match.'});
    }

    //generate token and send it to client
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
    res.cookie('token', token, {expiresIn: '1d'});
    const {id, username, name, email, role, userType} = user;

    return res.json({ token, user:  {id, username, name, email, role, userType}});
  });
};

exports.signout = (req, res)=>{
  res.clearCookie("token");
  res.json({
    message:'Signout success'
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
});

exports.authMiddleware = (req,res,next)=>{
  const authUserId = req.user._id;
  User.findById({_id: authUserId}).exec((err,user)=>{
    if(err || !user){
      return res.status(400).json({
        err: 'User not found'
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req,res,next)=>{
  const adminUserId = req.user._id;
  User.findById({_id: adminUserId}).exec((err,user)=>{
    if(err || !user){
      return res.status(400).json({
        err: 'User not found'
      });
    }

    if(user.role !== 1){
      return res.status(400).json({
        err: 'Admin resource. Access denied.'
      });
    }

    req.profile = user;
    next();
  });
};