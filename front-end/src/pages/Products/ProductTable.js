import PropTypes from 'prop-types';
import {Box, Card, Checkbox, Table, TableBody, TableCell, TableHead, TablePagination, TableRow} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {AnimatePresence, motion} from "framer-motion";
import { TableRow as MuiTableRow } from '@mui/material';


export const ProductTable = (props) => {
    const {
        count = 0,
        items = [],
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => {},
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        page = 0,
        rowsPerPage = 0,
        selected = [],
        isLoading,
        setProductId
    } = props;

    const selectedSome = (selected.length > 0) && (selected.length < items.length);
    const selectedAll = (items.length > 0) && (selected.length === items.length);
    const MotionTableRow = motion(MuiTableRow);


    return (
        <Card elevation={6} sx={{border: "0.5px solid black", boxShadow:3}}>
            {/*<Scrollbar>*/}
            <Box sx={{ minWidth: 800, minHeight: 450 }}>
                <Table>
                    <TableHead sx={{backgroundColor:"rgb(59, 61, 145, 0.3)"}}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAll}
                                    indeterminate={selectedSome}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            onSelectAll?.();
                                        } else {
                                            onDeselectAll?.();
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell>
                                Description
                            </TableCell>
                            <TableCell>
                                Type
                            </TableCell>
                            <TableCell>
                                Cost per unit
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            Array.from(new Array(rowsPerPage)).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell colSpan={7}>
                                        <Skeleton variant="rectangular" width="100%" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <AnimatePresence>
                                {items.map((product) => {
                                const isSelected = selected.includes(product.id);


                                return (
                                <MotionTableRow
                                        key={product.id}
                                        initial={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: -100}}
                                        transition={{duration: 0.2}}
                                        layout
                                        selected={isSelected}

                                        sx={{
                                            cursor: 'pointer',
                                            "&:hover, &:active, &:focus": {
                                                // color: "rgb(99, 102, 241, 0.5)",
                                                backgroundColor: "rgb(99, 102, 241, 0.08)"
                                            }
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        onSelectOne?.(product.id);
                                                    } else {
                                                        onDeselectOne?.(product.id);
                                                    }
                                                }}
                                                onClick={(event) => {
                                                    if (selected.length === 0) {
                                                        console.log("Inside Selected")
                                                        setProductId(product.id)
                                                    }
                                                    event.stopPropagation();
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {product.name}
                                        </TableCell>
                                        <TableCell>
                                            {product.description}
                                        </TableCell>
                                        <TableCell>
                                            {product.type}
                                        </TableCell>
                                        <TableCell>
                                            {product.price}
                                        </TableCell>
                                    </MotionTableRow>
                                );
                            })}
                          </AnimatePresence>
                        )}
                    </TableBody>
                </Table>
            </Box>
            {/*</Scrollbar>*/}
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};

ProductTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onDeselectAll: PropTypes.func,
    onDeselectOne: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectOne: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array
};
