import { useCallback, useEffect, useState } from 'react';
import { TopNav } from '../pages/Layout/TopNav';
import {SideNav} from "../pages/Layout/SideNav";
import {Box} from "@mui/material";
import { useLocation } from 'react-router-dom';



// const LayoutContainer = styled('div')({
//   display: 'flex',
//   flex: '1 1 auto',
//   flexDirection: 'column',
//   width: '100%',
//   backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.25) 100%), linear-gradient(225deg, #e1e1e1 0%, #f6f6f6 100%)',
//   backgroundSize: 'cover',
// });

export const Layout = (props) => {
  const { children } = props;
  const [showSideBar, setShowSideBar] = useState(false);
  const[showTopNav, setShowTopNav] = useState(false);
  const [openSideNav, setOpenSideNav] = useState(false);

  const noneTopNavRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/"];
  const  nonSideBarRoutes = [...noneTopNavRoutes, "/templates"];
  const currentPath = useLocation().pathname;

  useEffect(() => {
    const sideLayoutCanBeShown = !nonSideBarRoutes.includes(currentPath);
    if(sideLayoutCanBeShown) {
      setShowSideBar(true);
      setOpenSideNav(true);
    }
    if(!noneTopNavRoutes.includes(currentPath)) {
      // setOpenNav(true);
      setShowTopNav(true);
    }
  }, [currentPath]);



  return (
    <>
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
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        marginLeft: openSideNav && (window.innerWidth > 768) ? "230px" : "0px",
        // backGroundColor: 'transparent',
        // backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.25) 100%), linear-gradient(225deg, #e1e1e1 0%, #f6f6f6 100%)',
        // backgroundSize: 'cover',

      }}>
        {/*<LayoutContainer>*/}
          {children}
        {/*</LayoutContainer>*/}
      </Box>
    </>
  );
};
