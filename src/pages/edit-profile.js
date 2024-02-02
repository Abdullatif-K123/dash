import { useEffect, useState } from "react";
import Head from "next/head";
import { Unstable_Grid2 as Grid, TextField, Button, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuth } from "src/hooks/use-auth";
import axios from "axios";
import { API_ROUTES } from "src/utils/apiConfig";
import { Box, Container, Stack } from "@mui/system";
import CustomizedSnackbars from "src/components/Snackbar";
import { Password } from "@mui/icons-material";

import { useFormik } from "formik";
import * as Yup from "yup";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
const LinksPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("success");
  const [initialForms, setInitialForms] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { user } = useAuth();

  // Validation schema for password
  const passwordValidationSchema = Yup.string()
    .min(8, "Password should be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .required("Password is required");

  const handleSave = async () => {
    // Handle save logic here

    try {
      await axios.put(
        API_ROUTES.profile.put,
        {
          name: name,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      setOpenSnack(true);
      setMessage("Your data has been changed!!");
      setTimeout(() => {
        setOpenSnack(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.profile.get, {
          headers: { Authorization: `Bearer ${user}` },
        });
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user]);
  //validation for reset password using formik
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .min(8, "Password should not be less than 8 characters")
        .required("You have to write the old password"),
      newPassword: passwordValidationSchema,
      confirmPassword: Yup.string()
        .min(8)
        .required("Please confirm the password")
        .test("password-match", "Passwords do not match", function (value) {
          return value === this.parent.newPassword;
        }),
    }),
    onSubmit: async (values, helpers) => {
      console.log(values);
      try {
        await axios.put(
          API_ROUTES.profile.changePassPut,
          {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        );
        setOpenSnack(true);
        setStatus("success");
        setMessage("Password has been changed successfully !");
        values.oldPassword = "";
        values.newPassword = "";
        values.confirmPassword = "";
        setTimeout(() => {
          setOpenSnack(false);
        }, 3000);
        setShowChangePassword(false);
      } catch (error) {
        console.log(error);
        setStatus("error");
        setMessage(error.response.data.errorMessage);
        setOpenSnack(true);
        setTimeout(() => {
          setOpenSnack(false);
        }, 3000);
      }
    },
  });
  return (
    <>
      <Head>
        <title>Profile | GACA</title>
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
            <Typography
              variant="h4"
              sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
            >
              My Profile <UserIcon width={30} height={30} />{" "}
            </Typography>
            <Box sx={{ display: "flex", gap: "16px" }}>
              <TextField
                label="Email"
                value={email}
                type="email"
                required
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Name"
                fullWidth
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Button onClick={handleSave} variant="contained" color="primary" fullWidth>
              Save
            </Button>

            {showChangePassword && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <TextField
                    label="Old Password"
                    name="oldPassword"
                    type="password"
                    onBlur={formik.handleBlur}
                    value={formik.values.oldPassword}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                  {formik.touched.oldPassword && formik.errors.oldPassword && (
                    <div style={{ fontSize: "12px", color: "red" }}>
                      {formik.errors.oldPassword}
                    </div>
                  )}
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    id="newPassword"
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    required
                    fullWidth
                  />
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <div style={{ fontSize: "12px", color: "red" }}>
                      {formik.errors.newPassword}
                    </div>
                  )}
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    label="Confirm Password"
                    name="confirmPassword"
                    onBlur={formik.handleBlur}
                    type="password"
                    id="confirmPassword"
                    required={true}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div style={{ fontSize: "12px", color: "red" }}>
                      {formik.errors.confirmPassword}
                    </div>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!formik.isValid || !formik.dirty}
                  >
                    Change Password
                  </Button>
                </Box>
              </form>
            )}

            {!showChangePassword && (
              <Button
                onClick={() => setShowChangePassword(!showChangePassword)}
                variant="outlined"
                color="primary"
              >
                Change Password?
              </Button>
            )}
          </Stack>
        </Container>
        <CustomizedSnackbars open={openSnack} type={status} message={message} />
      </Box>
    </>
  );
};

LinksPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default LinksPage;
