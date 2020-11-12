import { saveMatch } from '../Services/matchesService';

/**
 * Create all playoff matches. Divided in 2 parts, first create initial Round based on info passed,
 * Then create rest of matches based on initial round matches.
 * @param {obj} initialRound 
 * @param {Number} numberOfGroups 
 * @param {Number} teamsAdvancingPerGroup 
 */
export const createPlayoffMatches = async (initialRound, numberOfGroups, teamsAdvancingPerGroup) => {
  let matches = [];
  const initialRoundMatches = await createInitialPlayoffRoundMatches(initialRound, numberOfGroups, teamsAdvancingPerGroup);
  matches.push(...initialRoundMatches);
  const finalRoundsMatches = await createFinalRoundsMatches(initialRoundMatches);
  matches.push(...finalRoundsMatches);
  return matches;
}

const createFinalRoundsMatches = async (initialRoundMatches) => {
  console.log('initialRoundMatches', initialRoundMatches);
  
  let roundMatches = initialRoundMatches.length / 2;
  let matches = [];

  while (roundMatches >= 1) {
    let playoffRound = '';
    console.log('roundMatches', roundMatches);
    
    switch (roundMatches) {
      case 4:
        playoffRound = 'Quater-finals';
        break;
      case 2:
        playoffRound = 'Semi-finals';
        break;
      case 1:
        playoffRound = 'Final';
      default:
        break;
    }

    for (let i = 0; i < roundMatches; i++) {
      const match = {
        playoffRound,
        playerA: {
          id: 'TBD',
          name: 'TBD',
          team: 'TBD',
          goals: null
        },
        playerB: {
          id: 'TBD',
          name: 'TBD',
          team: 'TBD',
          goals: null
        },
      }
  
      const { data: newMatch } = await saveMatch(match);
      matches.push({_id: newMatch._id});
    }
    
    roundMatches = roundMatches / 2;
  }

  return matches;
}

export const createInitialPlayoffRoundMatches = async (initialRound, numberOfGroups, teamsAdvancingPerGroup, players, statsAllGroups) => {
  let matches = [];
  let group = 1;


  while (group <= numberOfGroups) {
    const firstGroup = group;
    const secondGroup = group + 1;
    const roundLabel = initialRound;
    const newMatches = await createMatchesForTwoGroups(teamsAdvancingPerGroup, roundLabel, firstGroup, secondGroup, players, statsAllGroups);
    matches.push(...newMatches);
    group = group + 2;
  }

  return matches;
}

const createMatchesForTwoGroups = async (teamsAdvancingPerGroup, playoffRound, firstGroup, secondGroup, players, statsAllGroups) => {
  let firstGroupIndex = 0, secondGroupIndex = teamsAdvancingPerGroup - 1;
  const rankLabels = ['1st', '2nd', '3rd', '4th', '5th'];
  let matches = [];

  // Cross match players (first of group 1 vs last of group 2 and so on)
  while (firstGroupIndex < teamsAdvancingPerGroup && secondGroupIndex >= 0) {
    let playerAId = 'TBD';
    let playerAName = `${rankLabels[firstGroupIndex]} of Group ${firstGroup}`;
    let playerATeam = 'TBD';

    let playerBId = 'TBD';
    let playerBName = `${rankLabels[secondGroupIndex]} of Group ${secondGroup}`;
    let playerBTeam = 'TBD';

    // If stats passed, means group phase matches are done, so we need to create the matches for next round.
    if (statsAllGroups && statsAllGroups.length > 0) {
      console.log('statsAllGroups', statsAllGroups);
      
      const { stats: firstGroupStats } = statsAllGroups.find(sg => sg.group === firstGroup);
      const { stats: secondGroupStats } = statsAllGroups.find(sg => sg.group === secondGroup);

      console.log('firstGroupStats', firstGroupStats);
      playerAId = firstGroupStats.sort((a,b) => b.points - a.points)[firstGroupIndex].playerId;
      playerBId = secondGroupStats.sort((a,b) => b.points - a.points)[secondGroupIndex].playerId;

      console.log('playerAId', playerAId);
      
      const playerA = players.find(p => p.id === playerAId);
      const playerB = players.find(p => p.id === playerBId);

      playerAName = playerA.name;
      playerATeam = playerA.team;

      playerBName = playerB.name;
      playerBTeam = playerB.team;
    }

    const match = {
      playoffRound,
      playerA: {
        id: playerAId,
        name: playerAName,
        team: playerATeam,
        goals: null
      },
      playerB: {
        id: playerBId,
        name: playerBName,
        team: playerBTeam,
        goals: null
      },
    }
    
    // Save the match
    if (statsAllGroups && statsAllGroups.length > 0) {
      const { data: newMatch } = await saveMatch(match);
      matches.push({_id: newMatch._id});
    }

    firstGroupIndex++;
    secondGroupIndex--;
  }
console.log('matchesSaved', matches);

  return matches;
}
