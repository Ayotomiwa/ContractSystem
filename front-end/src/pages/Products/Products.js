import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
// import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {Box, Button, Card, Container, IconButton, Stack, SvgIcon, Typography} from '@mui/material';
import { useSelection } from '../../hooks/UseSelection';
import { Layout as DashboardLayout } from '../../components/Layout';
import { SearchBar } from '../../components/SearchBar';
import { applyPagination } from '../../utils/apply-pagination';
import axios from "axios";
import UserContext from "../../hooks/UserProvider";
import {generateRandomAvatar} from "../../utils/avatarUtils";
import {ProductTable} from "./ProductTable";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import {PagesTable} from "../../components/PagesTable";




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
    const [selectedProductId, setSelectedProductId] = useState(null);


    useEffect(() => {
        setIsLoading(true);
    }, [rowsPerPage]);


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


    const handleDelete = (event) => {
        event.preventDefault();
        deleteProduct()
    }


    const deleteProduct = () =>
    {
        axios.post(`http://localhost:8080/api/product-services/${selectedProductId}`)
            .then((res) => res.status)
            .then((status)=>{
                if(status === 200){
                    setProducts(prevProducts => prevProducts.filter(product => product.id !== selectedProductId));
                }
            }).
        catch((error) => {
            console.log(error);
        })
    }



    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const handleEdit = (itemId, businessId) =>{

    }

    const productId = useMemo(() => products.map((product) => product.id), [products]);

    const productSelection = useSelection(productId);


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
                                        width:"100%", height:"50px", borderRadius:"10px",
                                        '&:hover, &:focus, &active': {
                                            backgroundColor: "rgb(99, 102, 241)",
                                            // backgroundColor: "#e75480",
                                        }
                                    }}
                                >
                                    New Product
                                </Button>
                            </div>
                        </Stack>
                        <Card elevation={8} sx={{p: 2}}>
                        <Stack direction="row"
                               justifyContent="space-between"
                               alignItems="center"
                               spacing={4}
                        >
                            <SearchBar setSearchTerm={setSearchTerm} resetList={resetProductsList} placeHolder="Search Products" />
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
                            isLoading={isLoading}
                            setItemsId={setSelectedProductId}
                            columnHeaders={{
                                "Name": "name",
                                "Description": "description",
                                "Type":"type",
                                "Cost Per Unit":"price",
                            }}
                            handleEdit={handleEdit}
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