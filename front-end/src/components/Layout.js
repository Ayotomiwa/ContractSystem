import { useCallback, useEffect, useState } from 'react';
// import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
// import { withAuthGuard } from 'src/hocs/with-auth-guard';
// import { SideNav } from '../pages/Layout/side-nav';
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
  const [openNav, setOpenNav] = useState(false);

  const noneSideBarRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/"];
  const currentPath = useLocation().pathname;

  useEffect(() => {
    const layoutCanBeShown = !noneSideBarRoutes.includes(currentPath);
    if(layoutCanBeShown) {
      setShowTopNav(true);
      setOpenNav(true);
      setShowSideBar(true);
    }
  }, [currentPath]);



  return (
    <>
      {showTopNav && (
        <TopNav onNavOpen={() => setOpenNav(!openNav)}
                openNav={openNav}/>
      )}
      {showSideBar && (<SideNav
        onClose={() => setOpenNav(false)}
        OnOpen={() => setOpenNav(true)}
        open={openNav}
      />
          )}
      <Box sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        paddingLeft: openNav ? "280px" : "0px",
        backGroundColor: 'transparent',
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
