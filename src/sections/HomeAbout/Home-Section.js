import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  TextareaAutosize,
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import CustomizedSnackbars from "src/components/Snackbar";
import TipTap from "./TipTapEditor";
const HomeForm = ({ title, desc, user }) => {
  const [open, setOpen] = React.useState(false);
  const [descs, setDesc] = useState("");
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const [formData, setFormData] = useState({
    title: title,
    description: desc,
  });

  useEffect(() => {
    setFormData({ title: title, description: desc });
  }, [title, desc]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    formData.description = descs;
    try {
      const response = await axios.put("https://gaca.somee.com/api/Home/Update", formData, {
        headers: { Authorization: `Bearer ${user}` },
      });
      handleClick();
      console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  return (
    <Container maxWidth="m">
      <CustomizedSnackbars
        open={open}
        handleClose={handleClose}
        type={"success"}
        message={"The data has been changed"}
      />
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Update Home
          </Typography>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <InputLabel htmlFor="title">Title</InputLabel>
            <TextField
              id="title"
              fullWidth
              margin="auto"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            <InputLabel htmlFor="description">Description</InputLabel>

            <TipTap setDesc={setDesc} desc={desc} />
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HomeForm;
