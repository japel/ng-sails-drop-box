module.exports = {
  index: function (req, res) {
    var user = req.user || false;
    if(user.password) delete user.password;
    res.view("homepage", {user: JSON.stringify(user)});
  }
};
