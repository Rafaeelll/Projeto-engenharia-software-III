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
  instructions, 
  warning, 
  instructions2, 
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
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>{instructions}</Typography>
            {warning && (
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                <WarningRoundedIcon />
                <Typography sx={{ marginLeft: '5px' }}>{warning}</Typography>
              </div>
            )}
            <Typography style={{marginTop: '20px'}}>{instructions2}</Typography>
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
    </div>
  );
}
