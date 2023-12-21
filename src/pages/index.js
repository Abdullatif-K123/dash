import Head from "next/head";
import { useEffect, useState } from "react";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { OverViewBlog } from "src/sections/overview/overviewBlog";
import { useAuth } from "src/hooks/use-auth";
import axios from "axios";
const now = new Date();

const Page = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make your API request here
        const response = await axios.get("https://gaca.somee.com/api/Statistics/GetData", {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        console.log(response.data);
        setStatistics(response.data);
        // Update the component state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);
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
              <OverviewTotalCustomers value={statistics.documentCount} />
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
          {/* <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: "This year",
                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                  },
                  {
                    name: "Last year",
                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid> */}
          <Grid xs={12} md={6} lg={5} style={{ marginBottom: "10px" }}>
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
          </Grid>
          {/* <Grid xs={12} md={12} lg={8}>
            <OverviewLatestOrders
              orders={[
                {
                  id: "f69f88012978187a6c12897f",
                  ref: "DEV1049",
                  amount: 30.5,
                  customer: {
                    name: "Ahamd@gmail.com",
                  },
                  createdAt: 1555016400000,
                  status: "pending",
                },
                {
                  id: "9eaa1c7dd4433f413c308ce2",
                  ref: "DEV1048",
                  amount: 25.1,
                  customer: {
                    name: "samer@gmail.com",
                  },
                  createdAt: 1555016400000,
                  status: "delivered",
                },
                {
                  id: "01a5230c811bd04996ce7c13",
                  ref: "DEV1047",
                  amount: 10.99,
                  customer: {
                    name: "Alexa Richardson",
                  },
                  createdAt: 1554930000000,
                  status: "refunded",
                },
                {
                  id: "1f4e1bd0a87cea23cdb83d18",
                  ref: "DEV1046",
                  amount: 96.43,
                  customer: {
                    name: "Anje Keizer",
                  },
                  createdAt: 1554757200000,
                  status: "pending",
                },
                {
                  id: "9f974f239d29ede969367103",
                  ref: "DEV1045",
                  amount: 32.54,
                  customer: {
                    name: "Clarke Gillebert",
                  },
                  createdAt: 1554670800000,
                  status: "delivered",
                },
                {
                  id: "ffc83c1560ec2f66a1c05596",
                  ref: "DEV1044",
                  amount: 16.76,
                  customer: {
                    name: "Adam Denisov",
                  },
                  createdAt: 1554670800000,
                  status: "delivered",
                },
              ]}
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
