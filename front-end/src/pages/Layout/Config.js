import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
// import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
// import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
// import UserIcon from '@heroicons/react/24/solid/UserIcon';
// import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import NewspaperIcon from '@heroicons/react/24/solid/NewspaperIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Inbox',
    path: '/inbox',
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
        <SvgIcon fontSize="large">
          <NewspaperIcon />
        </SvgIcon>
    )
  },
  {
    title: 'My Clients',
    path: '/clients',
    icon: (
      <SvgIcon fontSize="large">
        <UsersIcon />
      </SvgIcon>
    )
  },


  {
    title: 'Products & Services',
    path: '/products',
    icon: (
      <SvgIcon fontSize="large">
        <CogIcon />
      </SvgIcon>
    )
  },

];
