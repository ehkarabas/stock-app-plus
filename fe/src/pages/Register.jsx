import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import LockIcon from "@mui/icons-material/Lock";
import image from "../assets/result.svg";
import Grid from "@mui/material/Grid";

import { Link, useNavigate } from "react-router-dom";
import { Box, TextField, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import useAuthCall from "../hooks/useAuthCall";
import { Form, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import {
  object,
  string,
  number,
  date,
  InferType,
  ref,
  ValidationError,
} from "yup";
import RegisterForm from "../components/RegisterForm";
import { useTheme } from "@mui/material/styles";
import ThemeToggle from "../components/Theme/ThemeToggle";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, error, loading } = useSelector((state) => state.auth);
  const { isDark } = useSelector((state) => state.theme);

  const { register, login } = useAuthCall();

  const registerSchema = object({
    username: string()
      .min(4, "Username must be at least 4 characters.")
      .max(20, "Username must be at most 20 characters.")
      .required("You must enter your username."),
    firstName: string()
      .min(2, "First name must be at least 2 characters.")
      .max(20, "First name must be at most 20 characters.")
      .required("You must enter your first name."),
    lastName: string()
      .min(2, "Last name must be at least 2 characters.")
      .max(20, "Last name must be at most 20 characters.")
      .required("You must enter your last name."),
    // email: string()
    //   .email("Email is not valid.")
    //   .required("You must enter your email."),
    email: string()
      .required("You must enter your email.")
      .test("email-validation", "Email validation error", (value) => {
        const emailRegex = /^[_.a-z0-9]{4,}@[a-z0-9.]{4,}$/;
        if (!emailRegex.test(value))
          throw new ValidationError("Invalid email pattern", null, "email");

        const [username, domainSubdomainTLD] = value.split("@");
        let errors = [];

        // Username checks
        if (/^[_.]/.test(username))
          errors.push("Username can't start with an underscore or a dot.");
        if (/[_.]$/.test(username))
          errors.push("Username can't end with an underscore or a dot.");
        if (/[_.]{2,}/.test(username))
          errors.push(
            "Username can't contain consecutive underscores or dots."
          );
        if (!username.match(/[a-z]/g))
          errors.push("Username must contain at least 1 lowercase letter.");
        if (!/[a-z0-9_.]{4,}/.test(username))
          errors.push(
            "Username must contain at least 4 characters. Only lowercase letters, digits, dots and underscores are allowed."
          );

        // Domain and TLD checks
        if (domainSubdomainTLD.match(/\./g)?.length > 2)
          errors.push("Subdomain-Domain-TLD is not valid.");
        if (!/^[a-z0-9]+\./.test(domainSubdomainTLD))
          errors.push("Domain/Subdomain is not valid.");
        if (
          domainSubdomainTLD.match(/\./g)?.length === 2 &&
          !/\.[a-z0-9]+\./.test(domainSubdomainTLD)
        )
          errors.push("Domain is not valid.");
        if (
          domainSubdomainTLD.match(/\./g)?.length < 1 ||
          domainSubdomainTLD.endsWith(".") ||
          !/\.[a-z]{1,3}$/.test(domainSubdomainTLD)
        )
          errors.push("TLD is not valid.");

        if (errors.length > 0) {
          throw new ValidationError(errors.join(" "), null, "email");
        }

        return true;
      }),
    password: string()
      .trim()
      .min(8, "Password must be at least 8 characters.")
      .max(16, "Password must be at most 16 characters.")
      .matches(/\d+/, "Password must contain at least 1 digit.")
      .matches(/[a-z]/, "Password must contain at least 1 lowercase letter.")
      .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
      .matches(
        /[!/\[@$!%*?&\]_]+/,
        "Password must contain at least 1 special character."
      )
      .required("You must enter your password."),
    password2: string()
      .oneOf([ref("password"), null], "Passwords must match.")
      .required("You must confirm your password."), // her iki password alaninin eslesme kontrolu ve eslesmiyorsa hata mesaji gosterme
  });

  return (
    <Container
      maxWidth="lg"
      sx={{
        backgroundColor: isDark ? "#94a3b8 !important" : "#FFF !important",
      }}
    >
      <Grid
        container
        justifyContent="center"
        direction="row-reverse"
        rowSpacing={{ sm: 3 }}
        sx={{
          height: "100vh",
          p: 2,
        }}
      >
        <Grid item xs={12} mb={3}>
          <Stack direction="row" p={2}>
            <Typography
              variant="h3"
              color="primary"
              align="center"
              flexGrow={1}
            >
              STOCK APP
            </Typography>
            <ThemeToggle />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={10} md={6}>
          <Avatar
            sx={{
              backgroundColor: "success.dark",
              m: "auto",
              width: 40,
              height: 40,
            }}
          >
            <LockIcon size="30" />
          </Avatar>
          <Typography
            variant="h4"
            align="center"
            mb={2}
            color={theme.palette.success.dark}
          >
            Register
          </Typography>

          <Formik
            initialValues={{
              username: "",
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              password2: "",
            }}
            validationSchema={registerSchema}
            onSubmit={async (values, actions) => {
              // console.log(values.email); // form state'i
              // console.log(values.password); // form state'i
              // console.log(actions); // form islemleri
              // console.log(actions.resetForm); // form resetleme
              // console.log(actions.setSubmitting); // formik isSubmitting built-in state'i toggle'i
              // TODO register(values) POST request
              await register(values);
              await login({ email: values.email, password: values.password });
              // TODO navigate -> handled in register dispatcher
              actions.resetForm(); // form resetleme
              actions.setSubmitting(false); // formik isSubmitting built-in state'ini false yapma
            }}
            component={(props) => <RegisterForm {...props} />}
          >
            {/* {({
              values, // Formik built-in state container'i
              errors, // Formik built-in error handling state'i
              touched, // Formik built-in focus tracking state'i
              handleChange, // Formik built-in onChange handler'i
              handleBlur, // Formik built-in onBlur handler'i -> focus disi olundugunda tetiklenir, touched'in true olarak toggle'lanmasini saglar, validasyon saglar, validasyon icin gereklidir
              handleSubmit, // Formik built-in onSubmit handler'i
              isSubmitting, // Formik built-in submit phase tracking state'i
            }) => (
              <Form>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Username"
                    name="username"
                    id="username"
                    type="text"
                    variant="outlined"
                    value={values.username}
                    error={touched?.username && Boolean(errors?.username)}
                    helperText={touched?.username && errors?.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <TextField
                    label="Email"
                    name="email"
                    id="email"
                    type="email"
                    variant="outlined"
                    value={values.email}
                    error={touched?.email && Boolean(errors?.email)}
                    helperText={touched?.email && errors?.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <TextField
                    label="First Name"
                    name="firstName"
                    id="firstName"
                    type="text"
                    variant="outlined"
                    value={values.firstName}
                    error={touched?.firstName && Boolean(errors?.firstName)}
                    helperText={touched?.firstName && errors?.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <TextField
                    label="Last Name"
                    name="lastName"
                    id="lastName"
                    type="text"
                    variant="outlined"
                    value={values.lastName}
                    error={touched?.lastName && Boolean(errors?.lastName)}
                    helperText={touched?.lastName && errors?.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    id="password"
                    type="password"
                    variant="outlined"
                    value={values.password}
                    error={touched?.password && Boolean(errors?.password)}
                    helperText={touched?.password && errors?.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <TextField
                    label="Confirm Password"
                    name="password2"
                    id="password2"
                    type="password"
                    variant="outlined"
                    value={values.password2}
                    error={touched?.password2 && Boolean(errors?.password2)}
                    helperText={touched?.password2 && errors?.password2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={loading}
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Form>
            )} */}
          </Formik>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link to="/">Do you have an account?</Link>
          </Box>
        </Grid>

        <Grid item xs={0} sm={7} md={6}>
          <Container>
            <img src={image} alt="" />
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;
