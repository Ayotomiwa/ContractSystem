import {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {Box, Button, Card, Container, darken, Divider, IconButton, Stack, SvgIcon, Typography} from '@mui/material';
import { useSelection } from '../../hooks/UseSelection';
import { Layout as DashboardLayout } from '../../components/Layout';
import { SearchBar } from '../../components/SearchBar';
import { applyPagination } from '../../utils/apply-pagination';
import axios from "axios";
import UserContext from "../../hooks/UserProvider";
import {generateRandomAvatar} from "../../utils/avatarUtils";
import {Link as RouterLink} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';

import Skeleton from '@mui/material/Skeleton';
import {ContractsTable} from "./ContractsTable";
import {PagesTable} from "../../components/PagesTable";
import ContractFilterButtons from "./ContractFilterButtons";
import {alpha} from "@mui/material/styles";




const ContractsOverview = () => {
    const {user} = useContext(UserContext);
    const [contracts, setContracts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalContracts, setTotalContracts] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState(false);
    const userId = user?.id;
    console.log("userId: ", userId);
    const basicContractUrl = `https://contract-system-5c4e51349d5b.herokuapp.com/api/contracts/${userId}`;
    const fetchContractUrl = `size=${rowsPerPage}&page=${page}`;
    const searchContractUrl = basicContractUrl + `/search?query=${searchTerm}`;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);
    const display =useRef("");


    useEffect(() => {
        setIsLoading(true);
    }, [rowsPerPage]);





    useEffect(() => {

        if (!user) {
            return
        }

        if (search === false || searchTerm === "") {
            setContracts([]);
            fetchContracts();
        } else if (search === true && searchTerm !== "") {
            if (page === 0) {
                setContracts([]);
            }
            fetchSearchData();
        }
    }, [user, page, rowsPerPage, searchTerm, search]);


    const fetchContracts = () => {
        // if (user) {
        // axios.get(`http://localhost:8080/api/clients/business/${user.business.id}`)
        axios.get(basicContractUrl + "?" + fetchContractUrl, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(response => {
                processContractsData(response.data);
                setIsLoading(false);
                // const clientWithAvatars = response.data.content.map((client) => ({
                //     ...client,
                //         avatar: generateRandomAvatar()
                // }));

            })
            .catch(error => {
                console.error("Error fetching contracts:", error);
                setIsLoading(false);
            });
    }

    const stagesColor = {
        "ALL": darken("#a8e6cf", 0.1),
        "DRAFT": darken("#a7c7e7", 0.1),
        "EXPIRED": darken("#f8c6d1", 0.1),
        "REVIEWED": darken("#d1c4e9", 0.1),
        "SIGNED": darken("#88d8b0",0.1),
        "ATTENTION": darken("#ffccaa",0.1),
        "SENT": darken("#87ceeb", 0.1)
    }


    const fetchSearchData = () => {
        setIsLoading(true);
        axios.get(searchContractUrl + "&" + fetchContractUrl, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(response => {
                processContractsData(response.data);
                setIsLoading(false);
                // const clientWithAvatars = response.data.content.map((client) => ({
                //     ...client,
                //         avatar: generateRandomAvatar()
                // }));

            })
            .catch(error => {
                console.error("Error fetching contracts:", error);
                setIsLoading(false);
            });
    }

    const handleDelete = (event) => {
        event.preventDefault();
        deleteContract()
    }


    const deleteContract = () =>
    {
        axios.post(`https://contract-system-5c4e51349d5b.herokuapp.com/api/contracts/delete/${selectedContractId}`, {},{
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then((res) => res.status)
            .then((status)=>{
                if(status === 200){
                    setContracts(prevClients => prevClients.filter(client => client.id !== selectedContractId));
                }
            }).
        catch((error) => {
            console.log(error);
        })
    }


    const processContractsData = (data) => {
        const modified = data.content.map((contract) => ({
            ...contract,
            owner: contract.userOwner.id === userId ? "ME" :  contract.userOwner.email,
        }));
        setContracts(modified);
        setTotalContracts(data.totalElements);
    }


    const resetContractsList = (value) => {
        // setExams([]);
        setTotalContracts(0);
        setPage(0);
        setSearch(value);
    }


    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };


    const handleEdit = (itemId, businessId) =>{
        window.location.href = `/contract/edit?contractId=${itemId}&color=${encodeURIComponent('#d1c4e9')}&default=${false}`;
    }


    const contractIds = useMemo(() => contracts.map((customer) => customer.id), [contracts]);

    const contractSelection = useSelection(contractIds);

    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                    marginLeft: "50px",
                    marginRight: "50px",
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Contracts
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                </Stack>
                            </Stack>
                            <div>
                                <Button
                                   onClick={() => window.location.href = "/templates"}
                                    startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PlusIcon/>
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        backgroundColor: "rgb(99, 102, 241)", fontSize: "1.2rem", color: "white",
                                        width: "100%", height: "50px", borderRadius: "10px",
                                        '&:hover, &:focus, &:active': {
                                            backgroundColor: "rgb(99, 102, 241)"
                                            // backgroundColor: "#e75480",
                                        }
                                    }}
                                >
                                    New Contract
                                </Button>
                            </div>
                        </Stack>
                        <Card elevation={10} sx={{p: 2}}>
                            <Stack direction="row"
                                   justifyContent="space-between"
                                   alignItems="center"
                                   spacing={4}
                            >

                                <SearchBar setSearchTerm={setSearchTerm} resetList={resetContractsList}
                                placeHolder="Search Contracts"
                                />
                                <IconButton
                                    color="red"
                                    onClick={handleDelete}
                                >
                                    <SvgIcon sx={{fontSize: "40px"}}>
                                        <TrashIcon color="rgb(185,67,102)"/>
                                    </SvgIcon>
                                </IconButton>
                            </Stack>
                            <Box sx={{mt:"30px"}}>
                                <Divider />
                            </Box>
                            <Box sx={{m:"10px"}}>
                                <ContractFilterButtons setSearchTerm={setSearchTerm} resetList={resetContractsList}/>
                            </Box>
                        </Card>
                        {/*<Card >*/}
                        {/*   */}
                        {/*</Card>*/}
                        <PagesTable
                            count={totalContracts}
                            items={contracts}
                            onDeselectAll={contractSelection.handleDeselectAll}
                            onDeselectOne={contractSelection.handleDeselectOne}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectAll={contractSelection.handleSelectAll}
                            onSelectOne={contractSelection.handleSelectOne}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            selected={contractSelection.selected}
                            isLoading={isLoading}
                            setItemsId={setSelectedContractId}
                            columnHeaders={{
                                "Name": "name",
                                "Recipient": "recipient.email",
                                "Business":"recipient.business.companyName",
                                "Owner":"owner",
                                "Created Date":"createdAt",
                                "Last Updated":"modifiedAt",
                                "Status": "ownerStage"
                            }}
                            handleEdit={handleEdit}
                            stagesColor={stagesColor}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default ContractsOverview;
