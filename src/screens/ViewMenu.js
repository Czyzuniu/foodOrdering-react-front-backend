import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from "../components/Utils";
import Paper from "@material-ui/core/Paper/Paper";
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

const styles = theme => ({
    categories: {
        display: 'flex',
        flexDirection: 'column',
        width:'25%',
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        height:'100%'
    },
    root: {
        width: '35%',
    },
    menuContainer: {
        flexDirection: 'column',
        flex:2,
        height:'75%',
        overflow:'auto'
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
    },
    filler: {
        display:'flex',
        flex:1
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

class ViewMenu extends Component {

    constructor(props) {
        super(props)

        this.state = {
            menuItems:[],
            "restaurantId":this.props.history.location.state.restaurantId
        }


        this.showAllMenuItems()

    }

    showByCategory(type) {

        this.setState({
            menuItems:[]
        })

        if (type.value != '') {
            Utils.getData(`${Utils.endPoint}/getFoodByCategory?restaurantId=${this.state.restaurantId}&foodCategory=${type.value}`).then((res) => {
                this.setState({
                    menuItems:res.menuItems
                })
            })
        } else {
            this.showAllMenuItems()
        }
    }

    showAllMenuItems() {
        Utils.getData(`${Utils.endPoint}/getAllMenuItems?restaurantId=${this.state.restaurantId}`).then((res) => {
            this.setState({
                menuItems:res.menuItems
            })
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div id='content' className={classes.row}>
                <div className={classes.categories}>
                <Typography variant="subheading" component="h2" style={{color:'white'}}>
                    Show by category
                </Typography>
                <Paper elevation={3} className={classes.root}>
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
                                    <Divider/>
                                </div>
                            )
                        })}
                    </List>
                </Paper>
                </div>
                <Paper className={classes.menuContainer}>
                    {this.state.menuItems.map((item) => {
                        return (
                            <div style={{margin: 15}}>
                                <AddMenuItemColumn menuItem={item}/>
                                <Divider/>
                            </div>
                        )
                    })}
                </Paper>
                <div className={classes.filler}></div>
            </div>
        );
    }
}

ViewMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewMenu);