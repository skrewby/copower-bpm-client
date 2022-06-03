import { Box, Container, Link, Typography } from '@mui/material';

const links = [
    {
        label: 'About Us',
        href: 'https://www.spacesolar.com.au/',
    },
    {
        label: 'Terms',
        href: 'https://www.spacesolar.com.au/',
    },
    {
        label: 'Support',
        href: 'https://www.google.com/',
    },
];

/**
 * Information about the company
 */
export const Footer = () => (
    <div>
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                flexDirection: {
                    sm: 'row',
                    xs: 'column',
                },
                py: 5,
                '& a': {
                    mt: {
                        sm: 0,
                        xs: 1,
                    },
                    '&:not(:last-child)': {
                        mr: {
                            sm: 5,
                            xs: 0,
                        },
                    },
                },
            }}
        >
            <Typography color="textSecondary" variant="caption">
                © 2022 Copower
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {links.map((link) => (
                <Link
                    color="textSecondary"
                    href={link.href}
                    key={link.label}
                    target="_blank"
                    underline="none"
                    variant="body2"
                >
                    {link.label}
                </Link>
            ))}
        </Container>
    </div>
);
