import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmImgDialog({title, greetings, open = false, onClose}) {

  const handleClose = answer => {
    // answer === true: resposta positiva à pergunta
    // answer === false: resposta negativa à pergunta 
    onClose(answer);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <u><strong> {title} </strong></u>
        </DialogTitle>
        
          <DialogContentText sx={{display: 'flex', justifyContent: 'center', pl: '50px', pr: '50px'}}>
              {greetings}
          </DialogContentText>
          <br/>

        <DialogActions>
          <Button onClick={() => handleClose(false)} size='small' color='secondary'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}