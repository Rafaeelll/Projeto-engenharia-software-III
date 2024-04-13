import * as React from 'react';
import './styles/home-styles.css'
import HeaderBarLP from '../../components/ui/HeaderBarLP';
import GamerBackground from '../../assets/back.jpg'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FooterBar from '../../components/ui/FooterBar'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import { CardActions } from '@mui/material';
import Typography from '@mui/material/Typography';
import SwipeableTextMobileStepper from '../../components/ui/SwipeableTextMobileStepper'

export default function LandingPage() {

  return (
    <>
      <div className="container">
        <HeaderBarLP/>
          <SwipeableTextMobileStepper/>
        <FooterBar/>
      </div>

    </>
  );
}