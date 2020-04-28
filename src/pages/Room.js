import React, {useState, useEffect, useRef} from 'react';
import { paperTheme } from '../themes/Theme.js';
import { Paper } from '@material-ui/core';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/Rooms.scss';
const ENDPOINT = "http://127.0.0.1:8090";


function Room(props) {
  const [room, updateRoom] = useState({messages: []});
  const [name, updateName] = useState({name: ''});
  const [message, updateMessage] = useState({message: ''});
  const serverRef = useRef(false);
  const socket = io(ENDPOINT);
  const uuid = window.location.pathname.split(':')[1];

  useEffect(() => {
    socket.on('new_message', function (data) {
      console.log("GOT DATA");
      console.log(message);
      updateRoom(data);
      serverRef.current = false;
    })
    socket.emit('get_room', uuid, function (response) {
      updateRoom(response[0]);
    })
    return () => {
      socket.off('new_message');
    }
  }, [])


  useEffect(() => {
    if (serverRef.current) {
      socket.emit('new_message', room)
    }
  }, [room])


  function sendMessage(e) {
    e.preventDefault();
    serverRef.current = true;
    const merged = {...name, ...message }
    console.log(merged);
    updateRoom(prevState => ({...prevState, messages: [...prevState.messages, merged ]}));

  }

  function onMessageChange (e) {
    let target = e.target.value
    updateMessage(prevState => ({...prevState, message: target}));
  }

  function onNameChange (e) {
    let target = e.target.value
    updateName(prevState => ({...prevState, name: target}));
  }

  console.log(room);
  return (
    <div className="Room">
      <div className="Room__container">
        <Paper style={paperTheme.paper} elevation={3} >
          <p>Welcome to {room.name} </p>
          <div className="Room__container__chat">
              {room.messages.map((message, index) => {
                return (
                  <div className={["Room__container__chat__message", index].join(' ')} key={index}>
                    <p>Name: {message.name} </p>
                    <p>Message: {message.message} </p>
                  </div>
                )
              })}
          </div>
          <form onSubmit={sendMessage}>
            <input type="text" onChange={onNameChange} placeholder="Name" name="name" required />
            <input type="text" onChange={onMessageChange} placeholder="Message" name="message" required />
            <input type="submit" />
          </form>
        </Paper>
      </div>
    </div>
  );
}

export default Room;
