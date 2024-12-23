import { Grid } from "@mui/material";
import { Card, Title, LineChart, AreaChart } from "@tremor/react";
import { useSelector } from "react-redux";

// const chartdata  = [
//   {
//     year: 1951,
//     "Population growth rate": 1.74,
//   },
//   {
//     year: 1952,
//     "Population growth rate": 1.93,
//   },
//   {
//     year: 1953,
//     "Population growth rate": 1.9,
//   },
//   {
//     year: 1954,
//     "Population growth rate": 1.98,
//   },
//   {
//     year: 1955,
//     "Population growth rate": 2,
//   },
// ];

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("tr").format(number).toString()}`;

const dateFormatter = (date) =>
  new Date(date).toLocaleString("tr-TR", {
    // timeZone: "Europe/Istanbul", // veri zaten tr saati, donusmemesi gerekir
    timeZone: "GMT",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const Charts = () => {
  const { sales, purchases } = useSelector((state) => ({
    sales: state.stock.sales?.result || [],
    purchases: state.stock.purchases?.result || [],
  }));
  const { isDark } = useSelector((state) => state.theme);

  // let {
  //   sales: { result: sales },
  //   purchases: { result: purchases },
  // } = useSelector((state) => state.stock);

  // sales = sales?.length ? sales : [];
  // purchases = purchases?.length ? purchases : [];

  const salesData = sales.map((item) => ({
    date: dateFormatter(item.createdAt),
    Sale: Number(item.priceTotal),
  }));

  const purchaseData = purchases.map((item) => ({
    date: dateFormatter(item.createdAt),
    Purchase: Number(item.priceTotal),
  }));

  return (
    <Grid container justifyContent={"center"} spacing={3} mt={3}>
      <Grid item xs={12} sm={12} md={6}>
        <Card>
          <Title>Total Sales</Title>
          <AreaChart
            data={salesData}
            index="date"
            categories={["Sale"]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
            sx={{
              backgroundColor: isDark ? "#94a3b8" : "#FFF",
              "& .MuiPaper-root": {
                backgroundColor: isDark ? "#94a3b8" : "#FFF", // Burası bileşenin içindeki Paper bileşenini hedef alır
              },
            }}
            // yAxisWidth={40}
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Card>
          <Title>Total Purchases</Title>
          <AreaChart
            data={purchaseData}
            index="date"
            categories={["Purchase"]}
            colors={["red"]}
            valueFormatter={dataFormatter}
            sx={{
              backgroundColor: isDark ? "#94a3b8" : "#FFF",
              "& .MuiPaper-root": {
                backgroundColor: isDark ? "#94a3b8" : "#FFF", // Burası bileşenin içindeki Paper bileşenini hedef alır
              },
            }}
            // yAxisWidth={40}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Charts;
