import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({name, updateName}) {
  const [open, setOpen] = useState(true);
  const [back, toBack] = useState(false);

  const handleBack = () => {
    toBack(true);
  };
  const handleEnter = () => {
    setOpen(false);
    console.log(name);
  };


  function handleInputChange (e) {
    let target = e.target.value
      updateName(prevState => ({...prevState, name: target}));
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
        <DialogTitle id="form-dialog-title">Username</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To use this chat, please enter your username here.
          </DialogContentText>
          <TextField
            onChange={handleInputChange}
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBack} color="primary">
            GO BACK
          </Button>
          <Button onClick={handleEnter} color="primary">
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
