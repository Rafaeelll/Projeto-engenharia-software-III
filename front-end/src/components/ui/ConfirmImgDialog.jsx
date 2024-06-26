import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

export default function ConfirmImgDialog({title, profileImg, userName, open = false, onClose, onConfirm}) {

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
          <u><strong> {title} </strong></u>
        </DialogTitle>
        
          <DialogContentText sx={{display: 'flex', justifyContent: 'center'}} id="alert-dialog-description">
            {userName}
          </DialogContentText>
          <DialogContent sx={{display: 'flex', justifyContent: 'center', pl: '50px', pr: '50px'}}>
              {profileImg}
          </DialogContent>

          <br/>

        <DialogActions>
          <Button onClick={handleConfirm} variant="outlined" size='small' color='secondary'>
            <IconButton size='small'><EditIcon color='secondary'/></IconButton>
            Alterar
          </Button>
          <Button onClick={() => handleClose(false)} autoFocus size='small' color='secondary'>
            Voltar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}