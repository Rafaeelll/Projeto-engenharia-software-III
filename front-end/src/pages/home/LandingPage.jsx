import * as React from 'react';
import './styles/home-styles.css'
import HeaderBar2 from '../../components/ui/HeaderBar2';
import BodyContent from '../../components/BodyContent';
import FooterContent from '../../components/FooterContent';
export default function LandingPage() {

  return (
    <>
      <HeaderBar2/>
      <BodyContent/>
      <FooterContent/>
    </>
  );
}