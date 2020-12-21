import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
    }
  },
  scoreDivider: {
    margin: '0 3px'
  }
}));

const FixturesTab = (props) => {
  const classes = useStyles(); 
  const [matches, setMatches] = useState(props.matches);

  /**
   * Update matches state variable when received new one
   */
  useEffect(()=>{
    setMatches(props.matches);
  }, [props.matches])

  const handleScoreChange = (event, matchId, player) => {
    let newScore = event.target.value;

    const match = matches.find(m => m._id === matchId);
    
    if (!match) return;

    const index = matches.indexOf(match);
    if (index < 0) return;

    // Validate is an integer number. If it is not, update input value to prev value.
    if (isNaN(newScore) || (newScore.length > 0 && newScore[newScore.length-1] === '.')) {
      newScore = matches[index][player].goals;
      return;
    }
    
    const updatedMatches = [...matches];
    // It's a valid integer, update the new value.
    updatedMatches[index][player].goals = newScore;
    props.onMatchesUpdate([updatedMatches[index]]);
  }

  const getGroupedMatches = (tournamentType, matches) => {
    if (tournamentType === 'league') return [{ group: null, matches }];
  }

  if (!props.tournament || !props.matches.length > 0) return null;
  const { tournamentType } = props.tournament;

  return ( 
    <div className={classes.root}>
      <Grid container spacing={1}>
          {getGroupedMatches(tournamentType, matches).map(obj => (
            <>
            {obj.group && (
                <div>
                  <h1>{obj.group}</h1>
                </div>
              )}
            {obj.matches && obj.matches.length > 0 && obj.matches.map(match => (
              <Grid key={match._id} item xs={12}>
                <Card className={classes.card}>
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
                          <input type="text" value={match.playerA.goals || ''} onChange={(e) => handleScoreChange(e, match._id, 'playerA')}></input>
                          <Typography variant="h5" component="h2"><span className={classes.scoreDivider}>-</span></Typography>
                          <input type="text" value={match.playerB.goals || ''} onChange={(e) => handleScoreChange(e, match._id, 'playerB')}></input>
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
            </>
          ))}
      </Grid>
    </div>
   );
}
 
export default FixturesTab;