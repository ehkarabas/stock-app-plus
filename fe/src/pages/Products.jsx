import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import FirmCard from "../components/FirmCard";
import ProductModal from "../components/modals/ProductModal";
import ProductCard from "../components/ProductCard";
import { getSuccess, fetchFail } from "../features/stockSlice";
import useStockCall from "../hooks/useStockCall";
import { btnStyle, flex } from "../styles/globalStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TableSkeleton, { ErrorMsg, NoDataMsg } from "../components/DataFetchMsg";

import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
} from "@mui/x-data-grid";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({
    categoryId: "",
    brandId: "",
    name: "",
  });

  const { getStockData, deleteStockData, getProdCatgBrnds } = useStockCall();
  const { products, error, loading } = useSelector((state) => ({
    products: state.stock.products?.result || [],
    error: state.stock.error,
    loading: state.stock.loading,
  }));
  // console.log(useLocation()); // {pathname: '/stock/firms/', search: '', hash: '', state: null, key: 'e6qi9mwg'}

  // + Custom hook ile okunurluk artirilabilir.
  // const dispatch = useDispatch();
  // const getStockData = async (url) => {
  //   const BASE_URL = process.env.REACT_APP_API_URL;
  //   // + Tek firmayi okumak icin -> `${BASE_URL}/stock/firms/{id}/`
  //   try {
  //     const { data } = await axios(`${BASE_URL}stock/firms/`, {
  //       headers: { Authorization: `Token ${token}` },
  //     });
  //     console.log(data);
  //     dispatch(getSuccess({ data, url }));
  //   } catch (error) {
  //     const err = `Error ${error.response.status}: ${error.message}`;
  //     console.log(err);
  //     dispatch(fetchFail(err));
  //   }
  // };

  const columns: GridColDef[] = [
    // field -> backend'ten gelen key, headerName -> UI'da render'lanan th cell
    {
      field: "id",
      headerName: "#",
      minWidth: 40,
      maxWidth: 70,
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row._id,
    },
    {
      field: "category",
      headerName: "Category",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 3,
      valueGetter: (params) => params.row.categoryId.name,
      // editable: true,
    },
    {
      field: "brand",
      headerName: "Brand",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 2,
      valueGetter: (params) => params.row.brandId.name,
      // editable: true,
    },
    {
      field: "name",
      headerName: "Name",
      type: "number",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 2,
      // editable: true,
    },
    {
      field: "quantity",
      headerName: "Stock",
      type: "number",
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      flex: 0.7,
      // valueGetter prop'u ile bir sutundaki veri, baska sutundaki veriler kullanilarak olusturulabilir
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
      // editable: true,
    },
    {
      // not receiving from backend
      field: "actions",
      headerName: "Actions",
      type: "number",
      headerAlign: "center",
      align: "center",
      minWidth: 50,
      editable: true,
      flex: 1,
      // renderCell ile cell icinde component dondurulebilir
      // renderCell: (params: GridRenderCellParams<Date>) => (
      //   <strong>
      //     {params.value.getFullYear()}
      //     <Button
      //       variant="contained"
      //       size="small"
      //       style={{ marginLeft: 16 }}
      //       tabIndex={params.hasFocus ? 0 : -1}
      //     >
      //       Open
      //     </Button>
      //   </strong>
      // ),
      // actions ile icon'lar ile belirli islemlerin gerceklestirilmesi saglanabilir
      // getActions: (params: GridRowParams) => [
      //   <GridActionsCellItem icon={...} onClick={...} label="Delete" />,
      //   <GridActionsCellItem icon={...} onClick={...} label="Print" showInMenu />,
      // ]
      // MUI data-grid renderCell'in kendine has bir prop yapisi vardir, id'lere direkt erisilebilir ancak verilere row key'inden erisilir.
      renderCell: (props) => (
        <GridActionsCellItem
          icon={<DeleteForeverIcon />}
          onClick={() => {
            console.log(props);
            deleteStockData(props.id);
          }}
          label="Delete"
          sx={btnStyle}
        />
      ),
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  useEffect(() => {
    // getStockData();
    // getStockData("categories");
    // getStockData("brands");
    //! Promise All
    getProdCatgBrnds();
  }, []);

  return (
    <div>
      {/* Without DataGrid */}
      {/* <Typography variant="h4" color="error" mb={3}>
        Products
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setInfo({
            name: "",
            phone: "",
            address: "",
            image: "",
          });
          setOpen(true);
        }}
      >
        NEW PRODUCT
      </Button>

      <ProductModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        info={info}
        setInfo={setInfo}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Brand</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[].map((product, index) => (
              <TableRow
                key={product.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right" component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">{product.category}</TableCell>
                <TableCell align="right">{product.brand}</TableCell>
                <TableCell align="right">{product.name}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
                <TableCell align="right">
                  <DeleteForeverIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      {/* <Grid container sx={flex}>
        {products?.map((product) => (
          <Grid item key={product.id}>
            <ProductCard
              {...product}
              handleOpen={handleOpen}
              setInfo={setInfo}
            />
          </Grid>
        ))}
      </Grid> */}

      <Typography variant="h4" color="primary" mb={3}>
        Products
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setInfo({
            categoryId: "",
            brandId: "",
            name: "",
          });
          setOpen(true);
        }}
      >
        NEW PRODUCT
      </Button>

      <ProductModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        info={info}
        setInfo={setInfo}
      />

      {error && <ErrorMsg />}
      {loading && <TableSkeleton />}

      {!error && !loading && !products.length && <NoDataMsg />}

      {/* height sabit olarak degil de auto vermek icin autoHeight prop'u kullanilabilir */}
      {!loading && !error && products.length > 0 && (
        <Box sx={{ width: "100%", marginTop: "1rem" }}>
          <DataGrid
            autoHeight
            rows={products || []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            slots={{ toolbar: GridToolbar }}
            sx={{
              boxShadow: 4,
            }}
            getRowId={(row) => row._id}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            // checkboxSelection -> satirlari secili hale getirmeye yarar
            // checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </div>
  );
};

export default Products;
