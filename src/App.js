import React, {useState, useEffect} from 'react';
import './App.css';
import TournamentsList from './Components/Tournaments';
import CreateTournament from './Components/CreateTournament';
import TournamentDashboard from './Components/TournamentDashboard';
import ProtectedRoute from './Components/common/ProtectedRoute';
import AppContext from './Context/appContext';
import { Route, Switch } from 'react-router-dom';
import SignInSide from './Components/SignIn/index';
import SignUpSide from './Components/SignUp/index';
import { getCurrentUser } from './Services/authService';

function App() {
  const [tournaments, setTournaments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const user = getCurrentUser();
    setUser(user);
  }, [])

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
        user,
        onCreateTournament: createTournamentHandle,
        onUpdateTournament: handleUpdateTournament}}>
      <div className="App">
        <Switch>
          <ProtectedRoute path="/Tournaments" component={TournamentsList}></ProtectedRoute>
          <ProtectedRoute path="/createTournament/:id?" component={CreateTournament}></ProtectedRoute>
          <Route path="/TournamentDashboard/:id" component={TournamentDashboard}></Route>
          <Route path="/SignIn" component={SignInSide}></Route>
          <Route path="/SignUp" component={SignUpSide}></Route>
          <ProtectedRoute path="/" component={TournamentsList}></ProtectedRoute>
        </Switch>
      </div>
    </AppContext.Provider>
  );
}

export default App;
