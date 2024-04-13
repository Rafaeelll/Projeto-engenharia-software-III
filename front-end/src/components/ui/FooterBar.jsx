import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FavoriteIcon from '@mui/icons-material/Favorite';


export default function FooterBar() {
  return (
    <Toolbar
      variant="dense"
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        justifyContent: 'center',
        width: '100vw',
        backgroundColor: 'action.disabledBackground',
        color: 'white'
      }}
    >
      <Typography variant="caption"
        sx={{
          '& a': {
            color: 'error.light',
            width: '100%'
          }
        }}
      >
          <strong> &copy; 2024 Stream Advisor</strong>, desenvolvido com <FavoriteIcon fontSize="small" color='error'/> por <a href="mailto:rafaelabnelcintra@gmail.com">Rafael Felipe</a>
      </Typography>
    </Toolbar>
  )
}
