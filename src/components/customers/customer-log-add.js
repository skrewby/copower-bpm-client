import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card, InputBase } from '@mui/material';

export const CustomerLogAdd = (props) => {
    const { onSend, submitDisabled, ...other } = props;
    const [content, setContent] = useState('');

    const handleChange = (event) => {
        setContent(event.target.value);
    };

    const handleSend = () => {
        onSend?.(content);
        setContent('');
    };

    return (
        <Card variant="outlined" {...other}>
            <Box
                sx={{
                    p: 2,
                    alignItems: 'center',
                    display: 'flex',
                }}
            >
                <InputBase
                    multiline
                    onChange={handleChange}
                    placeholder="Add note..."
                    sx={{
                        flex: 1,
                        mr: 2,
                    }}
                    value={content}
                />
                <Button
                    color="primary"
                    disabled={content.length === 0 || submitDisabled}
                    onClick={handleSend}
                    variant="contained"
                >
                    Send
                </Button>
            </Box>
        </Card>
    );
};

CustomerLogAdd.defaultProps = {
    submitDisabled: false,
};

CustomerLogAdd.propTypes = {
    onSend: PropTypes.func,
    submitDisabled: PropTypes.bool,
};
