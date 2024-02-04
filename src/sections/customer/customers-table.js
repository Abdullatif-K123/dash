import PropTypes from "prop-types";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import DocumentCell from "./DocumentCell";
import CustomizedSnackbars from "src/components/Snackbar";
export const CustomersTable = (props) => {
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("success");
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };
  const { user } = useAuth();
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    handleRemove,
  } = props;
  const handleUpdate = (status, message) => {
    setOpenSnack(true);
    setStatus(status);
    setMessage(message);
  };
  return (
    <Card>
      {/* Delete dialog */}

      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Date added</TableCell>
                <TableCell>File size</TableCell>
                <TableCell></TableCell>
                <TableCell>Download Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const dateCreatedString = customer.dateCreated;
                const dateCreated = new Date(dateCreatedString);

                const options = { year: "numeric", month: "long", day: "numeric" };
                const formattedDate = dateCreated.toLocaleDateString(undefined, options);

                const isSelected = selected.includes(customer.id);
                // const createdAt = format(customer.createdAt, "dd/MM/yyyy");

                return (
                  <DocumentCell
                    key={customer.id}
                    formattedDate={formattedDate}
                    isSelected={isSelected}
                    customer={customer}
                    user={user}
                    handleRemove={handleRemove}
                    handleUpdate={handleUpdate}
                  />
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <CustomizedSnackbars
        handleClose={handleCloseSnack}
        open={openSnack}
        type={status}
        message={message}
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
  selected: PropTypes.array,
};
