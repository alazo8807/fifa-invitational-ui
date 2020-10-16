import React, {useState} from 'react';
import './App.css';
import CreateTournament from './Components/CreateTournament';
import AppContext from './Context/appContext';

function App() {
  const [tournaments, setTournaments] = useState([]);

  const createTournamentHandle = (tournament) => {
    setTournaments([...tournaments, tournament]);
  }

  return (
    <AppContext.Provider value={{tournaments, onCreateTournament: createTournamentHandle}}>
      <div className="App">
        <CreateTournament></CreateTournament>
      </div>
    </AppContext.Provider>
  );
}

export default App;
