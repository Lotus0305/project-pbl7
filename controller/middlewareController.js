const jwt = require("jsonwebtoken");
const Account = require("../model/account");

const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.header("token");
    if (token) {
      accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
  },

  checkPermission: (permission) => {
    return (req, res, next) => {
      const account = Account.findById(req.user.id);

      permissions = account.role.permissions;
      if (permissions.includes(permission)) {
        next();
      } else {
        res.status(403).json("You are not authorized!");
      }
    };
  }
};

module.exports = middlewareController;
