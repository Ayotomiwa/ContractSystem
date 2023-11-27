import React, {useRef, useState} from 'react';
import {Typography, Paper, Box, Divider, Grid, IconButton, Tooltip, SvgIcon, Stack} from '@mui/material';
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import DocumentPlusIcon from '@heroicons/react/24/solid/DocumentPlusIcon';

const ContractPaper = ({ data, color}) => {

    const pdfRef = useRef(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
    });

    const handleDownload = () => {
        setGeneratingPdf(true);

        setTimeout(() => {
            if (pdfRef.current) {
                html2canvas(pdfRef.current,).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = pdf.internal.pageSize.getWidth();
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                    pdf.save(`${data.name || 'contract'}.pdf`);
                }).finally(() => {
                    setGeneratingPdf(false);
                });
            }
        },100);
    };




    const renderSection = (section, key) => {
        const regex = /%%(.*?)%%/g;
        const parts = section.body.split(regex);

        return (
            <Box key={key} my={2}>
                <Typography variant="h5">{section.title}</Typography>
                <Typography sx ={{marginBottom:"50px"}} variant="body1">
                    {parts.map((part, index) => {
                        if (index % 2 === 1) {
                            return (
                                <span key={index} style={{ backgroundColor:generatingPdf ? "" : color, fontStyle:"italic" }}>
                                _____________
                                    {/*{{PlaceHolder}}*/}
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
            <Typography variant="subtitle1">{key}: {signature.signatoryName}</Typography>
            <Typography variant="body2">Email: {signature.email}</Typography>
            <Typography variant="body2">Date: {signature.timestamp}</Typography>
        </Box>
    );

    return (
        <Paper elevation={7} ref={pdfRef}
               sx={{ padding: 3, margin: 2,
                   overflowY: generatingPdf ? "unset" : "auto",
                   maxHeight: generatingPdf ? "unset" : "75vh"
        }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '100%' }}
                >
                <Typography variant="h3" sx={{textAlign: 'center'}}>{data.name}</Typography>
                <Tooltip title="Download">
                    <IconButton
                        sx={{visibility: generatingPdf ? "hidden" : "visible",
                        backgroundColor:color,
                            color:"black"
                        }}
                        onClick={() => handleDownload()}
                    >
                        <SvgIcon fontSize="large">
                            <ArrowDownTrayIcon/>
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
            </Stack>
            {Object.entries(data.data.sections).map(([key, section]) => renderSection(section, key))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5">Signatures</Typography>
            <Stack
                sx={{
                    display: "flex",
                    flexDirection:"row",
                    justifyContent:"space-around",
                }}
            >
                <div>
                    {renderSignature(data.data.signatures.userSignature, data.data.signatures.userSignature.key? data.data.signatures.userSignature.key : 'Owner')}
                </div>
                <div>
                    {renderSignature(data.data.signatures.clientSignature, data.data.signatures.userSignature.key? data.data.signatures.userSignature.key : 'Client')}
                </div>
            </Stack>
        </Paper>
    );
};

export default ContractPaper;
