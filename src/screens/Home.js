import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AppContext from '../components/AppContext'
import Typography from "@material-ui/core/Typography/Typography";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import { Link } from 'react-router-dom'
import Utils from "../components/Utils";

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    height: 300
  },
  input: {
    margin: theme.spacing.unit,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%'
  },
  button: {
    margin: 'auto',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    marginTop: 10,
  },
  registerLink: {
    fontSize: 14,
    marginTop: 'auto'
  }
});

class Home extends Component {

  constructor(props) {
    super(props)
  }


  render() {
    const {classes} = this.props;

    const authenticatedUser = JSON.parse(localStorage.getItem('foodApp')).authenticatedUser

    return (
      <div id='content'>
        <Paper elevation={3} className={classes.root}>
          <Typography variant="title"  color="inherit" noWrap>
            Welcome {authenticatedUser.firstName}
          </Typography>
        </Paper>
      </div>
    );
  }
}


Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);

