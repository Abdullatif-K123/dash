import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import HomeForm from "src/sections/HomeAbout/Home-Section";
import Links from "src/sections/HomeAbout/Links";
import axios from "axios";
import { API_ROUTES } from "src/utils/apiConfig";
import { useAuth } from "src/hooks/use-auth";
const LinksPage = () => {
  const [homeData, setHomeData] = useState({});
  const [aboutData, setAboutData] = useState({});
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.socialMedia.get, {
          headers: { Authorization: `Bearer ${user}` },
        });
        setHomeData(response.data.returnData);
      } catch (error) {}
    };
    fetchData();
  }, [user]);
  if (!Object.keys(homeData).length) {
    return (
      <Typography align="center" gutterBottom variant="h5">
        Loading...
      </Typography>
    );
  }
  return (
    <>
      <Head>
        <title>Settings Links | GACA</title>
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
              <Grid container spacing={3}>
                <Links user={user} social={homeData} />
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

LinksPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default LinksPage;
