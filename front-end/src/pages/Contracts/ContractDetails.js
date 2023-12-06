import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { format } from 'date-fns';

const ContractDetails = ({ contract }) => {
    const formatDate = (date) => {
        return date ? format(new Date(date), 'dd-MM-yyyy ; HH:mm:ss') : 'N/A';
    };

    return (
        <Box sx={{ p: 2}}>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1"><b>Name:</b> {contract.name}</Typography>
            <Typography variant="body1"><b>Created:</b> {formatDate(contract.createdAt)}</Typography>
            <Typography variant="body1"><b>Last Modified:</b> {formatDate(contract.modifiedAt)}</Typography>
            <Typography variant="body1"><b>Owner Status:</b> {contract.ownerStage}</Typography>
            <Typography variant="body1"><b>Recipient Status:</b> {contract.recipientStage}</Typography>
            <Typography variant="body1"><b>Owner Signed:</b> {contract.signedUser ? 'Yes' : 'No'}</Typography>
            <Typography variant="body1"><b>Signed Date:</b> {formatDate(contract.signedUserDate)}</Typography>
            <Typography variant="body1"><b>Recipient Signed:</b> {contract.signedRecipient ? 'Yes' : 'No'}</Typography>
            <Typography variant="body1"><b>Signed Date:</b> {formatDate(contract.signedRecipientDate)}</Typography>
        </Box>
    );
};

export default ContractDetails;