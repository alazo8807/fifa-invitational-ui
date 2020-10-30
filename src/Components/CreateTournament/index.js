import React, { useState, useEffect, useContext } from 'react';
import Joi from 'joi';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
import ErrorDialog from './ErrorDialog';
import WheelDialog from './WheelDialog';
import AppContext from '../../Context/appContext';
import { saveTournament, getTournament } from '../../Services/tournamentService';
import { saveMatch } from '../../Services/matchesService';
import withNavBar from '../hoc/withNavBar';

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
  const [disableWheelBtn, setDisableWheelBtn] = useState(false);
  const [errors, setErrors] = useState({});
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openWheelDialog, setOpenWheelDialog] = useState(false);

  /**
   * If id passed in url, it means we need to clone that tournament.
   * Try to get tournament from db, then populate page with data received.
   */
  useEffect(()=>{
    const tournamentId = props.match.params.id;
    if (!tournamentId) return;

    let tournamentInDb = null;
    const populateData = () => {    
      setName(tournamentInDb.name);
      setTournamentType(tournamentInDb.tournamentType);
      setNumberOfPlayers(tournamentInDb.numberOfPlayers);
      setPlayers(tournamentInDb.players.map(p => ({id: p.id, name: p.name, team: p.team})));
    }

    const cloneTournamentFromDb = async () => {
      const result = await getTournament(tournamentId);
      tournamentInDb = result.data;
      if (!tournamentInDb) return;
      populateData();
    }

    cloneTournamentFromDb();
    
  },[])

  /**
   * Determine if Wheel Dialog should be enabled or not.
   * If there are at least 2 players without name and at least 2 players without team
   * then enable it.
   */
  useEffect(()=>{
    const playersWithEmptyName = players.filter(p => p.name.length === 0);
    const playersWithEmptyTeam = players.filter(p => p.team.length === 0);    
    const shouldDisble = (playersWithEmptyName.length <= 1 || playersWithEmptyTeam.length <= 1);

    setDisableWheelBtn(shouldDisble);
  }, [players])

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
    console.log("errors", errorsValidate);
    
    if (errorsValidate) {
      setOpenErrorDialog(true);
      return;
    }

    const matches = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i+1; j < players.length; j++){
        const match = {
          playerA: { ...players[i], goals: null },
          playerB: { ...players[j], goals: null }
        }

        const { data: newMatch } = await saveMatch(match);
        matches.push({_id: newMatch._id});
      }
    }

    const newTournament = {
      name,
      tournamentType,
      numberOfPlayers,
      players,
      matches,
      createdDate: new Date()
    }

    const { data } = await saveTournament(newTournament);
    newTournament._id = data._id;
    
    props.history.push(`/tournamentDashboard/${newTournament._id}`)
  }

  /**
   * Handle wheel dialog
   */
  const handleOpenWheelDialog = () => {
    setOpenWheelDialog(true);
  }

  /**
   * Update a player with value received from Wheel component
   */
  const handleWheelPick = (value, type) => {
    const playersCopy = [...players];
    
    for (let i = 0; i < playersCopy.length; i++) {
      if (!playersCopy[i][type]) {
        playersCopy[i][type] = value;

        // Remove validation error if there was any for that field
        const errorType = type === 'name' ? 'playerName' : 'playerTeam';
        delete errors[`${errorType}_${playersCopy[i].id}`];

        break;
      }
    }

    setPlayers(playersCopy);
  }

  return ( 
    <div className={classes.root}>
      <div>
        <div className={classes.form}>
          <div className={classes.formInputGroup}>
            <TextField id="outlined-basic"
              label="Name" 
              name="name"
              variant="outlined" 
              helperText="Please enter a name for the tournament"
              value={name}
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
          <div>
            <Button 
              disabled={disableWheelBtn} 
              color="primary"
              onClick={handleOpenWheelDialog}
              startIcon={<FlipCameraAndroidIcon />}
              >Use Wheel of names
            </Button>
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
                  value={player.name}
                  onChange={(event) => handlePlayerNameChange(event, player.id)}
                  onBlur={(event) => handleBlur({ event, id: player.id, label: "Player name" })} />
                <TextField
                  id={`team_${player.id}`}
                  name="playerTeam"
                  label="Team"
                  type="search"
                  variant="filled"
                  error={errors[`playerTeam_${player.id}`] !== undefined}
                  value={player.team}
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
      <WheelDialog
        open={openWheelDialog}
        onCloseDialog={() => setOpenWheelDialog(false)}
        initialPlayers={players}
        onWheelPick={handleWheelPick}
        />
    </div>
   );
}

CreateTournament.displayName = 'Create Tournament';
export default withNavBar(CreateTournament);
