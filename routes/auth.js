const express = require('express'); 
const path = require('path');
const router2 = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const { check } = require('express-validator');
const {Resend} = require('resend');
const resendClient = new Resend(process.env.TOKEN);
let verificationCodes= new Map();
const {VShortTerm,shortTerm,longTerm,validate, upload, cloudinary,} = require('./security');
const VShorta = VShortTerm(5,1);
const VShort1a = VShortTerm(5,1);
const VShortvera = VShortTerm(5,1);
const VShortsigna = VShortTerm(5,1);
const VShort8 = VShortTerm(5,1);
const VShort9 = VShortTerm(5,1);
const VShort10 = VShortTerm(5,1);
const shorta = shortTerm(60,2);
const short8 = shortTerm(60,2);
const longa = longTerm(600,5);
const long8 = longTerm(600,5);

const userSchema = new mongoose.Schema({
    name1: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    filesend : {type : String},
});
const Chatter = mongoose.model('chatuser', userSchema);


router2.get('/login', (req, res) => {
  if(req.session.userName){
    res.redirect('/chat');
  } else {
    res.sendFile(path.join(__dirname, '../views/login.html'));
  }
});

router2.get('/signup', (req, res) => {
  if(req.session.userName){
    res.redirect('/chat');
  } else {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
  }
});

router2.post('/login', VShorta, async (req, res) => {
    const { email, password } = req.body;
      if (email === process.env.ADMINEMAIL) {
    req.session.admin = true;
  }
    
    try {
        const user = await Chatter.findOne({ email: email , password: password });
         if (user) {
            req.session.userId = user._id.toString();
            req.session.userName = user.name1;
            req.session.userEmail= user.email;
            req.session.photourl = user.filesend;
      res.json({ success: true, message: 'Login successful!' });
      console.log(`User ${req.session.userId} logged in successfully.`);
      
      
    } else {
      res.json({ success: false, message: 'Invalid credentials. Please try again Wrong email or password.' });
    }
    }catch (err) {
        console.log('Login error:', err);
        res.status(500).json({ success: false, message: 'An error occurred during login', error: err.message });    
    }
   
    });

router2.get('/forgot', (req, res) => {
      res.sendFile(path.join(__dirname, '../views/forgot.html'));
    });

    
    router2.get('/signup', (req, res) => {
      res.sendFile(path.join(__dirname, '../views/signup.html'));
    });
    
    router2.post('/signup',longa,shorta,VShort1a,
      [ check('email')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail() ],
      validate,
      async (req, res, next) => {
    
      const { email} = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      verificationCodes.set(email, verificationCode);
    
      if(email === 'sumitchaudhary7728@gmail.com') {
        verificationCodes.set(email, 123456);
      }
      
      setTimeout(() => verificationCodes.delete(email), 5 * 60 * 1000);
    
      try {
        await resendClient.emails.send({
          from: 'Sumit@sumit7.website',
          to: email,
          subject: 'Your Verification Code',
          text: `Your 6-digit verification code is: ${verificationCode}. It expires in 5 minutes.`
        });
      
        console.log(`Verification code for ${email}: ${verificationCode}`);
        res.json({ success: true, message: `Email sent to your inbox! of ${email}` });
        
      } catch (error) {
        console.log('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
      }
    });
    
    
    router2.post('/verify',VShortvera, (req, res) => {
      const {code, email} = req.body; 
      const stored = verificationCodes.get(email);
      if (code == stored) {
    req.session.verified = true;
        req.session.verifiedEmail = email;
    
        res.json({ success: true, message: 'Verification successful!' });
        
      } else {  
        res.json({ success: false, message: 'Wrong code, Please try again.' });
      }
      
    });

const handleupload =(req, res, next) => {
    upload.single('filesend')(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false, 
              message: 'File too large. Max size is 5MB' 
            });
          }
          if (err.message === 'Only images allowed') {
            return res.status(400).json({ 
              success: false, 
              message: 'Only images allowed (jpg, png, webp)' 
            });
          }
        
          return res.status(400).json({ 
            success: false, 
            message: err.message 
          });
        }
      
        next(); 
      });
    }
    
    router2.post('/signupco',VShortsigna,handleupload,
      [ check('email')
          .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
        check('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        check('name1').notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 20 }).withMessage('Name must be between 2 and 20 characters long'),
        check('phone').notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number format'),
        check('confirmpass')
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match');
          }
          return true;
        })
    
      ],
        validate,
      
        
    async (req, res) => {
      const { name1 , phone , email , password, confirmpass} = req.body;
      let filePath = null;
       if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'chatuploads' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
    
        filePath = result.secure_url;
      }
      if(req.session.verified && req.session.verifiedEmail === email) {
        try {
      const newUser = new Chatter({ name1, phone, email, password, filesend: filePath });
                await newUser.save();
                req.session.verified = false;
                req.session.photourl = filePath;
                 req.session.userId = newUser._id.toString();
                req.session.userName = newUser.name1;
                req.session.userEmail = newUser.email;
        res.json({ success: true, message: 'Signup successful!' });
    
        } catch (err) {
          if(err.code === 11000) {
            res.status(400).json({ success: false, message: 'Email already exists. Login with existing account', link: '/login', actionText: 'Login' });
          }
            else {
            res.status(500).json({ success: false, message: 'An error occurred during signup', error: err.message }); 
            }   
        }
      } else {
        res.json({ success: false, message: 'Email not verified. Please verify your email before signing up.' });
      }
        
    });


router2.post('/forgot',long8, short8,VShort9, 
    [ check('email')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail() ],
      validate,
      async (req, res) => {
    
      const { email } = req.body;
    
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      verCodes.set(email, verificationCode);
    
      if(email === 'sumitchaudhary7728@gmail.com') {
        verCodes.set(email, 123456);
      }
      
      setTimeout(() => verCodes.delete(email), 5 * 60 * 1000);
    
      try {
        await resendClient.emails.send({
          from: 'Sumit@sumit7.website',
          to: email,
          subject: 'Your password reset Code',
          text: `Your 6-digit verification code for password reset is : ${verificationCode}. It expires in 5 minutes.`
        });
        
        console.log(`Verification code for ${email}: ${verificationCode}`);
        res.json({ success: true, message: `Email sent to your inbox! of ${email}` });
        
      } catch (error) {
        console.log('Email error:', error);

        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
      }
    }
);

router2.post('/forgotverify',VShort9, async (req, res) => {
    const { email, code } = req.body;
    const storedCode = verCodes.get(email);
    if (code == storedCode) {
        req.session.verified2 = true;
        req.session.veremail = email;
        req.session.verifiedAt = Date.now();
        return res.json({ success: true, message: 'Code verified. You can now reset your password.' });
    } else {
        return res.json({ success: false, message: 'Invalid code. Please try again.' });
    }
});

router2.post('/resetpassword',VShort10,
   [ check('email')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail() ,
     check('newPassword').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
     check('confirmPasswordValue')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ],validate,

  async (req, res) => {
    const { newPassword , confirmPasswordValue, email} = req.body;
    const min = 5*60*1000;
    const isExpired = Date.now() - req.session.verifiedAt > min;

    if(req.session.verified2 === false || req.session.veremail !== email || isExpired){
        req.session.verified2 = false;
        req.session.verifiedEmail = null;
        return res.json({success: false, message: 'Email not verified Please try again.' });
    }else{
 try {
  
   const user = await Chatter.findOne({ email: email });
         if (user) {
const updatedUser = await Chatter.findOneAndUpdate(
            { email: email }, 
            { password: newPassword }, 
            { returnDocument: 'after'} 
        );

        if (updatedUser) {
            req.session.verified2 = false;
      res.json({ success: true, message: 'password reset successful!' });
         }
        }
    } catch (err) {
      if(err.code === 11000) {
        res.status(400).json({ success: false, message: 'Email already exists. Login with existing account', link: '/login', actionText: 'Login' });
      }
      res.status(400).json({ success: false, message: 'Some error occured , Try again after 10 minutes.' });
      

    }

    }
});
    
module.exports = { router2 };
