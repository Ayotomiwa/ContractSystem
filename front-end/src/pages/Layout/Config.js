import NewspaperIcon from '@heroicons/react/24/solid/NewspaperIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import {SvgIcon} from '@mui/material';
import {CogIcon, EnvelopeIcon} from "@heroicons/react/20/solid";

const Config = [

        {
            title: 'Inbox',
            path: '/inbox',
            public: true,
            icon: (
                <SvgIcon fontSize="large">
                    <EnvelopeIcon/>
                </SvgIcon>
            )
        },
        {
            title: 'My Contracts',
            path: '/contracts',
            public: true,
            icon: (
                <SvgIcon fontSize="large">
                    <NewspaperIcon/>
                </SvgIcon>
            )
        },
        {
            title: 'My Clients',
            path: '/clients',
            public: false,
            icon: (
                <SvgIcon fontSize="large">
                    <UsersIcon/>
                </SvgIcon>
            )
        },


        {
            title: 'Products & Services',
            path: '/products',
            type: false,
            icon: (
                <SvgIcon fontSize="large">
                    <CogIcon/>
                </SvgIcon>
            )
        },
    ];

export default Config;
