import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import { MessagesOverView } from "src/sections/messages/MessagesOverView";
import { useAuth } from "src/hooks/use-auth";
import axios from "axios";
const now = new Date();
const data = [];
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
  //Get the data from server
  const { user } = useAuth();
  const [apiData, setApiData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make your API request here
        const response = await axios.get("https://gaca.somee.com/api/Message/GetAllPagination", {
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

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
        <title>Messages | GACA</title>
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
            <Stack direction="row" justifyContent="space-between" spacing={4}></Stack>
            {/* <CustomersSearch /> */}
            <MessagesOverView data={apiData} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
