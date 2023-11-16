import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
// import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {Box, Button, Card, Container, Stack, SvgIcon, Typography} from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { Layout as DashboardLayout } from '../../components/Layout';
import { SearchBar } from '../../components/SearchBar';
import { applyPagination } from '../../utils/apply-pagination';
import axios from "axios";
import UserContext from "../../hooks/UserProvider";
import {generateRandomAvatar} from "../../utils/avatarUtils";
import {ProductTable} from "./ProductTable";




const Products = () => {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchTerm,setSearchTerm] = useState("");
    const [search, setSearch] = useState(false);
    const businessId= "65523e0a91702e609ee9040b"
    const basicProductUrl = `http://localhost:8080/api/product-services/business/${businessId}`;
    const fetchProductUrl = `size=${rowsPerPage}&page=${page}`;
    const searchProductUrl= basicProductUrl + `/search?query=${searchTerm}` ;
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (search === false || searchTerm === "") {
            setProducts([]);
            fetchProducts();
        }

        else if(search === true && searchTerm !== ""){
            if(page === 0){
                setProducts([]);
            }
            fetchSearchData();
        }
    }, [user, page, rowsPerPage, searchTerm, search]);


    useEffect(() => {
        fetchProducts(page, rowsPerPage);
    }, [user, page, rowsPerPage]);


    const fetchProducts = () => {
        setIsLoading(true);
        // if (user) {
        // axios.get(`http://localhost:8080/api/products/business/${user.business.id}`)
        axios.get(basicProductUrl + "?" + fetchProductUrl)
            .then(response => {
                processProductsData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setIsLoading(false);
            });
    }

    const fetchSearchData = () => {
        setIsLoading(true);
        axios.get(searchProductUrl +"&"+ fetchProductUrl)
            .then(response => {
                processProductsData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setIsLoading(false);
            });
    }

    const processProductsData = (data) => {
        // const productWithAvatars = data.content.map((product) => ({
        //     ...product,
        //     avatar: generateRandomAvatar()
        // }));
        setProducts(data.content);
        setTotalProducts(data.totalElements);
    }


    const resetProductsList = (value) => {
        // setExams([]);
        setTotalProducts(0);
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


    const productId = useMemo(() => products.map((product) => product.id), [products]);

    const productSelection = useSelection(productId);


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
                                    Products & Services
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
                                    New
                                </Button>
                            </div>
                        </Stack>
                        <Card sx={{display:"flex", alignItems:"left", justifyContent:"left", p: 2 }}>
                            <SearchBar setSearchTerm={setSearchTerm} resetList={resetProductsList} />
                        </Card>
                        <ProductTable
                            count={totalProducts}
                            items={products}
                            onDeselectAll={productSelection.handleDeselectAll}
                            onDeselectOne={productSelection.handleDeselectOne}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectAll={productSelection.handleSelectAll}
                            onSelectOne={productSelection.handleSelectOne}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            selected={productSelection.selected}
                            // resetList={resetProductsList}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Products.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Products;