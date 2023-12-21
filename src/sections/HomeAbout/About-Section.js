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

const AboutForm = ({ user, content, mission, vision }) => {
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
    content: content,
    vision: vision,
    mission: mission,
  });

  useEffect(() => {
    setFormData({ content: content, vision: vision, mission: mission });
  }, [content, mission, vision]);
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
      const response = await axios.put("https://gaca.somee.com/api/About/Update", formData, {
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
            About Update
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <InputLabel htmlFor="content">Content</InputLabel>
            <TextareaAutosize
              placeholder="Content"
              style={{ width: "100%", marginBottom: "1rem" }}
              minRows={15}
              minCo
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
            <InputLabel htmlFor="vision">Vision</InputLabel>
            <TextareaAutosize
              placeholder="vision"
              style={{ width: "100%", marginBottom: "1rem" }}
              minRows={15}
              minCo
              name="vision"
              value={formData.vision}
              onChange={handleChange}
            />
            <InputLabel htmlFor="mission">Mission</InputLabel>
            <TextareaAutosize
              placeholder="mission"
              style={{ width: "100%", marginBottom: "1rem" }}
              minRows={15}
              minCo
              name="mission"
              value={formData.mission}
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

export default AboutForm;
