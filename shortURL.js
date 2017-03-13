var _alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_',
	_base = _alphabet.length;

module.exports.encode = function (num) {
	var str = '';
	while (num > 0) {
		str = _alphabet.charAt(num % _base) + str;
		num = Math.floor(num / _base);
	}
	return str;
};

module.exports.decode = function (str) {
	var num = 0;
	for (var i = 0; i < str.length; i++) {
		num = num * _base + _alphabet.indexOf(str.charAt(i));
	}
	return num;
};