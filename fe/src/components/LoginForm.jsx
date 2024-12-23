import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import { Form } from "formik";
import { useSelector } from "react-redux";
import { object, string } from "yup";

const passwordRules = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

const loginSchemaAlt = object({
  email: string()
    .email("Email is not valid.")
    .required("You must enter your email."),
  password: string()
    .min(8, "Password must be at least 8 characters.")
    .max(20, "Password must be at most 20 characters.")
    .matches(passwordRules, {
      message:
        "Must contain at least 1 lowercase, 1 uppercase, 1 digit, and 8 characters in total.",
    }) //  regex ile kural belirleme ve karsilanmazsa hata mesaji gosterme
    .required("You must enter your password."),
});

export const loginSchema = object({
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
});

const LoginForm = ({ values, handleChange, errors, touched, handleBlur }) => {
  const { currentUser, error, loading } = useSelector((state) => state.auth);
  return (
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
        {/* The TextField wrapper component is a complete form control including a label, input, and help text. It comes with three variants: outlined (default), filled, and standard. */}
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

        <LoadingButton variant="contained" type="submit" loading={loading}>
          Submit
        </LoadingButton>
        {/* loading buttons can show loading state and disable interactions. loading prop'u boolean deger alir ve degere gore spinner belirir veya belirmez */}
      </Box>
    </Form>
  );
};

export default LoginForm;
