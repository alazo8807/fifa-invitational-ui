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

export default calculateStats;