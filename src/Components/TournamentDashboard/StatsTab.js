import React from 'react';
import EnhancedTable from './EnhancedTable';
import calculateStats from '../../Utils/calculateStats';


const StatsTab = (props) => {

  const getGroupedStats = (players, matches, numberOfGroups) => {
    const stats = [];
    
    for (let i = 1; i <= numberOfGroups; i++) {
      const matchesInGroup = matches.filter(m => m.group === Number(i));
      const groupStats = calculateStats(players, matchesInGroup);
      stats.push({group: `Group ${String.fromCharCode(64 + i)}`, stats: groupStats});
    }

    return stats;
  }

  const { tournament } = props;
  if (!tournament || !tournament.players || !tournament.matches || !tournament.numberOfGroups) return null;
  const { players, matches, numberOfGroups } = tournament;

  return ( 
    <>
    {getGroupedStats(players, matches, numberOfGroups).map(obj => (
      <>
      <EnhancedTable title={obj.group} stats={obj.stats} />
      </>
    ))}
    </>
  );
}
 
export default StatsTab;