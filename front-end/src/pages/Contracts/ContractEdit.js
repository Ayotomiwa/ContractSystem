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
    const[contractSaved, setContractSaved] = useState(false)
    const[contractSent, setContractSent]= useState(false);
    // const[checked, setChecked] = useState(false);
    const [recipientEditData, setRecipientEditData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        business:{
            companyName:""
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
        fetchContract().then(r => console.log("Contract fetched"));

    }, [contractId]);


    const fetchDefaultTemplate = () => {
        axios.get(`https://contract-system-5c4e51349d5b.herokuapp.com/api/templates/default/${contractId}`)
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


    const fetchContract = async () => {
        axios.get(`https://contract-system-5c4e51349d5b.herokuapp.com/api/contracts/${contractId}/edit`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.data)
            .then(data => {
                setContract(data);
                console.log("contract", data);
                console.log("Contract Recipient: ", data.recipient);
                setRecipientDetails(data.recipient, data.message)
                setIsLoading(false)
                console.log("Contract fetched");
                console.log(data);
            }).catch(error => console.error(error));
    }



    const setRecipientDetails = (recipient, message) => {
        setRecipientEditData({
            ...recipientEditData,
            email: recipient.email,
            firstName: recipient.firstName,
            lastName: recipient.lastName,
            business: {
                companyName: recipient.business.companyName,
            },
            message: message,
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
            "id": defaultTemplate && defaultTemplate === true? null : contract.id,
            "name": contract?.name,
            "placeholders": contract?.placeholders,
            "template": defaultTemplate === true? contract.id : contract?.templateId,
            "data": contract?.data,
            "userOwner":{
                "id": user?.id,
                "business":{
                    "id": user?.businessId,
                }
            },
            "message": recipientEditData.message,
            "recipient":recipientEditData,
            "signedUser": contract?.signedUser,
            "signedRecipient": contract?.signedRecipient,
        }
        axios.post(`https://contract-system-5c4e51349d5b.herokuapp.com/api/contracts/${user.id}`, contractEditData, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.status)
            .then(status => {
                if(status === 200){
                    setContractSaved(true);
                    console.log("CONTRACT SAVED");
                }
            }).catch(error => console.error(error));
    }


    const handleSend = () => {
        if(!userId){
            return;
        }
        // if(contract.isSignedUser === false){
        //   setChecked(true);
        // }
        const contractEditData = {
            "name": defaultTemplate && defaultTemplate === true? contract.name : contract.data?.title,
            "placeholders": contract?.placeholders,
            "templateId":defaultTemplate === true? contract.id : contract?.templateId,
            "data": contract?.data,
            "userOwner":{
                "id": user?.id,
                "business":{
                    "id": user?.businessId,
                }
            },
            message: recipientEditData.message,
            "recipient":recipientEditData,
            "signedUser": contract.signedUser,
            "signedRecipient": contract.signedRecipient,
        }
        console.log("ContractEditData: signedUser ", contractEditData.signedUser);
        axios.post(`https://contract-system-5c4e51349d5b.herokuapp.com/api/contracts/${user.id}/send`, contractEditData, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.status)
            .then(status => {
                 if(status === 200){
                     setContractSent(true);
                 }
            }).catch(error => console.error(error));
    }


    const handleRecipientAction = () => {
        console.log("signing")
        if(!userId){
            return;
        }
        axios.post(`https://contract-system-5c4e51349d5b.herokuapp.com/api/inbox/${contractId}/SIGNED`, {},{
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.status)
            .then(status => {
                if(status === 200){
                    setContractSaved(true);
                    console.log("CONTRACT SAVED");
                }
            }).catch(error => console.error(error));
    }





    const handleCancel = () => {
        if(defaultTemplate === true){
            window.location.href = "/templates"
            return;
        }
        window.location.href = "/contracts"
    }



    const hexToRGBA = (hex, alpha = 1) => {
        const r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };


    if (isLoading) {
        return <div style={{display:"grid",placeItems:"center"}}>Loading...</div>;
    }



    const handleUserSignature = (isAuthorized) => {
        setContract(prevContract => ({
            ...prevContract,
            signedUser: isAuthorized
        }));
    };

    const handleRecipientSignature = (isAuthorized) => {
        setContract(prevContract => ({
            ...prevContract,
            signedRecipient: isAuthorized
        }));
    };


    const handleModalSubmit = () => {
        const isUserOwner = (!contract.userOwner && defaultTemplate !== true) || user.id === contract.userOwner?.id || user.businessId === contract.userOwner?.business?.id;
        let isAuthorized =`${user.firstName} ${user.lastName}` === fullName;


        if (isAuthorized) {
            const updatedContract = {
                ...contract,
                signedUser: isUserOwner ? true : contract.signedUser,
                signedRecipient: isUserOwner ? contract.signedRecipient : true
            };
            setContract(updatedContract);
            console.log("updatedContract: ", updatedContract);
        }


        setOpen(false);
        setFullNameValid(isAuthorized);
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
                    contractSent={contractSent}
                    contractSaved={contractSaved}
                    // signChecked={checked}
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
                    contract={contract}
                    defaultTemplate={defaultTemplate}
                    handleSave={handleSave}
                    handleSend={handleSend}
                    handleCancel={handleCancel}
                    recipientEditData ={recipientEditData}
                    setRecipientEditData={setRecipientEditData}
                    color={color || '#d1c4e9'}
                    contractSaved={contractSaved}
                    contractSent={contractSent}
                    handleRecipientAction={handleRecipientAction}
                />
            </Box>
        </Paper>
    )
}

export default ContractEdit;