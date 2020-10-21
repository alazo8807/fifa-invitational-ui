import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import Joi from 'joi';
import ErrorDialog from './ErrorDialog';
import AppContext from '../../Context/appContext';
import { saveTournament } from '../../Services/tournamentService';

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
    margin: '20px 40px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formInputGroup: {
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
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
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    }
  },
  errors: {
    '& > *': {
      margin: `${theme.spacing(1)}px 0`
    }
  },
  submitBtn: {
    margin: `${theme.spacing(2)}px 0`,
    maxWidth: 400
  }
}));

const CreateTournament = (props) => {
  const classes = useStyles();
  const appContext = useContext(AppContext);

  const [name, setName] = useState('');
  const [tournamentType, setTournamentType] = useState('league');
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [players, setPlayers] = useState(PlayersData);
  const [errors, setErrors] = useState({});
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  /**
   * Validate all required fields.
   */
  const validate = () => {
    // playerName and playerTeam are schemas for onBlur validation of the field. Ignore here.
    const validateSchema = {...schema};
    delete validateSchema['playerName'];
    delete validateSchema['playerTeam'];
    const { error } = Joi.object(validateSchema).validate({ name, type: tournamentType, players }, { abortEarly: false });
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  /**
   * Validate a specific field
   */
  const validateProperty = (name, value) => {
    if (!name) return null;

    const { error } = Joi.object({ [name]: schema[name]}).validate({[name]: value});
    return error ? error.details[0].message : null;
  };
  
  /**
   * Handle Name changed
   */
  const handleNameChanged = (event) => {
    setName(event.target.value);
  };
  
  /**
   * Handle Tournament Type changed
   */
  const handleTournamentTypeChange = (event) => {
    setTournamentType(event.target.value);
  };

  /**
   * Hanlde # of players changed
   */
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

  /**
   * Handle Player name changed
   */
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

  /**
   * Handle Player team changed
   */
  const handlePlayerTeamChange = (event, id) => {
    const playersCopy = [...players];
    const player = playersCopy.find(p => p.id === id);
    if (!player) return;

    const index = playersCopy.indexOf(player);
    if (index < 0) return;

    playersCopy[index].team = event.target.value;
    setPlayers(playersCopy);
  }

  /**
   * Handle blur event for player's name and team fields.
   * @param {event} - Event object
   * @param {id} id - Id of the player's name and team combination.
   * @param {label} - Label of the field. Used for updating error message.
   */
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

  /**
   * Handle submit (Create tournament clicked)
   */
  const handleSubmit = async () => {
    const errorsValidate = validate();
    if (errorsValidate) {
      setOpenErrorDialog(true);
      return;
    }

    const matches = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i+1; j < players.length; j++){
        const match = {
          id: Math.random().toString(36).substr(7),
          playerA: { ...players[i], goals: null },
          playerB: { ...players[j], goasl: null }
        }

        matches.push(match);
      }
    }

    const newTournament = {
      name,
      tournamentType,
      numberOfPlayers,
      players,
      matches
    }

    const { data } = await saveTournament(newTournament);
    newTournament._id = data._id;
    
    props.history.push(`/tournamentDashboard/${newTournament._id}`)
  }

  return ( 
    <div className={classes.root}>
      <div>
        <h1>Create Tournament</h1>
        <div className={classes.form}>
          <div className={classes.formInputGroup}>
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
            className={classes.submitBtn}
            color="primary"
            size="large"
            disabled={Object.entries(errors).length > 0}
            onClick={handleSubmit}>
              Create Tournament
          </Button>
        </div>
      </div>
      <ErrorDialog
        open={openErrorDialog}
        onCloseErrorDialog={() => setOpenErrorDialog(false)}/>
    </div>
   );
}

export default CreateTournament;
