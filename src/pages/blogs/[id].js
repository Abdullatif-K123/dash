import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  Button,
  Typography,
  CardMedia,
  CardContent,
  Card,
  Input,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import TipTap from "src/sections/HomeAbout/TipTapEditor";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Box } from "@mui/system";
import CustomizedSnackbars from "src/components/Snackbar";
const EditableCard = () => {
  const router = useRouter();
  const { id } = router.query;
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [image, setImage] = useState(""); // Replace with your default image path
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("Card Description");
  const { user } = useAuth();
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  //Deleting Blog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDelete = () => {
    // Show the confirmation dialog
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Handle the deletion logic here
    // ...
    try {
      const response = await axios.delete(`https://gaca.somee.com/api/Blog/Delete/${id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      setIsDialogOpen(false);
      router.replace("/blogs");
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
  const handleEditClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleUpdate = () => {
    // Handle update logic here
    setOpenDialog(false);
  };
  const handleupdateBolg = async () => {
    try {
      const response = await axios.put(
        "https://gaca.somee.com/api/Blog/Update",
        {
          id: id,
          title: title,
          description: description,
          imageUrl: image,
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      handleClick();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make your API request here
        const response = await axios.get(`https://gaca.somee.com/api/Blog/GetById/${id}`, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        const data = response.data.returnData;
        setTitle(data.title);
        setDescription(data.description);
        setImage(data.imageUrl);
        console.log(response.data);

        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user, id]);

  //Dialog for uploading file
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [fileUpload, setFileUpload] = useState({});

  // Function to handle opening the file upload dialog
  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  // Function to handle closing the file upload dialog
  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };
  // Function to handle file upload
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFileUpload(selectedFile);
    // Handle the selected file, e.g., upload it to a server
    console.log("Selected file:", selectedFile);
    // Close the dialog after handling the file
  };
  //Function to handle submitting file
  const handleFileSubmit = async () => {
    console.log(fileUpload);
    const formData = new FormData();
    formData.append("file", fileUpload);
    try {
      const response = await axios.post(
        `https://gaca.somee.com/api/Media/UploadFile/MediaType/blog/Id/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user}`,
          },
        }
      );
      handleClick();
      setImage(response.data.returnData);
    } catch (error) {
      console.error("Error Uploading file", error);
    }
    handleCloseUploadDialog();
  };
  if (!title.length) {
    return (
      <Typography align="center" gutterBottom variant="h5">
        Loading...
      </Typography>
    );
  }

  return (
    <Card>
      <CustomizedSnackbars
        open={open}
        handleClose={handleClose}
        type={"success"}
        message={"The data has been changed"}
      />
      <div>
        <CardMedia
          component="img"
          alt="Card Image"
          className="cardMedia"
          style={{ height: "350px", objectFit: "cover" }}
          image={`https://gaca.somee.com/${image}`}
          onClick={handleOpenUploadDialog}
        />
        <Typography className="editOverlay">Edit</Typography>
        {/* File Upload Dialog */}
        <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
          <DialogTitle>File Upload</DialogTitle>
          <DialogContent>
            {/* Input for file selection */}
            <Input
              type="file"
              onChange={handleFileUpload}
              inputProps={{ accept: ".png, .jpg, .jpeg" }}
            />
          </DialogContent>
          <DialogActions>
            {/* Cancel button */}
            <Button onClick={handleCloseUploadDialog} color="primary">
              Cancel
            </Button>
            {/* Upload button */}
            <Button onClick={handleFileSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <CardContent>
        <Typography variant="h5" component="div" marginBottom={5}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Typography>
        <TipTap desc={description} setDesc={setDescription} />
        <Box marginTop={1}>
          <Button onClick={handleupdateBolg} color="info" variant="contained">
            Update
          </Button>
          <Button
            style={{ marginLeft: "15px" }}
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </Box>
      </CardContent>

      {/* Delete dialog */}
      <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this Blog?</DialogContentText>
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
    </Card>
  );
};

EditableCard.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default EditableCard;
