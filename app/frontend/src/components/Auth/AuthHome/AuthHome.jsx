import React from 'react';
import Button from '../../UI/Buttons/Button';
import Card from '../../UI/Cards/Card';
import classes from './AuthHome.module.css';

const AuthHome = (props) => {
  return (
    <Card className={classes.auth}>
      <h1>Welcome to BLZ Transfer</h1>
      <p>Secure file sharing with integrated virus scanning.</p>
      
      <div className={classes.actions}>
        <Button 
          className={classes.guestBtn} 
          onClick={props.onContinueAsGuest}
        >
          Continue as Guest
        </Button>
        
        <Button 
          className={classes.loginBtn} 
          onClick={props.onLogin}
        >
          Login to Account
        </Button>
      </div>
    </Card>
  );
};

export default AuthHome;