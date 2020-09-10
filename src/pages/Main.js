import React, {useState, useEffect} from 'react';
import Loader from 'react-loader-spinner'
import io from 'socket.io-client';


import Table from '../components/Table.js';
import svg from '../assets/socket-io.png';
import '../styles/Main.scss';

const ENDPOINT = `${window.location.hostname}:5000`;
const socket = io(ENDPOINT);

export default function Main(props) {
  const [roomData, setRoomData] = useState();

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
            rooms={roomData}
            socket={socket}
          /> :
          <Loader
            type="Oval"
            color="white"
            height={100}
            width={100}
            timeout={1000} //3 secs
          />
        }
      </div>
    </div>
  );
}
