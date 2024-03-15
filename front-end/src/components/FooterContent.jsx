import React from 'react'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles';
import '../pages/home/styles/home-styles.css'

const CenteredTypography = styled(Typography)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

export default function FooterContent() {
  return (
    <>
      <footer className="footer">
        <div className='footer-text'>
          <CenteredTypography variant="body1"> <strong> &copy; 2024 Stream Advisor</strong></CenteredTypography>
        </div>
      </footer>
    </>
  )
}
