import React, {useState} from 'react';
import './App.css';
import CreateTournament from './Components/CreateTournament';
import TournamentDashboard from './Components/TournamentDashboard';
import AppContext from './Context/appContext';
import { Route, Switch } from 'react-router-dom';

function App() {
  const [tournaments, setTournaments] = useState([]);

  const createTournamentHandle = (tournament) => {
    setTournaments([...tournaments, tournament]);
  }

  return (
    <AppContext.Provider value={{tournaments, onCreateTournament: createTournamentHandle}}>
      <div className="App">
        <Switch>
          <Route path="/createTournament" component={CreateTournament}></Route>
          <Route path="/TournamentDashboard" component={TournamentDashboard}></Route>
          <Route path="/" component={CreateTournament}></Route>
        </Switch>
      </div>
    </AppContext.Provider>
  );
}

export default App;
