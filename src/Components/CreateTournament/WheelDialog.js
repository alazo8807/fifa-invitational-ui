import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WheelComponent from './WheelComponent';
import NamesList from './NamesList';
import Wheels from './Wheels';

const useStyles = makeStyles((theme) => ({
  root: {
  }
}));

export default function WheelDialog({open, onCloseDialog, initialPlayers, onWheelPick}) {
  const [showWheelComponent, setShowWheelComponent] = useState(false); 
  const [players, setPlayers] = useState(initialPlayers);
  const [listType, setListType] = useState('names');
  const [namesList, setNamesList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [namesError, setNamesError] = useState("");
  const classes = useStyles();

  const handleClose = () => {
    onCloseDialog();
  };

  const handleNamesComplete = (list) => {
    switch (listType) {
      case 'names':
        if (list.length !== players.length) {
          const diff = list.length - players.length;
          console.log(diff);
          
          const operation = diff < 0 ? 'add' : 'remove';
          const msg = `You need to ${operation} ${Math.abs(diff)} name(s)`;
          setNamesError(new String(msg));
          return;
        }
        setNamesError("");
        setNamesList(list);
        setListType('teams');
        break;
      case 'teams':
        if (list.length !== players.length) {
          const diff = list.length - players.length;
          console.log(diff);
          
          const operation = diff < 0 ? 'add' : 'remove';
          const msg = `You need to ${operation} ${Math.abs(diff)} teams(s)`;
          console.log(msg);
          
          setNamesError(new String(msg));
          return;
        }
        setTeamsList(list);
        setShowWheelComponent(true);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {!showWheelComponent && (
          <NamesList
            type={listType}
            error={namesError}
            onNamesComplete={handleNamesComplete}
          />
        )}
        {showWheelComponent && (
          <>
            <DialogTitle id="alert-dialog-title"></DialogTitle>
            <DialogContent>
              <Wheels 
                // names={['ale', 'roli', 'erlan']} 
                // teams={['real', 'barca', 'valencia']} 
                names={namesList} 
                teams={teamsList} 
                onWheelPick={onWheelPick}></Wheels>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
