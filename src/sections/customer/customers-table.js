import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

import { useRef, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { FormControl } from "@mui/material";
import { Input } from "@mui/material";
import { InputLabel } from "@mui/material";
import DocumentCell from "./DocumentCell";
export const CustomersTable = (props) => {
  const { user } = useAuth();
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
    handleRemove,
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

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
                  />
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
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
  selected: PropTypes.array,
};
