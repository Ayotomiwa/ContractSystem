import React, {useEffect, useRef, useState} from 'react';
import {Typography, Paper, Box, Divider, Grid, IconButton, Tooltip, SvgIcon, Stack} from '@mui/material';
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { keyframes } from '@mui/system';
import DocumentPlusIcon from '@heroicons/react/24/solid/DocumentPlusIcon';


const ContractPaper = ({ data, color, editingPlaceholder}) => {


    const pdfRef = useRef(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    // const containerRef = useRef(null);
    const glow = keyframes`
      0% {
        text-shadow:
                0 0 15px ${color},
                0 0 30px ${color},
                0 0 45px ${color},
                0 0 60px ${color};
      }
      100% {
        text-shadow:
                0 0 25px ${color},
                0 0 50px ${color},
                0 0 75px ${color},
                0 0 100px ${color};
      }
    `;



    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "b5",
    });

    // console.log(data);
    // console.log(data?.placeholders);


    useEffect(() => {
        console.log("ContractPaper.js: " + editingPlaceholder);
        if (editingPlaceholder) {
            const element = document.querySelector(`[data-placeholder='${editingPlaceholder}']`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [editingPlaceholder]);


    useEffect(() => {
        console.log("ContractPaper.js: " + editingPlaceholder);
        if ((data.userOwner) && (data.isSignedUser || data.isSignedRecipient)) {
            const element = document.querySelector(`[data-signatures='Owner']`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [data.userOwner, data.isSignedUser, data.isSignedRecipient]);



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
        // const regex = /%%(.*?)%%/g;
        // const regex = "";
        // const parts = section.body.split(regex);
        //
        // return (
        //     <Box key={key} my={2}>
        //         <Typography variant="h5">{section.title}</Typography>
        //         <Typography sx ={{marginBottom:"50px"}} variant="body1">
        //             {parts.map((part, index) => {
        //                 // if (index % 2 === 1) {
        //                 //     return (
        //                 //         <span key={index} style={{ backgroundColor:generatingPdf ? "" : color, fontStyle:"italic" }}>
        //                 //         {/*_____________*/}
        //                 //         {/*    /!*{{PlaceHolder}}*!/*/}
        //                 //             {part}
        //                 //     </span>
        //                 //     );
        //                 // }
        //                 return part;
        //             })}
        //         </Typography>
        //     </Box>

        // const regex = /%%(.*?)%%/g;
        // let body = section.body;
        //
        // // Replace placeholders in the body
        // let match;
        // while ((match = regex.exec(body)) !== null) {
        //     const keys = match[1].split('.');
        //     let value = data.placeholders;
        //     for (let key of keys) {
        //         if (value) {
        //             value = value[key];
        //         }
        //     }
        //     body = body.replace(match[0], value || '');
        // }
        //
        // return (
        //     <Box key={key} my={2}>
        //         <Typography variant="h5">{section.title}</Typography>
        //         <Typography sx ={{marginBottom:"50px"}} variant="body1">
        //             {body}
        //         </Typography>
        //     </Box>
        // );
        const regex = /%%(.*?)%%/g;
        let body = section.body;


        const bodyWithPlaceholders = body.split(regex).map((part, index) => {
            if (index % 2 === 0) {
                return part;
            } else {
                const keys = part.split('.');
                let value = data.placeholders;
                for (let key of keys) {
                    value = value ? value[key] : undefined;
                }
                const isEditing = part === editingPlaceholder;
                return (
                    <span
                        key={index}
                        data-placeholder={part}
                        style={{fontStyle: "italic",
                            borderBottom:"1px solid black",
                            ...(isEditing && {
                                animation: `${glow} 2s ease-in-out infinite alternate`,
                                textShadow: `0 0 15px ${color}, 0 0 30px ${color}, 0 0 45px ${color}, 0 0 60px ${color}`,
                                backgroundImage: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
                                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
                                backgroundColor: color,
                                color: 'initial'
                            }),
                    }}>
                    {value || '_________'}
                </span>
                );
            }
        });

        return (
            <Box key={key} my={2}>
                <Typography variant="h5" fontFamily="Times New Roman, serif">{section.title}</Typography>
                <Typography sx ={{marginBottom:"50px"}} variant="subtitle1" fontFamily="Times New Roman, serif">
                    {bodyWithPlaceholders}
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
        <Paper elevation={24} ref={pdfRef}
        /*<Paper elevation={7} ref={containerRef}*/
               sx={{ padding: 3,
                   margin:"auto",
                   // border:"3px blue solid",
                   // overflowY: generatingPdf ? "unset" : "auto",
                   // maxHeight: generatingPdf ? "unset" : "75vh"
        }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '100%' }}
                >
                <Typography variant="h4" sx={{textAlign: 'center', fontFamily:"Times New Roman, serif"}}>{data.name}</Typography>
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

            <Typography variant="h5" sx={{fontFamily:"Times New Roman, serif"}}>Signatures</Typography>
            <Stack
                sx={{
                    display: "flex",
                    flexDirection:"column",
                    justifyContent:"start",
                    gap:2
                }}
            >
                    <Box sx={{mt:"20px"}} data-signatures="Owner">
                        <Typography sx={{mb:1, fontFamily:"Times New Roman, serif"}}>
                            OWNER
                        </Typography>
                        <Typography sx={{fontStyle: "italic", fontFamily:"Times New Roman, serif"}}>
                            {data.signedUser && data.userOwner? data.userOwner.firstName + " " +  data.userOwner.lastName : "Not Signed"}
                        </Typography>
                        <Typography sx={{fontStyle: "italic", fontFamily:"Times New Roman, serif"}}>
                            {"Signed date: "}
                            {data.signedUser ?  data.signedUserDate? data.signedUserDate : new Date().toLocaleDateString() : "N/A"}
                        </Typography>
                    </Box>
                    <Box sx={{fontFamily:"Times New Roman, serif"}}>
                        <Typography sx={{mb:1, fontFamily:"Times New Roman, serif"}}>
                            RECIPIENT
                        </Typography>
                        <Typography sx={{fontStyle: "italic", fontFamily:"Times New Roman, serif"}}>
                            {data.signedRecipient? data.recipient.firstName + " " + data.recipient.lastName : "Not Signed"}
                        </Typography>
                        <Typography sx={{fontStyle: "italic", fontFamily:"Times New Roman, serif"}}>
                            {"Signed date: "}
                            {data.signedRecipientDate? data.signedRecipientDate : "N/A"}
                        </Typography>
                    </Box>
                {/*<div>*/}
                {/*    {renderSignature(data.data.signatures.userSignature, data.data.signatures.userSignature.key? data.data.signatures.userSignature.key : 'Owner')}*/}
                {/*</div>*/}
                {/*<div>*/}
                {/*    {renderSignature(data.data.signatures.clientSignature, data.data.signatures.userSignature.key? data.data.signatures.userSignature.key : 'Client')}*/}
                {/*</div>*/}
            </Stack>
        </Paper>
    );
};

export default ContractPaper;
