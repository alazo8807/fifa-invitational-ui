import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import GroupIcon from '@material-ui/icons/Group';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Badge } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  badgeGroup: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function TournamentCard({data}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  // useEffect(()=>{

  // },[])

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getTypeInitials = (type) => {
    switch (type) {
      case 'league':
        return 'L'
      default:
        break;
    }
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {getTypeInitials(data.tournamentType)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={data.name}
        subheader="September 14, 2016"
      />
      <CardMedia
        className={classes.media}
        image="/leagues.jpg"
        title="League Tournament"
      />
      <CardActions className={classes.cardActions}>
        <div className={classes.badgeGroup}>
          <Badge badgeContent={data.numberOfPlayers} color="primary">
            <GroupIcon />
          </Badge>
          <Badge badgeContent={data.matches.length} color="primary">
            <SportsSoccerIcon />
          </Badge>
        </div>
        <IconButton aria-label="share" className={classes.alignEnd}>
          <ShareIcon />
        </IconButton>        
      </CardActions>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography body1>
            Players: {data.numberOfPlayers}
          </Typography>
          <Typography body1>
            Fixtures: {data.matches.length}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
