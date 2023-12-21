import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { SeverityPill } from "src/components/severity-pill";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useAuth } from "src/hooks/use-auth";
const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};
const feedBackType = ["Recommendation", "Error Repot", "Question", "Other"];
const TableMessage = ({ order, DeleteItems }) => {
  const { user } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [open, setOpenDialog] = useState(false);

  const handleOpenDialog = async () => {
    setOpenDialog(true);
    try {
      // Make your API request here
      const response = await axios.get(`https://gaca.somee.com/api/Message/GetById/${order.id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      console.log(response.data);
      order.isSeen = true;

      // Update the component state with the fetched data
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    // Add your delete logic here
    console.log("Deleting...");
    handleCloseDialog();
    try {
      // Make your API request here
      const response = await axios.delete(`https://gaca.somee.com/api/Message/Delete/${order.id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      console.log(response.data);

      setConfirmDelete(false);
      // Update the component state with the fetched data
    } catch (error) {
      console.log(error);
    }
    DeleteItems(order.id);
  };
  return (
    <>
      {" "}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Feedback Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Name:</strong> {order.name}
            <br />
            <strong>Email:</strong> {order.email}
            <br />
            <strong>Phone:</strong> {order.phone}
            <br />
            <strong>Feedback Type:</strong> {order.feedBackType}
            <br />
            <strong>Feedback Title:</strong> {order.feedBackTitle}
            <br />
            <strong>Feedback Message:</strong> {order.feedBackMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setConfirmDelete(true)} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>

        {/* Delete confirmation dialog */}
      </Dialog>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this feedback?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <TableRow
        ableRow
        hover
        key={order.id}
        style={{ cursor: "pointer" }}
        onClick={handleOpenDialog}
      >
        <TableCell>{order.name}</TableCell>
        <TableCell>{order.email}</TableCell>
        <TableCell>{order.feedBackTitle}</TableCell>
        <TableCell>{feedBackType[order.feedBackType]}</TableCell>
        <TableCell>
          <SeverityPill color={statusMap[order.isSeen === true ? ["delivered"] : ["refunded"]]}>
            {order.isSeen ? "Opened" : "UnRead"}
          </SeverityPill>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TableMessage;
