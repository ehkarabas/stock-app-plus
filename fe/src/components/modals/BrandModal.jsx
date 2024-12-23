import React from "react";
import { flexColumn, modalStyle } from "../../styles/globalStyles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import useStockCall from "../../hooks/useStockCall";
import { object, string } from "yup";
import { Formik } from "formik";

export default function BrandModal({ open, setOpen, info, setInfo }) {
  const { postStockData, putStockData } = useStockCall();

  // const handleChange = (e) => {
  //   e.preventDefault();
  //   const { name, value } = e.target;
  //   setInfo({ ...info, [name]: value });
  // };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setOpen(false);
  //   let newInfo;
  //   if (info?.id) {
  //     newInfo = {
  //       name: info.name,
  //       image: info.image,
  //     };
  //     putStockData(info.id, newInfo);
  //   }
  //   !info?.id && postStockData(info);
  //   setInfo({
  //     name: "",
  //     image: "",
  //   });
  // };

  const brandModalSchema = object({
    name: string()
      .min(3, "Name must be at least 3 characters.")
      .max(30, "Name must be at most 30 characters.")
      .required("You must enter firm name."),
    image: string()
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gim,
        "URL is not valid"
      )
      .required("You must enter firm's logo url."),
  });

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
        setInfo({ name: "", image: "" });
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Formik
          initialValues={info}
          validationSchema={brandModalSchema}
          onSubmit={(values, actions) => {
            let newInfo;
            if (info?._id) {
              newInfo = {
                name: values.name,
                image: values.image,
              };
              putStockData(info._id, newInfo);
            }
            !info?._id && postStockData(values);
            setInfo({
              name: "",
              image: "",
            });
            actions.resetForm(); // form resetleme
            actions.setSubmitting(false); // formik isSubmitting built-in state'ini false yapma
            setOpen(false);
          }}
        >
          {({
            values, // Formik built-in state container'i
            errors, // Formik built-in error handling state'i
            touched, // Formik built-in focus tracking state'i
            handleChange, // Formik built-in onChange handler'i
            handleBlur, // Formik built-in onBlur handler'i -> focus disi olundugunda tetiklenir, touched'in true olarak toggle'lanmasini saglar, validasyon saglar, validasyon icin gereklidir
            handleSubmit, // Formik built-in onSubmit handler'i
            isSubmitting, // Formik built-in submit phase tracking state'i
          }) => (
            <Box sx={flexColumn} component={"form"} onSubmit={handleSubmit}>
              <TextField
                label="Brand Name"
                name="name"
                id="name"
                type="text"
                variant="outlined"
                value={values.name}
                error={touched?.name && Boolean(errors?.name)}
                helperText={touched?.name && errors?.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />

              <TextField
                label="Image Url"
                name="image"
                id="image"
                type="url"
                variant="outlined"
                value={values.image}
                error={touched?.image && Boolean(errors?.image)}
                helperText={touched?.image && errors?.image}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <Button type="submit" variant="contained" size="large">
                Save Brand
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

// return (
//   <Modal
//     open={open}
//     onClose={() => {
//       setOpen(false);
//       setInfo({ name: "", image: "" });
//     }}
//     aria-labelledby="modal-modal-title"
//     aria-describedby="modal-modal-description"
//   >
//     <Box sx={modalStyle}>
//       <Box sx={flexColumn} component={"form"} onSubmit={handleSubmit}>
//         <TextField
//           label="Brand Name"
//           name="name"
//           id="name"
//           type="text"
//           variant="outlined"
//           value={info?.name || ""}
//           onChange={handleChange}
//           required
//         />

//         <TextField
//           label="Image Url"
//           name="image"
//           id="image"
//           type="url"
//           variant="outlined"
//           value={info?.image || ""}
//           onChange={handleChange}
//         />

//         <Button type="submit" variant="contained" size="large">
//           Save Brand
//         </Button>
//       </Box>
//     </Box>
//   </Modal>
// );
