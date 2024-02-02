import { useCallback, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import classes from "./login.module.css";
import Image from "next/image";
import { Box, Button, InputLabel, Link, Stack, TextField, Typography } from "@mui/material";
import { ArrowLeftSharp } from "@mui/icons-material";
import { useAuth } from "src/hooks/use-auth";

const ForgetPassword = () => {
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState("email");
  const [error, setError] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const value = await auth.forgetPass(values.email);

        setError(value);
        if (!value.length) {
          router.push("/auth/otp");
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Check your connection!!!" });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  return (
    <>
      <Head>
        <title>Forget-Password | Gaca</title>
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
                Forget Password?{" "}
              </Typography>
              <Typography variant="p" sx={{ color: "#8290a1", fontSize: "14px" }}>
                Enter your email, and we&apos;ll send you instructions to reset your password
              </Typography>
            </Stack>

            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email">Email</InputLabel>

                <TextField
                  error={!!(formik.touched.email && formik.errors.email) || error?.length}
                  fullWidth
                  hiddenLabel
                  helperText={formik.touched.email && formik.errors.email}
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                  className={classes.filed}
                />
                <p className={classes.error}>{error}</p>
              </Stack>

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" variant="contained">
                Send Reset Link
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

export default ForgetPassword;
