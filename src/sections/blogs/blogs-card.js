import PropTypes from "prop-types";
import { useRef } from "react";
import Image from "next/image";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  Button,
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

export const BlogCard = (props) => {
  const [showFullContent, setShowFullContent] = useState(false);
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
  const titleRef = useRef(null);
  const fileRef = useRef(null);
  const handleDelete = () => {
    // Show the confirmation dialog
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Handle the deletion logic here
    // ...
    try {
      const response = await axios.delete(`https://gaca.somee.com/api/Blog/Delete/${company.id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      setIsDialogOpen(false);
      props.handleRemove(company.id);
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

  //update handler

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
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
        "https://gaca.somee.com/api/Stakeholder/Update",
        {
          id: company.id,
          title: title,
          imageUrl: company.imageUrl,
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
          <DialogTitle>Update for {company.title.slice(0, 10)}...</DialogTitle>
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
            src={`https://gaca.somee.com/${company.imageUrl}`}
            width={350}
            height={200}
            alt={company.title}
          />
        </Box>
        <Typography align="center" textAlign="left" gutterBottom variant="h6">
          {company.title}
        </Typography>
        <Typography
          align="center"
          color="gray"
          textAlign="left"
          gutterBottom
          variant="h8"
          display="flex"
        >
          {showFullContent ? (
            <p>{company.description}</p>
          ) : (
            <p>
              {company.description.slice(0, 150)}...
              <span
                style={{ color: "#61affe", cursor: "pointer" }}
                onClick={() => {
                  setShowFullContent(!showFullContent);
                }}
              >
                Read-More
              </span>
            </p>
          )}
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
        <Typography align="center" gutterBottom variant="h8"></Typography>
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

BlogCard.propTypes = {
  company: PropTypes.object.isRequired,
};
