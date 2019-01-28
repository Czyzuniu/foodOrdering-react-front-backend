import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing.unit / 2,
        maxWidth:220,
        maxHeight:150,
        overflow:'auto'
    },
    chip: {
        margin: theme.spacing.unit / 2,
    },
});

class Chips extends React.Component {
    state = {
        chipData: this.props.chipData
    };

    handleDelete = data => () => {
        this.setState(state => {
            const chipData = [...state.chipData];
            const chipToDelete = chipData.indexOf(data);
            chipData.splice(chipToDelete, 1);
            return { chipData };
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                {this.state.chipData.map(data => {
                    return (
                        <Chip
                            key={data.key}
                            label={data.label}
                            onDelete={this.handleDelete(data)}
                            className={classes.chip}
                        />
                    );
                })}
            </Paper>
        );
    }
}

Chips.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Chips);