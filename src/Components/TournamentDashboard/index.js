import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FixturesTab from './FixturesTab';
// import TableTab from './EnhancedTable';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getTournament } from '../../Services/tournamentService';
import { saveMatch } from '../../Services/matchesService';
import calculateStats from '../../Utils/calculateStats';
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
  const [tournament, setTournament] = useState({});
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(()=>{
    const tournamentId = props.match.params.id;
    let tournament = null;

    const getTournamentFromDb = async () => {
      const result = await getTournament(tournamentId);
      tournament = result.data;
      
      // Pass tournament name up to navbar to display on app bar.
      setTournament(tournament);
      if (props.setDisplayName) props.setDisplayName(tournament.name);
    }

    getTournamentFromDb();
  },[]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMatchesUpdate = (matches) => {
    const updateInDb = async () => {
      for (let match of matches) {
        await saveMatch(match);
      }
      const tournamentUpdated = {...tournament};
      tournamentUpdated.matches = matches;
      setTournament(tournamentUpdated);
    }

    updateInDb();
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
          onMatchesUpdate={handleMatchesUpdate} 
          {...props} />}
        {tabValue === 1 && <StatsTab tournament={tournament} />}
      </div>
    </>
   );
}

export default withNavBar(TournamentDashboard);