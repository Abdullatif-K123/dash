import React, { useState } from "react";
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
import axios from "axios";
import TipTap from "src/sections/HomeAbout/TipTapEditor";
const MasterPlanDialog = (
  openDialog,
  handleCloseDialog,
  currentName,
  titleProp,
  description,
  method,
  API_URL,
  user,
  id
) => {
  const [title, setTitle] = useState(titleProp);
  const [desc, setDesc] = useState(description);
  const handleUpdateConfirm = async () => {
    try {
      const response = await axios.post(
        API_URL,
        {
          masterPlanLayerId: id,
          title: title,
          description: desc,
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
        <Button onClick={handleUpdateConfirm} variant="contained" color="success" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MasterPlanDialog;
