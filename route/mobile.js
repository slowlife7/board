const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get('/', (req,res,next) => {
    fs.readFile("./views/layout_phone.html", (err, data) => {
        if (err) {
          next(err);
          return;
        }
        res.end(data);
    });
});

module.exports = router;
