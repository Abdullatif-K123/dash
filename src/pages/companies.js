import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Input,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CompanyCard } from "src/sections/companies/company-card";
import { CompaniesSearch } from "src/sections/companies/companies-search";
const Page = () => {
  const [apiData, setApiData] = useState([]);
  const { user } = useAuth();
  const [createdId, setCreatedId] = useState(null);

  const [open, setIsDialogOpen] = useState(false);
  const inputRef = useRef(null);

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
    console.log(inputRef.current.value);
    const titleValue = inputRef.current.value;
    // Pass the title and image URL to the parent component
    try {
      const response = await axios.post(
        "https://gaca.somee.com/api/Stakeholder/Create",
        {
          title: titleValue,
          imageUrl: "nothinghere",
        },
        { headers: { Authorization: `Bearer ${user}` } }
      );
      console.log(response);

      const idHolder = response.data.returnData.id;
      setCreatedId(idHolder);
    } catch (error) {
      console.log(error);
    }

    handleOpenUploadDialog();
    // Close the dialog
    handleClose();
  };

  //Dialog for uploading file
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [fileUpload, setFileUpload] = useState({});

  // Function to handle opening the file upload dialog
  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  // Function to handle closing the file upload dialog
  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFileUpload(selectedFile);
    // Handle the selected file, e.g., upload it to a server
    console.log("Selected file:", selectedFile);
    // Close the dialog after handling the file
  };
  //Handle remove stackholder
  const handleRemove = (id) => {
    const updateArray = apiData.filter((item) => item.id !== id);
    setApiData(updateArray);
  };
  //Function to handle submitting file
  const handleFileSubmit = async () => {
    console.log(fileUpload);
    const formData = new FormData();
    formData.append("file", fileUpload);
    try {
      const response = await axios.post(
        `https://gaca.somee.com/api/Media/UploadFile/MediaType/stakeholder/Id/${createdId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user}`,
          },
        }
      );
      try {
        // Make your API request here
        const response = await axios.get(
          "https://gaca.somee.com/api/Stakeholder/GetAllPagination",
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        );

        setApiData(response.data.data);
        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error Uploading file", error);
    }
    handleCloseUploadDialog();
  };
  //Seach Filter appyling
  const [searchQuery, SetSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    SetSearchQuery(e.target.value);
  };
  const filterData = apiData.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make your API request here
        const response = await axios.get(
          "https://gaca.somee.com/api/Stakeholder/GetAllPagination",
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        );
        console.log(response.data);
        setApiData(response.data.data);
        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);
  if (!apiData.length) {
    return (
      <Typography align="center" gutterBottom variant="h5">
        Loading...
      </Typography>
    );
  }
  return (
    <>
      <Head>
        <title>Stackholders | GACA</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          {/* Title Dialog  */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Button</DialogTitle>
            <DialogContent>
              <DialogContentText>Please enter the details for the new button.</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                type="text"
                inputRef={inputRef}
                fullWidth
              />
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
          {/* File Upload Dialog */}
          <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
            <DialogTitle>File Upload</DialogTitle>
            <DialogContent>
              {/* Input for file selection */}
              <Input
                type="file"
                onChange={handleFileUpload}
                inputProps={{ accept: ".png, .jpg, .jpeg" }}
              />
            </DialogContent>
            <DialogActions>
              {/* Cancel button */}
              <Button onClick={handleCloseUploadDialog} color="primary">
                Cancel
              </Button>
              {/* Upload button */}
              <Button onClick={handleFileSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Stackholders</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  onClick={handleOpenDialog}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CompaniesSearch handleSearchChange={handleSearchChange} />
            <Grid container spacing={3}>
              {filterData.map((company) => (
                <Grid xs={12} md={6} lg={4} key={company.id}>
                  <CompanyCard handleRemove={handleRemove} company={company} user={user} />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            ></Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page;
