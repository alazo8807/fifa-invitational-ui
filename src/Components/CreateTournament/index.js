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

}));

const CreateTournament = () => {
  const classes = useStyles();

  const [tournamentType, setTournamentType] = React.useState('league');

  const handleChange = (event) => {
    setTournamentType(event.target.value);
  };

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
        </div>
      </div>
    </div>
   );
}
 
export default CreateTournament;
