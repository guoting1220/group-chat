/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require('./Room');

/** ChatUser is a individual connection from client -> server to chat. */

class ChatUser {
  /** make chat: store connection-device, rooom */

  constructor(send, roomName) {
    this._send = send; // "send" function for this user
    this.room = Room.get(roomName); // room user will be in
    this.name = null; // becomes the username of the visitor

    console.log(`created chat in ${this.room.name}`);
  }

  /** send msgs to this client using underlying connection-send-function */

  send(data) {
    try {
      this._send(data);
    } catch {
      // If trying to send to a user fails, ignore it
    }
  }

  /** handle joining: add to room members, announce join */

  handleJoin(name) {
    this.name = name;
    this.room.join(this);
    this.room.broadcast({
      type: 'note',
      text: `${this.name} joined "${this.room.name}".`
    });
  }

  /** handle a chat: broadcast to room. */

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: 'chat',
      text: text
    });
  }


  handleJoke(msg) {
    msg.name = "server";
    this.send(JSON.stringify(msg));
  }


  handleChangeName(msg) {
    let oldName = this.name;
    let newName = msg.newName;
    this.name = newName;
    this.room.broadcast({
      type: 'note',
      text: `${oldName} changed name to "${newName}".`
    });
  }


  handleGetMembers(msg) {
    let members = "In room: ";
    for (let member of this.room.members) {
      members += `${member.name},`;
    }
    let len = members.length;
    if(members[len-1] === ",") {
      members = members.substring(0, len-1);
    }
    msg.text = members;
    this.send(JSON.stringify(msg));
  }


  handlePrivChat(msg) {
    msg.name = this.name;
    let toUser = msg.toUser;
    for (let member of this.room.members) {
      if (member.name === toUser) {
        member.send(JSON.stringify(msg));
      }
    }
    this.send(JSON.stringify(msg));
  }



  /** Handle messages from client:
   *
   * - {type: "join", name: username} : join
   * - {type: "chat", text: msg }     : chat
   */

  handleMessage(jsonData) {
    let msg = JSON.parse(jsonData);
    if (msg.type === 'priv-chat') this.handlePrivChat(msg);
    else if (msg.type === 'change-name') this.handleChangeName(msg);
    else if (msg.type === 'get-members') this.handleGetMembers(msg);
    else if (msg.type === 'get-joke') this.handleJoke(msg);
    else if (msg.type === 'join') this.handleJoin(msg.name);
    else if (msg.type === 'chat') this.handleChat(msg.text);
    else throw new Error(`bad message: ${msg.type}`);
  }

  /** Connection was closed: leave room, announce exit to others */

  handleClose() {
    this.room.leave(this);
    this.room.broadcast({
      type: 'note',
      text: `${this.name} left ${this.room.name}.`
    });
  }
}

module.exports = ChatUser;
