

			//var messagesElement = document.getElementById('roomContent');
			var infoElement = document.getElementById('info');
			var lastMessageElement = null;

			function addMessage(message, room) {
				var newMessageElement = document.createElement('div');
				var newMessageText = document.createTextNode('<div class="active"> {'+room+'} </div>'+message);

				newMessageElement.appendChild(newMessageText);
				//messagesElement.insertBefore(newMessageElement, lastMessageElement);
				$('#roomContent #' + room + '').prepend(newMessageElement);
				//lastMessageElement = newMessageElement;

			}

			var socket = io.connect('http://localhost:3000/chat');
			socket.on('serverMessage', function(content) {
				addMessage(content.content, content.room);
			});

			socket.on('serverInfo', function(message) {
				
				infoElement.innerHTML = message;
				
			});

			socket.on('entry', function(username) {
				var username = prompt('What username would you like to use?');
				socket.emit('login', username);
			});

			function sendCommand (command, args) {
				if(command === 'j') {
					//console.log("joining args" + args);
					socket.emit('join', args);
				} else {
					alert('unknown command: ' + command);
				}
			}

			function sendMessage (message, room) {
				var commandMatch = message.match(/^\/(\w*)(.*)/);
				if(commandMatch) {
					sendCommand(commandMatch[1], commandMatch[2].trim());
				} else {
					socket.emit('clientMessage', {message : message, room: room});
				}
			}

			var inputElement = document.getElementById('input');

			inputElement.onkeydown = function(keyboardEvent) {
				if (keyboardEvent.keyCode === 13) {
					//socket.emit('clientMessage', inputElement.value);
					var r = $('#rooms li.active a').attr('href');
					r = r.replace('#','');
					
					sendMessage(inputElement.value, r);
					inputElement.value = '';
					return false;
				} else {
					return true;
				}
			}

			socket.on('roomList', function(roomName) {
				var li = '<li><a href="#'+ roomName +'" >'+ roomName +'</a></li>';
				$("#roomList").append(li);
			});

			socket.on('loadRooms', function(rooms) {
				for(var r in rooms) {
					var rname = rooms[r];
					console.log("room :"+ r);
					r = r.split('/');
					if(r[2]) {
						var li = '<li><a href="#'+ r[2] +'" >'+ r[2] +'</a></li>';
						$("#roomList").append(li);
					}
				}
				
			});

			jQuery( document ).ready(function( $ ) {

				$(document).on("click", "#roomList li a", function (e) {
					e.preventDefault()
					var r = $(this).attr('href');
					r = r.replace('#','');
					console.log("click : "+ r);
					//socket.emit('join', r);
					checkAddRoom(r);
				});


				$('#myTab a').click(function (e) {
					e.preventDefault()
					$(this).tab('show')
				});
				$('#createRoom').click(function (e) {
						e.preventDefault();
						var roomName = prompt('What room name would you like to use?');
						if(roomName != null) {
							
							
							checkAddRoom(roomName);
							
						}
				});
					  // Code using $ as usual goes here.
			});
			function checkAddRoom(roomName) {
				
				socket.emit('join', roomName); // join only if a room name does not exists.

				if($('#rooms li a[href$="#'+roomName+'"]').length){

					$('#rooms li').removeClass('active');
					$('#rooms li a[href$="#'+roomName+'"]').parent().addClass('active');

				} else {
					
					$('#rooms li').removeClass('active');
					$('#roomContent .tab-pane').removeClass('active');
					var li = '<li class="active"><a href="#'+ roomName +'" data-toggle="tab">'+ roomName +'</a></li>';
					$("#rooms").append(li);
					li = '<div class="tab-pane well messageBox active" id="'+ roomName +'">...</div>';
					$("#roomContent").append(li);

				}

			}