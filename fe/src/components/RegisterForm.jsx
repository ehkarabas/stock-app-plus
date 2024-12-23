import { LoadingButton } from "@mui/lab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Form } from "formik";
import { useSelector } from "react-redux";
import { object, string, ref } from "yup";

export const registerSchema = object({
  username: string()
    .min(5, "Username must be at least 5 characters.")
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
  email: string()
    .email("Email is not valid.")
    .required("You must enter your email."),
  password: string()
    .min(8, "Password must be at least 8 characters.")
    .max(20, "Password must be at most 20 characters.")
    .matches(/\d+/, "Must contain at least 1 digit.")
    .matches(/[a-z]+/, "Must contain at least 1 lowercase.")
    .matches(/[A-Z]+/, "Must contain at least 1 uppercase.")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
      "Must contain at least 1 special character."
    ) //  regex ile kural belirleme, matches hiyerarsik olarak ayri regex'ler ile chain'lenebilir
    .required("You must enter your password."),
  password2: string()
    .oneOf([ref("password"), null], "Passwords must match.")
    .required("You must confirm your password."), // her iki password alaninin eslesme kontrolu ve eslesmiyorsa hata mesaji gosterme
});

const RegisterForm = ({
  values,
  handleChange,
  errors,
  touched,
  handleBlur,
}) => {
  const { currentUser, error, loading } = useSelector((state) => state.auth);
  return (
    <div>
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
          {/* The TextField wrapper component is a complete form control including a label, input, and help text. It comes with three variants: outlined (default), filled, and standard. */}

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

          <LoadingButton variant="contained" type="submit" loading={loading}>
            Submit
          </LoadingButton>
          {/* loading buttons can show loading state and disable interactions. loading prop'u boolean deger alir ve degere gore spinner belirir veya belirmez */}
        </Box>
      </Form>
    </div>
  );
};

export default RegisterForm;
