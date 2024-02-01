// Dashboard.js
import { useEffect, useState } from "react";
import { Container, TextField, Button, Grid } from "@mui/material";
import { API_ROUTES } from "src/utils/apiConfig";
import CustomizedSnackbars from "src/components/Snackbar";
import axios from "axios";
const Links = ({ user, social }) => {
  const [submiting, setSubmiting] = useState(false);
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState({
    facebook: social.faceBook,
    twitter: social.twitter,
    instagram: social.instgram,
    youtube: social.youTube,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks((prevLinks) => ({
      ...prevLinks,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Handle form submission
    setSubmiting(true);
    try {
      const response = await axios.put(
        API_ROUTES.socialMedia.post,
        {
          faceBook: links.facebook,
          twitter: links.twitter,
          youTube: links.youtube,
          instgram: links.instagram,
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setSubmiting(false);
  };

  return (
    <Container>
      <h1>Social Media Links</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Facebook"
            name="facebook"
            value={links.facebook}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="X"
            name="twitter"
            value={links.twitter}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Instagram"
            name="instagram"
            value={links.instagram}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Youtube"
            name="youtube"
            value={links.youtube}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: "10px" }}
        disabled={submiting}
      >
        Save
      </Button>
      <CustomizedSnackbars
        open={open}
        type={"success"}
        message={"The social media links has been changed!"}
      />
    </Container>
  );
};

export default Links;
