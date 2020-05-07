import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ENDPOINT = "http://127.0.0.1:8090";
const socket = io(ENDPOINT);


export default function NewPass({table, room}) {
  const [open, setOpen] = useState(true);
  const [newRoomData, setNewRoomData] = useState(room);
  const [passTxt, setPassTxt] = useState({pass: ''});
  const [cnfPass, setCnfPass] = useState({conf: ''});
  const [error, setError] = useState(false);
  const socketRef = useRef(false);
  const typeRef = useRef('private');


  useEffect(() => {
    if(socketRef.current) {
      socket.emit('update_rooms', table, newRoomData, socketRef.current, typeRef.current)
      socketRef.current = false;
    }
  },[newRoomData, table])



  function handleEnter () {
    if (passTxt.pass === cnfPass.conf) {
      setNewRoomData(prevState => ({...prevState, pass: passTxt.pass}));
      socketRef.current = 'create';
      setOpen(false);
    }
    else {
      setError(true);
    }
  }

  function handlePassChange (e) {
    let target = e.target.value;
    setPassTxt(prevState => ({...prevState, pass: target}));
  }

  function handleConfirmChange (e) {
    let target = e.target.value;
    setCnfPass(prevState => ({...prevState, conf: target}));
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleEnter}
        aria-labelledby="form-dialog-title"
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        >
          <DialogTitle id="form-dialog-title">Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a password for {newRoomData.name}.
            </DialogContentText>
            <TextField
              autoComplete="off"
              required={true}
              error={error}
              onChange={handlePassChange}
              autoFocus
              margin="dense"
              id="pwd"
              label="Password"
              type="password"
              fullWidth
            />
            <TextField
              autoComplete="off"
              required={true}
              error={error}
              onChange={handleConfirmChange}
              autoFocus
              margin="dense"
              id="conf_pwd"
              label="Confirm Password"
              type="password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEnter} color="primary">
              Enter
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
