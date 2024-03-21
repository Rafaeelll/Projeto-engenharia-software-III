import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

export default function ConfirmDialogInitialPage({
  title, 
  instruction1,
  warningTitle,
  warning1,
  warning2, 
  warning3, 
  acessarInstrucao, 
  open = false, 
  onClose, onConfirm}) {
  const handleClose = (answer) => {
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
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title"><strong><u>{title}</u></strong></DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography>{instruction1}</Typography>
          {warningTitle && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <WarningRoundedIcon color='error'/>
              <Typography sx={{ marginLeft: '3px' }}> <strong>{warningTitle}</strong></Typography>
            </div>
          )}
            <ul style={{marginLeft: '40px', marginTop: '10px'}}>
              <li>{warning1}</li>
              <li>{warning2}</li>
              <li>{warning3}</li>
          </ul>
          <Typography style={{marginTop: '40px'}}>{acessarInstrucao}</Typography>
        </DialogContentText>
      </DialogContent>


      <DialogActions>
        <Button onClick={handleConfirm} variant="outlined">
          Acessar
        </Button>
        <Button onClick={() => handleClose(false)} autoFocus>
          Voltar
        </Button>
      </DialogActions>
      
    </Dialog>
  );
}
