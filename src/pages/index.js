import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverViewBlog } from "src/sections/overview/overviewBlog";
import { useAuth } from "src/hooks/use-auth";
import CustomizedSnackbars from "src/components/Snackbar";
import axios from "axios";
import { API_ROUTES } from "src/utils/apiConfig";
const Page = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState({});
  //snackbar handling
  const [openSnack, setOpenSnack] = useState(false);

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnack(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.statistics.get, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });

        setStatistics(response.data);
      } catch (error) {
        console.log(error);
        setOpenSnack(true);
      }
    };
    fetchData();
  }, [user]);
  if (openSnack) {
    return (
      <>
        {" "}
        <CustomizedSnackbars
          open={openSnack}
          handleClose={handleCloseSnack}
          type={"error"}
          message={"Cannot bring the data"}
        />
        <Typography align="center" gutterBottom variant="h5">
          Network error please check your internet connection
        </Typography>
      </>
    );
  }
  if (!Object.keys(statistics).length) {
    return (
      <Typography align="center" gutterBottom variant="h5">
        Loading...
      </Typography>
    );
  }
  return (
    <>
      <Head>
        <title>Overview | GACA</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3} style={{ marginBottom: "10px" }}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={statistics.userCount}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers value={statistics.documentCount} sx={{ height: "100%" }} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress sx={{ height: "100%" }} value={statistics.stakeholderCount} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalProfit sx={{ height: "100%" }} value={statistics.messageCount} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverViewBlog sx={{ height: "100%" }} value={statistics.blogCount} />
            </Grid>
          </Grid>
          {/* <Grid xs={12} md={6} lg={5} style={{ marginBottom: "10px" }}>
            <OverviewTraffic
              chartSeries={[
                statistics.userCount,
                statistics.documentCount,
                statistics.blogCount,
                statistics.stakeholderCount,
                statistics.messageCount,
              ]}
              labels={["User", "Document", "Blog", "Stakeholder", "Message"]}
              sx={{ height: "100%" }}
            />
          </Grid> */}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
