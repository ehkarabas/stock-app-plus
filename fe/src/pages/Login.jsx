import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";
import image from "../assets/result.svg";
import { Link, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { TextField, Stack } from "@mui/material";
import ThemeToggle from "../components/Theme/ThemeToggle";
// https://www.npmjs.com/package/yup
import { object, string, number, date, InferType } from "yup";
import { LoadingButton } from "@mui/lab";
import useAuthCall from "../hooks/useAuthCall";
import LoginForm, { loginSchema } from "../components/LoginForm";
import { useTheme } from "@mui/material/styles";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, error, loading } = useSelector((state) => state?.auth);
  const { isDark } = useSelector((state) => state.theme);

  const { login } = useAuthCall();

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
            mb={4}
            color={theme.palette.success.dark}
          >
            Login
          </Typography>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={async (values, actions) => {
              // console.log(values.email); // form state'i
              // console.log(values.password); // form state'i
              // console.log(actions); // form islemleri
              // console.log(actions.resetForm); // form resetleme
              // console.log(actions.setSubmitting); // formik isSubmitting built-in state'i toggle'i
              // TODO login(values) POST request
              await login(values);
              // TODO navigate -> handled in register dispatcher
              actions.resetForm(); // form resetleme
              actions.setSubmitting(false); // formik isSubmitting built-in state'ini false yapma
            }}
            component={(props) => <LoginForm {...props} />}
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
            <Link to="/register">Dont you have an account?</Link>
          </Box>
        </Grid>

        <Grid item xs={10} sm={7} md={6}>
          <Container>
            <img src={image} alt="img" />
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
