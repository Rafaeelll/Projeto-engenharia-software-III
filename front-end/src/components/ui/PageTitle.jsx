import React from 'react'
import Typography from '@mui/material/Typography'

export default function PageTitle({title}) {
  return (
    <Typography variant="h3" component="h1" sx={{ textAlign: 'center', mb: '30px', marginTop: '10px', fontFamily: 'monospace' }}>
      {title}
    </Typography>
  )
}