import React, { Component } from "react";
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Grid, Paper } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';

const styles = {
  Icon: {
    marginLeft: "auto",
    width: "10%"
  },
  Paper: {
    margin: "auto",
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    width: "90%"
  }
};


class EditTodo extends Component {
  inputRef = React.createRef();
  render() {
    return (
      <Grid xs={12} item key={this.props.index}>
        <Paper elevation={2} style={styles.Paper}>
          <form
            onSubmit={() => {
              this.props.saveTodo(
                this.props.index,
                this.inputRef.current.value
              );
            }}
            style={{ display: "flex" }}
          >
            <TextField
            variant="outlined"
              style={{ width: "90%" }}
              defaultValue={this.props.todo}
              inputRef={this.inputRef}
            />
            <IconButton
              type="submit"
              color="primary"
              aria-label="Add"
              style={styles.Icon}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
          </form>
        </Paper>
      </Grid>
    );
  }
}

export default EditTodo;
