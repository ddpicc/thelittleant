let dotenv = require('dotenv');
dotenv.config({path: '../.env'});


module.exports = {
	randomCode (length) {
		var chars = ['0','1','2','3','4','5','6','7','8','9'];
		var result = ""; 
		for(var i = 0; i < length ; i ++) {
				var index = Math.ceil(Math.random()*9);
				result += chars[index];
		}
		return result;
	},
}