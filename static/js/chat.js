// The client - side JS makes a websocket connection to the 
// server(injecting the roomName into the ws URL), 
// and handles websocket events:


/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username?");


/** called when connection opens, sends join info to server. */

ws.onopen = function(evt) {
  console.log("open", evt); // console for the client side (chrome dev tool window)

  let data = {type: "join", name: name};
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */

ws.onmessage = function(evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note" || msg.type === "get-members" || msg.type === "change-name") {
    item = $(`<li><i>${msg.text}</i></li>`);
  }

  else if (msg.type === "chat" || msg.type === "priv-chat" || msg.type === "get-joke" ) {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  }

  else {
    return console.error(`bad message: ${msg}`);
  }

  $('#messages').append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** helper functions  */

function getToUser(msg) {
  let startIdx = msg.indexOf(" ") + 1;
  let endIdx = msg.indexOf(" ", startIdx);
  return msg.substring(startIdx, endIdx);
}

function getPrivMsgContent(msg) {
  let startIdx = msg.indexOf(" ", 6);
  return msg.substring(startIdx);
}

function getNewName(msg) {
  return msg.substring(msg.indexOf(" ") + 1)
}


/** send message when button pushed. */

$('form').submit(function (evt) {
  evt.preventDefault();
  let data;
  const msgInput = $("#m").val();

  if (msgInput.indexOf("/priv") === 0) {
    let toUser = getToUser(msgInput);
    data = { type: "priv-chat", toUser: getToUser(msgInput), text: getPrivMsgContent(msgInput)};
  }
  else if (msgInput.indexOf("/name") === 0) {
    data = { type: "change-name", newName: getNewName(msgInput)};
  }
  else if (msgInput === "/joke") {
    data = { type: "get-joke", text: "What do you call eight hobbits? A hob-byte!", name: "Server" };  
  }
  else if (msgInput === "/members") {
    data = { type: "get-members" };
  }
  else {
    data = { type: "chat", text: msgInput};    
  }

  ws.send(JSON.stringify(data));
  $('#m').val('');
});

