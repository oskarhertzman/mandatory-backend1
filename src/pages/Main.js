import React, {useState, useEffect} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Table from '../components/Table.js';
import '../styles/Main.scss';
const ENDPOINT = "http://127.0.0.1:8090";

function Main() {
  const [roomData, setRoomData] = useState("");
  const socket = io(ENDPOINT);

  useEffect(() => {
    socket.emit('get_rooms', function (response) {
      console.log(response);
      setRoomData(response);
    })
  }, [])


  return (
    <div className="Main">
      <div className="Main__container">
        {
          (roomData) ?
          <Table
            rooms={roomData}/> : null
          }
        </div>
      </div>
    );
  }

  export default Main;
