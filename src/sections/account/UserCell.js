import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "src/hooks/use-auth";
import CustomizedSnackbars from "src/components/Snackbar";
import { API_ROUTES } from "src/utils/apiConfig";
const UserCell = ({ item, DateCreate, DateUpdate, handleRemove }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setIsDialogOpenUpdate] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: item.name,
    email: item.email,
  });
  //creating for add button
  const handleOpenDialog = () => {
    setIsDialogOpenUpdate(true);
    setFormData({
      name: item.name,
      email: item.email,
    });
  };

  //Handle Search for
  const handleClose = () => {
    setIsDialogOpenUpdate(false);
    setFormData({
      name: "",
      email: "",
    });
  };
  //Creating new users
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCreateButton = async (e) => {
    // Validate input fields if needed
    e.preventDefault();
    try {
      const response = await axios.put(
        API_ROUTES.user.put,
        {
          id: item.id,
          name: formData.name.length ? formData.name : item.name,
          email: formData.email.length ? formData.email : item.email,
        },
        { headers: { Authorization: `Bearer ${user}` } }
      );
      console.log(response);

      item.name = formData.name.length ? formData.name : item.name;
      item.email = formData.email.length ? formData.email : item.email;

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = () => {
    // Show the confirmation dialog
    setIsDialogOpen(true);
    console.log(user);
  };

  const handleConfirmDelete = async () => {
    // Handle the deletion logic here
    // ...
    try {
      const response = await axios.delete(`${API_ROUTES.user.delete}/${item.id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      setIsDialogOpen(false);
      handleRemove(item.id);
    } catch (error) {
      console.log(error);
    }
    // Close the confirmation dialog
  };

  const handleCancelDelete = () => {
    // Close the confirmation dialog without deleting
    setIsDialogOpen(false);
  };

  return (
    <TableRow>
      {/* Title Dialog  */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Button</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the details for the new blg.</DialogContentText>
          <form onSubmit={handleCreateButton}>
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
            />

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Update
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete dialog */}
      <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
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
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.email}</TableCell>
      <TableCell>{DateCreate}</TableCell>
      <TableCell>{DateUpdate}</TableCell>
      <TableCell>
        {/* Add your edit and delete functionality here */}
        <IconButton aria-label="edit" onClick={handleOpenDialog}>
          <Edit />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDelete}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default UserCell;
