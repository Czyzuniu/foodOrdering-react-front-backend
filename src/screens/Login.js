import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography/Typography";
import {Link} from 'react-router-dom'
import Utils from "../components/Utils";
import CustomizedNotification from "../components/CustomizedNotification";

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
  },
  loggedInfo: {
    fontSize: 14,
    marginTop: 'auto',
    marginBottom:'auto'

  }
});

class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      emailAddress: '',
      password: '',
      isAuthenticated:false
    }

    this.notificationRef = React.createRef();
  }

  componentWillMount() {
    Utils.isAuthenticated().then((isAuthenticated) => {
      this.setState({
        isAuthenticated:isAuthenticated
      })
    })
  }

  login = () => {
    Utils.postData('http://localhost:3001/login', this.state).then((data) => {
      if (data.status == 'success') {
        localStorage.setItem('foodApp', JSON.stringify({
          'authenticatedUser': data.authenticatedUser
        })
        )
        document.cookie = 'authentication=' + JSON.stringify({sessionId: data.sessionId, userId: data.authenticatedUser.id})
        Utils.navigate('/')
      } else {
        this.notificationRef.current.open()
      }
    })
  }

  render() {
    const {classes} = this.props;

    const renderLoginPage = (
      <Paper elevation={3} className={classes.root}>
        <TextField
          id="email-addr-input"
          label="Email Address"
          className={classes.input}
          value={this.state.emailAddress}
          onChange={(e) => {
            this.setState({
              'emailAddress': e.target.value
            })
          }}
          margin="normal"
        />

        <TextField
          id="pass-input"
          label="Password"
          className={classes.input}
          value={this.state.password}
          type='password'
          margin="normal"
          onChange={(e) => {
            this.setState({
              'password': e.target.value
            })
          }}
        />

        <Typography variant="subtitle1" className={classes.registerLink} color="inherit" noWrap>
          Do not have an account? Create one <Link to="/register">here</Link>
        </Typography>
        <Button variant="contained" color={"primary"} className={classes.button} onClick={this.login}>
          Login
        </Button>
      </Paper>
    )

    return (
      <div id='content'>
        {this.state.isAuthenticated ?
          <Paper elevation={3} className={classes.root}>
            <Typography variant="subtitle1" className={classes.loggedInfo} color="inherit" noWrap>
              You are already logged in, log out first to login again
            </Typography>
          </Paper>
          :
          renderLoginPage
        }
        <CustomizedNotification innerRef={this.notificationRef} variant={'error'} message={'Incorrect password or email'}/>
      </div>
    );
  }
}


Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);