/**
 * Get Stats for each group and player.
 * @param {Array} players 
 * @param {Array} matches 
 */
const calculateStats = (players, matches) => {
  const stats = [];
  const rowPlayers = {};
  
  if (!matches || !players) return;

  for (let match of matches) {
    const playerA = players.find(p => p.id === match.playerA.id);
    const playerB = players.find(p => p.id === match.playerB.id);

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

  for (let key in rowPlayers) {
    stats.push({playerId: key, ...rowPlayers[key]});
  }
  // for (let values of Object.values(rowPlayers)) {
  //   stats.push(values);
  // }

  console.log('stats', stats);

  return stats;
}

/**
 * Get matches played for each group and check if all matches were played for each of them.
 */
export const checkGroupPhaseMatchesFinished = (players, matches, numberOfGroups, numberOfPlayersPerGroup) => {
  const result = [];
  for (let i = 1; i <= numberOfGroups; i++) {
    const matchesInGroup = matches.filter(m => m.group === Number(i));
    const groupStats = calculateStats(players, matchesInGroup);
    console.log('groupStats', groupStats);
    
    const gamesPlayedInGroup = groupStats.map(el => el.played).reduce((acc,curr) => (acc + curr),0);

    // Total number of matches to be played
    const totalMatchesToBePlayed = numberOfPlayersPerGroup * (numberOfPlayersPerGroup - 1);
    const groupFinished = (gamesPlayedInGroup === totalMatchesToBePlayed);

    result.push({group: `Group ${String.fromCharCode(64 + i)}`, gamesPlayedInGroup: gamesPlayedInGroup, groupFinished});
  }
  
  return result;
}


export default calculateStats;