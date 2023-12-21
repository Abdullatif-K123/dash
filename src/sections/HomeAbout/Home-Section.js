import React, { useEffect, useState } from "react";
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

const HomeForm = ({ title, desc, user }) => {
  const [open, setOpen] = React.useState(false);

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
    <Container maxWidth="sm">
      <CustomizedSnackbars
        open={open}
        handleClose={handleClose}
        type={"success"}
        message={"The data has been changed"}
      />
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Update Home
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
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
            <TextareaAutosize
              placeholder="Description"
              style={{ width: "100%", marginBottom: "1rem" }}
              minRows={15}
              minCo
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HomeForm;
