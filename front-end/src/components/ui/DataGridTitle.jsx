import React from 'react'
import Box from '@mui/material/Box'

export default function DataGridTitle({title}) {
  return (
    <Box 
      sx={{ 
        width: '40%', 
        margin: '0 auto', 
        backgroundColor: 'black', 
        color: 'white', 
        fontFamily: 'arial', 
        marginTop: '50px', 
        borderRadius: '5px 5px 0px 0px', 
        textAlign: 'center', 
        padding: '10px', 
        borderStyle: 'groove' }}> 
        <h1 style={{ margin: '0 auto', fontSize: '13px' }}>
          <strong> 
            {title}
          </strong>
        </h1>
    </Box>
  )
}