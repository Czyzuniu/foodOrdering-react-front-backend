import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    height: 300
  }
});

class ViewPhoto extends Component {

  constructor(props) {
    super(props)

  }

  render() {
    const {classes} = this.props;

    return (
      <div id='content'>
        <img src={'http://' + this.props.history.location.state.imgPath} />
      </div>
    );
  }
}

ViewPhoto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewPhoto);
