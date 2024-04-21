import React from "react";
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import './styles/home-styles.css'
import HeaderBarLP from "../../components/ui/HeaderBarLP";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";


function Contact(){
  return (
    <>
      <div className="container">
        <HeaderBarLP/>

          <Box className="background" sx={{height: '100vh'}}>
            <Typography gutterBottom variant="h4" component="div" sx={{color:'white', p: '15px'}}>
              <u><strong> Meus Contatos:</strong></u>
            </Typography>

            <Box sx={{pl: '35px'}}>
              <ul>
                <li style={{display: 'flex', alignItems: "center"}}>
                  <IconButton
                    size="medium"
                    sx={{background: 'inherit'}}
                    component={Link} 
                    to="https://www.instagram.com/young_abnel/?next=%2F&hl=en"
                    target="_blank"
                    >
                    <InstagramIcon 
                      fontSize="large" 
                      color="secondary"
                    />
                  </IconButton>
                  <Typography component={Link}
                    to="https://www.instagram.com/young_abnel/?next=%2F&hl=en"
                    sx={{color: 'secondary.light'}}
                    target="_blank"> Instagram
                  </Typography>
                </li>

                <li style={{display: 'flex', alignItems: "center"}}>
                  <IconButton
                    size="medium"
                    sx={{background: 'inherit'}}
                    component={Link} 
                    to="https://github.com/Rafaeelll"
                    target="_blank"
                    >
                    <GitHubIcon 
                      fontSize="large" 
                      color="secondary"
                    />
                  </IconButton>
                  <Typography component={Link}
                    to="https://github.com/Rafaeelll"
                    sx={{color: 'secondary.light'}}
                    target="_blank"> Github
                  </Typography>
                </li>

                <li style={{display: 'flex', alignItems: "center"}}>
                  <a>
                    <IconButton size="medium" sx={{background: 'inherit'}}>
                      <EmailIcon fontSize="large" color="secondary"/>
                    </IconButton>
                  </a>
                  <a href="mailto:rafaelabnelcintra@gmail.com">
                    <Typography sx={{color: 'secondary.light'}}> E-mail </Typography>
                  </a>
                </li>

                <li style={{display: 'flex', alignItems: "center"}}>
                  <IconButton size="medium" sx={{background: 'inherit'}}>
                    <WhatsAppIcon fontSize="large" color="secondary"/>
                  </IconButton>
                  <Typography sx={{color: 'secondary.light'}}> WhatsApp: +55 (16) 99412-6700 </Typography>
                </li>
              </ul>
            </Box>
          </Box>
      </div>
    </>
);
}
export default Contact