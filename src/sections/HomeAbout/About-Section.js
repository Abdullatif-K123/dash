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
import TipTap from "./TipTapEditor";
const AboutForm = ({ user, content, mission, vision }) => {
  const [open, setOpen] = React.useState(false);
  const [about1, setAbout1] = useState(content);
  const [about2, setAbout2] = useState(vision);
  const [about3, setAbout3] = useState(mission);
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
    setAbout1(content);
    setAbout2(vision);
    setAbout3(mission);
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
    <Container maxWidth="m">
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
          <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <InputLabel htmlFor="content">Content</InputLabel>
            <TipTap setDesc={setAbout1} desc={about1} />
            <InputLabel htmlFor="vision">Vision</InputLabel>
            <TipTap setDesc={setAbout2} desc={about2} />
            <InputLabel htmlFor="mission">Mission</InputLabel>
            <TipTap setDesc={setAbout3} desc={about3} />

            <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
              Update
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AboutForm;
