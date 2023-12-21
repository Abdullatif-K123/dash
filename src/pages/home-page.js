import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import HomeForm from "src/sections/HomeAbout/Home-Section";
import AboutForm from "src/sections/HomeAbout/About-Section";
import axios from "axios";
import { useAuth } from "src/hooks/use-auth";
const HomePage = () => {
  const [homeData, setHomeData] = useState({});
  const [aboutData, setAboutData] = useState({});
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make your API request here
        const response = await axios.get("https://gaca.somee.com/api/Home/GetData", {
          headers: { Authorization: `Bearer ${user}` },
        });

        setHomeData(response.data.returnData);

        // Update the component state with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
    const fetchDataAbout = async () => {
      try {
        // Make your API request here
        const response = await axios.get("https://gaca.somee.com/api/About/GetData", {
          headers: { Authorization: `Bearer ${user}` },
        });
        console.log(response.data);
        setAboutData(response.data.returnData);

        // Update the component state with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchDataAbout();
  }, [user]); // The empty dependency array ensures that the effect runs once when the component mounts
  return (
    <>
      <Head>
        <title>Pages | GACA</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Pages</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <HomeForm user={user} title={homeData.title} desc={homeData.description} />
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

HomePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HomePage;
