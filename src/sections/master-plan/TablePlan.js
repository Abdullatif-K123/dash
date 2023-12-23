import DocumentIcon from "@heroicons/react/24/solid/DocumentIcon";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  SvgIcon,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { useRef, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import React from "react";

const TablePlan = ({ customer, isSelected, handleRemove }) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [docUrl, setdocUrl] = useState("");
  const titleRef = useRef(customer.title);
  //url Action download
  function downloadPdf(url) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank"; // Open in a new tab, optional
    link.download = "document.pdf"; // Set the default download file name, optional

    // Trigger a click on the link
    document.body.appendChild(link);
    link.click();

    // Clean up the link element
    document.body.removeChild(link);
  }

  const handleDelete = (id) => {
    // Show the confirmation dialog
    setCurrentId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Handle the deletion logic here

    // ...
    try {
      const response = await axios.delete(
        `https://gaca.somee.com/api/Masterplancontext/Delete/${currentId}`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      setIsDialogOpen(false);
      handleRemove(currentId);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    // Close the confirmation dialog
  };

  const handleCancelDelete = () => {
    // Close the confirmation dialog without deleting
    setIsDialogOpen(false);
  };

  //update handler dialog soul

  // Function to handle opening the dialog
  const handleOpenDialog = (id, name, url) => {
    setCurrentName(name);
    setCurrentId(id);
    setdocUrl(url);
    console.log(url);
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Function to handle file upload (you can customize this based on your API)
  const handleFileUpload = async () => {
    // Perform file upload logic here
    const title = titleRef.current.value;
    // const file = fileRef.current.files[0];

    try {
      const response = await axios.put(
        "https://gaca.somee.com/api/Document/Update",
        {
          id: currentId,
          title: title,
          imageUrl: docUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      handleCloseDialog();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    // Make your PUT request with the title and file here
  };

  return (
    <TableRow hover selected={isSelected}>
      {/* Updating dialog  */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update for {currentName}</DialogTitle>
        <DialogContent style={{ minWidth: "400px" }}>
          {/* Title input using useRef */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="title-input">Title</InputLabel>
            <Input id="title-input" type="text" inputRef={titleRef} />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="info">
            Cancel
          </Button>
          <Button onClick={handleFileUpload} color="success" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this Document?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="info">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <TableCell padding="checkbox"></TableCell>
      <TableCell>
        <Stack alignItems="center" direction="row" spacing={1}>
          <SvgIcon>
            {" "}
            <DocumentIcon />{" "}
          </SvgIcon>
          <Typography
            variant="subtitle2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              downloadPdf(`https://gaca.somee.com/${customer.imageUrl}`);
            }}
          >
            {customer.title}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell> </TableCell>
      <TableCell> </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              handleOpenDialog(customer.id, customer.title, customer.imageUrl);
            }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(customer.id);
            }}
          >
            Delete
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default TablePlan;
