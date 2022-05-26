import { useState } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { Box, Button, Card, InputBase } from '@mui/material';

export const LogAdd = (props) => {
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
                    placeholder="Type here..."
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

LogAdd.defaultProps = {
    submitDisabled: false,
};

LogAdd.propTypes = {
    onSend: PropTypes.func,
    submitDisabled: PropTypes.bool,
};
