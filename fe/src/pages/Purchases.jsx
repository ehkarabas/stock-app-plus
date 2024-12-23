import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import useStockCall from "../hooks/useStockCall";

import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { btnStyle } from "../styles/globalStyles";
import EditIcon from "@mui/icons-material/Edit";
import PurchaseModal from "../components/modals/PurchaseModal";
import TableSkeleton, { ErrorMsg, NoDataMsg } from "../components/DataFetchMsg";

const Purchases = () => {
  const { deleteStockData, getStockData, getProdCatgBrnds } = useStockCall();
  const { purchases, error, loading } = useSelector((state) => ({
    purchases: state.stock.purchases?.result || [],
    error: state.stock.error,
    loading: state.stock.loading,
  }));
  const [open, setOpen] = useState(false);

  const [info, setInfo] = useState({
    firmId: "",
    brandId: "",
    productId: "",
    quantity: "",
    price: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const purchasesFetcher = async () => {
      await getStockData("firms");
      await getStockData("purchases");
      await getProdCatgBrnds();
    };
    purchasesFetcher();
  }, []); // eslint-disable-line

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
      field: "firm",
      headerName: "Firm",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.firmId.name,
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
      renderCell: ({
        id,
        row: { brandId, productId, quantity, price, firmId },
      }) => {
        return [
          <GridActionsCellItem
            key={"edit"}
            icon={<EditIcon />}
            label="Edit"
            onClick={() => {
              setOpen(true);
              setInfo({ id, firmId, brandId, productId, quantity, price });
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

  return (
    <div>
      <Typography variant="h4" color="primary" mb={3}>
        Purchases
      </Typography>

      <Button variant="contained" onClick={handleOpen}>
        New Purchase
      </Button>

      <PurchaseModal
        open={open}
        handleClose={handleClose}
        info={info}
        setInfo={setInfo}
      />

      {error && <ErrorMsg />}
      {loading && <TableSkeleton />}
      {!error && !loading && !purchases?.length && <NoDataMsg />}

      {!error && !loading && purchases?.length > 0 && (
        <Box
          sx={{
            width: "100%",
            marginTop: "1rem",
          }}
        >
          <DataGrid
            autoHeight
            rows={purchases || []}
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

export default Purchases;
