var http = require('http'),
	repl = require('repl'),
	app = require('./app')();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.set('log level', 1); // reduce logging

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var Room = require('./models/rooms');
var newroom = new Room({roomNum:0, roomName: 'Lobby', isPublic: 1, userCount: 0, users:[]});
var roomCount = 1;

var clients = {};

var chat = io.of('/chat');

chat.on('connection', function (socket) {
	socket.on('clientMessage', function(content) {
		socket.emit('serverMessage', 'You said : ' + content.message);



		socket.get('username', function (err, username) {
			if(!username) {
				username = socket.id;
			}

			//socket.get('room', function (err, room) {
				//if(err) { throw err; }
				var broadcast = socket.broadcast;
				var message = content.message;
				if(content.room) {
					broadcast = broadcast.to(content.room);
				}
				broadcast.emit('serverMessage', username + ' said : ' + message);
				
				
				var handshaken = io.sockets.handshaken;
				var connected = io.sockets.connected;
				var open = io.sockets.open;
				var closed = io.sockets.closed;

				console.log(io.sockets.clients().length);
			//});

			
		});
	});

	socket.on('login', function (username) {
		socket.set('username', username, function(err) {
			if(err) { throw err; }

			socket.join(newroom);
			room = newroom.data.roomName;

			//socket.set('room', [newroom]);

			//console.log("Get Rooms: " + socket.get('room'));

			newroom.data.users.push({id: socket.id, username: username});
			clients[socket.id] = newroom;

			console.log(newroom.data);

			socket.broadcast.emit('serverInfo', 'Total Rooms : '+ room);

			socket.emit('serverMessage', 'Currently loggedin as : ' + username);
			socket.broadcast.emit('serverMessage', 'User ' + username + ' logged in');
		});
	});

	socket.on('disconnect', function() {
		//delete chatClients[socket.id];
		socket.get('username', function(err, username) {
			if(!username) {
				username = socket.id;
			}
			
			/*var index = array.indexOf(5);
			

			if (index > -1) {
			    array.splice(index, 1);
			}
			*/
			socket.broadcast.emit('serverMessage', 'User ' + username + ' disconnected');
			
		});
	});

	socket.on('join', function(room) {
		//console.log("New room"+ room);
		/*socket.get('room', function(err, oldRoom) {
			if(err) { throw err; }

			socket.set('room', room, function (err) {
				if(err) { throw err; }*/

				var newerroom = new Room({roomNum:roomCount, roomName: room, isPublic: 0, userCount: 0, users:[]}); //get room name from the user input later on
				newerroom.data.users.push(socket.id);
				console.log(newerroom.data);

				socket.join(room);
				roomCount++;

				/*if(oldRoom){
					socket.leave(oldRoom);
				}*/
				socket.get('username', function (err, username) {
					if(!username){
						username = socket.id;
					}
				});

				socket.emit('serverMessage', 'You joined room: ' + room);
				socket.get('username', function (err, username) {
					if(!username){
						username = socket.id;
					}
					socket.broadcast.to(room).emit('serverMessage', 'User '+ username + ' joined this room ' + room);
					socket.emit('serverInfo', 'Total Rooms : '+ newerroom.data.roomName);
				});

				chat.emit('roomList', newerroom.data.roomName);
			/*});

		});*/
	});

	socket.emit('entry');
});


var prompt = repl.start({prompt: 'rooms> '});

var rooms = require('./models/rooms');
prompt.context.io = io;
prompt.context.room = rooms;
prompt.context.clients = clients;