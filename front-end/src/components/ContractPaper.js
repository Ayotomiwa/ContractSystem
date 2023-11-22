import React from 'react';
import { Typography, Paper, Box, Divider, Grid } from '@mui/material';

const ContractPaper = ({ data, color}) => {







    const renderSection = (section, key) => {
        const regex = /%%(.*?)%%/g;
        const parts = section.body.split(regex);

        return (
            <Box key={key} my={2}>
                <Typography variant="h6">{section.title}</Typography>
                <Typography variant="body1">
                    {parts.map((part, index) => {
                        if (index % 2 === 1) {
                            return (
                                <span key={index} style={{ backgroundColor: color, fontStyle:"italic" }}>
                                [[PlaceHolder]]
                            </span>
                            );
                        }
                        return part;
                    })}
                </Typography>
            </Box>
        );
    };


    const renderSignature = (signature, key) => (
        <Box key={key} my={1}>
            <Typography variant="subtitle1">{signature.signatoryName}</Typography>
            <Typography variant="body2">Email: {signature.email}</Typography>
            <Typography variant="body2">Date: {signature.timestamp}</Typography>
        </Box>
    );

    return (
        <Paper elevation={7} sx={{ padding: 3, margin: 2, overflowY: "auto", maxHeight:"75vh" }}>
            <Typography variant="h4" textAlign="center" gutterBottom>{data.name}</Typography>

            {Object.entries(data.data.sections).map(([key, section]) => renderSection(section, key))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5">Signatures</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {renderSignature(data.data.signatures.userSignature, 'userSignature')}
                </Grid>
                <Grid item xs={6}>
                    {renderSignature(data.data.signatures.clientSignature, 'clientSignature')}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ContractPaper;
