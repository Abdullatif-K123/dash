import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import UserCell from "./UserCell";
import { Delete } from "@mui/icons-material";
import { Edit } from "@mui/icons-material";
const UserTable = ({ data, handleRemove }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Date Created</TableCell>
            <TableCell>Date Updated</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => {
            //Human readable date
            const dateCreated = new Date(item.dateCreated);
            const dateUpdated = new Date(item.dateUpdated);
            const options = {
              year: "numeric",
              month: "long",
              day: "numeric",
            };

            const humanReadableDateCreated = dateCreated.toLocaleString("en-US", options);
            const humanReadableDateUpdated = dateUpdated.toLocaleString("en-US", options);
            return (
              <UserCell
                key={item.id}
                item={item}
                DateCreate={humanReadableDateCreated}
                DateUpdate={humanReadableDateUpdated}
                handleRemove={handleRemove}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
