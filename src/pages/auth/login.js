import { useCallback, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import classes from "./login.module.css";
import Image from "next/image";

import { usePathname, useSearchParams } from "next/navigation";
import CustomizedSnackbars from "src/components/Snackbar";
import {
  Box,
  Button,
  Checkbox,
  InputLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("resetSuccess");
  const auth = useAuth();
  const [method, setMethod] = useState("email");
  const [rememberMe, setRememberMe] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn(values.email, values.password);
        router.push("/");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
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
                Welcome to GACA !{" "}
              </Typography>
              <Typography variant="p" sx={{ color: "#8290a1", fontSize: "14px" }}>
                Please sign-in to your account and start the adventure
              </Typography>
            </Stack>

            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={0}>
                <InputLabel htmlFor="email">Email</InputLabel>

                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
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
                <div className={classes.passowrdFroget}>
                  <InputLabel htmlFor="Password">Password</InputLabel>

                  <Link href="/auth/forget-password" style={{ textDecoration: "none" }}>
                    <p className={classes.forgetPass}>Forget Password?</p>
                  </Link>
                </div>
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
                {/* Remember Me Checkbox */}
                <Stack direction="row" alignItems="center" spacing={-1}>
                  <Checkbox
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={() => {
                      setRememberMe(!rememberMe);
                    }}
                    color="primary"
                  />
                  <Typography variant="body2" sx={{ color: "darkgray" }}>
                    Remember Me
                  </Typography>
                </Stack>
              </Stack>

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
            </form>
          </div>
          <CustomizedSnackbars
            open={resetSuccess} // Pass the resetSuccess flag to determine if the Snackbar should be shown
            type="success" // Define the type of the Snackbar (e.g., success, error, warning)
            message="Password reset successfully!" // Define the message to be displayed in the Snackbar
          />
        </Box>
      </Box>
    </>
  );
};

export default Page;
