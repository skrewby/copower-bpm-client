import React, { Component, Fragment } from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BuildIcon from '@mui/icons-material/Build';
import { Grid, Paper } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { CSSTransition } from "react-transition-group";
import Checkbox from '@mui/material/Checkbox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const styles = {
  Icon: {
    marginLeft: "auto"
  },
  Paper: {
    margin: "auto",
    padding: 10,
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    width: "92%"
  }
};

class Todo extends Component {
  state = {
    fade: false
  };

  gridRef = React.createRef();

  deleteTodo = () => {
    const fade = true;
    this.setState({ fade });

    var promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(true);
      }, 500);
    });

    promise.then(() => this.props.deleteTodo(this.props.index));
    console.log(this.state);
  };

  render() {
    const gridClass = this.state.fade ? "fade-out" : "";

    return (
      <Grid
        xs={12}
        className={`${gridClass}`}
        item
        key={this.props.index}
        ref={this.gridRef}
      >
        <Paper elevation={1} style={styles.Paper}>
          <Checkbox icon={<FavoriteBorderIcon />} checkedIcon={<FavoriteIcon />} />
          <span style={styles.Todo}>{this.props.todo}</span>
          <IconButton
            color="primary"
            aria-label="Edit"
            style={styles.Icon}
            onClick={() => this.props.updateTodo(this.props.index)}
          >
            <BuildIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="Delete"
            onClick={this.deleteTodo}
          >
            <DeleteForeverIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Grid>
    );
  }
}

export default Todo;
