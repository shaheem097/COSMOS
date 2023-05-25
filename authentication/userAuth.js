module.exports = {
  userAuth: (req, res, next) => {
    if (req.session.user) {
      next();
    } else if (req.session.blockpage) {
      res.redirect("/blocked");
    } else {
      req.session.goback = true;
      res.redirect("/login");
    }
  },
};
