(function(window){

var utils = {};


// Check if the passed parameter is a valid email address
utils.isEmailAddress = function(eaddr) {
	var pos, str, dotPos, str2;

	try {
		if (!eaddr || typeof eaddr !== "string") throw "EmailAddressFormatException";//check if parameter is falsy or is not a string
		pos = eaddr.indexOf("@");
		if (pos <= 0 || pos == eaddr.length-1 ) throw "EmailAddressFormatException";// check if @ is part of the address, not the first or last char
		if (pos !== eaddr.lastIndexOf("@") ) throw "EmailAddressFormatException";// check if there is only one @
		str = eaddr.substr(pos+1);
		dotPos = str.indexOf(".");
		if (dotPos <= 0 || dotPos == str.length-1 ) throw "EmailAddressFormatException";
		if (dotPos !== str.lastIndexOf(".") ) throw "EmailAddressFormatException"; // check if there is only one .
		str2 = str.substr(dotPos+1);
		if (str2.length < 2 || str2.length > 3) throw "EmailAddressFormatException";// check if the part after @ is string.st or string.str
	}
	catch(e) {
		return false;
	}
	
	return true;
}

function stringToWords(value) {
	return value ? value.replace(/[,-.:;?!]/g," ").trim().split(" ") : [];
}

utils.isLength = function(input, n) {
	return input.length <= n ? true : false;
}
//
utils.isOfLength = function(input, n) {
	return input.length >= n ? true : false;
}
//
utils.countWords = function(input) {
	return stringToWords(input).length;
}
//
utils.lessWordsThan = function(input, n) {
	return this.countWords(input) <= n ? true : false;
}
//
utils.moreWordsThan = function(input, n) {
	return this.countWords(input) >= n ? true : false;
}




window.utils = utils; // Expose to global
// end IIFE
})(window);