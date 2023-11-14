// import NextLink from 'next/link';
// import { usePathname } from 'next/navigation';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import {
    Box,
    Button,
    Divider,
    Drawer,
    Stack,
    SvgIcon, SwipeableDrawer,
    Typography,
    useMediaQuery
} from '@mui/material';
// import { Logo } from 'src/components/logo';
// import { Scrollbar } from 'src/components/scrollbar';
import { items } from './Config';
import { SIdeNavItem } from './SIdeNavItem';
import {Scrollbar} from "../../components/scrollbar";

export const SideNav = (props) => {
    const {open, onClose, OnOpen} = props;
    // const pathname = usePathname();
    // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    const path = window.location.pathname;

    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box sx={{p: 3}}>
                <Box
                    sx={{
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                        p: '12px'
                    }}
                >
                    <div>
                        <Typography
                            color="inherit"
                            variant="h5"
                            sx={{textAlign:"center"}}
                        >
                            Manage Your Business
                        </Typography>
                    </div>
                </Box>
            </Box>
            <Divider sx={{borderColor: 'neutral.700'}}/>
            <Box
                component="nav"
                sx={{
                    flexGrow: 1,
                    px: 2,
                    py: 3
                }}
            >
                <Stack
                    component="ul"
                    spacing={0.5}
                    sx={{
                        listStyle: 'none',
                        p: 0,
                        m: 0
                    }}
                >
                    {items.map((item) => {
                        const active = item.path ? (path === item.path) : false;
                        //   const active = true;

                        return (
                            <SIdeNavItem
                                active={active}
                                disabled={item.disabled}
                                external={item.external}
                                icon={item.icon}
                                key={item.title}
                                path={item.path}
                                title={item.title}
                            />
                        );
                    })}
                </Stack>
            </Box>
            <Divider sx={{borderColor: 'neutral.700'}}/>
        </Box>
    );


    return (
        window.innerWidth > 768 ? (
                open &&
                (<SwipeableDrawer
                    anchor="left"
                    open={open}
                    onClose={onClose}
                    onOpen={OnOpen}
                    PaperProps={{
                        sx: {
                            backgroundColor: "rgb(99, 102, 241)",
                            color: "white",
                            width: 250
                        }
                    }}
                    // sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
                    // variant="temporary"
                    variant="permanent"
                >
                    {content}
                </SwipeableDrawer>
                )
            ) : (
                <SwipeableDrawer
                    anchor="left"
                    open={open}
                    onClose={onClose}
                    onOpen={OnOpen}
                    PaperProps={{
                        sx: {
                            backgroundColor: "rgb(99, 102, 241)",
                            color: "white",
                            width: 250
                        }
                    }}
                    // sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
                    // variant="temporary"
                    variant="temporary"
                >
                    {content}
                </SwipeableDrawer>
            )
);
};

  // return (
  //   <Drawer
  //     anchor="left"
  //     onClose={onClose}
  //     open={open}
  //     PaperProps={{
  //       sx: {
  //         backgroundColor: 'neutral.800',
  //         color: 'common.white',
  //         width: 280
  //       }
  //     }}
  //     sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
  //     variant="temporary"
  //   >
  //     {content}
  //   </Drawer>
  // );
// };

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
