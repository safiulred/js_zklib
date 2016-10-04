var dgram = require('dgram');

module.exports = function(ZKLib) {

	ZKLib.prototype.cleardata = function (cb) {
		var self = this;

		var command = self.CMD_CLEAR_ATTLOG;
		var command_string = new Buffer([]);
		var chksum = 0;
		var session_id = self.session_id;

		var reply_id = self.data_recv.readUInt16LE(6);

		var buf = self.createHeader(command, chksum, session_id, reply_id, command_string);

		self.socket = dgram.createSocket({type:"udp4", reuseAddr:true});
		self.socket.bind(self.inport);

		self.socket.once('message', function (reply, remote) {
			self.socket.close();
			self.data_recv = reply;

			if(reply && reply.length) {
				self.session_id = reply.readUInt16LE(4);
				cb(!self.checkValid(reply), reply);
			} else {
				cb("zero length reply");
			}
		});

		self.socket.send(buf, 0, buf.length, self.port, self.ip);
	}
}