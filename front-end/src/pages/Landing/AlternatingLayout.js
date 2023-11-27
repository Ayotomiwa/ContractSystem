import React from 'react';
import { Box, Grid, Typography, CardMedia, Button } from '@mui/material';

const alternatingData = [
    {
        id: 1,
        title: "Feature 1",
        description: "Detailed explanation of Feature 1...",
        imageUrl: "path/to/image1.jpg",
        buttonText: "Learn More",
    },
    {
        id: 2,
        title: "Feature 2",
        description: "In-depth details about Feature 2...",
        imageUrl: "path/to/image2.jpg",
        buttonText: "Read More",
    },
    // Add more features as needed
];

const AlternatingLayout = () => (
    <Box>
        {alternatingData.map((item, index) => (
            <Grid container key={item.id} sx={{ my: 4 }}>
                <Grid item xs={12} md={6} order={{ xs: index % 2 === 0 ? 2 : 1, md: 1 }}>
                    <CardMedia
                        component="img"
                        image={item.imageUrl}
                        alt={`Image for ${item.title}`}
                        sx={{ width: '100%', borderRadius: 2 }}
                    />
                </Grid>
                <Grid item xs={12} md={6} order={{ xs: index % 2 === 0 ? 1 : 2, md: 2 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
                    <Typography variant="h5">{item.title}</Typography>
                    <Typography variant="body1">{item.description}</Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>{item.buttonText}</Button>
                </Grid>
            </Grid>
        ))}
    </Box>
);

export default AlternatingLayout;
