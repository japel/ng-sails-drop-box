module.exports = function(req, res, next){
  if (req.session.passport.user){
    return next();
  }else{
    return res.status(401).json({error: true, success: false, message: 'required auth'});
  }
};
