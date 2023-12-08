import { useCallback, useEffect, useState } from 'react';
import { TopNav } from '../pages/Layout/TopNav';
import {SideNav} from "../pages/Layout/SideNav";
import {Box, ThemeProvider, useMediaQuery, useTheme} from "@mui/material";
import { useLocation } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';



const TOP_NAV_HEIGHT = 64;
export const Layout = (props) => {
  const { children } = props;
  const theme = createTheme({
    typography: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
    },
  });
  const [showSideBar, setShowSideBar] = useState(false);
  const[showTopNav, setShowTopNav] = useState(false);
  const [openSideNav, setOpenSideNav] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));


  const noneTopNavRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const  nonSideBarRoutes = [...noneTopNavRoutes, "/templates", "/"];
  const currentPath = useLocation().pathname;

  const isNonSidebarRoute = useCallback(() => {
    return nonSideBarRoutes.includes(currentPath) || currentPath.startsWith("/contract/edit");
  }, [currentPath]);

  useEffect(() => {
    const sideLayoutCanBeShown = !isNonSidebarRoute();
    if(sideLayoutCanBeShown) {
      setShowSideBar(true);
      if (!isSmallScreen) {
        setOpenSideNav(true);
      }
    }
    if(!noneTopNavRoutes.includes(currentPath)) {
      // setOpenNav(true);
      setShowTopNav(true);
    }
  }, [currentPath, isSmallScreen, isNonSidebarRoute]);



  return (
    <ThemeProvider theme={theme}>
      {showTopNav && (
        <TopNav onNavOpen={() => setOpenSideNav(!openSideNav)}
                openNav={openSideNav}
                showSideBar={showSideBar}
        />
      )}
      {showSideBar && (<SideNav
        onClose={() => setOpenSideNav(false)}
        OnOpen={() => setOpenSideNav(true)}
        open={openSideNav}
      />
          )}
      <Box sx={{
        marginLeft: openSideNav && !isSmallScreen ? "230px" : "0px",
      }}>
          {children}
      </Box>
    </ThemeProvider>
  );
};
