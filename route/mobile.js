const express = require("express");
const router = express.Router();
const fs = require("fs");
const user = require("../model/user");

router.get("/", (req, res, next) => {
  fs.readFile("./views/layout_phone.html", (err, data) => {
    if (err) {
      next(err);
      return;
    }
    res.end(data);
  });
});

router.post("/login", (req, res, next) => {
  const session = req.session;

  if (session.userid) {
    res.redirect("/mobile");
  } else {
    user.findOne({ userid: req.body.userid }).then(result => {
      console.log(result.passwd);
      console.log(req.body.password);
      if (result.passwd === req.body.password) {
        session.userid = req.body.userid;
        session.passwd = req.body.password;
        res.redirect("/mobile");
      } else {
        res.redirect("/mobile/login");
      }
    });
    //find mongodb
  }
});

module.exports = router;
