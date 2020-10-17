import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../../Context/appContext';
import FixturesTab from './FixturesTab';
import TableTab from './TableTab';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    margin: theme.spacing(3)
  },
}));

const TournamentDashboard = (props) => {
  const classes = useStyles(); 
  const appContext = useContext(AppContext);

  const [tabValue, setTabValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return ( 
    <>
      <Paper square>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Fixtures" />
          <Tab label="Table" />
        </Tabs>
      </Paper>
      <div className={classes.root}>
        {tabValue === 0 && <FixturesTab {...props}></FixturesTab>}
        {tabValue === 1 && <TableTab></TableTab>}
      </div>
    </>
   );
}
 
export default TournamentDashboard;