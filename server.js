var express = require("express"),
	http = require("http"),
	redis = require("redis"),
	redisstore = require("socket.io-redis"),
	bodyParser = require("body-parser"),
	session = require("express-session"),
	MongoClient = require('mongodb').MongoClient,
	app = express(),
	server = http.createServer(app);
	
	server.listen(3000);
	
	app.use(express.static(__dirname + "/client"));
	app.use(bodyParser.urlencoded({extended: false}));

	app.use(session({
		secret: '1029384756',
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 60000 }
	})); 
	

var	socketIO = require('socket.io'),
	io = socketIO(server),
	nspLobby = io.of('/lobby'),
	nspGame = io.of('/ingame');

var sess;
var lobbyclients = [];
var gameclients = [];

console.log("Server is listening at http://localhost:3000/");

/* Constructors */
//new registration constructor
function newUser(username, password, email) {
	this.username = username;
	this.password = password;
	this.email = email;
}
/* End constructors */

//make connection to db
function connectDB(process, obj, req, res) {
	var mongourl = "mongodb://localhost/zombiedice";
	MongoClient.connect(mongourl, function(err, db) {
		if(err) {
			return console.dir(err);
		}
		var collection = db.collection('users');
		process(collection, obj, req, res);
	});
}

//search array for key
function findIndex (toSearch, key, value) {
	for (var i = 0; i < toSearch.length; i++) {
		if (toSearch[i][key] === value) {
			return i;
		}
	}
	return null;
}

//insert user into db
var register = function(collection, obj, req, res) { 
	var doc = {username: obj.username, password: obj.password, wins: 0, losses: 0};
	
	//see if user name already in use
	collection.findOne({username : obj.username}, function(err, item) {
		if(!err) {
			if (item !== null) {
				//name already in use
				console.log(obj.username + " already in db");
				res.json({"registration": false});
			} else {
				//insert new user into db
				collection.insert(doc, {w:1}, function(err, result) {
					if(!err) {
						console.log(obj.username + " Inserted");
						res.json({"registration": true});
					}
				}); 
			}	
		}			
	});
};

//search for item in db
var login = function(collection, obj, req, res) {
	collection.findOne({username : obj.username}, function(err, item) {
		if(!err) {
			if (item !== null) {
				if (obj.password === item.password) {
					sess=req.session;
					sess.username=obj.username;
					res.json({"logon":true});
				}
				else {
					res.json({"logon":false});
				}
			} else {
				res.json({"logon":false});
			}			
		}			
	});
};

//get current record for user
var record = function(collection, obj, req, res) {
	collection.findOne({username : obj.username}, function(err, item) {
		if(!err) {
			res.json({"username": item.username, "wins": item.wins, "losses": item.losses});
		}	
	});
};

//routing
app.get("/results", function (req, res) {
	//res.json(myJson);
});

app.get("/",function(req,res){
	console.log("inside /");
	sess=req.session;
	
	if(sess.username){
		res.redirect("/lobby.html");
	} else {
		res.redirect("/index.html");
	}
}); 

app.get("/logoff",function(req,res) {
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		} else {
			res.json({"logoff":true});
		}
	});
});

app.get('/getrecord', function(req, res) {
	sess=req.session;
	connectDB(record, sess, req, res);
});

app.get('/game', function(req, res) {
	sess = req.session;
	res.redirect("/gameboard.html");
});

app.get('/lobby', function(req, res) {
	console.log("returning to lobby");
	sess = req.session;
	if (sess.username) {
		res.redirect("/lobby.html");
	} else {
		res.redirect("/index.html");
	}
});

app.post("/registration", function (req,res) {
	
	var valid = true;
	var reginfo = req.body;
	var registration;

	registration = new newUser(reginfo.username, reginfo.password, reginfo.email);
	
	connectDB(register, registration, req, res);
});

app.post("/userlogin", function (req,res) {
	
	var userinfo = req.body;
	connectDB(login, userinfo, req, res);
});

//socket io interaction
//io.on('connection', function(socket) {
nspLobby.on('connection', function(socket) {
	console.log(sess.username + ' connected to lobby');
	
	//get display of current users in lobby
	//io.sockets.connected[socket.id].emit('current lobby', clients);
	nspLobby.connected[socket.id].emit('current lobby', lobbyclients);
	
	//add new user to clients
	lobbyclients.push({sid: socket.id, username: sess.username});
	
	//lets other users know someone has joined lobby
	socket.broadcast.emit('user join', sess.username, socket.id);
	
	//let other players know someone left
	socket.on('disconnect', function () {
		var index = findIndex(lobbyclients, "sid", socket.id);
		console.log(lobbyclients[index].username + ' left lobby');
		lobbyclients.splice(index, 1);
		socket.broadcast.emit('user left', socket.id);
	});
	
	//send challenge request
	socket.on('challenge', function(sid) {
		console.log("recieved challenge for " + sid);
		var index = findIndex(lobbyclients, "sid", socket.id);
		nspLobby.connected[sid].emit("challenge recieved", lobbyclients[index].username, socket.id);
	});
	
	//send decline
	socket.on('declined', function(sid) {
		console.log(sid + " declined challenge");
		nspLobby.connected[sid].emit("challenge declined");
	});
	
	//send decline
	socket.on('accepted', function(sid) {
		console.log(sid + " accepted challenge");
		nspLobby.connected[sid].emit("challenge accepted", socket.id);
	});

});

//game io interaction
nspGame.on ('connection', function(socket) {
	console.log(sess.username + ' joined game');
	console.log(sess);
	
	socket.on('disconnect', function () {
		console.log('someone disconnected');
		
	});
});
