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

router.get('/', (req, res) => {
    if(req.session.userName){
        res.render('index' , { user: { username: req.session.userName, profilePic: req.session.photourl } });
    } else {
        res.render('auth');
    }
});

router.get('/chat', (req, res) => {
    if(req.session.userName){
        res.render('index' , { user: { username: req.session.userName, profilePic: req.session.photourl } });
    } else {
        res.redirect('/');
    }
});



module.exports = { router };