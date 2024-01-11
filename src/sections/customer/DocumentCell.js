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
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useRef, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "src/utils/apiConfig";
const DocumentCell = ({ customer, isSelected, formattedDate, handleRemove, user }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [docUrl, setdocUrl] = useState("");
  const titleRef = useRef(null);
  const [checked, setCheckd] = useState(false);
  const [fileUpload, setFileUpload] = useState({});
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
      const response = await axios.delete(`${API_ROUTES.document.delete}/${currentId}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      setIsDialogOpen(false);
      handleRemove(currentId);
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
  // Function to handle file upload
  const handleFileUploadDoucments = (event) => {
    const selectedFile = event.target.files[0];
    setFileUpload(selectedFile);
    // Handle the selected file, e.g., upload it to a server
    console.log("Selected file:", selectedFile);
  };
  // Function to handle file upload (you can customize this based on your API)
  const handleFileUpload = async () => {
    // const file = fileRef.current.files[0];
    if (checked) {
      const formData = new FormData();
      formData.append("file", fileUpload);
      console.log(formData);
      try {
        const response = await axios.post(
          `${API_ROUTES.media.doucmentPost}/${customer.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const title = titleRef.current.value;
        const response = await axios.put(
          API_ROUTES.document.put,
          {
            id: customer.id,
            title: title,
            imageUrl: customer.imageUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        );
        customer.title = title;
      } catch (error) {
        console.log(error);
      }
    }
    handleCloseDialog();
    // Make your PUT request with the title and file here
  };

  return (
    <TableRow hover key={customer.id} selected={isSelected}>
      {/* Updating dialog  */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update for {currentName}</DialogTitle>
        <DialogContent style={{ minWidth: "400px" }}>
          {checked ? (
            <DialogContent>
              {/* Input for file selection */}
              <Input
                type="file"
                onChange={handleFileUploadDoucments}
                inputProps={{ accept: ".pdf" }}
              />
            </DialogContent>
          ) : (
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="title-input">Title</InputLabel>
              <Input id="title-input" type="text" inputRef={titleRef} />
            </FormControl>
          )}
          <FormControlLabel
            checked={checked}
            onChange={() => setCheckd(!checked)}
            control={<Switch name="antoine" />}
            label="Upload Image"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleFileUpload} color="info" autoFocus>
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
              downloadPdf(`${API_ROUTES.domainName}/${customer.imageUrl}`);
            }}
          >
            {customer.title}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>{customer.FileSize}</TableCell>
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

export default DocumentCell;
