import {useContext, useEffect, useMemo, useRef, useState} from 'react';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {Box, Button, Card, Container, IconButton, Stack, SvgIcon, Typography} from '@mui/material';
import {useSelection} from '../../hooks/UseSelection';
import {SearchBar} from '../../components/SearchBar';
import axios from "axios";
import UserContext from "../../hooks/UserProvider";
import {generateRandomAvatar} from "../../utils/avatarUtils";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import {PagesTable} from "../../components/PagesTable";


const Clients = () => {
    const {user} = useContext(UserContext);
    const [clients, setClients] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalClients, setTotalClients] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState(false);
    // const businessId = "65523e0a91702e609ee9040b";
    const businessId = user?.businessId ? user.businessId : "";
    const basicClientUrl = `https://contract-system-5c4e51349d5b.herokuapp.com/api/business/${businessId}/clients`;
    const fetchClientsUrl = `size=${rowsPerPage}&page=${page}`;
    const searchClientUrl = basicClientUrl + `/search?query=${searchTerm}`;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        setIsLoading(true);
    }, [rowsPerPage]);


    useEffect(() => {
        if (!user) {
            return;
        }
        if (search === false || searchTerm === "") {
            setClients([]);
            fetchClients();
        } else if (search === true && searchTerm !== "") {
            if (page === 0) {
                setClients([]);
            }
            fetchSearchData();
        }
    }, [user, page, rowsPerPage, searchTerm, search]);


    const fetchClients = () => {
        axios.get(basicClientUrl + "?" + fetchClientsUrl, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }
        ).then(response => {
            processClientData(response.data);
            setIsLoading(false);

        })
            .catch(error => {
                console.error("Error fetching clients:", error);
                setIsLoading(false);
            });
    }


    const fetchSearchData = () => {
        axios.get(searchClientUrl + "&" + fetchClientsUrl, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }
        ).then(response => {
            processClientData(response.data);
            setIsLoading(false);
            // const clientWithAvatars = response.data.content.map((client) => ({
            //     ...client,
            //         avatar: generateRandomAvatar()
            // }));

        })
            .catch(error => {
                console.error("Error fetching clients:", error);
                setIsLoading(false);
            });
    }

    const handleDelete = (event) => {
        event.preventDefault();
        deleteClient()
    }

    const handleEdit = (itemId, businessId) => {
        navigate(`/clients/edit?clientId=${itemId}&businessId=${businessId}`, {replace: true});
    }

    const deleteClient = () => {
        // axios.get(`http://localhost:8080/api/business/delete/${selectedClientId}`, {
            axios.get(`https://contract-system-5c4e51349d5b.herokuapp.com/api/business/delete/${selectedClientId}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then((res) => res.status)
            .then((status) => {
                if (status === 200) {
                    setClients(prevClients => prevClients.filter(client => client.id !== selectedClientId));
                }
            }).catch((error) => {
            console.log(error);
        })
    }


    const processClientData = (data) => {
        const clientWithAvatars = data.content.map((client) => ({
            ...client,
            avatar: generateRandomAvatar(),
            name: client.userRecipient.firstName + " " + client.userRecipient.lastName
        }));
        setClients(clientWithAvatars);
        setTotalClients(data.totalElements);
    }


    const resetClientList = (value) => {
        // setExams([]);
        setTotalClients(0);
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

    const clientId = useMemo(() => clients.map((customer) => customer.id), [clients]);

    const clientSelection = useSelection(clientId);



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
                                    Clients
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
                                    New Client
                                </Button>
                            </div>
                        </Stack>
                        <Card elevation={8} sx={{p: 2}}>
                            <Stack direction="row"
                                   justifyContent="space-between"
                                   alignItems="center"
                                   spacing={4}
                            >

                                <SearchBar setSearchTerm={setSearchTerm} resetList={resetClientList}
                                           placeHolder="Search Client - Name or Email"/>
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
                        <PagesTable
                            count={totalClients}
                            items={clients}
                            onDeselectAll={clientSelection.handleDeselectAll}
                            onDeselectOne={clientSelection.handleDeselectOne}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectAll={clientSelection.handleSelectAll}
                            onSelectOne={clientSelection.handleSelectOne}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            selected={clientSelection.selected}
                            isLoading={isLoading}
                            businessId={businessId}
                            setItemsId={setSelectedClientId}
                            columnHeaders={{
                                "Name": "name",
                                "Email": "userRecipient.email",
                                "Phone Number": "userRecipient.phoneNumber",
                                "Business": "userRecipient.business.companyName",
                                "Created Date": "createdDate",
                                "Last Updated": "lastUpdatedDate",
                            }}
                            handleEdit={handleEdit}
                            showAvatar={true}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default Clients;

