import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Charts from "../components/Charts";
import KpiCards from "../components/KpiCards";
import useStockCall from "../hooks/useStockCall";

const Home = () => {
  const { getStockData, getPurchSales } = useStockCall();
  useEffect(() => {
    // getStockData("purchases");
    // getStockData("sales");
    //! Promise All
    getPurchSales();
  }, []);

  // console.log(useLocation().pathname.replaceAll("/", ""));
  return (
    <div>
      <Typography variant="h4" color="primary" mb={3}>
        Dashboard
      </Typography>
      <KpiCards />
      <Charts />
    </div>
  );
};

export default Home;
