import { Avatar, Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";
import { amber, deepPurple, pink } from "@mui/material/colors";
import { Stack } from "@mui/system";
import { Height } from "@mui/icons-material";
import { useSelector } from "react-redux";

const KpiCards = () => {
  // const iconSize = {
  //   ".MuiSvgIcon-root": { fontSize: "2rem" },
  // };

  const { sales, purchases } = useSelector((state) => ({
    sales: state.stock.sales?.result || [],
    purchases: state.stock.purchases?.result || [],
  }));

  // let {
  //   sales: { result: sales },
  //   purchases: { result: purchases },
  // } = useSelector((state) => state.stock);

  // sales = sales?.length ? sales : [];
  // purchases = purchases?.length ? purchases : [];

  const totalSales = sales
    .map((item) => Number(item.priceTotal))
    .reduce((acc, currVal) => acc + currVal, 0);

  const totalPurchases = purchases
    .map((item) => Number(item.priceTotal))
    .reduce((acc, currVal) => acc + currVal, 0);

  const totalProfit = totalSales - totalPurchases;

  // console.log(totalSales);
  // console.log(totalPurchases);

  const data = [
    {
      id: 1,
      title: "sales",
      value: `${totalSales}`,
      icon: <MonetizationOnIcon sx={{ fontSize: "2.3rem" }} />,
      color: deepPurple[600],
      bgColor: deepPurple[100],
    },
    {
      id: 2,
      title: "profit",
      value: `${totalProfit}`,
      icon: <ShoppingCartIcon sx={{ fontSize: "2.3rem" }} />,
      color: pink[600],
      bgColor: pink[100],
    },
    {
      id: 3,
      title: "purchases",
      value: `${totalPurchases}`,
      icon: <PaymentsIcon sx={{ fontSize: "2.3rem" }} />,
      color: amber[600],
      bgColor: amber[100],
    },
  ];
  return (
    <Grid container justifyContent="center" spacing={2}>
      {data.map((item, index) => (
        <Grid
          item
          key={index}
          xs={12}
          sm={10}
          md={6}
          lg={4}
          sx={{ minWidth: "250px" }}
        >
          <Paper sx={{ p: 2 }} elevation={10}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={5}
            >
              <Avatar
                item
                sx={{
                  backgroundColor: item.bgColor,
                  color: item.color,
                  width: 60,
                  height: 60,
                }}
              >
                {item.icon}
              </Avatar>
              <Box>
                <Typography variant="button">{item.title}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiCards;
