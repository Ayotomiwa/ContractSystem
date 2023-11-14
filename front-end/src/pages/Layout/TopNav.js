import PropTypes from 'prop-types';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import NewspaperIcon from '@heroicons/react/24/outline/NewspaperIcon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import HomeModernIcon from '@heroicons/react/24/solid/HomeModernIcon';
import {
    Avatar,
    Badge,
    Box,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip, Typography,
    useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { usePopover } from '../../hooks/use-popover';
import { AccountPopOver } from './AccountPopOver';
import {generateRandomAvatar} from "../../utils/avatarUtils";

const SIDE_NAV_WIDTH = 250;
const TOP_NAV_HEIGHT = 84;

export const TopNav = (props) => {
  const { onNavOpen, openNav } = props;
  const sideBarWidth = openNav ? SIDE_NAV_WIDTH : 0;
  console.log(openNav + " " + sideBarWidth);
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const accountPopover = usePopover();

  return (
    <div>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(25px)',
          // backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
            backgroundColor: 'rgba(255, 255, 255, 1)',
          position: 'sticky',
          left:`${sideBarWidth}px`,
          maxWidth: `calc(100% - ${sideBarWidth}px)`,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="large">
                  <Bars3Icon color="rgb(99, 102, 241)"/>
                </SvgIcon>
              </IconButton>
              <Stack direction="row">
                  <SvgIcon fontSize="large">
                      <HomeModernIcon color="rgb(99, 102, 241)"/>
                  </SvgIcon>
                  <Typography variant="h4" sx={{fontStyle:"bold", color:"#e75480", letterSpacing:"-5px", font:""}}>
                      Contract 101
                  </Typography>
              </Stack>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Tooltip title="Create Contract">
              <IconButton>
                  {/*CREATE*/}
                <SvgIcon fontSize="large">
                  <NewspaperIcon color="rgb(99, 102, 241)"/>
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton>
                <Badge
                  badgeContent={4}
                  // color="success"
                  variant="dot"
                >

                  <SvgIcon fontSize="large">
                    <BellIcon color="rgb(99, 102, 241)"/>
                  </SvgIcon>
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: 'pointer',
                height: 40,
                width: 40
              }}
              src={""}
            />
          </Stack>
        </Stack>
      </Box>
      <AccountPopOver
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </div>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
