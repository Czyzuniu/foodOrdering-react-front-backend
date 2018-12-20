import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from "../components/Utils";

export default class Restaurants extends Component {

  constructor(props) {
    super(props)

    Utils.getData('http://localhost:3001/restaurants').then((data) => {
      console.log(data)
    })
  }

  render() {

    return (
      <div id='content'>hello restaurants</div>
    );
  }
}


Restaurants.propTypes = {
  classes: PropTypes.object.isRequired,
};

// export default withStyles(styles)();