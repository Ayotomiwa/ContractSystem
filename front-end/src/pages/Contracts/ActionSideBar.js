import {Autocomplete, Box, Button, darken, List, ListItem, Stack, TextField, Typography} from "@mui/material";
import axios from "axios";
import {useContext, useEffect, useState} from "react";

import UserContext from "../../hooks/UserProvider";
import {alpha} from "@mui/material/styles";
import ContractDetails from "./ContractDetails";

const ActionSideBar = ({
                           contract,
                           defaultTemplate,
                           handleSave,
                           handleSend,
                           handleCancel,
                           recipientEditData,
                           setRecipientEditData,
                           color,
                           contractSaved,
                           handleRecipientAction,
                           contractSent
                       }) => {
    const [clients, setClients] = useState([]);
    const [clientByEmail, setClientByEmail] = useState(null);
    const [clientByBusinessName, setClientByBusinessName] = useState(null);
    const {user} = useContext(UserContext);
    const businessId = user?.businessId ? user.businessId : null;
    const [isUserOwner, setIsUserOwner] = useState(true);
    const allowedStatus = ["DRAFT"];
    const negativeStatus = ["DECLINED", "REJECTED"]
    const [action, setAction] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        message: "",
        businessName: "",
    });


    useEffect(() => {
        fetchClients();
    }, [businessId]);


    useEffect(() => {
        (!contract.userOwner && defaultTemplate !== true) || contract.userOwner?.email === user?.email || contract.userOwner?.business?.id === user?.businessId ? setIsUserOwner(true) : setIsUserOwner(false);

        const emailClient = getClientByEmail(recipientEditData.email);
        const businessClient = getFirstClientByBusinessName(recipientEditData.companyName);
        setFormData({
            ...formData,
            email: recipientEditData.email,
            name: recipientEditData.firstName + " " + recipientEditData.lastName,
            message: recipientEditData.message,
            businessName: recipientEditData.business.companyName,
        })

        setClientByEmail(emailClient ? {...emailClient} : recipientEditData?.email);
        setClientByBusinessName(businessClient ? {...businessClient} : recipientEditData?.business?.companyName);
    }, []);


    useEffect(() => {
        console.log("Action Side Bar: useffect action");
        if (recipientEditData.email === formData.email &&
            recipientEditData.firstName + " " + recipientEditData.lastName === formData.name &&
            recipientEditData.business.companyName === formData.businessName &&
            recipientEditData.message === formData.message) {
            if (action === "save") {
                handleSave();
            } else if (action === "send") {
                console.log(recipientEditData);
                console.log("Form Data")
                console.log(formData)
                handleSend();
            }
        }
    }, [action]);


    const saveRecipientDetails = () => {
        setRecipientEditData({
            ...recipientEditData,
            email: formData.email,
            firstName: formData.name.split(" ")[0],
            lastName: formData.name.split(" ")[1],
            business: {
                companyName: formData.businessName,
            },
            message: formData.message,
        });
    }


    const handlePreSave = (event) => {
        saveRecipientDetails();
        setAction("save");
    }


    const handlePreSend = () => {
        console.log("Presending")
        saveRecipientDetails();
        setAction("send");
    }


    const fetchClients = () => {
        if (!businessId) {
            return;
        }
        axios.get(`https://contract-system-5c4e51349d5b.herokuapp.com/api/business/${businessId}/clients/list`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.data)
            .then(data => {
                setClients(data);
                console.log(data);
            }).catch(error => console.error(error));
    };

    const handleAutocompleteChange = (name, value) => {
        if (name === 'businessName' && value) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                businessName: value.userRecipient.business.companyName,
                email: value.userRecipient.email,
                name: value.userRecipient.firstName + " " + value.userRecipient.lastName,
            }));
            setClientByEmail(value.userRecipient.email);
        } else if (name === 'email' && value) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                email: value.userRecipient.email,
                name: value.userRecipient.firstName + " " + value.userRecipient.lastName,
                businessName: value.userRecipient.business?.companyName,
            }));
            setClientByBusinessName(value.userRecipient.business?.companyName);
        } else if (name === 'email' && !value) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                email: "",
                name: "",
                businessName: "",
            }));
        }
    };


    const getClientByEmail = (email) => {

        return clients.find((client) => client.userRecipient.email === email) || null;
    }

    const getFirstClientByBusinessName = (businessName) => {
        const uniqueClients = Array.from(new Set(clients.map(client => client.userRecipient.business?.companyName)))
            .map(uniqueCompanyName => {
                return clients.find((client) => client.userRecipient.business?.companyName === uniqueCompanyName);
            });
        return uniqueClients.find((client) => client.userRecipient.business?.companyName === businessName) || null;

    }


    return (
        <Stack direction="column" sx={{width: "100%", height: "100%"}}>
            <Box sx={{pt: "10px", pb: "10px", bgcolor: color}}>
                <Typography variant="h6" textAlign="center"
                            component="h5">{ defaultTemplate !== "true" && (isUserOwner && (contract.signedRecipient || negativeStatus.includes(contract.recipientStage)
                || !allowedStatus.includes(contract.ownerStage)))
                || !isUserOwner ? "Contract Info" : "Recipient Details"} </Typography>
            </Box>

            {defaultTemplate !== "true" && (isUserOwner && (contract.signedRecipient || negativeStatus.includes(contract.recipientStage)
                || !allowedStatus.includes(contract.ownerStage)))
            || !isUserOwner ? (
                <ContractDetails contract={contract}/>
            ) : (
                <Box>
                <List sx={{width: "100%"}}>
                    <ListItem>
                        <Autocomplete
                            freeSolo
                            options={clients}
                            getOptionLabel={(option) => option?.userRecipient?.email ? option.userRecipient.email : option}
                            onChange={(event, value) => handleAutocompleteChange("email", value)}
                            value={clientByEmail}
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    variant="outlined"
                                    disabled={contractSent || contractSaved}
                                    sx={{bgcolor: alpha(color, 0.2)}}
                                />
                            )}
                        />
                    </ListItem>
                    {/*<ListItem sx={{mb:"-10px"}}>*/}
                    {/*    <ListItemText primary="Recipient Name"/>*/}
                    {/*</ListItem>*/}
                    <ListItem>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                });
                            }}
                            required
                            value={formData.name}
                            disabled={contractSent || contractSaved}
                            variant="outlined"
                            sx={{bgcolor: alpha(color, 0.2)}}
                        />
                    </ListItem>
                    {/*<ListItem sx={{mb:"-10px"}}>*/}
                    {/*    <ListItemText primary="Message"/>*/}
                    {/*</ListItem>*/}


                    <ListItem>
                        <Autocomplete
                            freeSolo
                            options={clients}
                            getOptionLabel={(option) => option?.userRecipient?.business?.companyName ? option.userRecipient.business.companyName : option}
                            onChange={(event, value) => handleAutocompleteChange("businessName", value)}
                            value={clientByBusinessName}
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                    {...params}

                                    label="Company Name"
                                    name="businessName"
                                    required
                                    disabled={contractSent || contractSaved}
                                    value={formData.businessName}
                                    variant="outlined"
                                    sx={{bgcolor: alpha(color, 0.2)}}
                                />
                            )}
                        />
                    </ListItem>
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
                            value={formData.message}
                            // variant="outlined"
                            multiline
                            disabled={contractSent || contractSaved}
                            minRows={4}
                            maxRows={4}
                            sx={{bgcolor: alpha(color, 0.2), overflowY: "auto"}}
                        />
                    </ListItem>
                </List>
                    {(!contractSaved && !contractSent) &&(
                    <Box sx={{mt: "40px"}}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            gap: 3,
                            p: 3
                        }}>
                            <Button variant="contained" onClick={handlePreSave} sx={{
                                width: "100%",
                                color: "white",
                                backgroundColor: darken(color, 0.55),
                                '&:focus,&:active,&:hover': {
                                    color: "white",
                                    backgroundColor: darken(color, 0.55),
                                }
                            }}>
                                Save
                            </Button>

                            <Button variant="contained" onClick={handleCancel} sx={{
                                width: "100%",
                                backgroundColor: "rgb(185,67,102)",
                                '&:focus,&:active,&:hover': {
                                    backgroundColor: "rgb(185,67,102)"
                                }
                            }}>
                                Cancel
                            </Button>
                        </Box>
                        <Box sx={{
                            display: "flex", justifyContent: "center", alignItems: "center",
                            mt: "50px",
                            maxWidth: "100%",
                            flexGrow: 1,
                        }}>
                            <Button variant="contained" onClick={handlePreSend} sx={{
                                color: "white",
                                backgroundColor: darken(color, 0.55),
                                '&:focus,&:active,&:hover': {
                                    color: "white",
                                    backgroundColor: darken(color, 0.55)
                                }
                            }}>
                                Save & Send11
                            </Button>
                        </Box>
                    </Box>
                        )}
                </Box>
            )}

                    <div style={{display:"flex", flexDirection:"column", marginTop:"50px", padding:3, gap:3 }}>
                        {(!isUserOwner && !contractSaved && contract.recipientStage !== "SIGNED"  && (
                        <Button variant="contained" onClick={handleRecipientAction} sx={{
                            width: "100%",
                            color: "white",
                            backgroundColor: darken(color, 0.55),
                            '&:focus,&:active,&:hover': {
                                color: "white",
                                backgroundColor: darken(color, 0.55),
                            }
                        }}>
                            Save & Send
                        </Button>
                        ))}

                        {(contractSent || contractSaved || !isUserOwner || (contract.recipient && contract.ownerStage !=="DRAFT")) &&  (
                        <Button variant="contained" onClick={handleCancel} sx={{
                            width: "100%",
                            backgroundColor: "rgb(185,67,102)",
                            '&:focus,&:active,&:hover': {
                                backgroundColor: "rgb(185,67,102)"
                            }
                        }}>
                            Go Back
                        </Button>
                            )}
                    </div>
        </Stack>
    )


}


export default ActionSideBar;