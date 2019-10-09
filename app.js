const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const indexRouter = require('./route/index');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rasgo.iptime.org:27017/toapp6', {useNewUrlParser: true}, (err) => {
	
	if( err ) {

	} else {
		console.log(`===> Succeeded in connecting`);
	}
});

app.use(express.static(path.join(__dirname,'public')));

app.use('/', indexRouter);
app.use(ErrorHandler);
app.use(CatchError);

app.listen(3000, function() {
	console.log('app listening on port 3000!');
});

function ErrorHandler(req, res, next) {
	console.log('Can not found any router!!!!');
	res.status(404).end();
}

function CatchError(err, req, res, next) {
	console.log('Can not found any router');
	res.status(500).end();
}

