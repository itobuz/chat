

			var messagesElement = document.getElementById('messages');
			var infoElement = document.getElementById('info');
			var lastMessageElement = null;

			function addMessage(message) {
				var newMessageElement = document.createElement('div');
				var newMessageText = document.createTextNode(message);

				newMessageElement.appendChild(newMessageText);
				messagesElement.insertBefore(newMessageElement, lastMessageElement);
				lastMessageElement = newMessageElement;

			}

			var socket = io.connect('http://192.168.1.117:3000/chat');
			socket.on('serverMessage', function(content) {
				addMessage(content);
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

			function sendMessage (message) {
				var commandMatch = message.match(/^\/(\w*)(.*)/);
				if(commandMatch) {
					sendCommand(commandMatch[1], commandMatch[2].trim());
				} else {
					socket.emit('clientMessage', message);
				}
			}

			var inputElement = document.getElementById('input');

			inputElement.onkeydown = function(keyboardEvent) {
				if (keyboardEvent.keyCode === 13) {
					//socket.emit('clientMessage', inputElement.value);
					sendMessage(inputElement.value);
					inputElement.value = '';
					return false;
				} else {
					return true;
				}
			}

		
			$('#myTab a').click(function (e) {
				e.preventDefault()
				$(this).tab('show')
			});
			$('#createRoom').click(function (e) {
					e.preventDefault();
					var roomName = prompt('What room name would you like to use?');
					var li = '<li><a href="#'+ roomName +'" data-toggle="tab">'+ roomName +'</a></li>';
					$("#rooms").append(li);
					li = '<div class="tab-pane well messageBox" id="'+ roomName +'">...</div>';
					$("#roomContent").append(li);
			});
		