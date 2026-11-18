const jwt = require('jsonwebtoken');
require('dotenv').config();
function auth(req,res,next){const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');if(!token)return res.status(401).json({message:'Please sign in first.'});try{req.user=jwt.verify(token,process.env.JWT_SECRET||'dev_only_secret_change_me');next()}catch{return res.status(401).json({message:'Session expired or invalid. Please sign in again.'})}}
function adminOnly(req,res,next){if(req.user?.role!=='ADMIN')return res.status(403).json({message:'Administrator access required.'});next()}
module.exports={auth,adminOnly};
