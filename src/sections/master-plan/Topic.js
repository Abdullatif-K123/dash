import DocumentIcon from "@heroicons/react/24/solid/PaperClipIcon";
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
import TipTap from "../HomeAbout/TipTapEditor";
import MasterPlanDialog from "src/utils/masterPlan-Dialog";
import { API_ROUTES } from "src/utils/apiConfig";
const Topic = ({ customer, isSelected, handleRemove, handleSelect }) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [docUrl, setdocUrl] = useState("");
  const [desc, setDesc] = useState(customer.description);
  const [title, setTitle] = useState(customer.title);
  const [openPlanDialog, setOpenPlanDialog] = useState(false);
  const [titlePlan, setTitlePlan] = useState("");
  const [descPlan, setDescPlan] = useState("");
  const handleClosePlanDialog = () => {
    setOpenPlanDialog(false);
  };
  const handleOpenPlanDialog = () => {
    setOpenPlanDialog(true);
    console.log(customer.id, customer.masterPlanId);
  };
  //Human readable date
  const dateCreated = new Date(customer.dateCreated);
  const dateUpdated = new Date(customer.dateUpdated);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const humanReadableDateCreated = dateCreated.toLocaleString("en-US", options);
  const humanReadableDateUpdated = dateUpdated.toLocaleString("en-US", options);
  const handleDelete = (id) => {
    // Show the confirmation dialog
    setCurrentId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Handle the deletion logic here

    // ...
    try {
      const response = await axios.delete(`${API_ROUTES.masterPlanContext.delete}/${currentId}`, {
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

  // Function to handle file upload (you can customize this based on your API)
  const handlUpdateConfirm = async () => {
    // Perform file upload logic here

    // const file = fileRef.current.files[0];

    try {
      const response = await axios.put(
        API_ROUTES.masterPlanContext.put,
        {
          id: customer.id,
          title: title,
          description: desc,
          masterPlanId: customer.masterPlanId,
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      handleCloseDialog();
      customer.title = title;
    } catch (error) {
      console.log(error);
    }
    // Make your PUT request with the title and file here
  };
  const handleAddPlanDialog = async () => {
    console.log("confirm");
    console.log(customer.id);
    try {
      const response = await axios.post(
        API_ROUTES.topic.post,

        {
          masterPlanLayerId: Number(customer.id),
          title: titlePlan,
          description: descPlan,
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      console.log(response);
      handleCloseDialog();
    } catch (error) {}
  };
  return (
    <TableRow hover selected={isSelected}>
      {/* {Adding new plan} */}
      <Dialog
        open={openPlanDialog}
        onClose={handleClosePlanDialog}
        fullScreen
        style={{ maxWidth: "90%", left: "270px" }}
      >
        <DialogTitle>Update for {customer.title}</DialogTitle>
        <DialogContent style={{ minWidth: "400px" }}>
          {/* Title input using useRef */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="title-input">Title</InputLabel>
            <Input
              id="title-input"
              type="text"
              value={titlePlan}
              onChange={(e) => {
                setTitlePlan(e.target.value);
              }}
              style={{ marginBottom: "20px" }}
            />
            <label>Description</label>
            <TipTap setDesc={setDescPlan} desc={descPlan} />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePlanDialog} variant="contained" color="info">
            Cancel
          </Button>
          <Button onClick={handleAddPlanDialog} variant="contained" color="success" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Updating dialog  */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen
        style={{ maxWidth: "90%", left: "270px" }}
      >
        <DialogTitle>Update for {currentName}</DialogTitle>
        <DialogContent style={{ minWidth: "400px" }}>
          {/* Title input using useRef */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="title-input">Title</InputLabel>
            <Input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              style={{ marginBottom: "20px" }}
            />
            <label>Description</label>
            <TipTap setDesc={setDesc} desc={desc} />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" color="info">
            Cancel
          </Button>
          <Button onClick={handlUpdateConfirm} variant="contained" color="success" autoFocus>
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
              handleSelect(customer.title);
            }}
          >
            {customer.title}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell> </TableCell>
      <TableCell>{humanReadableDateCreated}</TableCell>
      <TableCell>{humanReadableDateUpdated}</TableCell>
      <TableCell>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleOpenPlanDialog(customer.id, customer.title);
            }}
          >
            +Plan
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              handleOpenDialog(customer.id, customer.title);
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

export default Topic;
