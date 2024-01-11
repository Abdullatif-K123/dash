import { useCallback, useMemo, useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
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
const now = new Date();

let data = [];

const useCustomers = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useCustomerIds = (customers) => {
  return useMemo(() => {
    return customers.map((customer) => customer.id);
  }, [customers]);
};

const MasterPlan = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [apiData, setApiData] = useState([]);
  const [open, setIsDialogOpen] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [masterTitle, setMasterTitle] = useState("");
  const [descPlan, setDescPlan] = useState("");
  const inputRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();
  // Snackbar handling
  const [openSnack, setOpenSnack] = useState(false);
  const handleClickSnack = () => {
    setOpenSnack(true);
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
      handleClickSnack();
      const idHolder = response.data.returnData;
      setApiData([...apiData, idHolder]);
      console.log(idHolder);
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

  //Handle remove stackholder
  const handleRemove = (id) => {
    const updateArray = apiData.filter((item) => item.id !== id);
    setApiData(updateArray);
  };
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

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

        console.log(response.data.returnData);
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
        setMasterTitle(response.data.returnData[id - 1]);
        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };
    fetchData2();
    fetchData();
  }, [user, id]);

  //Seach Filter appyling
  const [searchQuery, SetSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    SetSearchQuery(e.target.value);
  };
  const filterData = apiData.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
        <Dialog fullWidth open={open} onClose={handleClose}>
          <DialogTitle>Add New Plan</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter the details for the new Plan.</DialogContentText>
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
              value={masterTitle.title}
            />
            <div>
              <Button onClick={handleUpdate} color="warning" variant="contained">
                Update Title
              </Button>
            </div>

            <PlanFile
              count={filterData.length}
              items={filterData}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
              handleRemove={handleRemove}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

MasterPlan.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MasterPlan;
