import DocumentIcon from "@heroicons/react/24/solid/DocumentIcon";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  SvgIcon,
  Switch,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "src/utils/apiConfig";
const LinkCell = ({
  customer,
  isSelected,
  formattedDate,
  handleNotification,
  handleRemove,
  user,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [docUrl, setdocUrl] = useState("");

  const inputRef = useRef(customer.title);
  const linkRef = useRef(null);
  const [title, setTitle] = useState(customer.title);
  const [link, setLink] = useState(customer.linkAddress);
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
      const response = await axios.delete(`${API_ROUTES.links.delete}/${currentId}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      setIsDialogOpen(false);
      handleRemove(currentId);
      handleNotification("Link has been deleted!!!");
    } catch (error) {
      console.log(error);
    }
    // Close the confirmation dialog
  };

  const handleCancelDelete = () => {
    // Close the confirmation dialog without deleting
    setIsDialogOpen(false);
  };

  // Function to handle opening the dialog
  const handleOpenDialog = (id, name, url) => {
    setCurrentName(name);
    setCurrentId(id);
    setdocUrl(url);
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCreateButton = async () => {
    // Validate input fields if needed
    // Pass the title and image URL to the parent component
    try {
      const response = await axios.put(
        API_ROUTES.links.put,
        { id: customer.id, title: title, linkAddress: link },
        { headers: { Authorization: `Bearer ${user}` } }
      );
      handleNotification("Link has been updated");
      customer.title = title;
      customer.linkAddress = link;
    } catch (error) {
      console.log(error);
    }

    // Close the dialog
    handleCloseDialog();
  };
  return (
    <TableRow hover key={customer.id} selected={isSelected}>
      {/* Updating dialog  */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update for {currentName} </DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the title of short link</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="link"
            label="Link Address"
            type="text"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateButton} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete?</DialogContentText>
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
          <Typography variant="subtitle2">{customer.title}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{customer.linkAddress}</TableCell>
      <TableCell>{formattedDate}</TableCell>

      <TableCell sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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

export default LinkCell;
