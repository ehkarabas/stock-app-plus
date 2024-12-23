import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { modalStyle } from "../../styles/globalStyles";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useStockCall from "../../hooks/useStockCall";
import { object, string } from "yup";
import { Form, Formik } from "formik";

export default function FirmModal({ open, setOpen, info, setInfo }) {
  // const [editCheck, setEditCheck] = useState(null);
  const { postStockData, putStockData } = useStockCall();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setInfo({ ...info, [name]: value });
  //   setInfo({ ...info, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   let newInfo;
  //   if (info?.id) {
  //     newInfo = {
  //       name: info.name,
  //       address: info.address,
  //       phone: info.phone,
  //       image: info.image,
  //     };
  //     putStockData(info.id, newInfo);
  //   }
  //   // editCheck ? putStockData(info.id, newInfo) : postStockData(info);
  //   !info?.id && postStockData(info);
  //   console.log(info);
  //   setInfo({
  //     name: "",
  //     phone: "",
  //     address: "",
  //     image: "",
  //   });
  //   setOpen(false);
  // };

  // /^((ftp|http|https):\/\/)?((?!www\.)[a-zA-Z0-9_-]+(\.[a-zA-Z]{2,})|www\.(?!www|http|https|ftp)[a-zA-Z0-9_-]+(\.[a-zA-Z]{2,}))+((\/[\w#-]+)*(\/[\w#-]+(\.[a-zA-Z0-9]{2,4}){0,2})*(?:(?=\.[a-zA-Z0-9]{2,4}(?![a-zA-Z0-9]))|(?=\.[a-zA-Z0-9]{2,4}\/)|(?=$))*(\/[\w#-]+)*)*(\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm -> soru isaretinden sonra algilamiyor

  // URL URL validation regex -> https://snyk.io/blog/secure-javascript-url-validation/

  const firmModalSchema = object({
    name: string()
      .min(3, "Name must be at least 3 characters.")
      .max(30, "Name must be at most 30 characters.")
      .required("You must enter firm name."),
    phone: string()
      .matches(
        /(?:(\+|00)\d{1,3})?[ -]?\(?(\d{3})\)?[ -]?(\d{3})[ -]?(\d{4})/g,
        "Must be at xxx-xxx-xxxx format. Whitespace or dash can be used as seperator. Country code in the beginning is optional."
      )
      .required("You must enter firm's phone."),
    address: string()
      .min(35, "Address must be at least 35 characters.")
      .max(120, "Address must be at most 120 characters.")
      .required("You must enter firm's address."),
    image: string()
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gim,
        "URL is not valid"
      )
      .required("You must enter firm's logo url."),
  });

  // useEffect(() => {
  //   if (info?.id) setEditCheck(true);
  // }, [info]);

  console.log("🔭 ~ FirmModal ~ info ➡ ➡ ", info);
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Formik
            initialValues={info}
            validationSchema={firmModalSchema}
            onSubmit={(values, actions) => {
              let newInfo;
              if (info?._id) {
                newInfo = {
                  name: values.name,
                  address: values.address,
                  phone: values.phone,
                  image: values.image,
                };
                putStockData(info._id, newInfo);
              }
              // editCheck ? putStockData(info.id, newInfo) : postStockData(info);
              !info?._id && postStockData(values);
              // console.log(info);
              setInfo({
                name: "",
                phone: "",
                address: "",
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
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                component="form"
                onSubmit={handleSubmit}
              >
                <TextField
                  label="Firm Name"
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
                  label="Phone"
                  name="phone"
                  id="phone"
                  type="tel"
                  variant="outlined"
                  value={values.phone}
                  error={touched?.phone && Boolean(errors?.phone)}
                  helperText={touched?.phone && errors?.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <TextField
                  label="Address"
                  name="address"
                  id="address"
                  type="text"
                  variant="outlined"
                  value={values.address}
                  error={touched?.address && Boolean(errors?.address)}
                  helperText={touched?.address && errors?.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <TextField
                  label="Image"
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
                <Button type="submit" variant="contained">
                  SUBMIT FIRM
                </Button>
              </Box>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
}

// return (
//   <div>
//     {/* <Button onClick={handleOpen}>Open modal</Button> */}
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={modalStyle}>
//         <Box
//           sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//           component="form"
//           onSubmit={handleSubmit}
//         >
//           <TextField
//             label="Firm Name"
//             name="name"
//             id="name"
//             type="text"
//             variant="outlined"
//             value={info?.name}
//             onChange={handleChange}
//             required
//             // error={touched?.email && Boolean(errors?.email)}
//             // helperText={touched?.email && errors?.email}
//             // onBlur={handleBlur}
//           />
//           <TextField
//             label="Phone"
//             name="phone"
//             id="phone"
//             type="tel"
//             variant="outlined"
//             value={info?.phone}
//             onChange={handleChange}
//             required
//             // error={touched?.email && Boolean(errors?.email)}
//             // helperText={touched?.email && errors?.email}
//             // onBlur={handleBlur}
//           />
//           <TextField
//             label="Address"
//             name="address"
//             id="address"
//             type="text"
//             variant="outlined"
//             value={info?.address}
//             onChange={handleChange}
//             required
//             // error={touched?.email && Boolean(errors?.email)}
//             // helperText={touched?.email && errors?.email}
//             // onBlur={handleBlur}
//           />
//           <TextField
//             label="Image"
//             name="image"
//             id="image"
//             type="url"
//             variant="outlined"
//             value={info?.image}
//             onChange={handleChange}
//             required
//             // error={touched?.email && Boolean(errors?.email)}
//             // helperText={touched?.email && errors?.email}
//             // onBlur={handleBlur}
//           />
//           <Button type="submit" variant="contained">
//             SUBMIT FIRM
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   </div>
// );
