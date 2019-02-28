import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Utils from "../components/Utils";


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  img: {
    width:500,
    height:300
  },
  column: {
    flexDirection:'column !important'
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
});
class AddPhotos extends Component {

  constructor(props) {
    super(props)

    this.state = {
      pictures: [],
      restaurantId:this.props.history.location.state.restaurantId

    }
  }


  componentDidMount() {
    Utils.getData('http://localhost:3001/restaurantImages?restaurantId=' + this.state.restaurantId).then((data) => {
      //check status later
      this.setState({
        pictures:data
      })
    })
  }


  render() {
    const {classes} = this.props;
    const {pictures} = this.state
    const handleOnDragStart = e => e.preventDefault()

    return (
      <div id='content' className={classes.column}>
        <div class="half-center">
          <Button
            variant="contained"
            component="label"
            style={{width:200, height:80}}
            color={'primary'}
          >
            Upload File
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                let selectedFile = e.target.files[0]
                let data = new FormData();
                console.log(selectedFile)
                data.append('uploadedFile', selectedFile);
                data.append('restaurantId', this.state.restaurantId);
                Utils.uploadImg(`${Utils.endPoint}/addPhoto`, data).then((res) => {
                  alert(res)
                }).catch((err) => {
                  console.log(err)
                })
              }}
            />
          </Button>
        </div>
        <div class="quarter-center">
          <AliceCarousel mouseDragEnabled buttonsDisabled={true} >
            {pictures.map((p) => {
              return  (
                <div>
                   <img src={'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'} onDragStart={handleOnDragStart} className={classes.img} />
                </div>
              )
            })}
          </AliceCarousel>
        </div>
      </div>
    );
  }
}


AddPhotos.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddPhotos);
