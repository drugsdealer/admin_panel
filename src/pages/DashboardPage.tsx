// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

const DashboardPage = () => {
  const [clientsCount, setClientsCount] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    axios.get("http://localhost:8080/api/customers").then((res) => {
      setClientsCount(res.data.length);
    });

    axios.get("http://localhost:8080/api/orders").then((res) => {
      setOrdersCount(res.data.length);
      const revenue = res.data.reduce((sum: number, order: any) => {
        return sum + order.products.reduce((pSum: number, p: any) => pSum + p.price, 0);
      }, 0);
      setTotalRevenue(revenue);
    });
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Clients</Typography>
              <Typography variant="h5">{clientsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h5">{ordersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h5">${totalRevenue}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;