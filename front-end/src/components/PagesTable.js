import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    Card,
    Checkbox,
    ListItem,
    ListItemText,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableRow as MuiTableRow,
    Typography
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {useNavigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";


export const PagesTable = (props) => {
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
        setItemsId,
        columnHeaders,
        showAvatar,
        handleEdit,
        tableType,
        stagesColor
    } = props;

    const selectedSome = (selected.length > 0) && (selected.length < items.length);
    const selectedAll = (items.length > 0) && (selected.length === items.length);
    const navigate = useNavigate();
    const MotionTableRow = motion(MuiTableRow);
    const columnLength = Object.keys(columnHeaders).length;


    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj) || "N/A";
    };


    return (
        <Card elevation={6} sx={{overflowX: "auto", border: "0.5px solid black", boxShadow: 3}}>
            {/*<Card sx={{boxShadow:3}}>*/}
            {/*<Scrollbar>*/}
            <Box sx={{minWidth: 800, minHeight: 450}}>
                <Table>
                    {/*<TableHead sx={{backgroundColor:"rgb(59, 61, 145, 0.3)"}}>*/}
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: "rgb(59, 61, 145, 0.5)",
                            textTransform: "uppercase",
                            height: "40px"
                        }}>
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
                            {Object.entries(columnHeaders).map(([columnHeader], index) => (
                                <TableCell key={index} sx={{
                                    fontSize: "16px",
                                }}>
                                    <Typography textAlign="center">
                                    {columnHeader}
                                    </Typography>
                                </TableCell>
                            ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            Array.from(new Array(rowsPerPage)).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell colSpan={columnLength + 1}>
                                        <Skeleton variant="rectangular" width="100%"/>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : items.length > 0 ? (
                            <AnimatePresence>
                                {items.map((item) => {

                                    const isSelected = selected.includes(item.id);

                                    return (
                                        <MotionTableRow
                                            key={item.id}
                                            initial={{opacity: 1, x: 0}}
                                            exit={{opacity: 0, x: -100}}
                                            transition={{duration: 0.3}}
                                            layout
                                            selected={isSelected}
                                            onClick={() => {
                                                handleEdit(item.id, businessId);
                                            }}
                                            sx={{
                                                cursor: 'pointer',
                                                background: tableType === "inbox" && item.status === "UNREAD" ? stagesColor[item.status] : "unset",
                                                "&:hover, &:active, &:focus": {
                                                    // color: "rgb(99, 102, 241, 0.5)",
                                                    backgroundColor: tableType === "inbox" && item.status === "UNREAD" ? stagesColor[item.status] : "rgb(99, 102, 241, 0.08)",
                                                }
                                            }}
                                        >
                                            <TableCell
                                                padding="checkbox">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            onSelectOne?.(item.id);
                                                        } else {
                                                            onDeselectOne?.(item.id);
                                                        }
                                                    }}
                                                    onClick={(event) => {
                                                        if (selected.length === 0) {
                                                            console.log("Inside Selected")
                                                            setItemsId(item.id)
                                                        }
                                                        event.stopPropagation();
                                                    }}
                                                />
                                            </TableCell>
                                            {Object.entries(columnHeaders).map(([header, path], index) => (
                                                <TableCell
                                                    key={index}>
                                                    {index === 0 ? (
                                                        <Stack alignItems="center" direction="row" spacing={2}>
                                                            {showAvatar && <Avatar src={item.avatar}/>}
                                                            <Typography
                                                                textAlign="center"
                                                                sx={{
                                                                    background: (header === "Status") && stagesColor[getNestedValue(item, path)] ? stagesColor[getNestedValue(item, path)] : "unset",
                                                                    padding: "10px"
                                                                }}
                                                                variant="subtitle2">
                                                                {getNestedValue(item, path)}
                                                            </Typography>
                                                        </Stack>
                                                    ) : (
                                                        header === "Created Date" || header === "Last Updated" ? (
                                                            <ListItem>
                                                                <ListItemText sx={{display:"grid", placeItems:"center"}}
                                                                    primary={
                                                                        <Typography variant="subtitle2">
                                                                            {new Date(getNestedValue(item, path)).toLocaleDateString()}
                                                                        </Typography>
                                                                    }
                                                                    secondary={
                                                                        <Typography variant="subtitle2">
                                                                            {new Date(getNestedValue(item, path)).toLocaleTimeString()}
                                                                        </Typography>
                                                                    }>
                                                                </ListItemText>
                                                            </ListItem>
                                                        ) : (
                                                            <Typography
                                                                textAlign="center"
                                                                sx={{
                                                                    background: (header === "Status") && stagesColor[item.status] ? stagesColor[item.status] : "unset",
                                                                    padding: "10px"
                                                                }}
                                                                variant="subtitle2">
                                                                {getNestedValue(item, path)}
                                                            </Typography>
                                                        )
                                                    )}
                                                </TableCell>
                                            ))}
                                        </MotionTableRow>
                                    )
                                })}
                            </AnimatePresence>
                        ) : (
                            <TableRow>
                                <TableCell align="center" colSpan={columnLength + 1}>
                                    No Data to be Displayed
                                </TableCell>
                            </TableRow>
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

PagesTable.propTypes = {
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
