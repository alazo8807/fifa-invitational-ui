import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WheelComponent from './WheelComponent';

export default function WheelDialog({open, onCloseDialog}) {
  const handleClose = () => {
    onCloseDialog();
  };

  const [segments, setSegments] =  useState(['Ale', 'Roli', 'Fernando', 'Erlan']);

  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];

  const onFinished = (winner) => {
    console.log(winner);
    // console.log('newSegments:', newSegments);
    let newSegs = [];
    setSegments(segs => {
      newSegs = segs.filter(s => s !== winner);
      return newSegs;
    });

    console.log(newSegs);
    
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Incomplete information"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please enter all the required information first.
          </DialogContentText>
          
          <WheelComponent
            segments = {[...segments]}
            segColors = {segColors}
            // winningSegment ='won 10'
            onFinished={(winner)=>onFinished(winner)}
            primaryColor='black'
            contrastColor='white'
            buttonText='Spin'/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
