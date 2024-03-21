import React from 'react'
import Typography from '@mui/material/Typography'

export default function FormTitle({title}) {
  return (
    <span
      style={{
        textAlign: 'center',
        width: '100%',
        background: '#470466',
        borderRadius: '5px',
        display: 'block',
        top: 'auto',
        marginBottom: '20px'
      }}
      >
      <Typography variant="h3" component="h1" 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold',
          color: 'whitesmoke',
          fontFamily: 'monospace', 
          fontSize: '25px' }}>
          <u>{title}</u>
      </Typography>
    </span>  
  )
}