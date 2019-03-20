var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var url = require('url');
var Busboy = require('busboy');

var app = express();

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/google-code-prettify"));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res){
	var datas = fs.readdirSync(`${__dirname}/public/`);
/*	var main = [];

	for(var i = 0; i < datas.length; i++){
		main.push(datas[i]);
		if(!datas[i].includes(".")){ 
			var temp = fs.readdirSync(__dirname + "/" + datas[i]);
			for (var j = 0; j < temp.length; j++)
				main.push(datas[i] + "/" + temp[j]);
		}
	}*/

	res.render('myProjectTest', {
		//files : main
		files : datas
	});
});

app.post('/', function(req, res) {
	var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = path.join(__dirname + "/public/" + filename);
      console.log('Uploading: ' + saveTo);
      file.pipe(fs.createWriteStream(saveTo), function(error) {
      	console.log(error);
      	res.redirect('/');
      });
    });
    busboy.on('finish', function(err) {
      	console.error(err);
	    res.redirect('/');
    });
    return req.pipe(busboy);
    
    
});
/*app.get('/data', function(req, res){
	var datas = fs.readdirSync(__dirname);
	res.send(datas);
});*/


app.get('/data', function(req, res) {
	console.log(req.query.filename);
	var value = [];
	if(req.query.filename){
		var datas = fs.readdirSync(__dirname + '/public/' + req.query.filename);
		for(var i = 0; i < datas.length; i++)
			value.push(req.query.filename+'/'+datas[i]);
		res.send(value);
	}
	else {
		var datas = fs.readdirSync(__dirname+'/public/');
		res.send(datas);
	}

});


var server = app.listen(8080, function() {
	var host = server.address().address
 	var port = server.address().port

 	console.log('Example app listening at http://%s:%s', host, port)
})