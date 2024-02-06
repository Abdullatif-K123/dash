import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Input,
  InputLabel,
  TextareaAutosize,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CustomizedSnackbars from "src/components/Snackbar";
import axios from "axios";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "next/router";
import { PlanFile } from "src/sections/master-plan/PlanFile";
import TipTap from "src/sections/HomeAbout/TipTapEditor";
import { API_ROUTES } from "src/utils/apiConfig";
const MasterPlan = () => {
  const [apiData, setApiData] = useState([]);
  const [open, setIsDialogOpen] = useState(false);
  const [masterTitle, setMasterTitle] = useState("");
  const [masterDescription, setMasterDescriptoin] = useState("");
  const [descPlan, setDescPlan] = useState("");
  const [status, setStatus] = useState("success");
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();
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
  //Creating Dialogs for adding a new documents
  const { slug } = router.query;
  const id = slug.at(-1);

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
        API_ROUTES.masterPlanContext.post,
        {
          title: titleValue,
          description: descPlan,
          masterPlanId: id,
        },
        { headers: { Authorization: `Bearer ${user}` } }
      );
      handleClickSnack("success", "New topic has added ✔");
      const idHolder = response.data.returnData;
      setApiData([...apiData, idHolder]);
    } catch (error) {
      console.log(error);
      handleClickSnack("error", "Something went wrong ❌");
    }
    // Close the dialog
    handleClose();
  };

  //Handle remove stackholder
  const handleRemove = (id) => {
    const updateArray = apiData.filter((item) => item.id !== id);
    setApiData(updateArray);
  };

  //Get the data from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make your API request here
        const response = await axios.get(`${API_ROUTES.masterPlanContext.get}/${id}`, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        setApiData(response.data.returnData);

        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };
    const fetchData2 = async () => {
      try {
        // Make your API request here
        const response = await axios.get(API_ROUTES.masterPlan.get, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });

        setMasterTitle(response.data.returnData[id - 1].title);
        setMasterDescriptoin(response.data.returnData[id - 1].descripton);
        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };
    fetchData2();
    fetchData();
  }, [user, id]);

  const handleChange = (e) => {
    setMasterTitle(e.target.value);
  };
  //Updating title of the layer
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        API_ROUTES.masterPlan.put,
        {
          id: id,
          title: masterTitle,
          descripton: masterDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      handleClickSnack();
    } catch (erro) {
      console.log(erro);
    }
  };
  return (
    <>
      <Head>
        <title>Master Plan | GACA</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        {/* Snackbar */}
        <CustomizedSnackbars
          open={openSnack}
          handleClose={handleCloseSnack}
          type={"success"}
          message={"The data has been changed"}
        />
        {/* Title Dialog  */}
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          style={{ maxWidth: "90%", left: "270px" }}
        >
          <DialogTitle>Add New Context Plan</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the details for the new context plan.
            </DialogContentText>
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
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Master Plan Layer{id}</Typography>
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
            {/* <CustomersSearch handleSearchChange={handleSearchChange} /> */}
            <InputLabel htmlFor="title">Title</InputLabel>
            <TextField
              id="title"
              onChange={handleChange}
              fullWidth
              name="title"
              hiddenLabel
              value={masterTitle}
            />
            <InputLabel htmlFor="description">Description</InputLabel>
            <TextareaAutosize
              placeholder="Layer description"
              id="description"
              onChange={(e) => {
                setMasterDescriptoin(e.target.value);
              }}
              fullWidth
              name="Description"
              minRows={3}
              value={masterDescription}
              style={{
                padding: "2px",
                border: "2px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
                resize: "none",
              }}
            />
            <div>
              <Button onClick={handleUpdate} color="warning" variant="contained">
                Update Layer info
              </Button>
            </div>

            <PlanFile items={apiData} handleRemove={handleRemove} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

MasterPlan.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MasterPlan;
