import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TournamentCard from './TournamentCard';
import { getTournaments } from '../../Services/tournamentService';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(1)
  },
}));

const TournamentsList = () => {
  const classes = useStyles();
  const [tournaments, setTournaments] = useState([]);

  useEffect(()=>{
    const getTournamentsFromDb = async () => {
      const result = await getTournaments();
      const tournaments = result.data;
      
      setTournaments(tournaments);
      console.log(tournaments);
    }
  
    getTournamentsFromDb();
  },[])

  return (
    <div className={classes.root}>
      <Grid container spacing={5} justify='center'>
        {tournaments.map(tournament => (
          <Grid item>
            <TournamentCard data={tournament} />
          </Grid>
        ))}
      </Grid>
    </div>
   );
}
 
export default TournamentsList;