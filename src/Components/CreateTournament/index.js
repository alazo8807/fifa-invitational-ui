import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const TournamentTypes = [
  {
    value: 'league',
    label: 'League'
  },
];

const PlayersData = [
  {
    name: '',
    team: ''
  },
  {
    name: '',
    team: ''
  }
]

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 40px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 400,
    '& > *': {
      marginBottom: 20
    }
  },
  playerTeamBox: {
    display: 'flex',
    flexDirection: 'column'
  }

}));

const CreateTournament = () => {
  const classes = useStyles();

  const [tournamentType, setTournamentType] = React.useState('league');
  const [numberOfPlayers, setNumberOfPlayers] = React.useState(2);
  const [players, setPlayers] = React.useState(PlayersData);

  const handleChange = (event) => {
    setTournamentType(event.target.value);
  };

  const handleNumberOfPlayersChange = (event) => {
    const newNumber = event.target.value;
    if (newNumber < 2) return setNumberOfPlayers(2)
    else if (newNumber > 20) return setNumberOfPlayers(20)
    
    // Increased: Add new player's box
    if (newNumber > numberOfPlayers) {
      const newPlayer = {
        name: '',
        team: ''
      }

      setPlayers([...players, newPlayer]);
    }

    // Decresead: Remove last player's box
    if (newNumber < numberOfPlayers) {
      const newPlayers = players.slice(0, -1);
      setPlayers(newPlayers);
    }

    setNumberOfPlayers(newNumber);

    
  }

  return ( 
    <div className={classes.root}>
      <div>
        <h1>Create Tournament</h1>
        <div class={classes.form}>
          <TextField id="outlined-basic"
            label="Name" 
            variant="outlined" 
            helperText="Please enter a name for the tournament"/>
          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            value={tournamentType}
            onChange={handleChange}
            helperText="Please select a tournament type"
            variant="outlined"
          >
            {TournamentTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField id="outlined-basic"
            label="Number of players" 
            variant="outlined" 
            helperText="Please enter a name for the tournament"
            type="number"
            value={numberOfPlayers}
            onChange={handleNumberOfPlayersChange}
          />
          {players.map((player) => (
            <div class={classes.playerTeamBox}>
              <TextField id="filled-search" label="Name" type="search" variant="filled" />
              <TextField id="filled-search" label="Team" type="search" variant="filled" />
            </div>
          ))}
        </div>
      </div>
    </div>
   );
}
 
export default CreateTournament;
