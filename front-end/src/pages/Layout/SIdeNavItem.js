// import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, ButtonBase } from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

export const SIdeNavItem = (props) => {
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
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: '16px',
          pr: '16px',
          py: '16px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            // backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'neutral.400',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: 'primary.main'
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
            // fontFamily: (theme) => theme.typography.fontFamily,
            // fontSize: 14,
            // fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            ...(active && {
              color: 'white'
            }),
            ...(disabled && {
              color: 'rgba(255, 255, 255, 0.04)'
            })
          }}
        >
          {title}
        </Box>
      </ButtonBase>
    </li>
  );
};

SIdeNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired
};