import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import WheelComponent from './WheelComponent';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 400,
    width: 500,
  },
  buttonsGroup: {
    display: 'flex',
    
    // alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const segColors = [
  "#EE4040", "#F0CF50", "#815CD1", "#3DA5E0", "#34A24F", "#F9AA1F", "#EC3F3F", "#FF9000",
  "#EA40F5", "#A93950", "#B35DD1", "#1DAFE0", "#54B242", "#492A8F", "#6C3A7A", "#66C000",
  "#C8C8C8", "#FA1F55", "#7AD9C0", "#135813",
];

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Wheels({names: initialNames, teams: initialTeams, onClose, onWheelPick}) {
  const classes = useStyles();
  const [nameSegments, setNameSegments] = useState(initialNames);
  const [teamSegments, setTeamSegments] = useState(initialTeams);
  const [currentWinner, setCurrentWinner] = useState('');
  const [openWinnerDialog, setOpenWinnerDialog] = useState(false);
  const [type, setType] = useState("name");

  /**
   * If there is only one name left to pick
   * update last player with it since you cannot spin again
   * */
  useEffect(()=>{
    if (nameSegments.length === 1) onWheelPick(nameSegments[0], type);
  }, [nameSegments])

  /**
   * If there is only one team left to pick
   * update last player with it since you cannot spin again
   * */
  useEffect(()=>{
    if (teamSegments.length === 1) onWheelPick(teamSegments[0], type);
  }, [teamSegments])

  /**
   * Handle value picked from wheel. It will show an alert with the value picked.
   * @param {String} winner 
   */
  const handleWinnerPicked = (winner) => {
    console.log(winner);
    setCurrentWinner(winner);
    setOpenWinnerDialog(true);
  }

  /**
   * Handle winner snack alert close.
   */
  const handleWinnerDialogClose = () => {
    setOpenWinnerDialog(false);

    let newSegs = [];
    let lastPick = '';
    if (type === 'name') {
      setNameSegments(segs => {
        newSegs = segs.filter(s => s !== currentWinner);
        return newSegs;
      });
    }
    else if (type === 'team') {
      setTeamSegments(segs => {
        newSegs = segs.filter(s => s !== currentWinner);
        return newSegs;
      });
    }

    onWheelPick(currentWinner, type);
    if (lastPick) onWheelPick(lastPick, type);
  }

  return (
    <div className={classes.root}>
      <div className={classes.buttonsGroup}>
        <Button 
          variant={type === 'name' ? "contained" : "outlined"}
          color="primary"
          onClick={()=>setType('name')}>
            Names
        </Button>
        <Button 
          variant={type === 'team' ? "contained" : "outlined"}
          color="primary"
          onClick={()=>setType('team')}>
            Teams
        </Button>
      </div>
      <WheelComponent
        segments = {type === 'name' ? nameSegments : teamSegments}
        segColors = {segColors}
        onFinished={handleWinnerPicked}
        primaryColor='black'
        contrastColor='white'
        buttonText='Spin'/>
      <Snackbar open={openWinnerDialog}>
        <Alert severity="success" onClose={handleWinnerDialogClose}>
          Winner: {currentWinner}
        </Alert>
      </Snackbar>
    </div>
  );
}
