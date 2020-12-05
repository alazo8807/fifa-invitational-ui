import React, { useEffect, useState } from 'react';
import EnhancedTable from './EnhancedTable';
import calculateStats from '../../Utils/calculateStats';

const StatsTab = (props) => {
  const [tournament, setTournament] = useState(props.tournament);

  useEffect(()=>{
    if (!props.tournament) return;
    setTournament(props.tournament);
  }, [props.tournament])

  const getGroupedStats = ({ tournamentType, players, matches, numberOfGroups }) => {
    const stats = [];
    
    if (tournamentType === 'league') {
      const leagueStats = calculateStats(players, matches);
      stats.push({group: null, stats: leagueStats});
    }
    else if (tournamentType === 'groupPlayoff') {
      for (let i = 1; i <= numberOfGroups; i++) {
        const matchesInGroup = matches.filter(m => m.group === Number(i));
        const groupStats = calculateStats(players, matchesInGroup);
        stats.push({group: `Group ${String.fromCharCode(64 + i)}`, stats: groupStats});
      }
    }

    return stats;
  }

  return ( 
    <>
    {getGroupedStats(tournament).map(obj => (
      <>
      <EnhancedTable title={obj.group} stats={obj.stats} />
      </>
    ))}
    </>
  );
}
 
export default StatsTab;