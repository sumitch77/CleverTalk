const express = require('express'); 
const path = require('path');
const router3 = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const { check } = require('express-validator');
const {VShortTerm,shortTerm,longTerm,validate, upload, cloudinary,} = require('./security');
const VShorta = VShortTerm(5,1);
const VShort1a = VShortTerm(5,1);
const VShortvera = VShortTerm(5,1);

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    Date: { type: Date, default: Date.now },
    
});
const fmainmessage = mongoose.model('mainfinalmsgs', messageSchema);

router3.post('/send-message/:id', async (req, res) => {
   
  try {
   const {message, receiver} = req.body;
   const newchat =  new fmainmessage({
    message: message,
    sender: req.session.userName,
    receiver: receiver,
   });
   await newchat.save();
    
    res.json({ success: true, message:message });
  } catch (err) {
    console.error('Error fetching user status:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router3.post('/display/:id', async (req, res) => {
   
  try {
    const { id , name } = req.body;
   const messages = await fmainmessage.find({})
    const msgarray = messages.filter(m => (m.sender === req.session.userName && m.receiver === name) || (m.sender === name && m.receiver === req.session.userName));
    
    res.json({ success: true, messages: msgarray });
  } catch (err) {
    console.error('Error fetching user status:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = { router3 };