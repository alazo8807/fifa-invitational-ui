import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import NamesList from './NamesList';
import Wheels from './Wheels';

export default function WheelDialog({open, onCloseDialog, initialPlayers, onWheelPick}) {
  const [showWheelComponent, setShowWheelComponent] = useState(false); 
  const [players, setPlayers] = useState(initialPlayers);
  const [listType, setListType] = useState('names');
  const [namesList, setNamesList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [namesError, setNamesError] = useState("");
  
  /**
   * Update list of players when players were increased/decreased
   */
  useEffect(()=>{
    setPlayers(initialPlayers);
  }, [initialPlayers])

  /**
   * Reset values to default
   */
  const reset = () => {
    setNamesList([]);
    setTeamsList([]);
    setListType('names');
    setShowWheelComponent(false);
    setNamesError("");
  }

  /**
   * Handle Close event
   */
  const handleClose = () => {
    reset();
    onCloseDialog();
  };

  /**
   * Handle go back event
   */
  const handleBack = () => {
    setNamesError("");
    setListType('names');
  }

  /**
   * Handle Next clicked. Save list of names received
   * @param {Array} list 
   */
  const handleNamesComplete = (list) => {
    // TODO: Refactor bellow, logic is very similar, so put in a function
    switch (listType) {
      case 'names':
        if (list.length !== players.length) {
          const diff = list.length - players.length;
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
          const operation = diff < 0 ? 'add' : 'remove';
          const msg = `You need to ${operation} ${Math.abs(diff)} teams(s)`;
          
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick
        disableEscapeKeyDown
      >
        {/* TODO: Extract Dialog wrappers from NameList, just leave List logic inside NameList */}
        {!showWheelComponent && (
          <NamesList
            type={listType}
            error={namesError}
            onCancel={handleClose}
            onBack={handleBack}
            onNamesComplete={handleNamesComplete}
          />
        )}
        {showWheelComponent && (
          <>
            <DialogTitle id="alert-dialog-title"></DialogTitle>
            <DialogContent>
              <Wheels 
                names={namesList} 
                teams={teamsList}
                onClose={handleClose}
                onWheelPick={onWheelPick}></Wheels>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="contained" color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
