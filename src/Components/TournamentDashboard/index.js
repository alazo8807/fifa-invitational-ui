import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FixturesTab from './FixturesTab';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getTournament, saveTournament } from '../../Services/tournamentService';
import { saveMatch } from '../../Services/matchesService';
import withNavBar from '../hoc/withNavBar';
import StatsTab from './StatsTab';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    margin: theme.spacing(3)
  },
}));

const TournamentDashboard = (props) => {
  const classes = useStyles();
  const [tournament, setTournament] = useState();
  const [matches, setMatches] = useState([]);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(()=>{
    const tournamentId = props.match.params.id;
    let tournament = null;

    const getTournamentFromDb = async () => {
      const result = await getTournament(tournamentId);
      tournament = result.data;
      
      // Pass tournament name up to navbar to display on app bar.
      setTournament(tournament);
      setMatches(tournament.matches);

      // Pass tournament name up to navbar to display on app bar.
      if (props.setDisplayName) props.setDisplayName(tournament.name);
    }

    getTournamentFromDb();
  },[]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMatchesUpdate = (updatedMatches) => {
    const updateInDb = async () => {
      let newMatches = [...matches];

      for (let match of updatedMatches) {
        await saveMatch(match);

        let matchToUpdate = newMatches.find(m => m._id === match._id);
        matchToUpdate = match;
      }

      setMatches(newMatches);
    }

    updateInDb();
  }

  const handleTournamentUpdate = async (tournamentUpdated) => {
    console.log("trying to save tournament", tournamentUpdated);
    
    const { data: tournamentSaved } = await saveTournament(tournamentUpdated);
    
    const tournamentId = tournamentSaved._id;
    let tournament = null;

    const getTournamentFromDb = async () => {
      const result = await getTournament(tournamentId);
      tournament = result.data;
      
      setTournament(tournament);
      setMatches(tournament.matches);
    }

    getTournamentFromDb();
  }

  return ( 
    <>
      <Paper square>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Fixtures" />
          <Tab label="Table" />
        </Tabs>
      </Paper>
      <div className={classes.root}>
        {tabValue === 0 && <FixturesTab 
          tournament={tournament}
          matches={matches}
          onMatchesUpdate={handleMatchesUpdate}
          onTournamentUpdate={handleTournamentUpdate}
          {...props} />}
        {tabValue === 1 && <StatsTab tournament={tournament} />}
      </div>
    </>
   );
}

export default withNavBar(TournamentDashboard);