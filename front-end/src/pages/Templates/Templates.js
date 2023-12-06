import {
    AppBar,
    Box,
    CssBaseline, Divider,
    Drawer,
    List,
    ListItem, ListItemButton,
    ListItemIcon,
    ListItemText, Stack,
    Toolbar,
    Typography
} from "@mui/material";
import {InboxIcon} from "@heroicons/react/20/solid";
import TemplateCard from "./TemplateCard";
import "./templates.css";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import TemplatePreviewModal from "./TemplatePreviewModal";
import UserContext from "../../hooks/UserProvider";




const Templates = () => {
    const {user } = useContext(UserContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [contracts, setContracts] = useState([]);
    const[filteredContracts, setFilteredContracts] = useState([]);
    const[contractData, setContractData] = useState({});
    const [selectedContractId, setSelectedContractId] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    const agreements = [
        { title: 'Asset Purchase Agreement', description: 'Outlines the terms of the sale and purchase of a company\'s assets.' },
        { title: 'Brand Licensing Agreement Template', description: 'Allows one party to use another\'s brand, logo, or name for a specified purpose.' },
        { title: 'Collaboration Agreement Template', description: 'A contract between parties to work together on a project or venture.' },
        { title: 'Data Use Agreement Template', description: 'Governs how data, particularly sensitive or proprietary, can be used and shared.' },
        { title: 'Lease', description: 'A contract conveying land, property, or services to another for a specified time against periodic payment.' },
        { title: 'Tenancy Agreement Template', description: 'A contract between a landlord and tenant outlining rental property terms and conditions.' },
        { title: 'Data Use Agreement Template', description: 'Governs how data, particularly sensitive or proprietary, can be used and shared.' },
        { title: 'Lease', description: 'A contract conveying land, property, or services to another for a specified time against periodic payment.' },
        { title: 'Tenancy Agreement Template', description: 'A contract between a landlord and tenant outlining rental property terms and conditions.' },
        { title: 'Data Use Agreement Template', description: 'Governs how data, particularly sensitive or proprietary, can be used and shared.' },
        { title: 'Lease', description: 'A contract conveying land, property, or services to another for a specified time against periodic payment.' },
        { title: 'Tenancy Agreement Template', description: 'A contract between a landlord and tenant outlining rental property terms and conditions.' },
    ];


    const softColors = [
        '#f8c6d1',
        '#a7c7e7',
        '#a8e6cf',
        '#d1c4e9',
        '#ffccaa',
        '#f6e8b1',
        '#87ceeb',
        '#88d8b0',
        '#f3e5f5',
        '#fffdd0'
    ];



    useEffect(() => {


       fetchTemplates();
    },[]);


    useEffect(() => {
        if(selectedContractId === null){
            return;
        }
        previewContract();
    },[selectedContractId]);

    const fetchTemplates= ()=>{

       axios.get(`https://contract-system-5c4e51349d5b.herokuapp.com/api/templates/default`, {
           headers: {
               'Authorization': `Bearer ${user.token}`
           }
       })
            .then(res => res.data.content)
           .then(data => {
               setContracts(data);
               setFilteredContracts(data)
               // console.log(data);
           })
            .catch(error => console.error(error));
    }


    const previewContract = () => {

        axios.get(`https://contract-system-5c4e51349d5b.herokuapp.com/api/templates/default/${selectedContractId}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.data)
            .then(data => {
                setContractData(data);
                setModalOpen(true);
                setSelectedContractId(null);
            }).catch(error => console.error(error));
    };


    const handleFilter = (text) => {
        if(text === "ALL"){
            fetchTemplates();
            return;
        }
        setContracts(filteredContracts.filter(contract => contract.type === text));
    }

    return (
        <div style={{padding:"40px"}}>
        <Box sx={{display: "grid", placeItems:"center", height: `calc(100% - 1px)`, position: "fixed", ml:{xs:"0px", md:"80px"} }}>
                <List sx = {{display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent: "center"
                }}>
                    {['All', 'Commercial', 'HR', 'Confidentiality', 'Lease', 'Other'].map((text, index) => (
                        <ListItem key={text}>
                            <ListItemButton
                                onClick={() => handleFilter(text.toUpperCase())}
                                sx={{backdropFilter: 'blur(25px)',
                                    backgroundColor: 'rgba(255,255,255,0.47)',
                                    border: "1px solid black",
                                    borderRadius: "25px",
                                    textAlign:"center",
                                    // "&:hover": {
                                    //     backdropFilter:"",
                                    //     backgroundColor: "rgb(59, 61, 145, 0.2)"
                                    // },
                                    // "&:active, &:focus": {
                                    //     backdropFilter:"",
                                    //     backgroundColor: "rgb(59, 61, 145, 0.4)"
                                    // }
                                }}
                            >
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
        </Box>
        <Box
         sx={{minHeight:"100vh"}}
        >
            {/*<TemplateHeading/>*/}
            <Box
                sx={{
                    display:"grid",
                    placeItems:"center",
                    width:"75%",
                    margin:"auto",
                }}
            >
                <Typography textAlign="center"
                            className="templateHeading"
                >
                    Choose a template to get started or preview.
                </Typography>
            </Box>
            <Box component="main" sx={{
                p: 3,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'start',
                gap: 4,
                marginLeft: { xs: "120px", md: "300px" }
            }}>
                {contracts.map((contract, index) => (
                    <TemplateCard
                        key={index}
                        title={contract.name}
                        description={contract.description}
                        color={softColors[index % softColors.length]}
                        contractId={contract.id}
                        setContractId={setSelectedContractId}
                        setColor={setSelectedColor}
                    />
                ))}
            </Box>
        </Box>
            <TemplatePreviewModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                data={contractData}
                color={selectedColor}
            />
        </div>
    );
};

export default Templates;