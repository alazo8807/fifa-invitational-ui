import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FixturesTab from './FixturesTab';
import TableTab from './TableTab';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getTournament } from '../../Services/tournamentService';
import { saveMatch } from '../../Services/matchesService';
import calculateStats from '../../Utils/calculateStats';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    margin: theme.spacing(3)
  },
}));

const TournamentDashboard = (props) => {
  const classes = useStyles();
  const [tournament, setTournament] = useState({});
  const [stats, setStats] = useState([]);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(()=>{
    const tournamentId = props.match.params.id;
    let tournament = null;

    const getTournamentFromDb = async () => {
      const result = await getTournament(tournamentId);
      tournament = result.data;
      
      setTournament(tournament);
      console.log(tournament);
      
      // Init stats
      const newStats = calculateStats(tournament);
      setStats(newStats);
    }

    getTournamentFromDb();
  },[]);

  // Calculate stats
  useEffect(() => {    
    if (!tournament) return;
    const newstats = calculateStats(tournament);
    setStats(newstats);
  }, [tournament]);

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

      const newStats = calculateStats(tournamentUpdated);
      setStats(newStats);
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
        {tabValue === 1 && <TableTab stats={stats} />}
      </div>
    </>
   );
}
 
export default TournamentDashboard;