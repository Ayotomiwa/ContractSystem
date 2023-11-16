import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {Box, Button, Card, Container, Stack, SvgIcon, Typography} from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { Layout as DashboardLayout } from '../../components/Layout';
import { ClientTable } from './ClientTable';
import { SearchBar } from '../../components/SearchBar';
import { applyPagination } from '../../utils/apply-pagination';
import axios from "axios";
import UserContext from "../../hooks/UserProvider";
import {generateRandomAvatar} from "../../utils/avatarUtils";
import {Link as RouterLink} from "react-router-dom";

import Skeleton from '@mui/material/Skeleton';



// const useCustomers = (page, rowsPerPage) => {
//   return useMemo(
//     () => {
//       return applyPagination(data, page, rowsPerPage);
//     },
//     [page, rowsPerPage]
//   );
// };

//
// const useCustomerIds = (customers) => {
//   return useMemo(
//     () => {
//       return customers.map((customer) => customer.id);
//     },
//     [customers]
//   );
// };

const Page = () => {
    const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalClients, setTotalClients] = useState(0);
  const [searchTerm,setSearchTerm] = useState("");
  const [search, setSearch] = useState(false);
  const businessId= "65523e0a91702e609ee9040b"
    const basicClientUrl = `http://localhost:8080/api/business/${businessId}/clients`;
  const fetchClientsUrl = `size=${rowsPerPage}&page=${page}`;
    const searchClientUrl= basicClientUrl + `/search?query=${searchTerm}` ;
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        if (search === false || searchTerm === "") {
            setClients([]);
            fetchClients();
        }

        else if(search === true && searchTerm !== ""){
            if(page === 0){
               setClients([]);
            }
            fetchSearchData();
        }
    }, [user, page, rowsPerPage, searchTerm, search]);


    const fetchClients = () => {
      // if (user) {
        // axios.get(`http://localhost:8080/api/clients/business/${user.business.id}`)
          axios.get(basicClientUrl + "?" + fetchClientsUrl)
            .then(response => {
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

    // const useCustomers = (page, rowsPerPage) => {
    //     return useMemo(
    //         () => {
    //             return applyPagination(clients, page, rowsPerPage);
    //         },
    //         [page, rowsPerPage]
    //     );
    // };



    const fetchSearchData = () => {
        setIsLoading(true);
        axios.get(searchClientUrl +"&"+ fetchClientsUrl)
            .then(response => {
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

    const processClientData = (data) => {
        const clientWithAvatars = data.content.map((client) => ({
            ...client,
            avatar: generateRandomAvatar()
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


    // const handlePageChange = useCallback(
  //   (event, value) => {
  //     setPage(value);
  //   },
  //   []
  // );

  // const handleRowsPerPageChange = useCallback(
  //   (event) => {
  //     setRowsPerPage(event.target.value);
  //   },
  //   []
  // );

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
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
                    to="/clients/new"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  size ="small"
                  sx={{backgroundColor:"rgb(99, 102, 241)", fontSize:"1.2rem", color:"white",
                   width:"100%", height:"50px", borderRadius:"10px", '&:hover': {
                          backgroundColor: "rgb(99, 102, 241)",
                          // backgroundColor: "#e75480",
                    },
                    '&:focus': {
                      backgroundColor: "rgb(99, 102, 241)",
                      //   backgroundColor: "#e75480",
                    },
                    '&:active': {
                      backgroundColor: "rgb(99, 102, 241)",
                        // backgroundColor: "#e75480",
                    }
                  }}
                >
                  New Client
                </Button>
              </div>
            </Stack>
            <Card sx={{display:"flex", alignItems:"left", justifyContent:"left", p: 2 }}>
              <SearchBar setSearchTerm={setSearchTerm} resetList={resetClientList} />
            </Card>
            <ClientTable
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
