import PropTypes from 'prop-types';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import NewspaperIcon from '@heroicons/react/24/solid/NewspaperIcon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import HomeModernIcon from '@heroicons/react/24/solid/HomeModernIcon';
import DocumentPlusIcon from '@heroicons/react/24/solid/DocumentPlusIcon';
import {
    AppBar,
    Avatar,
    Badge,
    Box, Button,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip, Typography,
    useMediaQuery, useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { usePopover } from '../../hooks/UsePopover';
import { AccountPopOver } from './AccountPopOver';
import {Link as RouterLink, useLocation} from "react-router-dom";
import {generateRandomAvatar} from "../../utils/avatarUtils";
import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import {useState} from "react";

const SIDE_NAV_WIDTH = 200;
const TOP_NAV_HEIGHT = 84;

export const TopNav = (props) => {
  const { onNavOpen, openNav, showSideBar } = props;
  const sideBarWidth = openNav && (window.innerWidth > 768) ? SIDE_NAV_WIDTH : 0;
  const accountPopover = usePopover();
  const theme= useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const currentPath = useLocation().pathname;
    // const [dashBoardNav, setDashBoardNav] = useState(false);
    // const[contractsNav, setContractsNav] = useState(false);


    const handleNavClick = (path) => {
        window.location.pathname = path;
    }


   const navBgColor =  (currentPath === "/contracts") ? "rgb(59, 61, 145)" : "transparent";

    return (
    <>
      <AppBar
        component="nav"
        sx={{
            overflowX: "hidden",
          backdropFilter: 'blur(25px)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            border:"1px solid black",
            top: 0,
          position: 'sticky',
          left:`${sideBarWidth}px`,
          maxWidth: `calc(100% - ${sideBarWidth}px)`,
            zIndex: 1000,
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
              {showSideBar && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="large">
                  {/*<Bars3Icon color="#e75480"/>*/}
                    <Bars3Icon color= "rgb(59, 61, 145)"/>
                  {/*  <Bars3Icon color="rgb(185,67,102)"/>*/}
                </SvgIcon>
              </IconButton>
                  )}
              <Stack direction="row">
                  <SvgIcon fontSize="large">
                      {/*<HomeModernIcon  color="#e75480"/>*/}
                      {/*<HomeModernIcon  color="rgb(185,67,102)"/>*/}
                      <HomeModernIcon
                          color="rgb(59, 61, 145)"/>
                  </SvgIcon>
                  {!isSmallScreen &&(
                  <Typography variant="h4" sx={{fontStyle:"bold", letterSpacing:"-5px", color:"black"}}>
                      Contract 101
                  </Typography>
                      )}
              </Stack>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
              {/*CREATE CONTRACT*/}
            <Tooltip title="Create Contract">

                {window.innerWidth > 768 ? (
                <Button
                    variant="text"
                    onClick={() => handleNavClick("/templates")}
                    sx={{color:"rgb(59, 61, 145)",
                    fontSize:"16px"
                }}>
                    <SvgIcon fontSize="large">
                          <DocumentPlusIcon
                              color="rgb(185,67,102)"
                          />
                      </SvgIcon>
                    Contracts
                </Button>
                ):(
              <IconButton
                  onClick={() => handleNavClick("/templates")}>
                <SvgIcon fontSize="large">
                    <DocumentPlusIcon
                        color="rgb(185,67,102)"
                    />
                </SvgIcon>
              </IconButton>

              )}

            </Tooltip>

              <Tooltip title="View Dashboard">

                  {window.innerWidth > 768 ? (
                  <Button
                      variant="text"
                      onClick={() => handleNavClick("/contracts")}
                      size="large"
                          sx={{color:"rgb(59, 61, 145)",
                              fontSize:"16px",
                              backgroundColor: {navBgColor},
                          // "&:active, &:focus, &:hover": {
                          //       color: {navBgColor},
                          //       backgroundColor: {navBgColor},
                          //   }
                  }}
                  >
                      <SvgIcon fontSize="large">
                                  <ChartBarIcon
                                      color="rgb(185,67,102)"
                                  />
                  </SvgIcon>
                      Dashboard
                  </Button>
                  ):(

                  <IconButton>
                      onClick={() => handleNavClick("/contracts")}
                      <SvgIcon fontSize="large">
                          <ChartBarIcon
                              color="rgb(185,67,102)"
                          />
                      </SvgIcon>
                  </IconButton>
                      )}
              </Tooltip>


            <Tooltip title="Notifications">
              <IconButton>
                <Badge
                  badgeContent={4}
                  // color="success"
                  variant="dot"
                >

                  <SvgIcon fontSize="large">
                      {/*<BellIcon color="rgb(185,67,102)"/>*/}
                      {/*<BellIcon color="#e75480"/>*/}
                    <BellIcon color="rgb(59, 61, 145)"/>
                  </SvgIcon>
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              size="large"
              sx={{
                cursor: 'pointer',
                // height: 40,
                // width: 40
              }}
              src={"/assets/avatars/avatar-carson-darrin.png"}
            />
          </Stack>
        </Stack>
      </AppBar>
      <AccountPopOver
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
