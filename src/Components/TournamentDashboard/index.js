import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FixturesTab from './FixturesTab';
import TableTab from './TableTab';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getTournament, saveTournament } from '../../Services/tournamentService';

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

  // Create a test tournament if none created yet. (Testing porpuse only)
  useEffect(()=>{
    const tournamentId = props.match.params.id;
    let tournament = null;

    const getTournamentFromDb = async () => {
      const result = await getTournament(tournamentId);
      tournament = result.data;
      
      setTournament(tournament);
      
      // Init stats
      const newStats = calculateStats(tournament);
      setStats(newStats);
      
      console.log(tournament);
    }

    getTournamentFromDb(); 
  },[]);

  // Calculate stats
  useEffect(() => {    
    if (!tournament) return;
    const newstats = calculateStats(tournament);
    setStats(newstats);
  }, [tournament]);

  const calculateStats = (tournament) => {
    const stats = [];
    const rowPlayers = {};
    
    if (!tournament || !tournament.matches) return;

    for (let match of tournament.matches) {
      const playerA = tournament.players.find(p => p.id === match.playerA.id);
      const playerB = tournament.players.find(p => p.id === match.playerB.id);

      if (!rowPlayers[playerA.id]) rowPlayers[playerA.id] = {
        name: '',
        played: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
        gf: 0,
        ga: 0,
        gd: 0
      };
      if (!rowPlayers[playerB.id]) rowPlayers[playerB.id] = {
        name: '',
        played: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
        gf: 0,
        ga: 0,
        gd: 0
      };
      
      rowPlayers[playerA.id].name = `${playerA.name}(${match.playerA.team})`;
      rowPlayers[playerB.id].name = `${playerB.name}(${match.playerB.team})`;

      const playerAGoals = match.playerA.goals === '' ? null : match.playerA.goals;
      const playerBGoals = match.playerB.goals === '' ? null : match.playerB.goals;
      
      // Match not played yet
      if (playerAGoals === null || playerAGoals === undefined || playerBGoals === null || playerBGoals === undefined) {
        continue;
      }

      rowPlayers[playerA.id].played = Number(rowPlayers[playerA.id].played || 0) + 1;
      rowPlayers[playerB.id].played = Number(rowPlayers[playerB.id].played || 0) + 1;
      rowPlayers[playerA.id].gf = playerAGoals;
      rowPlayers[playerB.id].gf = playerBGoals;
      rowPlayers[playerA.id].ga = Math.abs(Number((rowPlayers[playerA.id].ga || 0) - playerBGoals));
      rowPlayers[playerB.id].ga = Math.abs(Number((rowPlayers[playerB.id].ga || 0) - playerAGoals));
      rowPlayers[playerA.id].gd = rowPlayers[playerA.id].gf - rowPlayers[playerA.id].ga;
      rowPlayers[playerB.id].gd = rowPlayers[playerB.id].gf - rowPlayers[playerB.id].ga;
      
      // PlayerA win
      if (playerAGoals > playerBGoals) {
        rowPlayers[playerA.id].wins = (rowPlayers[playerA.id].wins || 0) + 1;
        rowPlayers[playerB.id].losses = (rowPlayers[playerB.id].losses || 0) + 1;
        rowPlayers[playerA.id].points = (rowPlayers[playerA.id].points || 0) + 3;
      }
      // PlayerB win
      else if (playerAGoals < playerBGoals) {
        rowPlayers[playerB.id].wins = (rowPlayers[playerB.id].wins || 0) + 1;
        rowPlayers[playerA.id].losses = (rowPlayers[playerA.id].losses || 0) + 1;
        rowPlayers[playerB.id].points = (rowPlayers[playerB.id].points || 0) + 3;
      }
      // Draw
      else if (playerAGoals === playerBGoals){
        rowPlayers[playerA.id].draws = (rowPlayers[playerA.id].draws || 0) + 1;
        rowPlayers[playerB.id].draws = (rowPlayers[playerB.id].draws || 0) + 1;
        rowPlayers[playerA.id].points = (rowPlayers[playerA.id].points || 0) + 1;
        rowPlayers[playerB.id].points = (rowPlayers[playerB.id].points || 0) + 1;
      }
    };

    for (let values of Object.values(rowPlayers)) {
      stats.push(values);
    }

    return stats;
  }

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTournamentUpdate = (tournament) => {
    const saveTournamentInDb = async () => {
      const result = await saveTournament(tournament);
      tournament = result.data;
      setTournament(tournament);
      const newStats = calculateStats(tournament);
      setStats(newStats);
    }

    saveTournamentInDb(); 
  }
  
  return ( 
    <>
      <Paper square>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Fixtures" />
          <Tab label="Table" />
        </Tabs>
      </Paper>
      <div className={classes.root}>
        {tabValue === 0 && <FixturesTab 
          tournament={tournament}
          onTournamentUpdate={handleTournamentUpdate} 
          {...props} />}
        {tabValue === 1 && <TableTab stats={stats} />}
      </div>
    </>
   );
}
 
export default TournamentDashboard;