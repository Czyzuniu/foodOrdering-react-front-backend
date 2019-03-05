import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Utils from "../components/Utils";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableHead from "@material-ui/core/TableHead/TableHead";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import CustomizedNotification from "../components/CustomizedNotification";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
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
  rootMain:{
    margin:15
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  button: {
    margin: 'auto',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 25,
    marginBottom:0
  },
  row: {
    flexDirection:'row'
  }
});
let counter = 0
function createData(imgPath) {
  counter += 1;
  return { id: counter,imgPath};
}

const CustomTableCell = withStyles(theme => ({
  head: {
    textAlign:'center',
    fontSize: 18,
    fontWeight:'bold'
  },
}))(TableCell);


const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

class AddPhotos extends Component {

  constructor(props) {
    super(props)

    this.state = {
      restaurantId:this.props.history.location.state.restaurantId,
      rows: [],
      page: 0,
      rowsPerPage: 3,
    }

    this.notificationRef = React.createRef();

  }

  componentDidMount() {
    this.getImages()
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };


  getImages(goLastPage) {
    Utils.getData('http://localhost:3001/restaurantImages?restaurantId=' + this.state.restaurantId).then((data) => {
      let rows = []

      data.map((r) => {
        rows.push(createData(r.imgPath))
      })

      if (goLastPage) {
        let lastPage = parseInt(this.state.rows.length / this.state.rowsPerPage)
        this.setState({
          rows:rows,
          page:lastPage
        })
      }

      this.setState({
        rows:rows
      })
    })
  }

  render() {
    const {classes} = this.props;
    const {pictures} = this.state
    const {rowsPerPage, page, rows } = this.state;

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
                data.append('uploadedFile', selectedFile);
                data.append('restaurantId', this.state.restaurantId);
                Utils.uploadImg(`${Utils.endPoint}/addPhoto`, data).then((res) => {
                  if (res.status == 'success') {
                    this.notificationRef.current.open()
                    this.getImages(true)
                  }
                }).catch((err) => {
                  console.log(err)
                })
              }}
            />
          </Button>
        </div>
        <div class="quarter-center">
          <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <CustomTableCell>ID</CustomTableCell>
                    <CustomTableCell align="right">Image</CustomTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                    <TableRow key={row.id}>
                      <TableCell align="center">
                        {row.id}
                      </TableCell>
                      <TableCell align="center">
                        <div>
                          <img class='galleryImage' src={'http://' + row.imgPath} width={100} height={100} style={{border:'3px solid black'}}
                               onClick={() => {
                                 window.location = 'http://' + row.imgPath
                                }
                               }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[3]}
                      colSpan={3}
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        native: true,
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActionsWrapped}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </Paper>
        </div>
        <CustomizedNotification innerRef={this.notificationRef} variant={'success'} message={'Image uploaded!'}/>
      </div>
    );
  }
}


AddPhotos.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddPhotos);




