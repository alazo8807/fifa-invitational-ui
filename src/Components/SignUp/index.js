import React, { useState, useEffect } from 'react';
import Joi from 'joi';
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
import { register } from '../../Services/userService';
import { loginWithJwt } from '../../Services/authService';

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
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required(),
  password: Joi.string().min(5).max(255).required()
}

export default function SignUpSide(props) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
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
   * Handle Name changed
   */
  const handleNameChanged = (event) => {
    setName(event.target.value);
  };

  /**
   * Handle Email changed
   */
  const handleEmailChanged = (event) => {
    setEmail(event.target.value);
  };

  /**
   * Handle Password changed
   */
  const handlePasswordChanged = (event) => {
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
   * 
   *  Handle Sign up clicked 
   */
  const handleSignUpClicked = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

    try {
      const response = await register({ name, email, password });
      loginWithJwt(response.headers['x-auth-token']);
      window.location = '/';
    } catch (ex) {
      if (ex.response.status && ex.response.status === 400) {
        setErrors(errors => errors = {...errors, email: ex.response.data});
      }
    }
    
  }

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
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              onChange={handleNameChanged}
              onBlur={(event)=>handleBlur(event, 'Name')}
              value={name}
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              error={errors['name'] && errors['name'].length > 0}
              helperText={errors['name']}
              autoFocus
            />
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
              error={errors['email'] && errors['email'].length > 0}
              helperText={errors['email']}
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
              onClick={handleSignUpClicked}
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="#" variant="body2">
                  {"Already have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}