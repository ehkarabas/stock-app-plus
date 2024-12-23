import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { modalStyle } from "../../styles/globalStyles";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useStockCall from "../../hooks/useStockCall";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useSelector } from "react-redux";

export default function ProductModal({ open, handleClose, info, setInfo }) {
  // const [editCheck, setEditCheck] = useState(null);
  const { postStockData, putStockData } = useStockCall();
  const { categories, brands } = useSelector((state) => ({
    categories: state.stock.categories?.result || [],
    brands: state.stock.brands?.result || [],
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postStockData(info);
    // console.log(info);
    setInfo({
      categoryId: "",
      brandId: "",
      name: "",
    });
    handleClose();
  };

  // useEffect(() => {
  //   if (info?.id) setEditCheck(true);
  // }, [info]);

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            component="form"
            onSubmit={handleSubmit}
          >
            <FormControl fullWidth>
              <InputLabel id="category">Categories</InputLabel>
              <Select
                labelId="category"
                id="category"
                name="categoryId"
                value={info?.categoryId || ""}
                label="Category"
                onChange={handleChange}
              >
                {categories.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="brand">Brands</InputLabel>
              <Select
                labelId="brand"
                id="brand"
                name="brandId"
                value={info?.brandId || ""}
                label="Brand"
                onChange={handleChange}
              >
                {brands.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Product Name"
              name="name"
              id="name"
              type="text"
              variant="outlined"
              value={info?.name}
              onChange={handleChange}
              required
              // error={touched?.email && Boolean(errors?.email)}
              // helperText={touched?.email && errors?.email}
              // onBlur={handleBlur}
            />
            <Button type="submit" variant="contained">
              SUBMIT PRODUCT
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
