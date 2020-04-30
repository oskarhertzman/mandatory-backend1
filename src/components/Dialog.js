import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({name, updateName, error, server_ref}) {
  const [open, setOpen] = useState(true);
  const [back, toBack] = useState(false);
  const [inputError, setInputError] = useState(error);
  const [errorRef, setErrorRef] = useState({name: "", type: "", topic: ""})
  const [nameRef, setNameRef] = useState(name);

  useEffect(() => {
    if(server_ref){
      setErrorRef(server_ref)
    }
  }, [server_ref])


  const handleBack = () => {
    toBack(true);
  };

  const handleEnter = (e) => {
    updateName(nameRef);

    if (nameRef.name) {
      setOpen(false);
    }
    else  {
      setInputError(true);
    }
  };

  function handleInputChange (e) {
    let target = e.target.value
    setNameRef(prevState => ({...prevState, name: target}));
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
                  : 'To use this chat, please enter your username here.'}
                  {error && errorRef.name.length > 0 ? <div> Please delete this room from the main menu, since its now useless:
                    <ul style={{fontWeight: 'bold'}}>
                      <li>Room: {errorRef.name} </li>
                      <li>Type: {errorRef.type}</li>
                      <li>Topic: {errorRef.topic}</li>
                    </ul>
                  </div> : null}
                </DialogContentText>
                {error ? null :
                  <TextField
                      required={true}
                      error={inputError}
                      onChange={handleInputChange}
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Username"
                      type="text"
                      fullWidth
                    /> }
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
