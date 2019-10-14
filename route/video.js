const express = require("express");
const Video = require("../model/video");
const router = express.Router();
const boardAPI = require("../private/javascript/boardAPI")(Video);

router.get("/*.mp4", function(req, res, next) {
  const file = "/home/bear/video" + decodeURI(req.path);
  console.log(file);
  if (!fs.existsSync(file)) {
    return;
  }

  fs.stat(file, (err, stat) => {
    if (err) {
      //not found file
      if (err.code === "ENOENT") {
        return;
      }
    }

    let start = 0,
      end = stat.size,
      total = 0,
      contentLength = stat.size;
    let contentRange = false;
    const range = req.header("Range");
    if (range) {
      const position = range.replace(/bytes=/, "").split("-");
      start = parseInt(position[0], 10);
      total = stat.size;
      end = position[1] ? parseInt(position[1], 10) : total - 1;
      contentRange = true;
      contentLength = end - start + 1;
    }

    if (start <= end) {
      if (contentRange) {
        res.status(206).set({
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
          "Content-Range": "bytes " + start + "-" + end + "/" + total
        });
      } else {
        res.status(200).set({
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4"
        });
      }
      let st = fs
        .createReadStream(file, { start: start, end: end })
        .on("end", function() {
          console.log("Stream done");
          res.end();
        })
        .on("error", function(err) {
          console.error(err);
          res.end();
        })
        .pipe(
          res,
          { end: true }
        );
    } else {
      res.status(403).end();
    }
  });
});

router.get(
  ["/", "/:title"],
  (req, res, next) => {
    let page_no = 0,
      count_pagination = 5,
      count_per_page = 10;
    //refresh = false;

    const query = req.query;
    if (Object.keys(query).length) {
      page_no = query.page_no - 1 || page_no;
      count_per_page = query.count_per_page || count_per_page;
      count_pagination = query.count_pagination || count_pagination;
      //refresh = query.refresh || refresh;
    }

    req.page_no = page_no;
    req.count_per_page = count_per_page;
    req.count_pagination = count_pagination;
    //req.refresh = refresh;

    if (req.params.title) {
      next();
      return;
    }

    const json = {
      condition: {},
      sort: { created: -1 },
      skip: req.page_no * req.count_per_page,
      limit: parseInt(req.count_per_page)
    };

    boardAPI
      .getPageData(json)
      .then(result => {
        const page_info = getPageInfo(
          result.count_items,
          req.count_per_page,
          req.count_pagination,
          req.page_no + 1
        );
        res.json({ ...page_info, ...result });
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  },
  (req, res, next) => {
    const json = {
      condition: { title: { $regex: ".*" + req.params.title + ".*" } },
      sort: { created: -1 },
      skip: req.page_no * req.count_per_page,
      limit: parseInt(req.count_per_page)
    };

    boardAPI
      .getPageData(json)
      .then(result => {
        const page_info = getPageInfo(
          result.count_items,
          req.count_per_page,
          req.count_pagination,
          req.page_no + 1
        );
        res.json({ ...page_info, ...result });
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  }
);

function getPageInfo(count_items, count_per_page, count_pagination, page_no) {
  const count_page_group = Math.ceil(count_items / count_per_page); //페이징으로 보여질 총 페이지 개수
  let last_page_group =
    Math.ceil(page_no / count_pagination) * count_pagination; //현재 페이징에서 가장 마지막 페이지
  const first_page_group = last_page_group - count_pagination + 1; //현재 페이징에서 가장 첫 페이지
  if (last_page_group > count_page_group) {
    // 가장 마지막페이지가 전체 페이지 개수 보다 큰 경우
    last_page_group = count_page_group;
  }

  let page = {
    prev: first_page_group - 1 < 0 ? 0 : first_page_group - 1,
    first: first_page_group,
    last: last_page_group,
    cur: page_no > last_page_group ? last_page_group : page_no,
    next: last_page_group < count_page_group ? last_page_group + 1 : 0
  };

  return page;
}

module.exports = router;
