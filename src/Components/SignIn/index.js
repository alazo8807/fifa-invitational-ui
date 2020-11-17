import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import auth, { login } from '../../Services/authService';
import Joi from 'joi';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(./players2.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = {
  email: Joi.string().min(5).max(255).required(),
  password: Joi.string().min(5).max(255).required()
}

export default function SignInSide(props) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  /**
   * Validate a specific field
   */
  const validateProperty = (name, value) => {
    if (!name) return null;

    const { error } = Joi.object({ [name]: schema[name]}).validate({[name]: value});
    return error ? error.details[0].message : null;
  };

  /**
   * Handle Email changed. If there is an error received from the server, remove it.
   * TODO: Create a function for emailChanged and passwordChanged, they are almost the same.
   */
  const handleEmailChanged = (event) => {
    const errorsUpdate = {...errors};
    delete errorsUpdate['server'];
    setErrors(errorsUpdate);
    setEmail(event.target.value);
  };

  /**
   * Handle Password changed. If there is an error received from the server, remove it.
   */
  const handlePasswordChanged = (event) => {
    const errorsUpdate = {...errors};
    delete errorsUpdate['server'];
    setErrors(errorsUpdate);
    setPassword(event.target.value);
  };

  /**
   * Handle blur 
   */
  const handleBlur = (event, label) => {
    const propertyName = event.currentTarget.name;
    const value = event.target.value;
    const errorMessage = validateProperty(propertyName, value);
    
    const errorsCopy = {...errors};
    const key = [propertyName];
    if (errorMessage) {
      const updatedErrorMessage = errorMessage.replace(`${propertyName}`, `${label}`);
      errorsCopy[key] = updatedErrorMessage;
    } else {
      delete errorsCopy[key];
    }

    setErrors(errorsCopy);
  }

  /**
   *  Handle Sign up clicked 
   */
  const handleSignInClicked = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

    try {
      const result = await login(email, password);
      window.location = '/';
    } catch (ex) {
      if (ex.response.status && ex.response.status === 400) {
        setErrors(errors => errors = {...errors, server: ex.response.data});
      }
    }
  }

  if (auth.getCurrentUser()) return <Redirect to="/" />

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              onChange={handleEmailChanged}
              onBlur={(event)=>handleBlur(event, 'Email')}
              value={email}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={(errors['email'] && errors['email'].length > 0) || (errors['server'] && errors['server'].length > 0)}
              helperText={errors['email'] || errors['server']}
            />
            <TextField
              variant="outlined"
              margin="normal"
              onChange={handlePasswordChanged}
              onBlur={(event)=>handleBlur(event, 'Password')}
              value={password}
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={errors['password'] && errors['password'].length > 0}
              helperText={errors['password']}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSignInClicked}
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account yet? Sign up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}