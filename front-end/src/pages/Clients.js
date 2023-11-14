import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
// import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {Box, Button, Card, Container, Stack, SvgIcon, Typography} from '@mui/material';
import { useSelection } from '../hooks/use-selection';
import { Layout as DashboardLayout } from '../components/Layout';
import { CustomersTable } from '../components/CustomersTable';
import { CustomersSearch } from '../components/CustomersSearch';
import { applyPagination } from '../utils/apply-pagination';
import axios from "axios";
import UserContext from "../hooks/UserProvider";
import {generateRandomAvatar} from "../utils/avatarUtils";



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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalClients, setTotalClients] = useState(0);






  const fetchClients = () => {
      // if (user) {
        // axios.get(`http://localhost:8080/api/clients/business/${user.business.id}`)
          axios.get(`http://localhost:8080/api/business/65523e0a91702e609ee9040b/clients`)
            .then(response => {
                const clientWithAvatars = response.data.content.map((client) => ({
                    ...client,
                        avatar: generateRandomAvatar()
                }));
              setClients(clientWithAvatars);
              setTotalClients(response.data.totalElements);
            })
            .catch(error => {
              console.error("Error fetching clients:", error);
              // Handle error as needed
            });
      // }
      // else if(user) {
      //   window.location.href = "/contracts";
      // }
      // else{
      //   window.location.href = "/"
      // }
  }


  useEffect(() => {
    fetchClients(page, rowsPerPage);
  }, [user, page, rowsPerPage]);


  const handlePageChange = (event, newPage) => {
        setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
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
                  {/*<Button*/}
                  {/*  color="inherit"*/}
                  {/*  startIcon={(*/}
                  {/*    <SvgIcon fontSize="small">*/}
                  {/*      <ArrowUpOnSquareIcon />*/}
                  {/*    </SvgIcon>*/}
                  {/*  )}*/}
                  {/*>*/}
                  {/*  Import*/}
                  {/*</Button>*/}
                  {/*<Button*/}
                  {/*  color="inherit"*/}
                  {/*  startIcon={(*/}
                  {/*    <SvgIcon fontSize="small">*/}
                  {/*      <ArrowDownOnSquareIcon />*/}
                  {/*    </SvgIcon>*/}
                  {/*  )}*/}
                  {/*>*/}
                  {/*  Export*/}
                  {/*</Button>*/}
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  size ="small"
                  sx={{backgroundColor:"rgb(99, 102, 241)", fontSize:"1.2rem", color:"white",
                   width:"100%", height:"50px", borderRadius:"10px", '&:hover': {
                          // backgroundColor: "rgb(99, 102, 241)",
                          backgroundColor: "#e75480",
                    },
                    '&:focus': {
                      // backgroundColor: "rgb(99, 102, 241)",
                        backgroundColor: "#e75480",
                    },
                    '&:active': {
                      // backgroundColor: "rgb(99, 102, 241)",
                        backgroundColor: "#e75480",
                    }
                  }}
                >
                  New Client
                </Button>
              </div>
            </Stack>
            <Card sx={{display:"flex", alignItems:"left", justifyContent:"left", p: 2 }}>
              <CustomersSearch />
            </Card>
            <CustomersTable
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
