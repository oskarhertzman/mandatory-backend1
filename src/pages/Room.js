import React, {useState, useEffect} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/Rooms.scss';
const ENDPOINT = "http://127.0.0.1:8090";


function Room(props) {
  const [room, updateRoom] = useState(props.location.state.referrer);

  useEffect(() => {
    console.log(props.location.state.referrer);
    const socket = io(ENDPOINT);
    getMessages(socket);
  }, [])


  function getMessages (socket) {
    socket.on('FromAPI', (data) => {
      console.log(data);
    });
  }

  function sendMessage() {

  }


  return (
    <div className="Room">
      <div className="Room__container">
      <p>Welcome to {room.name} </p>
      </div>
    </div>
  );
}

export default Room;
