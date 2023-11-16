import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon color="white"/>
      </SvgIcon>
    )
  },
  {
    title: 'My Contracts',
    path: '/contracts',
    icon: (
        <SvgIcon fontSize="small">
          <XCircleIcon color="white"/>
        </SvgIcon>
    )
  },
  {
    title: 'My Clients',
    path: '/clients',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon color="white"/>
      </SvgIcon>
    )
  },


  {
    title: 'Products & Services',
    path: '/products',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon color="white"/>
      </SvgIcon>
    )
  },

];
