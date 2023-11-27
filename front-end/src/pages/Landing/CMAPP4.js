import React from 'react';
import { Box, Button, Grid, Typography, Card, CardContent, Paper, Divider, Avatar } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers'; // For an abstract representation of management
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // For growth and improvement
import SecurityIcon from '@mui/icons-material/Security'; // For security
import ChatIcon from '@mui/icons-material/Chat'; // For AI ChatBot

const styles = {
    heroSection: {
        backgroundImage: 'url("/images/hero-background.jpg")', // Replace with an appropriate background image
        backgroundSize: 'cover',
        color: 'white',
        padding: '80px 50px',
        textAlign: 'center'
    },
    featureCard: {
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        gap: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px'
    },
    testimonialCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '10px'
    },
    ctaButton: {
        backgroundColor: 'rgb(59, 61, 145)',
        color: 'white',
        padding: '10px 30px',
        borderRadius: '20px',
        marginTop: '20px'
    }
};

const CMPAPP4 = () => (
    <Box>
        {/* Hero Section */}
        <Box style={styles.heroSection}>
            <Typography variant="h2" style={{ fontFamily: 'Playfair Display, serif' }}>Transform Your Contract Experience</Typography>
            <Typography variant="h5" style={{ marginTop: '20px' }}>Streamline, Secure, and Simplify</Typography>
            <Button variant="contained" style={styles.ctaButton}>Get Started</Button>
        </Box>

        {/* Features Overview */}
        <Grid container spacing={3} style={{ padding: '40px' }}>
            <Grid item xs={12} md={4}>
                <Card style={styles.featureCard}>
                    <LayersIcon fontSize="large" />
                    <Typography variant="h6">Intuitive Management</Typography>
                    <Typography variant="body2">Centralized and streamlined contract handling</Typography>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card style={styles.featureCard}>
                    <TrendingUpIcon fontSize="large" />
                    <Typography variant="h6">Growth & Efficiency</Typography>
                    <Typography variant="body2">Leverage data for smarter decisions</Typography>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card style={styles.featureCard}>
                    <SecurityIcon fontSize="large" />
                    <Typography variant="h6">Unmatched Security</Typography>
                    <Typography variant="body2">Protecting your most valuable assets</Typography>
                </Card>
            </Grid>
        </Grid>

        {/* AI Chatbot Highlight */}
        <Box style={{ textAlign: 'center', padding: '50px', backgroundColor: 'rgba(211, 161, 55, 0.7)', color: 'white' }}>
            <ChatIcon fontSize="large" />
            <Typography variant="h4">Meet Your Digital Assistant</Typography>
            <Typography variant="body1" style={{ marginTop: '10px' }}>Always on hand to help with your contract needs</Typography>
        </Box>

        {/* Testimonials */}
        <Box style={{ padding: '30px' }}>
            <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }}>Trusted by Professionals</Typography>
            <Grid container spacing={2}>
                {/* Map testimonials here */}
            </Grid>
        </Box>

        {/* Final Call-to-Action */}
        <Box style={{ textAlign: 'center', padding: '50px' }}>
            <Typography variant="h4">Ready to Start?</Typography>
            <Button variant="contained" style={styles.ctaButton}>Join Us Today</Button>
        </Box>
    </Box>
);

export default CMPAPP4;