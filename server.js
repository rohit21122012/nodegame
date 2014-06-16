//branch for trying chatnode.js setup



var appPort =  process.env.PORT || 3000;

var express = require('express');
var app = express();
var http = require('http')
, server = http.createServer(app)
, io = require('socket.io').listen(server);

var mysql = require('mysql');


var db = mysql.createConnection(
{
host: 'localhost',
user: 'root',
password: 'root',
database: 'goods$nothing'
});

db.connect(function(err)
{
if(err) console.log(err);

});


app.set('views', __dirname + '/views');
app.set('view engine', 'jade')
app.set('view options', { layout: false });
app.configure(function() {
app.use(express.static(__dirname + '/public'));
});
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser('My SuperKey'));
app.use(express.session());

var auth = function restrict(req, res, next)
{
	if(req.session.user)
	{
		next();
	}
	else
	{
		req.session.error = "Access Denied";
		res.redirect('/login');
	}
} 

var presentUser, array;

app.get('/',auth, function(req, res){
	res.render('start.jade');
});

app.get('/login', function(req, res){
	res.render('start.jade');
});

app.post('/login', function(req, res){
	
	var username = req.body.username;
	var password = req.body.password;
	console.log('SELECT * FROM users WHERE username =' + mysql.escape(username) + ' and password =' + mysql.escape(password)+'');
	//var avatar = req.body.avatar;
	db.query('SELECT * FROM users WHERE username =' + mysql.escape(username) + ' and password =' + mysql.escape(password)+'', function(err, row)
	{
		if (err) throw err;
		
		if(row.length === 0)
		{
			db.query('INSERT INTO users SET ?',{username: username, password: password}, function(err, row)
			{
			if (err)throw err; 

			});

			req.session.regenerate(function(){
				req.session.user = username;
				presentUser = req.session.user;

				var cardDoneArray = new Array;
				cardDoneArray.push(0);
				req.session.array = cardDoneArray;
				array = req.session.array;
				

				res.redirect('/game');
			});
		}
		else 
		{
			req.session.regenerate(function(){
				req.session.user = username;
				presentUser = req.session.user;

				var cardDoneArray = new Array;
				cardDoneArray.push(0);
				req.session.array = cardDoneArray;
				array = req.session.array;
				

				
				res.redirect('/game');
			});                  
		}         
	});
});


app.get('/',auth,function(req, res){
	res.render('home.jade');
});

app.get('/game', auth, function(req, res){

	res.render('home.jade');
});


app.get('/logout',auth, function(req, res){
	if(req.session)
	{ delete req.session.user;
	 delete req.session.array;
	 delete presentUser;
 	 }
 	 res.redirect('/login');
});

server.listen(appPort);
// app.listen(appPort);



io.sockets.on('connection', function (socket)
{	
	
	socket.on('pageLoaded', function (res, req)
	{
		socket.set('pseudo', presentUser);
		
		var lock = 1;
		if(lock === 1)
		{

			var counter;
			var inserts = ["id", "name", "specs","image"];
			var noOfGoods = db.query('SELECT ?? FROM goods WHERE id NOT IN (?)', [inserts, array],function(err, row)
			{
				if (err) throw err;
				for(counter = 0; counter < row.length;counter++){
					console.log("Hello");
					socket.emit('row', row[counter]);
				}   
			});
		 	console.log(noOfGoods.sql);
		}
	
	lock = 0;
	
	
	
	}); 

	


	
	socket.on('valueData', function(valueData)
	{	

		console.log("Card no : "+ valueData['id']+" is set to " +valueData['value']);
		array.push(valueData['id']);

		var presentCardValue = GetExactValue(valueData['id']);
		var addXP = CalculateXP(presentCardValue, valueData['value']);
		console.log("addXP is" + addXP + "presentCardValue is " + presentCardValue);
		socket.emit('xp', addXP);
		var presentXP = db.query('SELECT xp FROM users WHERE username ='+ mysql.escape(presentUser), function(err, row){
			if (err) throw err;
			console.log(row[0].xp);
			presentXP = mysql.escape(row[0].xp);
		 } );
		
		console.log("presentXP is " + presentXP);
		
		var XPIncrease = db.query('UPDATE users SET ? WHERE username =' + mysql.escape(presentUser) , {xp: (presentXP + addXP)},function(err, row)
		{
			if (err) throw err;
		});
		//console.log(xp.sql);
	});




	socket.on('message', function (message) 
	{
		socket.get('pseudo', function (error, name)
		{
			var data = { 'message' : message, pseudo : name };
			socket.broadcast.emit('message', data);
			console.log("user " + name + " send this : " + message);
		});

	});



});

/*
var goodsData = {'goodsNames': goodsNames, 'goodsDescriptions': goodsDescriptions};
socket.emit('goods', goodsData);
*/
/*

function GetExactValue(objectId){
	console.log("objectId is " + objectId);
	var cardValue;
	db.query('SELECT value FROM goods WHERE id = ?', objectId ,function(err, row){
		if (err)throw err;
		//console.log(cardValue);
		cardValue = row[0].value;
		console.log("CARDVALUE IS " + cardValue);
	});
	console.log("2.CardValue is " + cardValue);
	
	return cardValue;
}

function CalculateXP(real, guessed){
	var diff = Math.abs(real-guessed);
	var xp;
	if(diff>0 && diff<(0.1 * real))
	{
		xp = 15;
	}
	else if(diff>=10 && diff<(0.2 * real))
	{
		xp = 10;
	}
	else if(diff>=(0.2 * real) && diff<(0.3 * real))
	{
		xp = 5;
	}
	else if(diff>=(0.3 * real) && diff<( 1 * real))
	{
		xp = 0;
	}
	else
	{
		xp = -10;
	}
	console.log("XP is " + xp);
	return xp;
}
*/