import React, {useState, useEffect} from 'react';
import { paperTheme } from '../themes/Theme.js';
import { Paper } from '@material-ui/core';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/Rooms.scss';
const ENDPOINT = "http://127.0.0.1:8090";


function Room(props) {
  const [room, updateRoom] = useState({});


  useEffect(() => {
    // console.log(props.location.state.referrer);
    let uuidFeth = window.location.pathname.split(':')[1];
    console.log(uuidFeth);
    const socket = io(ENDPOINT);
    getRoom(socket, uuidFeth);
  }, [])


  function getRoom (socket, uuid) {
    console.log(uuid);
    socket.emit('get_room', uuid, function (response) {
      updateRoom(response[0]);
    })
  }

  function sendMessage() {

  }


  return (
    <div className="Room">
      <div className="Room__container">
        <Paper style={paperTheme.paper} elevation={3} >
      <p>Welcome to {room.name} </p>
    </Paper>
      </div>
    </div>
  );
}

export default Room;
