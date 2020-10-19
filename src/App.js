import React, {useState, useEffect} from 'react';
import './App.css';
import CreateTournament from './Components/CreateTournament';
import TournamentDashboard from './Components/TournamentDashboard';
import AppContext from './Context/appContext';
import { Route, Switch } from 'react-router-dom';

function App() {
  const [tournaments, setTournaments] = useState([]);

  const handleUpdateTournament = (tournament) => {
    const newTournaments = [...tournaments];
    const tournamentInDb = newTournaments.find(t => t.id === tournament.id);
    if (!tournamentInDb) {
      newTournaments.push(tournament);
      setTournaments(newTournaments);
      return;
    };

    const index = newTournaments.indexOf(tournamentInDb);
    if (index === null || index < 0) return;

    newTournaments[index] = {...tournament};
    setTournaments([...newTournaments])
  }

  const createTournamentHandle = (tournament) => {
    setTournaments([...tournaments, tournament]);
  }

  return (
    <AppContext.Provider 
      value={
        {tournaments,
        onCreateTournament: createTournamentHandle,
        onUpdateTournament: handleUpdateTournament}}>
      <div className="App">
        <Switch>
          <Route path="/createTournament" component={CreateTournament}></Route>
          <Route path="/TournamentDashboard/:id" component={TournamentDashboard}></Route>
          <Route path="/" component={CreateTournament}></Route>
        </Switch>
      </div>
    </AppContext.Provider>
  );
}

export default App;
