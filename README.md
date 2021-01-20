#GroupChat App

Setting Up:

To run the app, please follow the instructions below:

in the command line:

1. cd to the project folder

2. start the server, run
    $ node server.js
    or 
    $ nodemon server.js (if you prefer to use nodemon and have nodemon installed)    

3.  Go to http://localhost:3000/room-name. You can use any room name you want — so you can go to “/random” or “/humor” or “/library” or such — each of these will be a different room with different possible users.

4. Open a second tab on the same computer and visit the same room, and you should be able to chat with each other. 

5. If the user types /joke into the new message field, this should not be broadcast to all users — instead, it should return a joke to just that user. 

6. If the user types /members into the new message field, this should not be broadcast to all users — instead, it should return a list the usernames of the users in the current room, like: “In room: juanita, jenny, jeff”.

7. Add a command like /priv user message,  that sends a private message that only that other user sees.

8. Add a command like /name myNewName that change your username. It should announce this change to the room you’re in.
