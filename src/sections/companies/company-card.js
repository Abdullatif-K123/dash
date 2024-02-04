import PropTypes from "prop-types";
import { useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl } from "@mui/material";
import { Input } from "@mui/material";
import { InputLabel } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { API_ROUTES } from "src/utils/apiConfig";
export const CompanyCard = (props) => {
  const { company } = props;
  const { user } = props;
  //Human readable date
  const dateCreated = new Date(company.dateCreated);
  const dateUpdated = new Date(company.dateUpdated);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const humanReadableDateCreated = dateCreated.toLocaleString("en-US", options);
  const humanReadableDateUpdated = dateUpdated.toLocaleString("en-US", options);
  //Delete dialog handler
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [checked, setCheckd] = useState(false);
  const [title, setTitle] = useState(company.title);
  const [imageUrl, setImageUrl] = useState(company.imageUrl);
  const titleRef = useRef(null);
  const fileRef = useRef(null);
  const [fileUpload, setFileUpload] = useState({});
  const handleDelete = () => {
    // Show the confirmation dialog
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Handle the deletion logic here
    // ...
    try {
      const response = await axios.delete(`${API_ROUTES.stakeholder.delete}/${company.id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      setIsDialogOpen(false);
      props.handleRemove(company.id);
      props.notification("success", "Stackholder has been deleted ✔");
      console.log(response);
    } catch (error) {
      console.log(error);
      props.notification("error", "Something went wrong ❌");
    }
    // Close the confirmation dialog
  };

  const handleCancelDelete = () => {
    // Close the confirmation dialog without deleting
    setIsDialogOpen(false);
  };

  //update handler

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  // Function to handle file upload
  const handleFileUploadCompanies = (event) => {
    const selectedFile = event.target.files[0];
    setFileUpload(selectedFile);
    // Handle the selected file, e.g., upload it to a server
    console.log("Selected file:", selectedFile);
    // Close the dialog after handling the file
  };
  // Function to handle file upload (you can customize this based on your API)
  const handleFileUpload = async () => {
    // Perform file upload logic here

    // const file = fileRef.current.files[0];
    if (checked) {
      const formData = new FormData();
      formData.append("file", fileUpload);
      try {
        const response = await axios.post(
          `${API_ROUTES.media.StakeholderPost}/${company.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user}`,
            },
          }
        );

        setImageUrl(response.data.returnData);
        handleCloseDialog();
        props.notification("success", "Stackholder has been changed ✔");
      } catch (error) {
        console.log(error);
        props.notification("error", "Something went wrong ❌");
      }
    } else {
      const titles = titleRef.current.value;
      try {
        const response = await axios.put(
          API_ROUTES.stakeholder.put,
          {
            id: company.id,
            title: titles,
            imageUrl: company.imageUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        );
        setTitle(response.data.returnData.title);
        props.notification("success", "Stackholder title has been changed ✔");
        handleCloseDialog();
      } catch (error) {
        console.log(error);
        props.notification("error", "Something went wrong ❌");
      }
    }

    // Make your PUT request with the title and file here
  };
  const label = { inputProps: { "aria-label": "Switch demo" } };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Image Upload Dialog */}
      <>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Update for {title}</DialogTitle>
          <DialogContent style={{ minWidth: "400px" }}>
            {/* Title input using useRef */}
            {checked ? (
              <DialogContent>
                {/* Input for file selection */}
                <Input
                  type="file"
                  onChange={handleFileUploadCompanies}
                  inputProps={{ accept: ".png, .jpg, .jpeg" }}
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
            <Button onClick={handleCloseDialog} color="info">
              Cancel
            </Button>
            <Button onClick={handleFileUpload} color="error" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete dialog */}
        <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
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
      </>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 3,
          }}
        >
          <img
            src={`${API_ROUTES.domainName}/${imageUrl}`}
            width={120}
            height={120}
            alt={company.title}
          />
        </Box>
        <Typography align="center" gutterBottom variant="h5">
          {title}
        </Typography>
      </CardContent>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={0}
        sx={{ p: 1, fontSize: "0.7rem", color: "gray" }} // Adjust the font size and color
      >
        <Typography align="flex-start" gutterBottom variant="h8">
          Created at: {humanReadableDateCreated}
        </Typography>
        <Typography align="center" gutterBottom variant="h8">
          Updated at: {humanReadableDateUpdated}
        </Typography>
      </Stack>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          <Button variant="contained" color="info" onClick={handleOpenDialog}>
            Update
          </Button>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired,
};
