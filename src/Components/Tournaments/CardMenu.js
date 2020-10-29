import React, { useState, useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ListItemIcon, Typography } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1)
  },
}));

export default function CardMenu({htmlEl, onClose, onDelete, onDuplicate }) {
  const [anchorEl, setAnchorEl] = useState(htmlEl);
  const classes = useStyles();

  useEffect(()=>{
    setAnchorEl(htmlEl)
  }, [htmlEl])

  return (
    <div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuItem onClick={onDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small"/>
            <Typography variant="body1">Delete</Typography>
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={onDuplicate}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small"/>
            <Typography variant="body1">Clone</Typography>
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </div>
  );
}
