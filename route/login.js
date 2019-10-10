const express = require("express");
const router = express.Router();
const fs = require("fs");

const parseCookies = (cookie = "") =>
  cookie
    .split(";")
    .map(v => v.split("="))
    .map(([k, ...vs]) => [k, vs.join("=")])
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

router.get(
  "/",
  (req, res, next) => {
    if (req.headers.cookie) {
      const cookies = parseCookies(req.headers.cookie);

      if (cookies.name) {
        res
          .status(200)
          .set({
            "Content-Type": "text/html charset=utf-8"
          })
          .end(`${cookies.name}님 안녕하세요`);
      } else {
        next();
      }
    } else {
      next();
    }
  },
  (req, res, next) => {
    console.log("next");
    fs.readFile("./views/login.html", (err, data) => {
      if (err) {
        next(err);
        return;
      }
      res.end(data);
    });
  }
);

router.get("/login", (req, res, next) => {
  console.log("tttttq1");
  const name = req.query.name;
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 5);

  res
    .status(201)
    .cookie("name", name, { expires: expires })
    .redirect(302, "/test/test1");
});

module.exports = router;
