const express = require('express'); 
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const dns = require("dns");
const { check } = require('express-validator');
const {VShortTerm,shortTerm,longTerm,validate, docupload, cloudinary,} = require('./security');
const VShort = VShortTerm(5,1);
const VShort1 = VShortTerm(5,1);
const short = VShortTerm(60,2);
const long = VShortTerm(600,5);
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const {  chatusers } = require('./auth');

router.get('/', async (req, res) => {
    try{
   
    if(req.session.userName){
        res.redirect('/chat');
    } else {
        res.render('auth');
    }
}catch(err){
    console.error('Error fetching users:', err);
    res.status(500).send('Internal Server Error');
}
});

router.get('/chat', async (req, res) => {
    try{
    if(req.session.userName){
         const users = await chatusers.find({});
        res.render('index' , { user: { username: req.session.userName, profilePic: req.session.photourl }  , 
            users : users,}
        );
    } else {
        res.redirect('/');
    }
}catch(err){
    console.error('Error fetching users:', err);
    res.status(500).send('Internal Server Error');
}
});




module.exports = { router };