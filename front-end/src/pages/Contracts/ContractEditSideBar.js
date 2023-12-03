import {useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox, darken,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
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

const ContractEditSideBar = ({contract, setContract, setEditingPlaceholder, handleModalSubmit, setFullName, fullName, fullNameValid, color, defaultTemplate}) => {
    const {user} = useContext(UserContext);
    const [formData, setFormData] = useState({});
    const [open, setOpen] = useState(false);
    const [signClicked, setSignClicked] = useState(false);
    // const [fullName, setFullName] = useState('');
    const [checked, setChecked] = useState(false);
    // const [fullNameValid, setFullNameValid] = useState(true);
    const [showAuthErrorModal, setShowAuthErrorModal] = useState(false);

    // const handleCheckboxClick = (event) => {
    //     if (event.target.checked) {
    //         setOpen(true);
    //     } else {
    //         setChecked(false);
    //     }
    // };

    useEffect(() => {
        if(!fullName){
            console.log("handleModalSubmitInternal returned",fullNameValid );
            return;
        }
        if (fullNameValid) {
            console.log("handleModalSubmitInternal ",fullNameValid );
            setChecked(true);
            setOpen(false);
        } else {
            console.log("handleModalSubmitInternal else",fullNameValid );
            setChecked(false);
            setShowAuthErrorModal(true);
        }
    },[fullNameValid, signClicked]);

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
        setFormData(initialFormData);


    }, [contract.placeholders]);


    useEffect(() => {
        const isUserOwner = contract.userOwner?.email === user.email || contract.userOwner?.business.id === user.businessId;
        setChecked(isUserOwner ? contract.isSignedUser : contract.isSignedRecipient);
    }, [user]);



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
            // Update contract state
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

            <Box sx={{pt: "10px", pb: "10px", bgcolor:color}}>
                <Typography variant="h6" textAlign="center" component="h5">Contract Details</Typography>
            </Box>
            {/*<Divider sx={{marginTop: "10px", marginBottom: "10px"}}/>*/}

            <Box component="form"
                 sx={{
                     overflowY: "auto",
                     maxHeight: "80vh"
                 }}
            >
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
                                        sx={{bgcolor:alpha(color, 0.2)}}
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
                                    fullWidth
                                    sx={{bgcolor:alpha(color, 0.2)}}
                                />
                            </ListItem>
                        )}
                    </List>
                ))}
                <List>
                    <ListItem>
                        <ListItemText>
                            <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>Signatures</Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            label={defaultTemplate !== true || contract.userOwner?.email === user?.email || contract.userOwner?.business?.id === user?.businessId
                                ? "Owner Signature" : "Recipient Signature"}
                            control={<Checkbox checked={checked || false} onChange={handleCheckboxClick}/>}
                        />
                    </ListItem>
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
                                value={fullName}
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
                        <DialogActions sx={{display:"flex", justifyContent:"space-around", alignItems:"center"}}>
                            <Button
                                sx={{
                                    width:"100%",
                                    color:"white",
                                    backgroundColor:"rgb(185,67,102)",
                                    '&:focus,&:active,&:hover': {
                                        color:"white",
                                        backgroundColor:"rgb(185,67,102)"
                                    }
                                }}
                                onClick={() => handleModalClose(true)}>Cancel</Button>
                            <Button
                                sx={{
                                    width:"100%",
                                    color:"white",
                                    backgroundColor:darken(color, 0.55),
                                    '&:focus,&:active,&:hover': {
                                        color:"white",
                                        backgroundColor:darken(color, 0.55)
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
                                color:"white",
                                backgroundColor:darken(color, 0.5),
                                '&:focus,&:active,&:hover': {
                                    color:"white",
                                    backgroundColor:darken(color, 0.5)
                                }
                            }}
                                onClick={() => setShowAuthErrorModal(false)}>OK</Button>
                        </DialogActions>
                    </Dialog>
                    {/*<List>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemText>*/}
                    {/*            <Typography variant="subtitle1" sx={{fontWeight:"bold"}}>Signatures</Typography>*/}
                    {/*        </ListItemText>*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <TextField*/}
                    {/*            name={"ownerSignature"}*/}
                    {/*            label={"Owner Signature"}*/}
                    {/*            value={formData["ownerSignature"] || ''}*/}
                    {/*            onChange={handleChange}*/}
                    {/*            fullWidth*/}
                    {/*        />*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <TextField*/}
                    {/*            name={"recipientSignature"}*/}
                    {/*            label={"Recipient Signature"}*/}
                    {/*            value={formData["recipientSignature"] || ''}*/}
                    {/*            onChange={handleChange}*/}
                    {/*            fullWidth*/}
                    {/*        />*/}
                    {/*    </ListItem>*/}
                </List>
            </Box>
        </Stack>
    );
};

export default ContractEditSideBar;