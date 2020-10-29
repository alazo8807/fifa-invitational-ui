import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { DialogTitle, DialogContent, DialogActions, Button, Collapse } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 400
  },
  inputContainer: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  alert: {
    margin: `${theme.spacing(1)}px 0`,
  },
  list: {
    marginTop: theme.spacing(1),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function NamesList({type, error, onCancel, onBack, onNamesComplete}) {
  const classes = useStyles();
  const [currentName, setCurrentName] = useState('');
  const [playersNames, setPlayersNames] = useState([]);
  const [playersTeams, setPlayersTeams] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  /**
   * Update Error message if any
   */
  useEffect(()=>{    
    const showError = error.length > 0;
    setShowAlert(showError);
  }, [error])

  /**
   * Handle input loose focus
   */
  const handleInputBlur = (event) => {
    const value = event.target.value;
  }

  /**
   * Handle input value changed 
   * @param {Object} event 
   */
  const handleNameChange = (event) => {
    const value = event.target.value;
    setCurrentName(value);
  }

  /**
   * Handle Add button clicked
   */
  const handleAddName = () => {
    setShowAlert(false);

    if (type === 'names') {
      setPlayersNames(players => [...players, currentName]);
    }
    else {
      setPlayersTeams(teams => [...teams, currentName]);
    }

    setCurrentName('');
  }

  /**
   * Handle Next clicked
   */
  const handleNextClick = () => {
    if (type === 'names') {
      onNamesComplete(playersNames);
      return;
    }

    onNamesComplete(playersTeams)
  }

  /**
   * Handle delete item from the list when remove btn clicked
   */
  const handleDelete = (value) => {
    setShowAlert(false);

    if (type === 'names') {
      setPlayersNames(names => names.filter(p => p !== value));
    }
    else {
      setPlayersTeams(teams => teams.filter(p => p !== value));
    }
  }

  return (
    <>
    <DialogTitle id="alert-dialog-title"></DialogTitle>
    <DialogContent className={classes.root}>
      <Paper component="form" className={classes.inputContainer}>
        <InputBase
          className={classes.input}
          placeholder={type === 'names' ? "Add player name" : "Add player team"}
          value={currentName}
          inputProps={{ 'aria-label': 'add player name' }}
          onChange={handleNameChange}
          onBlur={(event) => handleInputBlur(event)}
        />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton color="primary" className={classes.iconButton} aria-label="add"
          onClick={handleAddName}>
          <AddIcon />
        </IconButton>
      </Paper>
      {error.length > 0 && 
        (<Collapse className={classes.alert} in={showAlert}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setShowAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Collapse>)
      }
      {(type === 'names' && playersNames.length > 0) &&
        <Paper className={classes.list}>
          <List dense={true}>
            {playersNames.map(name => 
              <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={name}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(name)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            )}
          </List>
        </Paper>
      }
      {(type === 'teams' && playersTeams.length > 0) &&
        <Paper className={classes.list}>
          <List dense={true}>
            {playersTeams.map(team => 
              <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={team}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={()=>handleDelete(team)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            )}
          </List>
        </Paper>
      }
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        {type === 'teams' && (
          <Button onClick={onBack} color="primary">
            Back
          </Button>
        )}
        <Button onClick={handleNextClick} variant="contained" color="primary">
          Next
        </Button>
      </DialogActions>
    </>
  );
}
