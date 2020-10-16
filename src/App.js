import React, {useState, useEffect} from 'react';
import './App.css';
import CreateTournament from './Components/CreateTournament';
import TournamentDashboard from './Components/TournamentDashboard';
import AppContext from './Context/appContext';
import { Route, Switch } from 'react-router-dom';

function App() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    if (!tournaments.length) {
      const tempTournament = {
        id: "oqio5f",
        name: "Test Tournament",
        tournamentType: "league",
        numberOfPlayers: 2,
        matches: [
          {
            id: "doli2w",
            playerA: {id: "6sargm", name: "ale", team: "real", goals: 0},
            playerB: {id: "pweu", name: "roli", team: "barca", goasl: 0}

          }
        ],
        players: [
          {id: "6sargm", name: "ale", team: "real"},
          {id: "pweu", name: "roli", team: "barca"}
        ],
      }

      setTournaments([tempTournament]);
    }
  },[]);

  const createTournamentHandle = (tournament) => {
    setTournaments([...tournaments, tournament]);
  }

  return (
    <AppContext.Provider value={{tournaments, onCreateTournament: createTournamentHandle}}>
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
