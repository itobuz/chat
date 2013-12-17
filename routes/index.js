module.exports = function() {

	var functions = {};

	functions.chat = function(req, res) {
		res.render('index', { 
  			title: 'Express', 
  			scripts:['../javascripts/script.js']
 		});

	}
	
	return functions;
};


  	