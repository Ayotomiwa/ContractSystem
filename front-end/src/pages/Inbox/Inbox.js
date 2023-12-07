import {useContext, useEffect, useMemo, useRef, useState} from 'react';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {Box, Button, Card, Container, darken, Divider, IconButton, Stack, SvgIcon, Typography} from '@mui/material';
import {useSelection} from '../../hooks/UseSelection';
import {SearchBar} from '../../components/SearchBar';
import axios from "axios";
import UserContext from "../../hooks/UserProvider";
import {generateRandomAvatar} from "../../utils/avatarUtils";
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';

import {PagesTable} from "../../components/PagesTable";
import InboxFilterButtons from "./InboxFilterButtons";
import {CheckIcon, NoSymbolIcon} from "@heroicons/react/20/solid";
import {alpha} from "@mui/material/styles";
import {dark} from "@mui/material/styles/createPalette";


const Inbox = () => {
    const {user} = useContext(UserContext);
    const [contracts, setContracts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalContracts, setTotalContracts] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState(false);
    const userId = user?.id;
    const basicContractUrl = `https://contract-system-5c4e51349d5b.herokuapp.com/api/inbox/${userId}`;
    // const basicContractUrl = `http://localhost:8080/api/inbox/${userId}`;
    const fetchContractUrl = `size=${rowsPerPage}&page=${page}`;
    const searchContractUrl = basicContractUrl + `/search?query=${searchTerm}`;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);
    const [contractId, setContractId] = useState(null);
    const display = useRef("");


    useEffect(() => {
        setIsLoading(true);
    }, [rowsPerPage]);

    useEffect(() => {
        if (!contractId) {
            return;
        }
        window.location.href = `/contract/edit?contractId=${contractId}&color=${encodeURIComponent('#d1c4e9')}&default=${false}`;
    }, [contractId]);


    useEffect(() => {
        if (!user) {
            return;
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
            }
        ).then(response => {
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
        "DECLINED": darken("#f8c6d1", 0.1),
        "SIGNED": darken("#88d8b0",0.1),
        "ATTENTION": darken("#ffccaa",0.1),
        "UNREAD": alpha("#87ceeb", 0.1)
    }

    const fetchSearchData = () => {
        setIsLoading(true);
        axios.get(searchContractUrl + "&" + fetchContractUrl, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }
        ).then(response => {
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


    const fetchInboxData = (itemId) => {
        // axios.get(`http://localhost:8080/api/inbox/${itemId}/contract`, {
        axios.get(`https://contract-system-5c4e51349d5b.herokuapp.com/api/inbox/${itemId}/contract`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.data)
            .then(res => setContractId(res.contractId))
            .catch(error => console.error(error));
    }

    const handleDelete = (event) => {
        event.preventDefault();
        deleteContract()
    }

    const handleEdit = (itemId) => {
        fetchInboxData(itemId);

    }

    const deleteContract = () => {
        axios.post(`http://localhost:8080/api/delete/${selectedContractId}`, {}, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then((res) => res.status)
            .then((status) => {
                if (status === 200) {
                    setContracts(prevClients => prevClients.filter(client => client.id !== selectedContractId));
                }
            }).catch((error) => {
            console.log(error);
        })
    }


    const handleStatus = (status) => {

        // axios.post(`http://localhost:8080/api/inbox/${selectedContractId}/${status}`,{}, {
        axios.post(`https://contract-system-5c4e51349d5b.herokuapp.com/api/inbox/${selectedContractId}/${status}`, {}, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then((res) => res.status)
            .then((status) => {
                if (status === 200) {
                    fetchContracts();
                }
            }).catch((error) => {
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
                                    Inbox
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
                                           placeHolder="Search Inbox"
                                />
                                <Card elevation={3}
                                      sx={{
                                          display: "flex", justifyContent: "space-between", gap: 2,
                                          backgroundColor: "rgb(59, 61, 145, 0.2)",
                                          border: "1px solid rgb(59, 61, 145, 0.2)"
                                      }}>
                                    <IconButton
                                        color="red"
                                        onClick={() => handleStatus("ACCEPTED")}
                                    >
                                        <SvgIcon sx={{fontSize: "40px"}}>
                                            <CheckIcon color="rgb(185,67,102)"/>
                                        </SvgIcon>
                                    </IconButton>
                                    <IconButton
                                        color="red"
                                        onClick={() => handleStatus("DECLINED")}
                                    >
                                        <SvgIcon sx={{fontSize: "40px"}}>
                                            <NoSymbolIcon color="rgb(185,67,102)"/>
                                        </SvgIcon>
                                    </IconButton>
                                    <IconButton
                                        color="red"
                                        onClick={handleDelete}
                                    >
                                        <SvgIcon sx={{fontSize: "40px"}}>
                                            <TrashIcon color="rgb(185,67,102)"/>
                                        </SvgIcon>
                                    </IconButton>
                                </Card>
                            </Stack>
                            <Box sx={{mt: "30px"}}>
                                <Divider/>
                            </Box>
                            <Box sx={{m: "10px"}}>
                                <InboxFilterButtons setSearchTerm={setSearchTerm} resetList={resetContractsList}/>
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
                                "From": "from",
                                "To": "to",
                                "Title": "title",
                                "sent": "sent",
                                "received": "received",
                                "Status": "status",
                            }}
                            tableType="inbox"
                            stagesColor ={stagesColor}
                            handleEdit={handleEdit}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default Inbox;
