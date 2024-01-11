import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Button,
  SvgIcon,
  DialogActions,
  TextField,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import UserTable from "src/sections/account/UserTable";
import { useRef, useState, useEffect } from "react";
import { API_ROUTES } from "src/utils/apiConfig";
const Page = () => {
  const { user } = useAuth();
  const [open, setIsDialogOpen] = useState(false);
  const inputRef = useRef(null);
  const [apiData, setApiData] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  //creating for add button
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  //Handle Search for
  const handleClose = () => {
    setIsDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  //Making effect for users
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make your API request here
        const response = await axios.get(API_ROUTES.user.getAll, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        console.log(response.data);
        setApiData(response.data.data);
        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  //Creating new users
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (formData.password === formData.confirmPassword) setPasswordError("");
  };
  const handleCreateButton = async (e) => {
    // Validate input fields if needed
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      // Pass the title and image URL to the parent component
      try {
        const response = await axios.post(
          API_ROUTES.user.post,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
          { headers: { Authorization: `Bearer ${user}` } }
        );
        console.log(response);
        setApiData([...apiData, response.data.returnData]);
        const idHolder = response.data.returnData.id;

        handleClose();
      } catch (error) {
        console.log(error);
      }
    }
    // Close the dialog
  };
  //Handle remove stackholder
  const handleRemove = (id) => {
    const updateArray = apiData.filter((item) => item.id !== id);
    setApiData(updateArray);
  };
  return (
    <>
      <Head>
        <title>Users | Gaca</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          {/* Title Dialog  */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Button</DialogTitle>
            <DialogContent>
              <DialogContentText>Please enter the details for the new blg.</DialogContentText>
              <form onSubmit={handleCreateButton}>
                <TextField
                  label="Name"
                  name="name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.password}
                  onChange={handleChange}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={passwordError.length > 0}
                  helperText={passwordError}
                />

                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Create
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Users</Typography>
            </div>
            <div>
              <div style={{ marginBottom: "15px" }}>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  onClick={handleOpenDialog}
                  variant="contained"
                >
                  Add User
                </Button>
              </div>
              <Grid>
                <Grid xs={12} md={6} lg={8}>
                  <UserTable data={apiData} handleRemove={handleRemove} />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
