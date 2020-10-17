import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AppContext from '../../Context/appContext';
import { Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    margin: theme.spacing(3)
  },
  card: {
    minWidth: 400,
    maxWidth: 500,
  },
  teamText: {
    display: 'flex',
    flexDirection: 'column'
  },
  scoreWrapper: {
    display: 'flex',
    height: 30,
    '& > input': {
      width: 50,
      fontSize: 24,
      border: '1px solid #eceef0',
      borderRadius: 5,
      // borderStyle: 'none',
      focusStyle: 'none',
      textAlign: 'center',
      fontWeight: 600,
    },
    '& > input:focus': {
        outline: 'none !important'
    },
  },
  scoreDivider: {
    margin: '0 3px'
  }
}));

const FixturesTab = (props) => {
  const classes = useStyles(); 
  const appContext = useContext(AppContext);
  const { tournaments } = appContext;
  const [tournament, setTournament] = useState({});
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');

  useEffect(()=>{
    const tournamentId = props.match.params.id;
  
    let tournament = tournaments.find(t => t.id === tournamentId);

    // temp just for testing
    if (!tournament) {
      tournament = {
        id: "oqio5f",
        name: "Test Tournament",
        tournamentType: "league",
        numberOfPlayers: 2,
        matches: [
          {
            id: "doli2w",
            playerA: {id: "6sargm", name: "ale", team: "Real Madrid", goals: ''},
            playerB: {id: "pweu", name: "roli", team: "Real Madrid B", goals: ''}

          }
        ],
        players: [
          {id: "6sargm", name: "ale", team: "real"},
          {id: "pweu", name: "roli", team: "barca"}
        ],
      }
    }

    setTournament(tournament);
  },[]);

  const handleScoreChange = (event, matchId, player) => {
    let newScore = event.target.value;

    const tournamentCopy = {...tournament};
    const match = tournamentCopy.matches.find(m => m.id === matchId);
    if (!match) return;

    const index = tournamentCopy.matches.indexOf(match);
    if (index < 0) return;

    // Validate is an integer number. If it is not, update input value to prev value.
    if (isNaN(newScore) || (newScore.length > 0 && newScore[newScore.length-1] === '.')) {
      newScore = tournamentCopy.matches[index][player].goals;
      player === 'playerA' ? setScoreA(newScore) : setScoreB(newScore);
      return;
    }
    
    // It's a valid integer, update the new value.
    player === 'playerA' ? setScoreA(newScore) : setScoreB(newScore);
    tournamentCopy.matches[index][player].goals = newScore;
    appContext.onUpdateTournament(tournamentCopy);
  }
  
  return ( 
    <div className={classes.root}>
      <Grid container spacing={1}>
        {tournament.matches && tournament.matches.map(match => (
          <Grid item xs={12}>
            <Card id={match.id} className={classes.card}>
              <CardContent className={classes.matchWrapper}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <div className={classes.TeamWrapper}>
                      <div className={classes.teamText}>
                        <Typography variant="h6" component="h1">{match.playerA.team}</Typography>
                        <Typography variant="body1" component="p">{match.playerA.name}</Typography>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.scoreWrapper}>
                      <input type="text" value={scoreA} onChange={(e) => handleScoreChange(e, match.id, 'playerA')}></input>
                      <Typography variant="h5" component="h2"><span className={classes.scoreDivider}>-</span></Typography>
                      <input type="text" value={scoreB} onChange={(e) => handleScoreChange(e, match.id, 'playerB')}></input>
                      <p>{match.playerA.goals}</p>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.TeamWrapper}>
                      <div className={classes.teamText}>
                        <Typography variant="h6" component="h1">{match.playerB.team}</Typography>
                        <Typography variant="body1" component="p">{match.playerB.name}</Typography>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
   );
}
 
export default FixturesTab;