import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography, Grid } from '@material-ui/core';
import calculateStats, { checkGroupPhaseMatchesFinished } from '../../Utils/calculateStats';
import { createInitialPlayoffRoundMatches } from '../../Utils/matchGenerator';
import { saveTournament } from '../../Services/tournamentService';

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
  const [groupPhaseFinished, setGroupPhaseFinished] = useState(false);
  const [tournament, setTournament] = useState(props.tournament);

  /**
   * Update tournament state variable when received new one
   */
  useEffect(()=>{
    setTournament(props.tournament);
    console.log('updating tt',props.tournament);
    
  }, [props.tournament])

  // const [count, setCount] = useState(1);
  //temp
  useEffect(()=>{
    if (!tournament || !tournament.matches) return;
    if (!groupPhaseFinished) return; 

    // if(count === 10) return;

    const playoffMatchesExisting = tournament.matches.some(m => m.playoffRound && m.playoffRound.length > 0);
    console.log('playoffMatchesExisting', playoffMatchesExisting);
    
    if (playoffMatchesExisting) return;
    
    const createAndSaveMatches = async () => {
      
      let stats = [];
      for (let i = 1; i <= tournament.numberOfGroups; i++) {
        const matchesInGroup = tournament.matches.filter(m => m.group === Number(i));
        const groupStats = calculateStats(tournament.players, matchesInGroup);      
        stats.push({group: Number(i), stats: groupStats});
      }
      
      const { playoffType, numberOfGroups, teamsAdvancingPerGroup, players } = tournament;

      const newMatches = await createInitialPlayoffRoundMatches(playoffType, numberOfGroups, teamsAdvancingPerGroup, players, stats);
      console.log('newMatches', newMatches);
      
      const tournamentUpdate = {...tournament};
      tournamentUpdate.matches = [...tournament.matches, ...newMatches];
      props.onTournamentUpdate(tournamentUpdate);
      // saveTournament(tournamentUpdate);
      // setTournament(tournamentUpdate);

      // setCount(count + 1);
    }

    createAndSaveMatches();
  }, [groupPhaseFinished])

  /**
   * Check if all the matches for group stage have been played. 
   * If so, then enable and update playoff match tiles.
   */
  const checkAndUpdatePlayoffs = () => {
    const { matches, players, numberOfGroups, numberOfPlayersPerGroup } = tournament;

    const matchesPlayedPerGroup = checkGroupPhaseMatchesFinished(players, matches, numberOfGroups, numberOfPlayersPerGroup);
    
    // If there are matches remaining for any group, don't do anything.
    // TODO: We should unlock playoff matches as soon as we can, no need to wait for all matches to be finished.
    const groupMatchesRemaining = matchesPlayedPerGroup.some(g => g.groupFinished === false);
    if (groupMatchesRemaining) return;

    setGroupPhaseFinished(true);
  }

  const handleScoreChange = (event, matchId, player) => {
    let newScore = event.target.value;

    const tournamentCopy = {...tournament};
    const match = tournamentCopy.matches.find(m => m._id === matchId);
    
    if (!match) return;

    const index = tournamentCopy.matches.indexOf(match);
    if (index < 0) return;

    // Validate is an integer number. If it is not, update input value to prev value.
    if (isNaN(newScore) || (newScore.length > 0 && newScore[newScore.length-1] === '.')) {
      newScore = tournamentCopy.matches[index][player].goals;
      return;
    }
    
    // It's a valid integer, update the new value.
    tournamentCopy.matches[index][player].goals = newScore;
    // TODO: Keep a copy of matches in a state variable here to avoid delay when new score entered.
    props.onMatchesUpdate(tournamentCopy.matches);

    // Check and populate playoff round matches information if possible
    checkAndUpdatePlayoffs();
  }

  const getPlayoffGroupedMatches = (matches) => {
    let result = [];
    // Get different rounds of playoff
    const playoffMatches = matches.filter(m => (m.playoffRound && m.playoffRound.length > 0));

    console.log('getPlayoffGroupedMatches', playoffMatches);
    
    const playoffRounds = new Set();
    for (let match of playoffMatches) {
      if (playoffRounds.has(match.playoffRound)) continue;
      playoffRounds.add(match.playoffRound);
    }

    // Group matches per round
    for (let round of playoffRounds) {
      const matchesInRound = matches.filter(m => m.playoffRound === round);
      result.push({group: round, matches: matchesInRound});
    }

    return result;
  }

  const getGroupedMatches = (updatedTournament) => {
    const { tournamentType, numberOfGroups, matches } = updatedTournament;

    console.log('checking updates', updatedTournament.matches);
    
    if (tournamentType === 'league') return [{matches}];
    
    const result = [];

    // Get group stage matches
    for (let i = 1; i <= numberOfGroups; i++) {
      const matchesInGroup = matches.filter(m => m.group === Number(i));
      // ASCII code of A is 65. Convert i to corresponding group letter
      result.push({group: `Group ${String.fromCharCode(64 + i)}`, matches: matchesInGroup});
    }

    // Playoff rounds matches
    const playoffMatches = getPlayoffGroupedMatches(matches);
    result.push(...playoffMatches);
    
    return result;
  }

  /**
   * Check if input field should be disabled or not.
   * If input is of a playoff match and group phase matches are not finished, then disable.
   */
  const checkInputDisabled = (group) => {  
    if (group >= 1 && group <= 8) return false;
    if (groupPhaseFinished) return false;

    return true;
  }

  if (!tournament || !tournament.matches) return null;
  
  return ( 
    <div className={classes.root}>
      <Grid container spacing={1}>
          {getGroupedMatches(tournament).map(obj => (
            <>
            {obj.group && (
                <div>
                  <h1>{obj.group}</h1>
                </div>
              )}
            {obj.matches.map(match => (
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
                          <input disabled={checkInputDisabled(match.group)} type="text" value={match.playerA.goals || ''} onChange={(e) => handleScoreChange(e, match._id, 'playerA')}></input>
                          <Typography variant="h5" component="h2"><span className={classes.scoreDivider}>-</span></Typography>
                          <input disabled={checkInputDisabled(match.group)} type="text" value={match.playerB.goals || ''} onChange={(e) => handleScoreChange(e, match._id, 'playerB')}></input>
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