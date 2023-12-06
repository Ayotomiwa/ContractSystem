
import PropTypes from 'prop-types';
import { Box, ButtonBase } from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title } = props;

  const linkProps = path
    ? external
      ? {
        component: 'a',
        to: path,
        target: '_blank'
      }
      : {
        component: RouterLink,
        to: path
      }
    : {};

  return (
    <li>
      <ButtonBase
        sx={{
            display: 'flex',
            flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 1,
          padding:"14px",
          textAlign: 'left',
          width: '100%',
          ...(active &&{
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
          }),
          // '&:hover': {
          //   backgroundColor: 'rgba(255, 255, 255, 0.04)'
          // }
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
                color:"",
              alignItems: 'center',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 1,
                ...(disabled &&{
                    color: "gray"
                }),
                ...(active && {
                    color: "rgb(185,67,102)"
                })
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: 'white',
            flexGrow: 1,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
              ...(disabled &&{
                  color: "gray"
              }),
          }}
        >
          {title}
        </Box>
      </ButtonBase>
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired
};
