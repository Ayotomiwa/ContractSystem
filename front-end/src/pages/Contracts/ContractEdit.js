import {useLocation, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import ContractPaper from "../../components/ContractPaper";
import {Box, Card, CardContent, CardHeader, Divider, Paper} from "@mui/material";
import ContractEditSideBar from "./ContractEditSideBar";
import ActionSideBar from "./ActionSideBar";
import UserContext from "../../hooks/UserProvider";



const ContractEdit = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const contractId = queryParams.get('contractId');
    const color = decodeURIComponent(queryParams.get('color'));
    const defaultTemplate = queryParams.get('default');
    const {user} = useContext(UserContext);
    const userId = user?.id;
    const [contract, setContract] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [placeholder, setPlaceholder] = useState({});
    const [editingPlaceholder, setEditingPlaceholder] = useState(null);
    const [open, setOpen] = useState(false);
    const [fullName, setFullName] = useState("");
    const[fullNameValid, setFullNameValid] = useState(true);
    const [recipientEditData, setRecipientEditData] = useState({
        "firstName":"",
        "lastName":"",
        "email":"",
        business:{
            "companyName":"Barclays"
        },
        message:""
    });



    useEffect(() => {
        console.log("ContractEdit.js: ", contractId + "CCC" + color + " DDD" + defaultTemplate);
        if(defaultTemplate === "true"){
            console.log("DEFAULT TEMPLATE", defaultTemplate)
            fetchDefaultTemplate();
            return;
        }
        console.log("CONTRACT TEMPLATE")
        fetchContract()

    }, []);


    const fetchDefaultTemplate = () => {
        axios.get(`http://localhost:8080/api/templates/default/${contractId}`)
            .then(res => res.data)
            .then(data => {
                setContract(data);
                setPlaceholder(data.placeholders);
                // console.log(data.placeholders);
                setIsLoading(false);
                // console.log("default fetched");
                // console.log(data);
            }).catch(error => console.error(error));
    }


    const fetchContract = () => {
        axios.get(`http://localhost:8080/api/contracts/${contractId}/edit`)
            .then(res => res.data)
            .then(data => {
                setContract(data);
                setRecipientDetails(data.recipient)
                setIsLoading(false)
                console.log("Contract fetched");
                console.log(data);
            }).catch(error => console.error(error));
    }



    const setRecipientDetails = (recipient) => {
        setRecipientEditData({
            ...recipientEditData,
            email: recipient.email,
            firstName: recipient.firstName,
            lastName: recipient.lastName,
            business: {
                "companyName": recipient.business.companyName,
            },
            // message: formData.message,
        });
    }


    const handleSave = () => {
        console.log("User: ", user);
        console.log("Saving")
        if(!userId){
            console.log("User not found in contractEdit")
            return
        }

        const contractEditData = {
            "name": "",
            "placeholders": contract?.placeholders,
            "template": contract?.id,
            "contract": contract?.data,
            "userOwner":{
                "id": user?.id,
                business:{
                    "id": user?.businessId,
                }
            },
            "recipient" : {
                "id": null,
                "firstName": recipientEditData.firstName,
                "lastName" : recipientEditData.lastName,
                "email": recipientEditData.email,
                business:{
                    companyName: recipientEditData.companyName
                }
            },
            "isSignedUser": contract?.isSignedUser,
            "isSignedRecipient": contract?.isSignedRecipient,
        }
        axios.post(`http://localhost:8080/api/contracts/${user.id}`, contractEditData)
            .then(res => res.data)
            .then(data => {
                console.log(data);
            }).catch(error => console.error(error));
    }



    const handleSend = () => {
        if(!userId){
            return;
        }

        const contractEditData = {
            "name": contract?.data?.name,
            "placeholders": contract?.placeholders,
            "template": contract?.id,
            "data": contract?.data,
            "userOwner":{
                "id": user?.id,
                business:{
                    "id": user?.businessId,
                }
            },
            "recipient":recipientEditData,
            "isSignedUser": contract.isSignedUser,
            "isSignedRecipient": contract.isSignedRecipient,
        }
        axios.post(`http://localhost:8080/api/contracts/${user.id}/send`, contractEditData)
            .then(res => res.data)
            .then(data => {
                console.log(data);
            }).catch(error => console.error(error));
    }

    const handleCancel = () => {
        window.location.href = "/templates"
    }



    const hexToRGBA = (hex, alpha = 1) => {
        const r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };


    if (isLoading) {
        return <div>Loading...</div>; // Render a loading indicator
    }

    const handleModalSubmit = () => {

        if ((!contract.userOwner && !contract.recipient) || user.id === contract.userOwner.id
            || user.businessId === contract.userOwner.business.id) {
            console.log("In user Signature")
            console.log("New Contract?", !contract.userOwner && !contract.recipient)
            const userFullName = `${user.firstName} ${user.lastName}`;
            console.log("User Full Name: ", userFullName);
            console.log("Full Name: ", fullName);
            if (userFullName === fullName) {
                setContract(prevContract => ({...prevContract, isSignedUser: true}));
                if(defaultTemplate === "true" && !contract.userOwner){
                    console.log("Setting user owner")
                    console.log(user)
                    setContract(prevContract => ({...prevContract, userOwner: user}));
                }
                setFullNameValid(true);
            } else {
                console.log("You are not authorized to sign as the Owner of this contract");
                setContract(prevContract => ({...prevContract, isSignedUser: false}));
                // if(defaultTemplate === "true" && !contract.userOwner){
                //     setContract(prevContract => ({...prevContract, userOwner: ""}));
                // }
                setFullNameValid(false);
            }
        } else if ((user.id === contract.recipient.id) || (user.businessId === contract.recipient.business.id)) {
            const recipientFullName = `${recipientEditData.firstName} ${recipientEditData.lastName}`;
            if (recipientFullName === fullName) {
                setContract(prevContract => ({...prevContract, isSignedRecipient: true}));
                setFullNameValid(true);
            } else {
                console.log("You are not authorized to sign as the Recipient of this contract");
                setContract(prevContract => ({...prevContract, isSignedUser: false}));
                setFullNameValid(false);
            }
        } else {
            console.log("You are not authorized to sign this contract");
            setContract(prevContract => ({...prevContract, isSignedUser: false}));
            setFullNameValid(false);
        }
        setOpen(false);
    };



    return (
        <Paper
            sx={{display:"flex",
                flexDirection:"row",
                // justifyContent:"space-between",
                maxWidth:"100%",
                height:`calc(100dvh - 60px)`,
                maxHeight:`calc(100dvh - 60px)`,
                overflowY:"hidden",
                overflowX:"hidden",
                margin:"0 auto",
                // border:"2px solid blue"
                 }}

        >

            <Box sx={{width:"20%", borderRight:"0.2px gray solid"}}>
                <ContractEditSideBar
                    contract={contract}
                    setContract={setContract}
                    setEditingPlaceholder={setEditingPlaceholder}
                    handleModalSubmit={handleModalSubmit}
                    setFullName={setFullName}
                    fullName={fullName}
                    fullNameValid={fullNameValid}
                    color={color || '#d1c4e9'}
                    defaultTemplate ={defaultTemplate}
                />
            </Box>

        <Paper sx={{
            display: "grid",
            placeItems:"center",
            backgroundColor:hexToRGBA(color, 0.4),
            // filter: "brightness(80%)",
            paddingTop:"50px",
            paddingBottom:"50px",
            overflowY:"auto",
            maxHeight:"80vh",
            width:"60%",
           }}>
            <Box width="90%">
                <ContractPaper data={contract} color={color} editingPlaceholder={editingPlaceholder}/>
            </Box>
        </Paper>
            <Box sx={{width:"20%", borderLeft:"0.2px gray solid"}}>
                <ActionSideBar
                    handleSave={handleSave}
                    handleSend={handleSend}
                    handleCancel={handleCancel}
                    recipientEditData ={recipientEditData}
                    setRecipientEditData={setRecipientEditData}
                    color={color || '#d1c4e9'}
                />
            </Box>
        </Paper>
    )
}

export default ContractEdit;