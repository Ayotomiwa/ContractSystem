import PropTypes from 'prop-types';
import { format } from 'date-fns';
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
import { Scrollbar } from './scrollbar';
// import { getInitials } from 'src/utils/get-initials';

export const CustomersTable = (props) => {
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
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);


  return (
    <Card>
      {/*<Scrollbar>*/}
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
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
                  Email
                </TableCell>
                <TableCell>
                  Business
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Created Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((client) => {
                const isSelected = selected.includes(client.id);


                return (
                  <TableRow
                    hover
                    key={client.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(client.id);
                          } else {
                            onDeselectOne?.(client.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                          <Avatar src={client.avatar} />
                        <Typography variant="subtitle2">
                          {client.userRecipient.firstName} {client.userRecipient.lastName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {client.userRecipient.email}
                    </TableCell>
                    <TableCell>
                      {client.userRecipient.business? client.userRecipient.business.companyName : "N/A"}
                    </TableCell>
                    <TableCell>
                      {client.userRecipient.phoneNumber? client.userRecipient.phoneNumber: "N/A"}
                    </TableCell>
                    <TableCell>
                      {client.createdDate}
                    </TableCell>
                  </TableRow>
                );
              })}
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

CustomersTable.propTypes = {
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
