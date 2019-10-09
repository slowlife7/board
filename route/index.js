const express = require('express');
const Video = require('../model/video');
const router = express.Router();
router.get(['/','/:title'], ( req, res, next) => {
	let page_no = 0, count_per_page = 10;
	const query = req.query;
	if ( Object.keys(query).length ) {
		page_no = query.page_no - 1;
		count_per_page = query.count_per_page;
	}

	req.page_no = page_no;
	req.count_per_page = count_per_page;

	if(req.params.title) {
		next();
		return;
	} 

	Video.countDocuments()
	.then( ( count ) => {
		req.count = count;
		console.log(req.count);
		return Video.find( {}, {_id:0, __v:0}).sort({created:-1}).skip(req.page_no * req.count_per_age).limit(req.count_per_page);
	})
	.then( ( result ) => {
		let items = result.map( ( item ) => {
			item.title = item._doc.title.replace(/._/, '');
			return item;
		});
		res.json({"search_count":req.count, "items":items});
	})
	.catch( ( err ) => {
		next(err);
	});
}, (req, res, next )=> {
	Video.countDocuments({"title": { $regex: '.*'+req.params.title+'.*'}})
	.then( ( count ) => {
		req.count = count;
		return Video.find({"title": { $regex: '.*'+req.params.title+'.*'}},
											{ _id:0, __v:0}).sort({created:-1}).skip(req.page_no * req.count_per_page).limit(req.count_per_page);
	})
	.then( ( result) => {
		let items = result.map( ( item ) => {
			item.title = item._doc.title.replace(/._/, '');
			return item;
		});
		res.json({"search_count":req.count, "items":items});
	})
	.catch( ( err ) => {
		next(err);
	});
});
module.exports = router;

