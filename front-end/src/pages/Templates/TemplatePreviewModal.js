import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContractPaper from '../../components/ContractPaper';



const TemplatePreviewModal = ({ open, handleClose, data, color }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '75%',
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: color,
        borderRadius: '10px',
        border: '2px solid black',
        p: 1,
        backdropFilter: 'blur(25px)',
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {/*<IconButton*/}
                {/*    aria-label="close"*/}
                {/*    onClick={handleClose}*/}
                {/*    sx={{ position: 'absolute', right: 8, top: 8 }}*/}
                {/*>*/}
                {/*    <CloseIcon />*/}
                {/*</IconButton>*/}
                {/*<Typography id="modal-modal-title" variant="h3" component="h2" gutterBottom>*/}
                {/*    Contract Preview*/}
                {/*</Typography>*/}
                <ContractPaper data={data} color={color} />
            </Box>
        </Modal>
    );
};

export default TemplatePreviewModal;
