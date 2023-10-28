import Head from "next/head";
import { Box, Container, Grid, Typography, TextField, Button, FormHelperText } from "@mui/material";
import { useForm } from "react-hook-form";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    reValidateMode: "onSubmit",
  });

  const onSubmit = (data) => {
    router.push(`/dashboard/${data.username}`);
  };

  return (
    <>
      <Head>
        <title>Overview | Devias Kit</title>
      </Head>
      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            ID検索
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              sx={{
                width: "600px",
                "@media screen and (max-width:600px)": {
                  width: "300px",
                },
              }}
              margin="normal"
              fullWidth
              id="username"
              label="ユーザーID"
              autoComplete="username"
              {...register("username", {
                required: {
                  value: true,
                  message: "入力が必須の項目です。",
                },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "英数字のみ入力してください。",
                },
              })}
              error={Boolean(errors.username)}
            />
            <Box xs={24} sm={12} lg={3}>
              {errors.username && <FormHelperText error>{errors.username?.message}</FormHelperText>}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              ログイン
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
