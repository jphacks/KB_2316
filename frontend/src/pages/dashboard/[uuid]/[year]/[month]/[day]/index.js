import React from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { useEffect, useState } from "react";
import { getDateDaysAgo } from "../../../";

const Page = () => {
  const router = useRouter();
  const { uuid, year, month, day } = router.query;

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:1991/api/v1/test")
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, []);

  let sum = 0;

  if (data) {
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
  }

  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Overview | Devias Kit</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid xs={12} sm={6} lg={3}>
                <OverviewBudget
                  difference={12}
                  positive
                  sx={{ height: "100%" }}
                  value={sum}
                  dataTime={`${year}/${month}/${day}`}
                />
              </Grid>
              <Grid xs={12} lg={8}>
                <OverviewSales
                  chartSeries={[
                    {
                      name: "Time line",
                      data: data,
                    },
                  ]}
                  sx={{ height: "100%" }}
                  dataTime={`${year}/${month}/${day}`}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} lg={8}>
                <OverviewLatestOrders
                  uuid={uuid}
                  orders={[
                    {
                      time: getDateDaysAgo(1, `${year}/${month}/${day}`),
                    },
                    {
                      time: getDateDaysAgo(2, `${year}/${month}/${day}`),
                    },
                    {
                      time: getDateDaysAgo(3, `${year}/${month}/${day}`),
                    },
                    {
                      time: getDateDaysAgo(4, `${year}/${month}/${day}`),
                    },
                    {
                      time: getDateDaysAgo(5, `${year}/${month}/${day}`),
                    },
                  ]}
                  sx={{ height: "100%" }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Page;
