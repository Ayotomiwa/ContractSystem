import React, {useContext} from 'react';
import {Box, Button, Grid, Typography, Card, CardContent, Paper, Divider, IconButton, SvgIcon} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // For Contract Generation
import FolderIcon from '@mui/icons-material/Folder'; // For Centralized Repository
import SendIcon from '@mui/icons-material/Send'; // For Sending Contracts
import PeopleIcon from '@mui/icons-material/People'; // For Client Management
import LockIcon from '@mui/icons-material/Lock'; // For Contract Security
import NotificationsIcon from '@mui/icons-material/Notifications'; // For Contract Notification
import HistoryIcon from '@mui/icons-material/History'; // For Contract Versioning
import ChatIcon from '@mui/icons-material/Chat';
import LayersIcon from "@mui/icons-material/Layers";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import Carousel from "react-material-ui-carousel";
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import { motion } from 'framer-motion';
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useInView } from 'react-intersection-observer';
import UserContext from "../../hooks/UserProvider";


const styles = {
    heroSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgb(211, 161, 55, 0.7)',
        // backgroundColor: 'rgba(255, 255, 255, 0.8)',
        minHeight: '75vh',
        // color: 'rgba(255, 255, 255, 0.8)',
        color: 'rgb(211, 161, 55, 0.7)',
        // color: 'rgb(59, 61, 145)',
        padding: '50px',
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
        // backgroundColor: 'rgba(255, 255, 255, 0.9)',
        // backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        border: '1px solid black',
    },
    testimonial: {
        // placeSelf:"center",
        // alignSelf:"center",
        padding: '25px',
        margin: '10px 0',
        backgroundColor: 'rgb(211, 161, 55, 0.5)',
         textAlign: 'center',
        border:"2px black solid",
        // backgroundColor: 'rgba(255, 255, 255, 0.7)'
    },
    ctaButton: {
        // backgroundColor: 'rgb(211, 161, 55)',
        // color: 'black',
        // backgroundColor: 'rgb(211, 161, 55)',
        // color: 'black',
        marginTop: '20px',
        backgroundColor: 'rgb(211, 161, 55, 0.5)',
        color: 'black',
        border: '1px solid black'
    }
};

const features = [
    { title: 'Contract Generation', icon: <SearchIcon /> },
    { title: 'Centralized Repository', icon: <FolderIcon /> },
    { title: 'Sending Contracts', icon: <SendIcon /> },
    { title: 'Client Management', icon: <PeopleIcon /> },
    { title: 'Contract Security', icon: <LockIcon /> },
    { title: 'Contract Notification', icon: <NotificationsIcon /> },
    { title: 'Contract Versioning', icon: <HistoryIcon /> },
    { title: 'AI ChatBot', icon: <ChatIcon /> }
];



const testimonialsData = [
    {
        name: "John Doe",
        testimonial: "This platform has revolutionized the way we manage our contracts. The user interface is intuitive and the features are incredibly helpful."
    },
    {
        name: "Jane Smith",
        testimonial: "Efficient, reliable, and easy to use. It's everything we needed for our contract management process. Highly recommended!"
    },
    {
        name: "Alex Johnson",
        testimonial: "A must-have tool for any business. It has saved us countless hours by streamlining our contract workflows."
    },
];

const socialIcons = [LinkedInIcon, TwitterIcon, FacebookIcon];

const heroVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
}

const cardVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 120 } }
}

const carouselVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 120 } }
};



const CMAPP2 = () => {
  
    const {user} = useContext(UserContext)

    const [ref, inView] = useInView({
        triggerOnce: true
    });
    
    const handleLogin = () => {
        if(user){
            window.location.href = "/contracts"
        }
        else{
            window.location.href = "/login"
        }
    }


    return (
        <Box>
            <Box sx={{backgroundColor: 'rgb(59, 61, 145)', height: "85vh"}}>
                <Box style={styles.heroSection}>
                    <Typography variant="h2"
                                style={{fontFamily: 'Playfair Display, serif', width: "500px", textAlign: "center"}}>Simplify
                        Your Contract Management</Typography>
                    <Typography variant="h5">All your contracts, streamlined and secure.</Typography>
                    <Button variant="contained" 
                            onClick={() => handleLogin()}
                            style={styles.ctaButton}>
                        <Typography>Explore Features </Typography></Button>
                </Box>
                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Box sx={{marginTop: "-100px", display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
                        <img src="/assets/avatars/undraw_people_search_re_5rre.svg" alt="Contract Management"
                             style={{width: '100%', maxHeight: '280px',}}/>
                        <img src="/assets/avatars/undraw_contract_re_ves9 (2).svg" alt="Contract Management"
                             style={{width: '100%', maxHeight: '300px',}}/>
                        <img src="/assets/avatars/undraw_agreement_re_d4dv.svg" alt="Contract Management"
                             style={{width: '100%', maxHeight: '320px',}}/>
                    </Box>
                </motion.div>
            </Box>


           
            <motion.div
                style={{backgroundColor: 'rgb(59, 61, 145, 0.7)',
                    color: 'white',
                    width: "100%", height: "100%", marginTop:"300px"}}
                ref={ref}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <Grid container spacing={3} style={{padding: '50px', marginTop: "200px", height:"400px"}}>
                    <Grid item xs={12} md={4}>
                        <Card style={styles.featureCard}>
                            <LayersIcon fontSize="large"/>
                            <Typography variant="h6">Intuitive Management</Typography>
                            <Typography variant="body2">Centralized and streamlined contract handling</Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card style={styles.featureCard}>
                            <TrendingUpIcon fontSize="large"/>
                            <Typography variant="h6">Quick & Efficient</Typography>
                            <Typography variant="body2">Leverage our resource for quick contract generation</Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card style={styles.featureCard}>
                            <SecurityIcon fontSize="large"/>
                            <Typography variant="h6">Unmatched Security</Typography>
                            <Typography variant="body2">Protecting your most important contracts</Typography>
                        </Card>
                    </Grid>
                </Grid>
            </motion.div>


            <motion.div
                ref={ref}
                variants={carouselVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <Box sx={{
                    p: 5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    mb:"120px",
                    // border: "1px solid black",
                }}>
                    <Carousel sx={{
                        width: "50%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {testimonialsData.map((testimonial, index) => (
                            <Paper key={index} elevation={3} sx={styles.testimonial}>
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon key={index} style={{color: 'secondary.main', height: 25, width: 25}}/>
                                ))}
                                <Typography variant="h6">{testimonial.name}</Typography>
                                <Typography variant="body1">{testimonial.testimonial}</Typography>
                            </Paper>
                        ))}
                    </Carousel>
                </Box>
            </motion.div>


          
            {/*<Box style={{ textAlign: 'center', padding: '50px', backgroundColor: 'rgba(59, 61, 145, 0.7)', color: 'white' }}>*/}
            {/*    <Typography variant="h4">Ready to Enhance Your Contract Management?</Typography>*/}
            {/*    <Button variant="contained" style={styles.ctaButton}>Get Started</Button>*/}
            {/*</Box>*/}


            <Box sx={{
                backgroundColor: 'rgba(59, 61, 145, 0.7)',
                border: "0.5px solid black",
                color: 'white',
                p: 4,
                textAlign: 'center',
            }}>
                <Typography variant="h6">Contact Us:</Typography>
                {socialIcons.map((Icon, index) => (
                    <IconButton key={index} color="inherit">
                        <Icon style={{height: 30, width: 30}}/>
                    </IconButton>
                ))}
            </Box>

        </Box>
    );
};

export default CMAPP2;