import { useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import { MessagesOverView } from "src/sections/messages/MessagesOverView";
import { useAuth } from "src/hooks/use-auth";
import { API_ROUTES } from "src/utils/apiConfig";
import axios from "axios";
const now = new Date();
const data = [];
const useCustomers = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const Page = () => {
  //Get the data from server
  const { user } = useAuth();
  const [apiData, setApiData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make your API request here
        const response = await axios.get(API_ROUTES.message.getAll, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        const updatedResponse = response.data.data.sort((a, b) => a.isSeen);
        setApiData(updatedResponse);

        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
