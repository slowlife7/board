const express = require("express");
const router = express.Router();
const fs = require("fs");
router.get("/", (req, res, next) => {
    console.log('index');
    fs.readFile("./views/index.html", (err, data) => {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      console.log('rrrrrrrrrrr');
      res.end(data);
    });
});

module.exports = router;
