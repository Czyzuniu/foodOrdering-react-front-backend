import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from "../components/Utils";
import Paper from "@material-ui/core/Paper/Paper";
import classNames from 'classnames';
import AddIcon from '@material-ui/icons/AddCircle';
import AddMenuItemColumn from "../components/AddMenuItemColumn";
import Button from "@material-ui/core/Button/Button";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Typography from "@material-ui/core/Typography/Typography";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Card from "@material-ui/core/Card/Card";
import Notification from "../components/Notification";
import CustomizedNotification from "../components/CustomizedNotification";
import Chips from "../components/Chips";



const styles = theme => ({
    categories: {
        display: 'flex',
        flexDirection: 'column',
        width:'25%',
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        height:'100%'
    },
    root: {
        margin:15,
        marginTop: theme.spacing.unit * 3,
    },
    rootMain:{
      margin:15
    },
    table: {
        minWidth: 1020,
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

const foodTypes = [
    {
        value: '',
        label: 'All categories',
        icon:<RestaurantIcon />
    },
    {
        value: 'MT_STARTER',
        label: 'Starters',
        icon:<RestaurantIcon />
    },
    {
        value: 'MT_MAIN',
        label: 'Mains',
        icon:<RestaurantIcon />
    },
    {
        value: 'MT_DSRT',
        label: 'Desserts',
        icon:<BeachAccessIcon  />
    },
    {
        value: 'MT_SNK',
        label: 'Snacks',
        icon:<BeachAccessIcon  />
    },
    {
        value: 'MT_DRINK',
        label: 'Drinks',
        icon:<LocalDrinkIcon />
    },
];


let counter = 0;
function createData(name, desc, price, cat, dbId) {
    counter += 1;
    return { id: counter, PRODUCT_NAME:name, PRODUCT_DESCRIPTION:desc, PRODUCT_PRICE:price, PRODUCT_MENU_TYPE:cat, PRODUCT_ID:dbId};
}
function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Product Name' },
    { id: 'desc', numeric: false, disablePadding: false, label: 'Product Description' },
    { id: 'price', numeric: false, disablePadding: false, label: 'Product Price (£)' },
    { id: 'cat', numeric: false, disablePadding: false, label: 'Product Category' },
    { id: 'alg', numeric: false, disablePadding: false, label: 'Product Allergies' }
];

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {rows.map(
                        row => (
                            <TableCell
                                key={row.id}
                                align={row.numeric ? 'right' : 'left'}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        ),
                        this,
                    )}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

let EnhancedTableToolbar = props => {
    const { numSelected, classes,selectedCategory, onAddPress, onDelete} = props;

    console.log(selectedCategory)

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        {selectedCategory.label}
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                <div style={{display: 'flex'}}>
                <Tooltip title="Add row">
                    <IconButton aria-label="Add" onClick={onAddPress}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete" onClick={onDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    ''
                )}
                </div>
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    selectedCategory: PropTypes.object.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);


class ViewMenu extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data:[
            ],
            "restaurantId":this.props.history.location.state.restaurantId,
            order: 'asc',
            orderBy: 'Product Name',
            selected: [],
            page: 0,
            rowsPerPage: 5,
            selectedCategory:{
                value:'',
                label:''
            },
            status:{
              message:'Product Added',
              type:'success'
            }
        }

        this.notificationRef = React.createRef();





        this.showAllMenuItems()

    }

    showByCategory(type) {
        let records = []

        if (type.value != '') {
            Utils.getData(`${Utils.endPoint}/getFoodByCategory?restaurantId=${this.state.restaurantId}&foodCategory=${type.value}`).then((res) => {
                res.menuItems.map((item) => {
                    records.push(createData(item.PRODUCT_NAME, item.PRODUCT_DESCRIPTION, item.PRODUCT_PRICE, item.PRODUCT_MENU_TYPE,item.PRODUCT_ID,false))
                })
                this.setState({
                    data:records,
                    selectedCategory:type,
                    selected:[]
                })

                console.log(this.state)
            })
        } else {
            this.showAllMenuItems()
        }
    }

    showAllMenuItems() {
        let selectedCategory = {
            value:'',
            label:'All categories'
        }
        let records = []
        Utils.getData(`${Utils.endPoint}/getAllMenuItems?restaurantId=${this.state.restaurantId}`).then((res) => {
            res.menuItems.map((item) => {
                records.push(createData(item.PRODUCT_NAME, item.PRODUCT_DESCRIPTION, item.PRODUCT_PRICE, item.PRODUCT_MENU_TYPE, item.PRODUCT_ID,false))
            })
            this.setState({
                data:records,
                selectedCategory:selectedCategory,
                selected:[]
            })
        })
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: state.data.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    };


    handleEdit = (e, id, col) => {
        const { data } = this.state;
        let newRecord

        for (let i of data) {
            if (i.id == id) {
                newRecord = i
            }
        }
        newRecord[col] = e.target.value
        this.setState({data:data})

    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    addRow = () => {

        let selectedCategory = this.state.selectedCategory.value ? this.state.selectedCategory.value : "MT_STARTER"


        let newRow = createData('','','',selectedCategory,null)
        let newData = this.state.data
        let lastPage = parseInt(this.state.data.length / this.state.rowsPerPage)

        let data = {
          menuItem:newRow,
          restaurantId:this.props.history.location.state.restaurantId
        }


        Utils.postData(`${Utils.endPoint}/addProduct`,data).then((res) => {
          if (res.status === 'success') {

            newRow.PRODUCT_ID = res.PRODUCT_ID

            newData.push(newRow)
            this.setState({
              status:{type:'success', message:'Product Added'},
              data:newData
            })

            this.notificationRef.current.open()

          }
        })


    }

    onDelete = () => {
        let selected = this.state.selected
        console.log(selected)
        console.log(this.state.data)
        let toDelete = []

        for (let i of selected) {
            for (let j of this.state.data) {
                if (i == j.id) {
                    toDelete.push(j.PRODUCT_ID)
                }
            }
        }

        Utils.postData(`${Utils.endPoint}/deleteMenuItems`,toDelete).then((res) => {
            if (res.status === 'success') {
                this.setState({status:{type:'success', message:'deleted!'}})
                this.notificationRef.current.open()
                if (!this.state.selectedCategory.value) {
                    this.showAllMenuItems()
                } else {
                    this.showByCategory(this.state.selectedCategory)
                }
            }
        })
    }

    saveMenu = () => {
        let data = {
            menuItems:this.state.data,
            restaurantId:this.props.history.location.state.restaurantId
        }

        Utils.postData(`${Utils.endPoint}/saveMenu`,data).then((res) => {
            if (res.status === 'success') {
                this.setState({status:{type:'success', message:'Menu saved!'}})
                this.notificationRef.current.open()
            }
        })
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {classes} = this.props;

        const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <div id='content' className={classes.row}>
                <div className={classes.categories}>
                <Typography variant="subheading" component="h2" style={{color:'white'}}>
                    Show by category
                </Typography>
                <Paper elevation={3} className={classes.root} style={{margin:15}}>
                    <List>
                        {foodTypes.map((type) => {
                            return (
                                <div>
                                    <ListItem button
                                        onClick={() => {this.showByCategory(type)}}
                                    >
                                        <Avatar>
                                            {type.icon}
                                        </Avatar>
                                        <ListItemText primary={type.label}  />
                                    </ListItem>
                                </div>
                            )
                        })}
                    </List>
                </Paper>

                    <Button variant="contained" color="primary" size={'large'} className={classes.button} onClick={this.saveMenu}>
                        Save changes
                    </Button>

                </div>
                <Paper className={classes.rootMain}>
                    <EnhancedTableToolbar numSelected={selected.length} selectedCategory={this.state.selectedCategory} onAddPress={this.addRow} onDelete={this.onDelete} />
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle" >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={data.length}
                            />
                            <TableBody>
                                {stableSort(data, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(n => {
                                        const isSelected = this.isSelected(n.id);
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isSelected}
                                                tabIndex={-1}
                                                key={n.id}
                                                selected={isSelected}
                                            >
                                                <TableCell padding="checkbox"  onClick={event => this.handleClick(event, n.id)}>
                                                    <Checkbox checked={isSelected} />
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <TextField
                                                        required
                                                        value={n.PRODUCT_NAME}
                                                        id={n.id}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            this.handleEdit(e,n.id,'PRODUCT_NAME')
                                                        }}
                                                        onBlur={this.saveMenu}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="left">
                                                    <TextField
                                                        required
                                                        value={n.PRODUCT_DESCRIPTION}
                                                        id={n.id}
                                                        className={classes.textField}
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            this.handleEdit(e,n.id,'PRODUCT_DESCRIPTION')
                                                        }}
                                                        variant="outlined"
                                                        onBlur={this.saveMenu}
                                                    />
                                                </TableCell>
                                                <TableCell align="left">
                                                    <TextField
                                                        required
                                                        value={n.PRODUCT_PRICE}
                                                        id={n.id}
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            this.handleEdit(e,n.id,'PRODUCT_PRICE')
                                                        }}
                                                        variant="outlined"
                                                        onBlur={this.saveMenu}

                                                    />
                                                </TableCell>
                                                <TableCell align="left">
                                                    <TextField
                                                        required
                                                        select
                                                        value={n.PRODUCT_MENU_TYPE}
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            this.handleEdit(e,n.id,'PRODUCT_MENU_TYPE')
                                                        }}
                                                        variant="outlined"
                                                        onBlur={this.saveMenu}
                                                    >
                                                        {foodTypes.map((option) => {
                                                            if (option.value != '') {
                                                                return (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                )
                                                            }
                                                        })}
                                                    </TextField>
                                                </TableCell>
                                                {/*<TableCell align="left">*/}
                                                    {/*<Chips chipData={[*/}
                                                        {/*{ key: 0, label: 'Angular' },*/}
                                                        {/*{ key: 1, label: 'jQuery' },*/}
                                                        {/*{ key: 2, label: 'Polymer' },*/}
                                                        {/*{ key: 3, label: 'React' }*/}
                                                    {/*]}></Chips>*/}
                                                {/*</TableCell>*/}
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 49 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                {/*<div className={classes.filler}></div>*/}
                <CustomizedNotification innerRef={this.notificationRef} variant={this.state.status.type} message={this.state.status.message}/>
            </div>
        );
    }
}

ViewMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewMenu);