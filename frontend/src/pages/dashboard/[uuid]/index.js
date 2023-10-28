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
import { StaticDatePicker } from "@mui/x-date-pickers-pro";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ja from "date-fns/locale/ja";

const now = new Date();

export function getDateDaysAgo(daysAgo, baseDate) {
  // 文字列で渡された基準日をDateオブジェクトに変換
  const [yearStr, monthStr, dayStr] = baseDate.split("/");
  const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));

  // 指定された日数分だけ日付を遡る
  date.setTime(date.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  // 結果の日付を取得
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth()は0から11の範囲で月を返します、従って+1が必要です
  const day = date.getDate();

  return `${year}/${month}/${day}`;
}

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [data2, setData2] = useState(new Date());

  const { uuid } = router.query;

  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth()は0から11の範囲で月を返します、従って+1が必要です
  const day = now.getDate();

  useEffect(() => {
    fetch(`http://localhost:1991/api/v1/${uuid}/${year}/${month}/${day}`)
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

  console.log(sum);
  console.log(data);

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
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
              <StaticDatePicker
                Picker
                displayStaticWrapperAs="desktop"
                value={data2}
                onChange={(newValue) => {
                  setData2(newValue);
                }}
              />
            </LocalizationProvider>
            <button onClick={() => console.log(data2.getDate())}></button>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Page;
