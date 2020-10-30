import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import GroupIcon from '@material-ui/icons/Group';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Badge } from '@material-ui/core';
import CardMenu from './CardMenu';
import { deleteTournament } from '../../Services/tournamentService';

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

export default function TournamentCard(props) {
  const classes = useStyles();
  const [data, setData] = useState(props.data);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(()=>{
    setData(props.data);
  }, [props.data])

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDuplicateClicked = (id) => {
    handleMenuClose();
    props.history.push(`/createTournament/${id}`);
  }

  const handleDeleteClicked = async (id) => {
    const result = await deleteTournament(id);
    const deletedId = result.data._id;

    handleMenuClose();
    props.onTournamentDeleted(deletedId);
  }

  const handleNameClicked = (e) => {
    e.preventDefault();
    props.history.push(`/tournamentDashboard/${data._id}`)
  }

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
          <>
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <CardMenu htmlEl={menuAnchor}
              onClose={handleMenuClose}
              onDuplicate={()=>handleDuplicateClicked(data._id)}
              onDelete={()=>handleDeleteClicked(data._id)}/>
          </>
        }
        title={
          <Link href="#" onClick={handleNameClicked}>
            {data.name}
          </Link>
        }
        subheader={new Date(data.createdDate).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}
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
    </Card>
  );
}
