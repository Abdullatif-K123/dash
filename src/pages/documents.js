import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Input } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useAuth } from "src/hooks/use-auth";
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

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [apiData, setApiData] = useState([]);
  const [open, setIsDialogOpen] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const inputRef = useRef(null);
  const { user } = useAuth();
  //creating for add button
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  //Handle Search for Documents
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleCreateButton = async () => {
    // Validate input fields if needed
    const titleValue = inputRef.current.value;
    // Pass the title and image URL to the parent component
    try {
      const response = await axios.post(
        API_ROUTES.document.post,
        {
          title: titleValue,
          imageUrl: "nothinghere",
        },
        { headers: { Authorization: `Bearer ${user}` } }
      );

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
    // Close the dialog after handling the file
  };
  //Handle remove stackholder
  const handleRemove = (id) => {
    const updateArray = apiData.filter((item) => item.id !== id);
    setApiData(updateArray);
  };
  //Function to handle submitting file
  const handleFileSubmit = async () => {
    const formData = new FormData();
    formData.append("file", fileUpload);
    try {
      const response = await axios.post(`${API_ROUTES.media.doucmentPost}/${createdId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user}`,
        },
      });
      try {
        // Make your API request here
        const response = await axios.get(API_ROUTES.document.getAll, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });

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
        const response = await axios.get(API_ROUTES.document.getAll, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        setApiData(response.data.data);
        data = response.data.data;
        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  //Seach Filter appyling
  const [searchQuery, SetSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    SetSearchQuery(e.target.value);
  };
  const filterData = apiData.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <Head>
        <title>Documents | GACA</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
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
            <Input type="file" onChange={handleFileUpload} inputProps={{ accept: ".pdf" }} />
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

        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Download Archive</Typography>
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
            <CustomersSearch handleSearchChange={handleSearchChange} />
            <CustomersTable
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

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
