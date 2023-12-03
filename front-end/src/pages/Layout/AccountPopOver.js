import {useContext} from 'react';

import PropTypes from 'prop-types';
import {Box, Divider, MenuItem, MenuList, Popover, Typography} from '@mui/material';
import UserContext from "../../hooks/UserProvider";
import {useNavigate} from 'react-router-dom';


export const AccountPopOver = (props) => {
    const {anchorEl, onClose, open} = props;
    const {logout, user} = useContext(UserContext);
    const navigate = useNavigate();


    const handleSignOut = () => {
        logout();
        window.location.href = '/'
    };

    const handleSignIn = () => {
        window.location.href = '/login'
    }

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
            }}
            onClose={onClose}
            open={open}
            PaperProps={{sx: {
                width: user ? 250 : 150}}}
        >
            <Box
                sx={{
                    py: 1.5,
                    px: 2
                }}
            >
                <Typography variant="overline">
                    Account
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="body2"
                    textAlign="center"
                >
                    {user ? user.email : ''}
                </Typography>
            </Box>
            <Divider/>
            <MenuList
                disablePadding
                dense
                sx={{
                    p: '8px',
                    '& > *': {
                        borderRadius: 1
                    }
                }}
            >
                {user ?
                    (
                        <MenuItem onClick={handleSignOut}>
                            Sign out
                        </MenuItem>

                    ):(
                    <MenuItem onClick={handleSignIn}>
                Sign in
            </MenuItem>
            )}
        </MenuList>
</Popover>
)

};

AccountPopOver.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired
};
