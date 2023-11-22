import {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {Box, Button, Card, Container, IconButton, Stack, SvgIcon, Typography} from '@mui/material';
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




const ContractsOverview = () => {
    const {user} = useContext(UserContext);
    const [contracts, setContracts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalContracts, setTotalContracts] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState(false);
    const businessId = "65523e0a91702e609ee9040b"
    const basicContractUrl = `http://localhost:8080/api/business/${businessId}/clients`;
    const fetchContractUrl = `size=${rowsPerPage}&page=${page}`;
    const searchContractUrl = basicContractUrl + `/search?query=${searchTerm}`;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);
    const display =useRef("");


    useEffect(() => {
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
        axios.get(basicContractUrl + "?" + fetchContractUrl)
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

    // const useCustomers = (page, rowsPerPage) => {
    //     return useMemo(
    //         () => {
    //             return applyPagination(contracts, page, rowsPerPage);
    //         },
    //         [page, rowsPerPage]
    //     );
    // };


    const fetchSearchData = () => {
        setIsLoading(true);
        axios.get(searchContractUrl + "&" + fetchContractUrl)
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
        axios.get(`http://localhost:8080/api/business/delete/${selectedContractId}`)
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
        const clientWithAvatars = data.content.map((client) => ({
            ...client,
            avatar: generateRandomAvatar()
        }));
        setContracts(clientWithAvatars);
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
                                    component={RouterLink}
                                    to={`/clients/edit?businessId=${businessId}`}
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

                                <SearchBar setSearchTerm={setSearchTerm} resetList={resetContractsList}/>
                                <IconButton
                                    color="red"
                                    onClick={handleDelete}
                                >
                                    <SvgIcon sx={{fontSize: "40px"}}>
                                        <TrashIcon color="rgb(185,67,102)"/>
                                    </SvgIcon>
                                </IconButton>
                            </Stack>

                        </Card>
                        <ContractsTable
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
                            businessId={businessId}
                            setContractsId={setSelectedContractId}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default ContractsOverview;
