import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from "../components/Utils";
import Paper from "@material-ui/core/Paper/Paper";
import AddIcon from '@material-ui/icons/AddCircle';
import AddMenuItemColumn from "../components/AddMenuItemColumn";
import Button from "@material-ui/core/Button/Button";

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    margin: 'auto',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 25,
    marginBottom:0
  },
  column: {
    flexDirection:'column'
  }

});

class AddMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      rows:[]
    }
    this.refsCounter = 0
    this.inputRefs = {}
  }

  addMenuRow = () => {
    let ref = React.createRef();
    let row = React.createElement(AddMenuItemColumn, {innerRef:ref})
    let rows = this.state.rows
    rows.push(row)
    this.setState({rows:rows})
    this.inputRefs[this.refsCounter++] = ref
  }

  addToMenu = () => {
    let data = {
      "menuItems":[],
      "restaurantId":this.props.history.location.state.restaurantId
    }
    let i = 0
    this.state.rows.map((row,index) => {
      let inputRef = this.inputRefs[index]

      if (inputRef) {
        data.menuItems.push(inputRef.current.state)
      }
    })

    if (data.menuItems.length) {
      Utils.postData(`${Utils.endPoint}/addToMenu`, data).then((res) => {

      }).catch((err) => {
        alert(err)
      })
    }
  }

  render() {

    const {classes} = this.props;

    return (
      <div id='content' className={classes.column}>
        <Paper elevation={3} className={classes.root}>
          <AddIcon onClick={this.addMenuRow}/>
          {
            this.state.rows.map((row,index) => {
              return row
            })
          }
        </Paper>
        <Button variant="contained" color={"primary"} className={classes.button} onClick={this.addToMenu}>
          Add food items to menu
        </Button>
      </div>
    );
  }
}


AddMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddMenu);