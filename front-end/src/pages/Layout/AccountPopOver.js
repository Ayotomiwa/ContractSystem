import {useCallback, useContext} from 'react';

import PropTypes from 'prop-types';
import {Box, Divider, Link, MenuItem, MenuList, Popover, Typography} from '@mui/material';
import UserContext from "../../hooks/UserProvider";
import { useNavigate } from 'react-router-dom';


export const AccountPopOver = (props) => {
  const { anchorEl, onClose, open } = props;
  const {logout, user} = useContext(UserContext);
    const navigate = useNavigate();


  const handleSignOut = () => {
        logout();
        navigate('/');
       window.location.href = '/'
  };

  const handleSignIn = () => {
      // navigate('/');
      window.location.href = '/'
  }

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 150 } }}
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
        >
            {user? user.username : ''}
        </Typography>
      </Box>
      <Divider />
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
          {user?
              (<MenuItem onClick={handleSignOut}>
          Sign out
        </MenuItem>
              ):(
                    <MenuItem onClick={handleSignIn}>
                        Sign in
                    </MenuItem>
                )}
      </MenuList>
    </Popover>
  );
};

AccountPopOver.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
