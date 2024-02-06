import React, { useEffect, useRef, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { API_ROUTES } from "src/utils/apiConfig";
import { useAuth } from "src/hooks/use-auth";
import axios from "axios";
import { Box, Container, Stack } from "@mui/system";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import Head from "next/head";
import TipTap from "src/sections/HomeAbout/TipTapEditor";
import { PlanFile } from "src/sections/master-plan/PlanFile";
import CustomizedSnackbars from "src/components/Snackbar";
import { ArrowLeftIcon } from "@mui/x-date-pickers";
const SubAdded = () => {
  const [apiData, setApiData] = useState([]);
  const [open, setIsDialogOpen] = useState(false);
  const [descPlan, setDescPlan] = useState("");
  const [status, setStatus] = useState("success");
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();
  const { id, titleContext } = router.query;
  const { user } = useAuth();
  const auth = useAuth();
  // Snackbar handling
  const [openSnack, setOpenSnack] = useState(false);
  const handleClickSnack = (status, message) => {
    setOpenSnack(true);
    setStatus(status);
    setMessage(message);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };
  //creating for add button
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  //Handle Search for
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleCreateButton = async () => {
    // Validate input fields if needed

    const titleValue = inputRef.current.value;
    // Pass the title and image URL to the parent component
    try {
      const response = await axios.post(
        API_ROUTES.sup_topic_addendum.post,
        {
          title: titleValue,
          description: descPlan,
          subTopicId: id,
        },
        { headers: { Authorization: `Bearer ${user}` } }
      );
      handleClickSnack("success", "sub topic addendum has been created successfully ✔");
      const idHolder = response.data.returnData;
      setApiData([...apiData, idHolder]);
    } catch (error) {
      console.log(error);
      handleClickSnack(
        "error",
        error.response ? error.response.data.title : "Something went wrong❌"
      );
    }

    // Close the dialog
    handleClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make your API request here
        const response = await axios.get(`${API_ROUTES.sup_topic_addendum.get}/${id}`, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        setApiData(response.data.returnData);
        console.log(response);
        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
        handleClickSnack;
        if (error?.response?.status == 401) {
          auth.signOut();
          router.replace("/auth/login?expired=true");
        }
      }
    };
    fetchData();
  }, [auth, id, user, router]);

  //Handle remove stackholder
  const handleRemove = (id) => {
    const updateArray = apiData.filter((item) => item.id !== id);
    setApiData(updateArray);
  };
  return (
    <>
      <Head>
        <title>Master Plan | Topic</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography
                  variant="h5"
                  sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  onClick={() => {
                    router.back();
                  }}
                >
                  <ArrowLeftIcon />
                  {titleContext.slice(0, 80)}...
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={handleOpenDialog}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <PlanFile node={"subAddendum"} items={apiData} handleRemove={handleRemove} />
          </Stack>
        </Container>
      </Box>
      {/* Adding new Sub Topic  */}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        style={{ maxWidth: "90%", left: "270px" }}
      >
        <DialogTitle>Add New Sub Topic Addendum</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the details for the new sub topic.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            inputRef={inputRef}
            fullWidth
            style={{ marginBottom: "25px" }}
          />
          <TipTap setDesc={setDescPlan} desc={descPlan} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateButton} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <CustomizedSnackbars
        open={openSnack}
        handleClose={handleCloseSnack}
        type={status}
        message={message}
      />
    </>
  );
};
SubAdded.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SubAdded;
