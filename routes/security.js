const express = require('express'); 
const { check , validationResult} = require('express-validator');
const { link } = require('fs');
let ratelimit = require('express-rate-limit');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINNAME,
  api_key: process.env.CLOUDINAPI,
  api_secret: process.env.CLOUDINSEC,
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Only images allowed'), false); 
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage,
    fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
 });

 const docstorage = multer.memoryStorage();
  const docupload = multer({ docstorage,
    limits: { fileSize: 20 * 1024 * 1024 },
  });

const VShortTerm = (sec,max)=>{
return ratelimit({
  windowMs:  5 * 1000, 
  max: max,
  standardHeaders: true,
    legacyHeaders: false,
   handler: (req, res) => {
    res.status(429).json({
      success: false,
      total : sec,
      message: "Please wait few seconds before clicking again.",
      retryAfter: sec,
    });
 }
});
}
const shortTerm =(sec,max)=>{
return ratelimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: max, 
  standardHeaders: true, 
    legacyHeaders: false,
   handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime; 
    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
 
    res.status(429).json({
      success: false,
      total : sec,
      message: "Please wait 60 seconds before requesting another code.",
     secondsLeft: secondsLeft,
    });
 }
});
}


const longTerm =(sec,max)=>{
  return ratelimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: max,
  standardHeaders: true, 
    legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime; 
    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
 
    res.status(429).json({
      success: false,
      total : sec,
      message: " Your limit has reached ,Please Try again after 10 Minutes.",
      secondsLeft: secondsLeft,
    });
 }
});
}



const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedError = errors.array()[0].msg;
  
  return res.status(400).json({
    success: false,
    message: extractedError,
  });
};

module.exports={
VShortTerm,
shortTerm,
longTerm,
validate,
upload,
cloudinary,
docupload,
};

