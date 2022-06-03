import PropTypes from 'prop-types';
import { Box, ListItem, ListItemText, Typography } from '@mui/material';

export const InfoCardListItem = (props) => {
    const { align, children, component, value, label, ...other } = props;

    return (
        <ListItem
            component={component}
            disableGutters
            sx={{
                px: 3,
                py: 1.5,
            }}
            {...other}
        >
            <ListItemText
                disableTypography
                primary={
                    <Typography
                        color="textPrimary"
                        sx={{
                            minWidth: align === 'vertical' ? 'inherit' : 180,
                        }}
                        variant="subtitle2"
                    >
                        {label}
                    </Typography>
                }
                secondary={
                    <Box
                        sx={{
                            flex: 1,
                            mt: align === 'vertical' ? 0.5 : 0,
                        }}
                    >
                        {children || (
                            <Typography color="textSecondary" variant="body2">
                                {value ?? 'No Info'}
                            </Typography>
                        )}
                    </Box>
                }
                sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    flexDirection: align === 'vertical' ? 'column' : 'row',
                    my: 0,
                }}
            />
        </ListItem>
    );
};

InfoCardListItem.defaultProps = {
    align: 'vertical',
};

InfoCardListItem.propTypes = {
    align: PropTypes.string,
    component: PropTypes.elementType,
    children: PropTypes.node,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
