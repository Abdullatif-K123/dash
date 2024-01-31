import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import classes from "./login.module.css";
import Image from "next/image";
import { Box, Button, InputLabel, Link, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { ArrowLeftSharp } from "@mui/icons-material";

const ResetPassword = () => {
  const router = useRouter();
  const auth = useAuth();
  const { user, email } = useAuth();
  console.log(user, email);
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      password: "",
      submit: null,
      rememberMe: false,
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().max(255).required("New Password is required"),
      password: Yup.string()
        .max(255)
        .required("Please confirm the password")
        .test("password-match", "Passwords do not match", function (value) {
          return value === this.parent.newPassword;
        }),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.resetPass(values.newPassword, values.password, user);
        router.replace("/auth/login");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Login | Gaca</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "#f5f5f9",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src="/assets/svg/top-shape.svg"
          width={250}
          height={250}
          alt="top-shape"
          className={classes.backgroundTop}
        />
        <Image
          src="/assets/svg/bottom-shape.svg"
          width={250}
          height={250}
          alt="bottom-shape"
          className={classes.backgroundBottom}
        />
        <Box
          sx={{
            maxWidth: 400,
            px: 3,
            py: "1.5rem",
            width: "100%",
            background: "#fff",
            border: "0 solid #d9dee3",
            borderRadius: "0.5rem",
            boxShadow: "0 2px 6px 0 rgba(67, 89, 113, 0.12)",
            backgroundClip: "padding-box",
            zIndex: 4,
          }}
        >
          <div className={classes.heading}>
            <Image src="/favicon.svg" width={50} height={50} alt="logo" />
            <h2>GACA Management</h2>
          </div>
          <div>
            <Stack spacing={1} sx={{ mb: 4, mt: 4 }}>
              <Typography
                variant="p"
                sx={{ color: "#566a7f", fontSize: "1.375rem", fontWeight: "500" }}
              >
                Reset Password{" "}
              </Typography>
              <Typography variant="p" sx={{ color: "#8290a1", fontSize: "14px" }}>
                for {email}
              </Typography>
            </Stack>

            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={0}>
                <InputLabel htmlFor="newPassword">New Password</InputLabel>

                <TextField
                  fullWidth
                  hiddenLabel
                  name="newPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.newPassword}
                  className={classes.filed}
                />
                <InputLabel htmlFor="password">Confirm Password</InputLabel>

                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                  hiddenLabel
                />
              </Stack>

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                disabled={!formik.isValid || !formik.dirty} // Disable button if form is not valid or unchanged
              >
                Set New Password
              </Button>
            </form>
            <Link
              href="/auth/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
                textDecoration: "none",
              }}
            >
              <ArrowLeftSharp /> Back to log in
            </Link>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default ResetPassword;
