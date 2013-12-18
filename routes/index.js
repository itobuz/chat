module.exports = function() {

	var functions = {};

	functions.chat = function(req, res) {
		res.render('index', { 
  			title: 'Express', 
  			scripts:['../javascripts/jquery-1.10.2.js', '../javascripts/bootstrap.js', '../javascripts/script.js']
 		});

	}
	
	return functions;
};


  	