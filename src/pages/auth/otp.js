import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import classes from "./login.module.css";
import Image from "next/image";
import { Box, Button, InputLabel, Link, Stack, TextField, Typography } from "@mui/material";
import { ArrowLeftSharp } from "@mui/icons-material";
import { useAuth } from "src/hooks/use-auth";

const OTP = () => {
  const router = useRouter();
  const auth = useAuth();
  const { user } = useAuth();
  const [method, setMethod] = useState("email");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [otpError, setOtpError] = useState(null);
  const otpBoxReference = useRef([]);
  const numberOfDigits = 4;
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values, helpers) => {
      try {
        const otpValue = otp.join("");
        const value = await auth.forgetOtp(otpValue, user);
        console.log(value);
        if (!value.length) {
          router.push("/auth/reset-pass");
        }
        setError("❌ Wrong OTP Please Check Again");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Check your connection please!!!" });
        helpers.setSubmitting(false);
      }
    },
  });

  function handleChange(value, index) {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

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
                Two-Step Verification{" "}
              </Typography>
              <Typography variant="p" sx={{ color: "#8290a1", fontSize: "14px" }}>
                We sent a verification code to your mobile. Enter the code from the mobile in the
                filed below.
              </Typography>
            </Stack>

            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={1}>
                <article className={classes.container}>
                  <p className={classes.label}>Type your 4 digit security code</p>

                  <div className={classes.inputContainer}>
                    {" "}
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        value={digit}
                        maxLength={1}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                        ref={(reference) => (otpBoxReference.current[index] = reference)}
                        className={classes.input}
                      />
                    ))}
                  </div>

                  {/* Error message */}
                  <p className={`${classes.errorMessage} ${otpError ? classes["error-show"] : ""}`}>
                    {otpError}
                  </p>
                </article>
              </Stack>

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <p className={classes.error}>{error}</p>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
                disabled={otp.join("").length < 4 ? true : false}
              >
                Verify my account
              </Button>
            </form>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p className={classes.label}>Didn&apos;t get the code?</p>
              <Link
                href="/auth/login"
                style={{
                  textDecoration: "none",
                  marginTop: "10px",
                  marginLeft: "5px",
                }}
              >
                Resend
              </Link>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default OTP;
