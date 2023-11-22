import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {useNavigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import { TableRow as MuiTableRow } from '@mui/material';


export const ClientTable = (props) => {
    const {
        count = 0,
        items = [],
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => {
        },
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        page = 0,
        rowsPerPage = 0,
        selected = [],
        isLoading,
        businessId,
        setContractsId
    } = props;

    const selectedSome = (selected.length > 0) && (selected.length < items.length);
    const selectedAll = (items.length > 0) && (selected.length === items.length);
    const navigate = useNavigate();
    const MotionTableRow = motion(MuiTableRow);



  return (
        <Card elevation={6}  sx={{overflowX: "auto", border: "0.5px solid black", boxShadow:3}}>
            {/*<Card sx={{boxShadow:3}}>*/}
            {/*<Scrollbar>*/}
            <Box sx={{minWidth: 800, minHeight: 450}}>
                <Table>
                    {/*<TableHead sx={{backgroundColor:"rgb(59, 61, 145, 0.3)"}}>*/}
                        <TableHead >
                        <TableRow sx={{backgroundColor:"rgb(59, 61, 145, 0.5)",
                            color:"yellow",
                            textTransform: "uppercase",
                            fontWeight: "bold"}}>
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
                                Email
                            </TableCell>
                            <TableCell>
                                Business
                            </TableCell>
                            <TableCell>
                                Phone Number
                            </TableCell>
                            <TableCell>
                                Created Date
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            Array.from(new Array(rowsPerPage)).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell colSpan={7}>
                                        <Skeleton variant="rectangular" width="100%"/>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <AnimatePresence>
                                {items.map((client) => {
                                    const isSelected = selected.includes(client.id);

                                    return (
                                        <MotionTableRow
                                            key={client.id}
                                            initial={{opacity: 1, x: 0}}
                                            exit={{opacity: 0, x: -100}}
                                            transition={{duration: 0.3}}
                                            layout
                                                selected={isSelected}
                                                onClick={() => {
                                                    navigate(`/clients/edit?clientId=${client.id}&businessId=${businessId}`, {replace: true});
                                                }}
                                                sx={{
                                                    cursor: 'pointer',
                                                    "&:hover, &:active, &:focus": {
                                                        // color: "rgb(99, 102, 241, 0.5)",
                                                        backgroundColor: "rgb(99, 102, 241, 0.08)"
                                                    }
                                                }}

                                             // component="tablerow"
                                         >
                                                <TableCell
                                                    padding="checkbox">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={(event) => {
                                                            if (event.target.checked) {
                                                                onSelectOne?.(client.id);
                                                            } else {
                                                                onDeselectOne?.(client.id);
                                                            }
                                                        }}
                                                        onClick={(event) => {
                                                            if (selected.length === 0) {
                                                                console.log("Inside Selected")
                                                                setContractsId(client.id)
                                                            }
                                                            event.stopPropagation();
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        spacing={2}
                                                    >
                                                        <Avatar src={client.avatar}/>
                                                        <Typography variant="subtitle2">
                                                            {client.userRecipient?.firstName ? client.userRecipient.firstName : "N/A"} {client.userRecipient?.lastName ? client.userRecipient.lastName : "N/A"}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    {client.userRecipient?.email}
                                                </TableCell>
                                                <TableCell>
                                                    {client.userRecipient?.business ? client.userRecipient.business.companyName : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {client.userRecipient?.phoneNumber ? client.userRecipient.phoneNumber : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {client.createdDate}
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

ClientTable.propTypes = {
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
