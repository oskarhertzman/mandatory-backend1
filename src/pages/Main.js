import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import Table from '../components/Table.js';
import svg from '../assets/socket-io.png';
import nav from '../utilities/nav';
import '../styles/Main.scss';
const ENDPOINT = "http://127.0.0.1:8090";
const socket = io(ENDPOINT);
nav('/');

function Main(props) {
  const [roomData, setRoomData] = useState("");

  useEffect(() => {
    socket.emit('get_rooms', function (response) {
      setRoomData(response);
    })
  }, [])

  return (
    <div className="Main">
      <div className="Main__header">
        <h1>Socket Chat</h1>
        <img className="Main__logo" src={svg} alt="SocketIo Logo" />
      </div>
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
