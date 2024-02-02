import { Delete, Edit, Label } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
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
  const [upDatePassword, setUpdatePassword] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState(".");
  const [status, setStatus] = useState("success");
  const [testing, setTesting] = useState(true);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: item.name,
    email: item.email,
    newPassword: "",
    confirmPassword: "",
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
      newPassword: "",
      confirmPassword: "",
    });
    setUpdatePassword(false);
    setTesting(true);
    setTimeout(() => {
      setOpenSnack(false);
    }, 3000);
  };
  //Creating new users
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (upDatePassword) {
      name === "newPassword"
        ? formData.confirmPassword !== e.target.value
          ? setTesting(true)
          : setTesting(false)
        : formData.newPassword !== e.target.value
        ? setTesting(true)
        : setTesting(false);
    }
  };

  const handleCreateButton = async (e) => {
    // Validate input fields if needed
    e.preventDefault();
    if (upDatePassword) {
      try {
        await axios
          .put(
            API_ROUTES.user.putPassword,
            {
              userId: item.id,
              newPassword: formData.newPassword,
              confirmPassword: formData.confirmPassword,
            },
            {
              headers: {
                Authorization: `Bearer ${user}`,
              },
            }
          )
          .then((response) => {
            handleClose();
            setOpenSnack(true);
            setMessage("Password of the user has been changed!!!");
            setStatus("success");
          });
      } catch (error) {
        setOpenSnack(true);
        setMessage(error.response ? error.response.data.errorMessage : "Check you connection");
        setStatus("error");
      }
      setTimeout(() => {
        setOpenSnack(false);
      }, 3000);
    } else {
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

        item.name = formData.name.length ? formData.name : item.name;
        item.email = formData.email.length ? formData.email : item.email;
        setOpenSnack(true);
        setStatus("success");
        setMessage("Information of the user has been changed");

        handleClose();
      } catch (error) {
        console.log(error);
        setOpenSnack(true);
        setStatus("error");
        setMessage(error.response ? error.response.data.errorMessage : "Check you connection");
      }
    }
  };
  const handleDelete = () => {
    // Show the confirmation dialog
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
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
        <DialogTitle>Update user {upDatePassword ? "Password" : "Info"}</DialogTitle>
        <DialogContent>
          {upDatePassword ? "Make sure to write at least 8 character for new password" : ""}
        </DialogContent>
        <DialogContent>
          <form onSubmit={handleCreateButton}>
            {!upDatePassword ? (
              <>
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
              </>
            ) : (
              <>
                <FormLabel id="newPassword">New Password</FormLabel>
                <TextField
                  name="newPassword"
                  variant="outlined"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <TextField
                  name="confirmPassword"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </>
            )}

            <Button
              onClick={() => {
                setUpdatePassword(!upDatePassword);
              }}
              variant="outlined"
              color="success"
            >
              {upDatePassword ? "Hide" : "Show"} Update Password?
            </Button>

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              {upDatePassword ? (
                <Button type="submit" color="primary" disabled={testing}>
                  Update
                </Button>
              ) : (
                <Button type="submit" color="primary">
                  Update
                </Button>
              )}
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
      <TableCell>{DateUpdate === "Invalid Date" ? "" : DateUpdate}</TableCell>
      <TableCell>
        {/* Add your edit and delete functionality here */}
        <IconButton aria-label="edit" onClick={handleOpenDialog}>
          <Edit />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDelete}>
          <Delete />
        </IconButton>
      </TableCell>
      <CustomizedSnackbars open={openSnack} type={status} message={message} />
    </TableRow>
  );
};

export default UserCell;
