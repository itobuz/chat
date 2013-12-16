var Rooms = function(info) {
	this.data = {
		roomNum: null,
		roomName: null,
		roomOwner: null,
		userCount: null,
		isPublic: null,
	};
	this.fill = function(info) {
		for(var prop in this.data) {
			if(this.data[prop] !== 'undefined'){   //need to recheck this later
				this.data[prop] = info[prop];
			}
		}
	}

	this.getInformation = function() {
		return this.data;
	}

}

module.exports = function(info) {

	var room = new Rooms();
	room.fill(info);
	return room;

};