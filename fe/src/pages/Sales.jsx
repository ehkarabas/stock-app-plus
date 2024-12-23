import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import useStockCall from "../hooks/useStockCall";

import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { btnStyle } from "../styles/globalStyles";
import SaleModal from "../components/modals/SaleModal";
import EditIcon from "@mui/icons-material/Edit";
import TableSkeleton, { ErrorMsg, NoDataMsg } from "../components/DataFetchMsg";

const Sales = () => {
  const { getStockData, deleteStockData, getProdCatgBrnds } = useStockCall();
  const { sales, loading, error } = useSelector((state) => ({
    sales: state.stock.sales?.result || [],
    loading: state.stock.loading,
    error: state.stock.error,
  }));
  const [open, setOpen] = useState(false);

  const [info, setInfo] = useState({
    brandId: "",
    productId: "",
    quantity: "",
    price: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      minWidth: 175,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) =>
        new Date(params.row.createdAt).toLocaleString("tr-TR", {
          // timeZone: "Europe/Istanbul", // veri zaten tr saati, donusmemesi gerekir
          timeZone: "GMT",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.brandId.name,
    },
    {
      field: "product",
      headerName: "Product",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.productId.name,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      minWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "priceTotal",
      headerName: "Amount",
      minWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 40,
      headerAlign: "center",
      align: "center",
      renderCell: ({ id, row: { brandId, productId, quantity, price } }) => {
        return [
          <GridActionsCellItem
            key={"edit"}
            icon={<EditIcon />}
            label="Edit"
            onClick={() => {
              setOpen(true);
              setInfo({ id, brandId, productId, quantity, price });
            }}
            sx={btnStyle}
          />,
          <GridActionsCellItem
            key={"delete"}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => deleteStockData(id)}
            sx={btnStyle}
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    getStockData();
    getProdCatgBrnds();
  }, []); // eslint-disable-line

  return (
    <div>
      <Typography variant="h4" color="primary" mb={3}>
        Sales
      </Typography>

      <Button variant="contained" onClick={handleOpen}>
        New Sale
      </Button>

      <SaleModal
        open={open}
        handleClose={handleClose}
        info={info}
        setInfo={setInfo}
      />

      {error && <ErrorMsg />}
      {loading && <TableSkeleton />}
      {!loading && !sales?.length && <NoDataMsg />}

      {!loading && sales?.length > 0 && (
        <Box
          sx={{
            width: "100%",
            marginTop: "1rem",
          }}
        >
          <DataGrid
            autoHeight
            rows={sales || []}
            columns={columns}
            // pageSize={10}
            slots={{
              toolbar: GridToolbar,
            }}
            sx={{
              boxShadow: 4,
            }}
            pageSizeOptions={[10, 20, 50, 75, 100]}
            getRowId={(row) => row._id}
          />
        </Box>
      )}
    </div>
  );
};

export default Sales;
