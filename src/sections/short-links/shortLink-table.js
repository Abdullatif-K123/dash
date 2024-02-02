import PropTypes from "prop-types";
import { format } from "date-fns";
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

import { useRef, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { FormControl } from "@mui/material";
import { Input } from "@mui/material";
import { InputLabel } from "@mui/material";
import CustomizedSnackbars from "src/components/Snackbar";
import LinkCell from "./LinkCell";
export const ShortLink = (props) => {
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

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const [message, setMessage] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const handleChange = (message) => {
    setMessage(message);
    setOpenSnack(true);
    setTimeout(() => {
      setOpenSnack(false);
    }, 3000);
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
                <TableCell>Title</TableCell>
                <TableCell>Link Address</TableCell>
                <TableCell>Date added</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
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
                  <LinkCell
                    key={customer.id}
                    formattedDate={formattedDate}
                    isSelected={isSelected}
                    customer={customer}
                    user={user}
                    handleRemove={handleRemove}
                    handleNotification={handleChange}
                  />
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>

      <CustomizedSnackbars open={openSnack} type={"success"} message={message} />
    </Card>
  );
};

ShortLink.propTypes = {
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
