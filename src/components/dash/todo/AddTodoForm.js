import React, { Component } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

class AddTodoForm extends Component {
    inputRef = React.createRef();
    errorRef = React.createRef();
    handleSubmit = (e) => {
        console.log(this.inputRef.current.value);
        e.preventDefault();
        if (this.inputRef.current.value === '') {
            this.errorRef.current.classList.add('active');
            return null;
        }
        this.errorRef.current.classList.remove('active');

        this.props.addToList(this.inputRef.current.value);
        e.currentTarget.reset();
    };
    render() {
        return (
            <form onSubmit={this.handleSubmit} style={{ display: 'flex' }}>
                <TextField
                    variant="outlined"
                    label="Add todo List"
                    inputProps={{
                        'aria-label': 'Description',
                    }}
                    onChange={this.handleChange}
                    inputRef={this.inputRef}
                    style={{ width: '90%' }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ width: '10%' }}
                    sx={{ ml: 2 }}
                >
                    Add
                </Button>
                <p ref={this.errorRef} className="error"></p>
            </form>
        );
    }
}

export { AddTodoForm };
