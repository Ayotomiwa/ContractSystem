import {useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    darken,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import UserContext from "../../hooks/UserProvider";
import {green, red} from "@mui/material/colors";
import {alpha} from "@mui/material/styles";

const ContractEditSideBar = ({
                                 contract,
                                 setContract,
                                 setEditingPlaceholder,
                                 handleModalSubmit,
                                 setFullName,
                                 fullName,
                                 fullNameValid,
                                 color,
                                 defaultTemplate,
                                 contractSaved,
                                 contractSent
                             }) => {
    const {user} = useContext(UserContext);
    const [formData, setFormData] = useState({});
    const [open, setOpen] = useState(false);
    const [signClicked, setSignClicked] = useState(false);
    const [checked, setChecked] = useState(false);
    const [showAuthErrorModal, setShowAuthErrorModal] = useState(false);
    const [isUserOwner, setIsUserOwner] = useState(false);

    // const handleCheckboxClick = (event) => {
    //     if (event.target.checked) {
    //         setOpen(true);
    //     } else {
    //         setChecked(false);
    //     }
    // };

    useEffect(() => {
        if (!fullName) {
            console.log("handleModalSubmitInternal returned", fullNameValid);
            return;
        }
        if (fullNameValid) {
            console.log("handleModalSubmitInternal ", fullNameValid);
            setOpen(false);
            setChecked(true);

        } else if (!open) {
            console.log("handleModalSubmitInternal else", fullNameValid);
            setChecked(false);
            setShowAuthErrorModal(true);
        }
    }, [fullNameValid, signClicked]);


    useEffect(() => {

        if (!contract.placeholders) {
            return;
        }
        const initialFormData = {};
        Object.keys(contract.placeholders).forEach(key => {
            if (typeof contract.placeholders[key] === 'object' && contract.placeholders[key] !== null) {
                Object.keys(contract.placeholders[key]).forEach(subKey => {
                    initialFormData[`${key}.${subKey}`] = contract.placeholders[key][subKey];
                });
            } else {
                initialFormData[key] = contract.placeholders[key];
            }
        });
        initialFormData["ownerSignature"] = contract.ownerSignature;
        initialFormData["recipientSignature"] = contract.recipientSignature;
        initialFormData["message"] = contract.message;
        setFormData(initialFormData);


    }, [contract.placeholders]);


    useEffect(() => {
        (!contract.userOwner && defaultTemplate !== true) || contract.userOwner?.email === user?.email || contract.userOwner?.business?.id === user?.businessId ? setIsUserOwner(true) : setIsUserOwner(false);
        if (contract.userOwner && isUserOwner) {
            if (checked) {
                return
            }
            setChecked(contract.signedUser);
        } else if (contract.recipient && !isUserOwner) {
            if (checked) {
                return;
            }
            setChecked(contract.signedRecipient);
        }
        // setChecked(isUserOwner ? contract.isSignedUser : contract.isSignedRecipient);
    }, [user, contract]);


    const handleModalClose = (cancel = false) => {
        setOpen(false);
        if (cancel || !fullNameValid) {
            setChecked(false);
        }
    };

    const handleCheckboxClick = (event) => {
        setChecked(event.target.checked);
        setOpen(event.target.checked);
    };


    const handleModalSubmitInternal = () => {
        setSignClicked(!signClicked);
        handleModalSubmit();
    };


    function toTitleCase(str) {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
            return str.toUpperCase();
        })
    }


    const handleChange = (event) => {

        setFormData(prevFormData => {
            const newFormData = {
                ...prevFormData,
                [event.target.name]: event.target.value
            };

            setContract(prevContract => {
                const newContract = {...prevContract};
                const keys = event.target.name.split('.');
                if (keys.length === 2) {
                    if (!newContract.placeholders[keys[0]]) {
                        newContract.placeholders[keys[0]] = {};
                    }
                    newContract.placeholders[keys[0]][keys[1]] = newFormData[event.target.name];
                } else {
                    newContract.placeholders[event.target.name] = newFormData[event.target.name];
                    newContract.message = newFormData["message"];
                    newContract.ownerSignature = !!newFormData["ownerSignature"];
                    newContract.recipientSignature = !!newFormData["recipientSignature"];
                }
                return newContract;
            });
            return newFormData;
        });
        setEditingPlaceholder(event.target.name);
    };

    return (
        <Stack direction="column" sx={{width: "100%"}}>

            <Box sx={{pt: "10px", pb: "10px", bgcolor: color}}>
                <Typography variant="h6" textAlign="center" component="h5">Contract Details</Typography>
            </Box>


            <Box component="form"
                 sx={{
                     overflowY: "auto",
                     maxHeight: "80vh"
                 }}
            >
                {isUserOwner && (
                    <Box>
                        {Object.keys(contract.placeholders).map((key) => (
                            <List key={key}>
                                <ListItem>
                                    <ListItemText>
                                        <Typography variant="subtitle1"
                                                    sx={{fontWeight: "bold"}}>{toTitleCase(key)}</Typography>
                                    </ListItemText>
                                </ListItem>
                                {typeof contract.placeholders[key] === 'object' && contract.placeholders[key] !== null ? (
                                    Object.keys(contract.placeholders[key]).map((subKey) => (
                                        <ListItem key={subKey}>
                                            <TextField
                                                name={`${key}.${subKey}`}
                                                label={toTitleCase(subKey)}
                                                value={formData[`${key}.${subKey}`] || ''}
                                                onChange={handleChange}
                                                fullWidth
                                                disabled={contractSaved || contractSent || contract.signedUser || contract.signedRecipient}
                                                sx={{bgcolor: alpha(color, 0.2)}}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem>
                                        <TextField
                                            name={key}
                                            label={toTitleCase(key)}
                                            value={formData[key] || ''}
                                            onChange={handleChange}
                                            disabled={contractSaved || contractSent || contract.signedUser || contract.signedRecipient}
                                            fullWidth
                                            sx={{bgcolor: alpha(color, 0.2)}}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        ))}
                    </Box>
                )}
                <List>
                    <ListItem>
                        <ListItemText>
                            <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>Signatures</Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            label={(!contract.userOwner && defaultTemplate !== true) || contract.userOwner?.email === user?.email || contract.userOwner?.business?.id === user?.businessId
                                ? "Owner Signature" : "Recipient Signature"}
                            control={<Checkbox
                                checked={checked || false}
                                disabled={contractSent || contractSaved || (isUserOwner && contract.signedUser && (contractSaved || contractSent)) || (!isUserOwner && contract.signedRecipient)}
                                onChange={handleCheckboxClick}/>}
                        />
                    </ListItem>
                    {!isUserOwner && (
                        <ListItem sx={{mt: "20px"}}>
                            <TextField
                                fullWidth
                                label="Message"
                                name="message"
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        message: e.target.value,
                                    });
                                }}
                                required
                                disabled={contractSent || contractSaved || (isUserOwner && contract.signedUser && (contractSaved || contractSent)) || (!isUserOwner && contract.signedRecipient)}
                                value={formData.message}
                                // variant="outlined"
                                multiline
                                minRows={4}
                                maxRows={4}
                                sx={{bgcolor: alpha(color, 0.2), overflowY: "auto"}}
                            />
                        </ListItem>
                    )}
                    <Dialog open={open}
                            onClose={() => handleModalClose(true)}>
                        <DialogTitle>Sign Contract</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please enter your full name to sign the contract.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Full Name"
                                type="text"
                                fullWidth
                                value={fullName || ''}
                                onChange={e => setFullName(e.target.value)}
                                error={!fullNameValid}
                                helperText={!fullNameValid ? 'You are not authorized to sign this contract' : ''}
                                InputProps={{
                                    style: {
                                        color: fullNameValid ? green[500] : red[500]
                                    }
                                }}
                            />
                        </DialogContent>
                        <DialogActions sx={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
                            <Button
                                sx={{
                                    width: "100%",
                                    color: "white",
                                    backgroundColor: "rgb(185,67,102)",
                                    '&:focus,&:active,&:hover': {
                                        color: "white",
                                        backgroundColor: "rgb(185,67,102)"
                                    }
                                }}
                                onClick={() => handleModalClose(true)}>Cancel</Button>
                            <Button
                                sx={{
                                    width: "100%",
                                    color: "white",
                                    backgroundColor: darken(color, 0.55),
                                    '&:focus,&:active,&:hover': {
                                        color: "white",
                                        backgroundColor: darken(color, 0.55)
                                    }
                                }}
                                onClick={handleModalSubmitInternal}>Sign</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={showAuthErrorModal} onClose={() => setShowAuthErrorModal(false)}>
                        <DialogTitle>Authorization Error</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                You are not authorized to sign this contract. Please enter the correct full name.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button sx={{
                                color: "white",
                                backgroundColor: darken(color, 0.5),
                                '&:focus,&:active,&:hover': {
                                    color: "white",
                                    backgroundColor: darken(color, 0.5)
                                }
                            }}
                                    onClick={() => setShowAuthErrorModal(false)}>OK</Button>
                        </DialogActions>
                    </Dialog>

                </List>
            </Box>
        </Stack>
    );
};

export default ContractEditSideBar;