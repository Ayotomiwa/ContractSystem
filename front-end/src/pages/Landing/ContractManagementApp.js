import React from 'react';
import { Box, Button, Grid, Typography, Card, CardContent, TextField, List, ListItem, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChatIcon from '@mui/icons-material/Chat';

const styles = {
    section: {
        padding: '50px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(25px)',
        border: '1px solid black',
        margin: '20px 0'
    },
    featureCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        gap: '10px'
    },
    ctaButton: {
        backgroundColor: 'rgb(211, 161, 55, 0.5)',
        color: 'black',
        border: '1px solid black'
    }
};

const ContractManagementApp = () => (
    <Box>
        {/* Hero Section */}
        <Box style={{ ...styles.section, textAlign: 'center' }}>
            <Typography variant="h2" style={{ fontFamily: 'Playfair Display, serif' }}>Contract Lifecycle Management</Typography>
            <Typography variant="h5">Manage your contracts efficiently and securely.</Typography>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} style={styles.ctaButton}>
                Get Started
            </Button>
        </Box>

        {/* Feature Sections */}
        <Grid container spacing={3}>
            {[['Contract Generation', <SearchIcon />], ['Centralized Repository', <FolderIcon />], ['Sending Contracts', <SendIcon />], ['Client Management', <PeopleIcon />], ['Contract Security', <LockIcon />], ['Contract Notification', <NotificationsIcon />], ['Contract Versioning', <HistoryIcon />], ['AI ChatBot', <ChatIcon />]].map(([feature, icon]) => (
                <Grid item xs={12} md={6} key={feature}>
                    <Card style={styles.section}>
                        <CardContent style={styles.featureCard}>
                            {icon}
                            <Typography variant="h6">{feature}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>

        {/* Call-to-Action Section */}
        <Box style={{ textAlign: 'center', padding: '50px' }}>
            <Button variant="contained" size="large" style={styles.ctaButton}>
                Sign Up Now
            </Button>
        </Box>
    </Box>
);

export default ContractManagementApp;
