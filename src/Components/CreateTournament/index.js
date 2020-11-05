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
import { createPlayoffMatches } from '../../Utils/matchGenerator';

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
      team: Joi.string().min(2).max(20).required(),
      group: Joi.number().min(1)
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
  playersTeamsContainer: {
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

const TournamentTypes = [
  {
    value: 'league',
    label: 'League'
  },
  {
    value: 'groupPlayoff',
    label: 'Group and Playoffs'
  },
];

const PlayoffTypes = [
  {
    value: 'round16',
    label: 'Round of 16',
    teamsRequired: 16,
  },
  {
    value: 'round8',
    label: 'Quater-finals',
    teamsRequired: 8,
  },
  {
    value: 'round4',
    label: 'Semi-finals',
    teamsRequired: 4,
  },
  {
    value: 'round2',
    label: 'Final',
    teamsRequired: 2,
  },
];

const PlayersData = [
  {
    id: Math.random().toString(36).substr(7),
    name: '',
    team: '',
    group: 1
  },
  {
    id: Math.random().toString(36).substr(7),
    name: '',
    team: '',
    group: 1
  }
];

const CreateTournament = (props) => {
  const classes = useStyles();
  const appContext = useContext(AppContext);

  const [name, setName] = useState('');
  const [tournamentType, setTournamentType] = useState('groupPlayoff');
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [numberOfGroups, setNumberOfGroups] = useState(1);
  const [numberOfPlayersPerGroup, setNumberOfPlayersPerGroup] = useState(2);
  const [teamsAdvancingPerGroup, setTeamsAdvancingPerGroup] = useState(1);
  const [playoffType, setPlayoffType] = useState('round16');
  const [players, setPlayers] = useState(PlayersData);
  const [disableWheelBtn, setDisableWheelBtn] = useState(false);
  const [errors, setErrors] = useState({});
  const [dialogError, setDialogError] = useState({});
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
      setPlayers(tournamentInDb.players.map(p => ({id: p.id, name: p.name, team: p.team, group: p.group})));
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
    let group = 1;

    if (newNumber < 2) return setNumberOfPlayers(2)
    if (newNumber > 20) return setNumberOfPlayers(20)
    
    // Increased: Add new player's box
    if (newNumber > numberOfPlayers) {
      const newPlayer = {
        id: Math.random().toString(36).substr(7),
        name: '',
        team: '',
        group
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
   * Handle Number of groups changed
   */
  const handleNumberOfGroupsChange = (event) => {
    const newNumber = event.target.value;
    
    // Limit the number of groups between 1 and 8
    if (newNumber < 1) return setNumberOfGroups(1);
    if (newNumber > 8) return setNumberOfGroups(8);
    
    // Increased: Add numberOfPlayersPerGroup needed for a new group
    if (newNumber > numberOfGroups) {
      let newPlayers = [];
      for (let i = 0; i < numberOfPlayersPerGroup; i++) {
        const newPlayer = {
          id: Math.random().toString(36).substr(7),
          name: '',
          team: '',
          group: Number(newNumber)
        }
        
        newPlayers.push(newPlayer);
      }

      setPlayers([...players, ...newPlayers]);
    }

    // Decresead: Remove the players from the last group
    if (newNumber < numberOfGroups) {
      const newPlayers = players.filter(p => (p.group !== Number(numberOfGroups)));    
      setPlayers(newPlayers);
    }

    setNumberOfGroups(newNumber);
  }

  /**
   * Handle Number of players per group changed
   */
  const handleNumberOfPlayersPerGroupChange = (event) => {
    const newNumber = event.target.value;

    // Limite # of players for group between 2 and 10
    if (newNumber < 2) return setNumberOfPlayers(2)
    if (newNumber > 10) return setNumberOfPlayers(20)
    
    // Increased: Add new player's box for each group
    if (newNumber > numberOfPlayers) {
      let newPlayers = [];

      for (let i = 1; i <= numberOfGroups; i++) {
        const newPlayer = {
          id: Math.random().toString(36).substr(7),
          name: '',
          team: '',
          group: i
        }
        
        newPlayers.push(newPlayer);
      }

      setPlayers([...players, ...newPlayers]);
    }

    // Decresead: Remove last player's box
    if (newNumber < numberOfPlayersPerGroup) {
      let newPlayers = [];
      for (let i = 1; i <= numberOfGroups; i++) {
        const playersInGroup = players.filter(p => p.group === i);
        const newPlayersInGroup = playersInGroup.slice(0, -1);
        newPlayers.push(...newPlayersInGroup);
      }

      console.log('newPlayers', newPlayers);
      
      setPlayers(newPlayers);
    }

    setNumberOfPlayersPerGroup(newNumber);
  }

  /**
   * Handle teams advancing per group changed
   */
  const handleTeamsAdvancingPerGroupChange = (event) => {
    const newNumber = event.target.value;

    if (newNumber < 1) return setTeamsAdvancingPerGroup(1)
    if (newNumber > 4) return setTeamsAdvancingPerGroup(4)
    
    setTeamsAdvancingPerGroup(newNumber);
  }

  /**
   * Handle Playoff Type changed
   */
  const handlePlayoffTypeChange = (event) => {
    setPlayoffType(event.target.value);
  };

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
   * Validate fields are populated before submitting request.
   */
  const validateBeforeSubmit = () => {
    const errorsValidate = validate();
    console.log("errors", errorsValidate);
    
    if (errorsValidate) {
      setDialogError({title: 'Incomplete information', msg: 'Please enter all the required information first.'})
      setOpenErrorDialog(true);
      return false;
    }

    return true;
  }

  /**
   * For Group and playoff type, verify number of teams advancing match required number of teams
   * required for first round of playoffs.
   */
  const validateTeamsForPlayoff = () => {
    const teamsAdvancing = numberOfGroups * teamsAdvancingPerGroup;
    let requiredNumber = 0;

    switch (playoffType) {
      case 'round16':
        requiredNumber = 16;
        break;
      case 'round8':
        requiredNumber = 8;
        break;
      case 'round4':
        requiredNumber = 4;
        break;
      case 'round2':
        requiredNumber = 2;
        break;
      default:
        break;
    }

    if (requiredNumber !== teamsAdvancing) {
      setDialogError({title: 'Wrong information', msg: 'Incorrect number of teams for selected Playoff type. Please edit the number of teams to match required for selected Playoff round.'})
      setOpenErrorDialog(true);
      return false;
    }

    return true;
  }

  /**
   * Create Array of matches por players param. It saves it in db as it creates it.
   * @param {Array} players 
   * @param {Number} group 
   */
  const createGroupMatches = async (players, group) => {
    const matches = [];

    for (let i = 0; i < players.length; i++) {
      for (let j = i+1; j < players.length; j++){
        const match = {
          group: Number(group) || 1,
          playerA: { id: players[i].id, name: players[i].name, team: players[i].team, goals: null },
          playerB: { id: players[j].id, name: players[j].name, team: players[j].team, goals: null }
        }

        const { data: newMatch } = await saveMatch(match);
        matches.push({_id: newMatch._id});
      }
    }

    return matches;
  }

  const autoGeneratePlayers = (players) => {
    const playersCopy = [...players];
    let playerCount = 1;
    for(let i=0; i<playersCopy.length; i++) {
      playersCopy[i].name = `P${String.fromCharCode(64 + playersCopy[i].group)}${playerCount}`
      playersCopy[i].team = `T${String.fromCharCode(64 + playersCopy[i].group)}${playerCount}`
      playerCount++;
      if (playerCount > numberOfPlayersPerGroup) playerCount = 1;
    }

    setPlayers(playersCopy);
  }

  /**
   * Handle submit (Create tournament clicked)
   */
  const handleSubmit = async () => {
    
    let newTournament = {};

    if (tournamentType === 'league') {
      if (!validateBeforeSubmit()) return;

      const matches = await createGroupMatches(players, 1);

      newTournament = {
        name,
        tournamentType,
        numberOfPlayers,
        players,
        matches,
        createdDate: new Date()
      }
    } else if (tournamentType === 'groupPlayoff') {  
      if (!validateTeamsForPlayoff()) return;
      if (!validateBeforeSubmit()) return;

      let matches = [];

      for (let groupIndex = 1; groupIndex <= numberOfGroups; groupIndex++) {
        const playersInGroup = players.filter(p => p.group === Number(groupIndex));

        const newMatches = await createGroupMatches(playersInGroup, groupIndex);
        matches.push(...newMatches);
      }

      const initialRound = PlayoffTypes.find(t => t.value===playoffType);
      const playOffMatches = await createPlayoffMatches(initialRound, numberOfGroups, teamsAdvancingPerGroup);

      matches.push(...playOffMatches);

      newTournament = {
        name,
        tournamentType,
        numberOfGroups,
        numberOfPlayersPerGroup,
        teamsAdvancingPerGroup,
        playoffType,
        players,
        matches,
        createdDate: new Date()
      }
    }

    const { data } = await saveTournament(newTournament);
    newTournament._id = data._id;
    
    props.history.push(`/tournamentDashboard/${newTournament._id}`)
  }

  /**
   * Handle wheel dialog open
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

  /**
   * Get players per corresponding group. If league type, just return the players.
   * This is just for rendering pourpose.
   */
  const getGroupedPlayers = (players, numberOfGroups) => {
    if (tournamentType === 'league') return [{players}];

    const result = [];
    for (let i = 1; i <= numberOfGroups; i++) {
      const playersInGroup = players.filter(p => p.group === i);
      // ASCII code of A is 65. Convert i to corresponding group letter
      result.push({group: `Group ${String.fromCharCode(64 + i)}`, players: playersInGroup});
    }

    return result;
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
              <MenuItem key={option.value}
                value={option.value}
                onClick={()=>setTournamentType(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
            </TextField>
            {tournamentType === 'league' &&
              <TextField id="outlined-basic"
              label="Number of groups" 
              variant="outlined"
              type="number"
              value={numberOfPlayers}
              onChange={handleNumberOfPlayersChange}/>
            }
            {tournamentType === 'groupPlayoff' && (
              <>
              <TextField id="outlined-basic"
                label="Number of groups" 
                variant="outlined"
                type="number"
                value={numberOfGroups}
                onChange={handleNumberOfGroupsChange}/>
              <TextField id="outlined-basic"
                label="Number of players per group" 
                variant="outlined"
                type="number"
                value={numberOfPlayersPerGroup}
                onChange={handleNumberOfPlayersPerGroupChange}/>
              <TextField id="outlined-basic"
                label="Teams advancing per group" 
                variant="outlined"
                type="number"
                value={teamsAdvancingPerGroup}
                onChange={handleTeamsAdvancingPerGroupChange}/>
              <TextField
                id="outlined-select-currency"
                select
                label="Playoff type"
                value={playoffType}
                onChange={handlePlayoffTypeChange}
                variant="outlined"
              >
              {PlayoffTypes.map((option) => (
                <MenuItem key={option.value}
                  value={option.value}
                  onClick={()=>setPlayoffType(option.value)}
                >
                  {option.label}
                </MenuItem>
              ))}
              </TextField>
              </>
            )}
          </div>
          <div>
            <Button 
              disabled={disableWheelBtn} 
              color="primary"
              onClick={handleOpenWheelDialog}
              startIcon={<FlipCameraAndroidIcon />}
              >Use Wheel of names
            </Button>
            <Button 
              disabled={disableWheelBtn} 
              color="primary"
              onClick={()=>autoGeneratePlayers(players)}
              startIcon={<FlipCameraAndroidIcon />}
              >Autogenerate
            </Button>
          </div>
          <div className={classes.playersTeamsContainer}>
            {getGroupedPlayers(players, numberOfGroups).map(obj => (
              <>
              {obj.group && (
                <div className={classes.groupContainer}>
                  <h1>{obj.group}</h1>
                </div>
              )}
              <div className={classes.playersTeamsForm}>
                {obj.players.map((player)=>(
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
              </>
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
        error={dialogError}
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
