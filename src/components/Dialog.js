import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ENDPOINT = "http://127.0.0.1:5000";
const socket = io(ENDPOINT);


export default function FormDialog({name, room, updateName, error}) {
  const [open, setOpen] = useState(true);
  const [back, toBack] = useState(false);
  const [inputError, setInputError] = useState(error);
  const [nameRef, setNameRef] = useState(name);
  const [passRef, setPassRef] = useState({pass: ''});

  useEffect(() => {
    socket.on('user_auth', function (data) {
      if (data.login) {
        updateName(nameRef);
        setOpen(false);
      }
      else {
        alert('Wrong password')
        setInputError(true);
      }
    })
    return () => {
      socket.off('user_auth');
    }
  },[nameRef, updateName])


  function handleBack () {
    toBack(true);
  };

  function handleEnter () {
    if (room.type === 'Public') {
      if (nameRef.name) {
        updateName(nameRef);
        setOpen(false);
      }
      else  {
        setInputError(true);
      }
    }
    else if (room.type === 'Private') {
      if (nameRef.name && passRef.pass) {
        socket.emit('user_auth', passRef, room.uuid);
      }
      else  {
        setInputError(true);
      }
    }
  };

  function handleInputChange (e) {
    let target = e.target.value
    setNameRef(prevState => ({...prevState, name: target}));
  }

  function handlePassChange (e) {
    let target = e.target.value;
    setPassRef(prevState => ({...prevState, pass: target}));
  }

  return (
    <div>
      {back ?
        <Redirect
          to={{
            pathname: `/`
          }}/> : null}
          <Dialog
            open={open}
            onClose={handleEnter || handleBack}
            aria-labelledby="form-dialog-title"
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
            >
              <DialogTitle id="form-dialog-title">{error ? 'Error 404' : 'Username'}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {error ? 'The room was not found on the server, click the button to go back'
                  : [
                    ( room.type === 'Public' ?
                    <>To use {room.name}, please enter your username here.</> :
                    <>To use {room.name}, please enter your username & the room's password here.</>
                  ),
                ]
              }
            </DialogContentText>
            {error ? null :
              <TextField
                tabIndex="0"
                autoComplete="off"
                required={true}
                error={inputError}
                onChange={handleInputChange}
                autoFocus
                margin="dense"
                id="name"
                label="Username"
                type="text"
                fullWidth
              /> } {room.type === 'Private' ?
              <TextField
                autoComplete="off"
                required={true}
                error={inputError}
                onChange={handlePassChange}
                margin="dense"
                id="pwd"
                label="Password"
                type="password"
                fullWidth
              />
              : null}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBack} color="primary">
                GO BACK
              </Button>
              {error ? null :
                <Button onClick={handleEnter} color="primary">
                  Enter
                </Button>
              }
            </DialogActions>
          </Dialog>
        </div>
      );
    }
