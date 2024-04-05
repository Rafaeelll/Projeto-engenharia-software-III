import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmImgDialog({title, children, open = false, onClose, onConfirm}) {

  const handleClose = answer => {
    // answer === true: resposta positiva à pergunta
    // answer === false: resposta negativa à pergunta 
    onClose(answer);
  };
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      handleClose(true);
    }
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
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} variant="outlined">
            Acessar
          </Button>
          <Button onClick={() => handleClose(false)} autoFocus>Voltar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}