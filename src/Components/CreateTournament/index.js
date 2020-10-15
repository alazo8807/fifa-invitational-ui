import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import Joi from 'joi';
import ErrorDialog from './ErrorDialog';

const TournamentTypes = [
  {
    value: 'league',
    label: 'League'
  },
];

const PlayersData = [
  {
    id: Math.random().toString(36).substr(7),
    name: '',
    team: ''
  },
  {
    id: Math.random().toString(36).substr(7),
    name: '',
    team: ''
  }
];

const schema = {
  name: Joi.string()
      .alphanum()
      .min(2)
      .max(20)
      .required(),

  type: Joi.string()
      .alphanum()
      .required(),

  playerName: Joi.string().min(3).max(20).required(),
  playerTeam: Joi.string().min(3).max(20).required(),

  players: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string().min(1).max(20).required(),
      team: Joi.string().min(2).max(20).required()
    })
  )
};

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
  },
  playersTeamsForm: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    }
  },
  errors: {
    '& > *': {
      margin: theme.spacing(1),
    }
  }
}));

const CreateTournament = () => {
  const classes = useStyles();

  const [name, setName] = useState('');
  const [tournamentType, setTournamentType] = useState('league');
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [players, setPlayers] = useState(PlayersData);
  const [errors, setErrors] = useState({});
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  const validate = () => {
    const validateSchema = {...schema};
    delete validateSchema['playerName'];
    delete validateSchema['playerTeam'];
    const { error } = Joi.object(validateSchema).validate({ name, type: tournamentType, players }, { abortEarly: false });
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  const validateProperty = (name, value) => {
    if (!name) return null;

    const { error } = Joi.object({ [name]: schema[name]}).validate({[name]: value});
    return error ? error.details[0].message : null;
  };
  
  const handleNameChanged = (event) => {
    setName(event.target.value);
  };
  
  const handleTournamentTypeChange = (event) => {
    setTournamentType(event.target.value);
  };

  const handleNumberOfPlayersChange = (event) => {
    const newNumber = event.target.value;
    if (newNumber < 2) return setNumberOfPlayers(2)
    else if (newNumber > 20) return setNumberOfPlayers(20)
    
    // Increased: Add new player's box
    if (newNumber > numberOfPlayers) {
      const newPlayer = {
        id: Math.random().toString(36).substr(7),
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

  const handlePlayerNameChange = (event, id) => {
    const playersCopy = [...players];
    const player = playersCopy.find(p => p.id === id);
    if (!player) return;

    const index = playersCopy.indexOf(player);
    if (index < 0) return;

    const value = event.target.value;
    playersCopy[index].name = value;
    setPlayers(playersCopy);
  }

  const handlePlayerTeamChange = (event, id) => {
    const playersCopy = [...players];
    const player = playersCopy.find(p => p.id === id);
    if (!player) return;

    const index = playersCopy.indexOf(player);
    if (index < 0) return;

    playersCopy[index].team = event.target.value;
    setPlayers(playersCopy);
  }

  const handleBlur = ({ event, id, label }) => {
    const propertyName = event.currentTarget.name;
    const value = event.target.value;
    const errorMessage = validateProperty(propertyName, value);
    
    const errorsCopy = {...errors};
    const key = id ? `${propertyName}_${id}` : [propertyName];
    if (errorMessage) {
      const updatedErrorMessage = errorMessage.replace(`${propertyName}`, `${label}`);
      errorsCopy[key] = updatedErrorMessage;
    } else {      
      delete errorsCopy[key]; 
    }

    setErrors(errorsCopy);
  }

  const handleSubmit = () => {
    const errorsValidate = validate();
    if (errorsValidate) {
      console.log(errorsValidate);
      
      setOpenErrorDialog(true);
    } 
  }

  return ( 
    <div className={classes.root}>
      <div>
        <h1>Create Tournament</h1>
        <div className={classes.form}>
          <TextField id="outlined-basic"
            label="Name" 
            name="name"
            variant="outlined" 
            helperText="Please enter a name for the tournament"
            onChange={handleNameChanged}
            onBlur={(event) => handleBlur({ event, label: "Name" })}
            error={errors['name'] && errors['name'].length > 0}
            helperText={errors['name']} />
          <TextField
            id="outlined-select-currency"
            select
            label="Tournament type"
            value={tournamentType}
            onChange={handleTournamentTypeChange}
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
        </div>
        <div className={classes.playersTeamsForm}>
          {players.map((player) => (
            <div id={`player_team_${player.id}`} className={classes.playerTeamBox}>
              <TextField
                id={`player_${player.id}`}
                label="Name"
                name="playerName"
                type="search"
                variant="filled"
                error={errors[`playerName_${player.id}`] !== undefined}
                onChange={(event) => handlePlayerNameChange(event, player.id)}
                onBlur={(event) => handleBlur({ event, id: player.id, label: "Player name" })} />
              <TextField
                id={`team_${player.id}`}
                name="playerTeam"
                label="Team"
                type="search"
                variant="filled"
                error={errors[`playerTeam_${player.id}`] !== undefined}
                onChange={(event) => handlePlayerTeamChange(event, player.id)}
                onBlur={(event) => handleBlur({ event, id: player.id, label: "Player team" })} />
            </div>
          ))}
        </div>
        <div className={classes.errors}>
          {Object.keys(errors).map(key => (
            <Alert severity="error">{errors[key]}</Alert>
          ))}
        </div>
        <Button 
          variant="contained"
          color="primary"
          size="large"
          disabled={Object.entries(errors).length > 0}
          onClick={handleSubmit}>
            Create Tournament
        </Button>
      </div>
      <ErrorDialog
        open={openErrorDialog}
        onCloseErrorDialog={() => setOpenErrorDialog(false)}/>
    </div>
   );
}
 
export default CreateTournament;
