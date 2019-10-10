const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const indexRouter = require('./route/index');
const videoRouter = require('./route/video');
const loginRouter = require('./route/login');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rasgo.iptime.org:27017/toapp6', {useNewUrlParser: true})
.then( () => { console.log('=====>Succeeded in connecting..'); } )
.catch( (err) => { console.log(err); })


app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.use('*.ico', FaviconHandler);


app.use('/video', videoRouter);
app.use('/test/test1', loginRouter);
app.use('/', indexRouter);
app.use(ErrorHandler);
app.use(CatchError);

app.listen(3000, function() {
	console.log('app listening on port 3000!');
});


function FaviconHandler(req, res, next) {
  console.log('favicon');
  res.status(200).end();
}

function ErrorHandler(req, res, next) {
	console.log('Can not found any router!!!!');
	res.status(404).end();
}

function CatchError(err, req, res, next) {
	console.log('Can not found any router');
	res.status(500).end();
}

