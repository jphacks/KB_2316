"use client";

import React from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Card, Container, Unstable_Grid2 as Grid } from "@mui/material";
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
import { API_URL } from "src/config";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { CardHeader } from "@mui/material";

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
  const month = now.getMonth() + 1;
  const day = now.getDate();

  useEffect(() => {
    if (uuid && year && month && day) {
      fetch(`${API_URL}/api/v1/get/${uuid}/${year}/${month}/${day}`)
        .then((res) => res.json())
        .then((x) => {
          setData(x);
          console.log(x);
        });
    }
  }, [uuid, year, month, day]); // year, month, day を依存配列に追加

  let year2 = data2.getFullYear();
  let month2 = data2.getMonth() + 1;
  let day2 = data2.getDate();

  // data2が変更されたら実行
  useEffect(() => {
    year2 = data2.getFullYear();
    month2 = data2.getMonth() + 1;
    day2 = data2.getDate();
  }, [data2]);

  let sum = 0;

  if (data) {
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
  }

  const routePage = () => {
    router.push(`/dashboard/${uuid}/${year2}/${month2}/${day2}`);
  };

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
              <Grid xs={12} md={12} lg={5}>
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
              <Grid xs={12} md={12} lg={5}>
                <Card sx={{ height: "100%" }}>
                  <CardHeader title="記録検索" />
                  <Box mt={4}>
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
                    <Box xs={1} sx={{ alignItems: "center", margin: "auto", width: "200px" }}>
                      <Grid item>
                        <Stack spacing={2}>
                          <Button variant="contained" href="" onClick={routePage}>
                            検索
                          </Button>
                        </Stack>
                      </Grid>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Page;
