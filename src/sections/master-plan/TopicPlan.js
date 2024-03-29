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
import { API_ROUTES } from "src/utils/apiConfig";
import { useRouter } from "next/router";
const TopicPlan = ({ method, customer, isSelected, handleRemove, handleSelect, notification }) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [docUrl, setdocUrl] = useState("");
  const [desc, setDesc] = useState(customer.description);
  const [descriptionPlan, setDescriptionPlan] = useState(customer.description);
  const [title, setTitle] = useState(customer.title);
  const [openPlanDialog, setOpenPlanDialog] = useState(false);
  const [titlePlan, setTitlePlan] = useState("");
  const [descPlan, setDescPlan] = useState("");
  const router = useRouter();
  const handleClosePlanDialog = () => {
    setOpenPlanDialog(false);
  };
  const handleOpenPlanDialog = () => {
    setOpenPlanDialog(true);
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
    console.log(id);
    // Show the confirmation dialog
    setCurrentId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Handle the deletion logic here

    // ...
    try {
      const response = await axios.delete(
        `${
          method === "plan" ? API_ROUTES.topic.delete : API_ROUTES.masterPlanContext.delete
        }/${currentId}`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      setIsDialogOpen(false);
      handleRemove(currentId);
      notification("success", "Topic has been deleted ✔");
    } catch (error) {
      console.log(error);
      notification("error", "Something went wrong ❌");
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
    console.log(customer);
    // const file = fileRef.current.files[0];

    try {
      const response = await axios.put(
        API_ROUTES.topic.put,
        {
          id: customer.id,
          title: title,
          description: desc,
          masterPlanId: customer.masterPlanLayerId,
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      handleCloseDialog();
      notification("success", "Topic has been updated successfully ✔");
      customer.title = title;
      console.log(response.data);
    } catch (error) {
      console.log(error);
      notification(
        "error",
        error.response ? error.response.data.errorMessage : "something went wrong ❌"
      );
    }
    // Make your PUT request with the title and file here
  };
  const handleAddPlanDialog = async () => {
    console.log("confirm");
    console.log(customer.id);
    try {
      const response = await axios.post(
        API_ROUTES.sup_topic.post,

        {
          topicId: customer.id,
          title: titlePlan,
          description: descPlan,
        },
        {
          headers: {
            Authorization: `Bearer  ${user}`,
          },
        }
      );

      notification("success", "SubTopic has been added successfully ✔");
      handleClosePlanDialog();
    } catch (error) {
      console.log(error);
      if (error.response) notification("error", error.response.data.errorMessage);
      else notification("error", "Soemthing went wrong check your connection ❌");
    }
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
            {method === "plan" ? (
              <TipTap setDesc={setDescriptionPlan} desc={descriptionPlan} key={customer.id} />
            ) : (
              <TipTap setDesc={setDesc} desc={desc} key={customer.id} />
            )}
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
          <Typography variant="subtitle2" style={{ cursor: "pointer" }}>
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
              router.push(
                `/master-plan/layer/subtopic?id=${customer.id}&titleContext=${customer.title}`
              );
            }}
          >
            SubTopic
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

export default TopicPlan;
