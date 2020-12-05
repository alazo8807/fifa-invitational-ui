import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TournamentCard from './TournamentCard';
import { getTournaments } from '../../Services/tournamentService';
import { Grid, Button, Typography } from '@material-ui/core';
import withNavBar from '../hoc/withNavBar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(1)
  },
  getStarted: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const TournamentsList = (props) => {
  const classes = useStyles();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const getTournamentsFromDb = async () => {
      const result = await getTournaments(true);
      const tournaments = result.data;
      
      setTournaments(tournaments);
      setLoading(false);
      console.log(tournaments);
    }
  
    getTournamentsFromDb();
  },[])

  const handleTournamentDeleted = (deletedId) => {
    const newTournaments = tournaments.filter(t => t._id !== deletedId);
    setTournaments(newTournaments);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={5} justify='center'>
        {(!loading && tournaments.length === 0) && (
          <div className={classes.getStarted}>
            <Typography variant="paragraph">You don't have any tournament created yet.</Typography>
            <Button fullWidth="false" variant="outlined" color="primary" onClick={()=>props.history.push("/createTournament")}>Get started</Button>
          </div>
        )}
        {tournaments.map(tournament => (
          <Grid item>
            <TournamentCard data={tournament} onTournamentDeleted={handleTournamentDeleted} {...props}/>
          </Grid>
        ))}
      </Grid>
    </div>
   );
}
 
TournamentsList.displayName = 'My Tournaments';
export default withNavBar(TournamentsList);