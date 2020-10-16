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

const TournamentDashboard = (props) => {
  const classes = useStyles(); 
  const appContext = useContext(AppContext);
  const [tournament, setTournament] = useState({});

  useEffect(()=>{
    const tournamentId = props.match.params.id;
    const { tournaments } = appContext;
  
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
            playerA: {id: "6sargm", name: "ale", team: "Real Madrid", goals: 0},
            playerB: {id: "pweu", name: "roli", team: "Real Madrid B", goasl: 0}

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

  console.log(tournament);
  
  return ( 
    <div className={classes.root}>
      <Grid container spacing={1}>
        {tournament.matches && tournament.matches.map(match => (
          <Grid item xs={12}>
            <Card id={match.id} className={classes.card}>
              <CardContent className={classes.matchWrapper}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={4}>
                    <div className={classes.TeamWrapper}>
                      <div className={classes.teamText}>
                        <Typography variant="h6" component="h1">{match.playerA.team}</Typography>
                        <Typography variant="body1" component="p">{match.playerA.name}</Typography>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div className={classes.scoreWrapper}>
                      <input type="text"></input>
                      <Typography variant="h5" component="h2"><span className={classes.scoreDivider}>-</span></Typography>
                      <input type="text"></input>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
 
export default TournamentDashboard;