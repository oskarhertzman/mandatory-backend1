import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import { Paper } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

import FormDialog from '../components/Dialog.js';
import { paperTheme } from '../themes/Theme.js';
import { inputTheme } from '../themes/Theme.js';
import nav from '../utilities/nav';
import '../styles/Rooms.scss';

const ENDPOINT = "http://127.0.0.1:8090";
const socket = io(ENDPOINT);
nav(window.location.pathname)

export default function Room(props) {
  const [room, updateRoom] = useState({name: '', messages: []});
  const [name, updateName] = useState({name: ''});
  const [message, updateMessage] = useState({message: ''});
  const [referance, setReferance] = useState(false);
  const [error, setError] = useState(false);
  const serverRef = useRef(false);
  const classes = inputTheme();
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
      {error || !name.name ? null :
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
          <div className="Room__container__user">
            <form onSubmit={sendMessage}>
              <TextField
                className={classes.message}
                id="outlined-basic" label="message" variant="outlined"
                onChange={onMessageChange}
                required={true} />
              <Button className={classes.button} type="submit" label="login" variant="contained" color="primary"><SendIcon /></Button>
            </form>
            <div className="Room__container__user__info">
              <p>User: {name.name}</p>
            </div>
          </div>
        </Paper>
      </div>
        }
        {room.name || error ?
          <FormDialog
            name={name}
            room={room}
            updateName={updateName}
            error={error}
            server_ref={referance}
          /> : null
        }

      </div>
    );
  }
