var dgram = require('dgram');

module.exports = function(ZKLib) {

	ZKLib.prototype.cleardata = function (cb) {
		return this._executeCmd( this.CMD_ATTLOG_RRQ, '', cb );
	}
}