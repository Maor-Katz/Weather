import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

const useStyles = makeStyles({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
});

export default function Searchfield(props) {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        destination: '',
    });

    const handleChange = destination => event => {
        const {returnAutosuggest} = props;
        setValues({...values, [destination]: event.target.value});
        returnAutosuggest(values.destination)
    };
    return (
        <Paper className={classes.root}>
            <IconButton className={classes.iconButton} aria-label="menu">
                {/*<MenuIcon />*/}
            </IconButton>
            <InputBase
                onChange={handleChange('destination')}
                className={classes.input}
                placeholder="Type any destination"
                inputProps={{'aria-label': 'search google maps'}}
            />
            <IconButton className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </IconButton>
            <Divider className={classes.divider}/>
            {/*<IconButton color="primary" className={classes.iconButton} aria-label="directions">*/}
            {/*<DirectionsIcon />*/}
            {/*</IconButton>*/}
        </Paper>
    );
}
