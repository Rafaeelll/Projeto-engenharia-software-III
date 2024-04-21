import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

export default function ConfirmImgDialog({title, warning, warning2, open = false, onClose}) {

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
        <DialogTitle id="alert-dialog-title" sx={{display: 'flex', alignItems: 'center',}}>
          <WarningRoundedIcon sx={{mr: '5px'}} color='error'/> <u><strong> {title} </strong></u>
        </DialogTitle>
        
          <DialogContentText sx={{display: 'flex', justifyContent: 'center', pl: '30px', pr: '30px'}}>
            {warning}
          </DialogContentText>

          <DialogContentText sx={{display: 'flex', justifyContent: 'center', pl: '30px', pr: '30px'}}>
            {warning2}
          </DialogContentText>
          <br/>

        <DialogActions>
          <Button onClick={() => handleClose(true)} variant="outlined">OK</Button>
          <Button onClick={() => handleClose(false)} autoFocus>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}