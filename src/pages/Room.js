import React, {useState, useEffect, useRef} from 'react';
import { Redirect } from "react-router-dom";
import FormDialog from '../components/Dialog.js';
import { paperTheme } from '../themes/Theme.js';
import { Paper } from '@material-ui/core';
import io from 'socket.io-client';
import '../styles/Rooms.scss';
const ENDPOINT = "http://127.0.0.1:8090";
const socket = io(ENDPOINT);


function Room(props) {
  const [room, updateRoom] = useState({name: '', messages: []});
  const [name, updateName] = useState({name: ''});
  const [message, updateMessage] = useState({message: ''});
  const [referance, setReferance] = useState(false);
  const [error, setError] = useState(false);
  const serverRef = useRef(false);
  const uuid = window.location.pathname.split(':')[1];

  useEffect(() => {
    socket.emit('get_room', uuid, function (response) {
      console.log(response);
      if(response.error_404){
        setError(response.error_404);
        if (response.referance) {
          setReferance(response.referance[0]);
        }
      }
      else {
        updateRoom(response[0])
      }
    })
    socket.on('new_message', function (data) {
      updateRoom(prevState => ({...prevState, messages: [...prevState.messages, data]}));
      serverRef.current = false;
    })
    return () => {
      socket.off('new_message');
    }
  }, [uuid])

  function sendMessage(e) {
    e.preventDefault();
    const merged = {...name, ...message}
    socket.emit('new_message', merged, uuid)
    updateRoom(prevState => ({...prevState, messages: [...prevState.messages, merged]}));
  }

  function onMessageChange (e) {
    let target = e.target.value
    updateMessage(prevState => ({...prevState, message: target}));
  }

  return (
    <div className="Room">
      {error ? null :
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
              <p>User: {name.name}</p>
              <input type="text" onChange={onMessageChange} placeholder="Message" name="message" required />
              <input type="submit" />
            </form>
          </Paper>
        </div>
      }

      <FormDialog
        name={name}
        updateName={updateName}
        error={error}
        referance={referance}
      />
      </div>
    );
  }

  export default Room;
