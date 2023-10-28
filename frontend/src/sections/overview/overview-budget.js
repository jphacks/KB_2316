import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

export const OverviewBudget = (props) => {
  const { difference, positive = false, sx, value, dataTime } = props;
  const now = new Date();
  let icon = <></>;
  if (value) {
    icon = (
      <>
        <Avatar
          sx={{
            backgroundColor: "success.light",
            height: 56,
            width: 56,
          }}
        >
          <SvgIcon>
            <Heart />
          </SvgIcon>
        </Avatar>
      </>
    );
  }
  // !valueであり、かつ15:00以降であれば
  else if (!value && now.getHours() >= 15) {
    icon = (
      <>
        <Avatar
          sx={{
            backgroundColor: "error.main",
            height: 56,
            width: 56,
          }}
        >
          <SvgIcon>
            <Heart />
          </SvgIcon>
        </Avatar>
      </>
    );
  } else {
    icon = (
      <>
        <Avatar
          sx={{
            backgroundColor: "primary.light",
            height: 56,
            width: 56,
          }}
        >
          <SvgIcon>
            <Heart />
          </SvgIcon>
        </Avatar>
      </>
    );
  }
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="black" variant="h6">
              {dataTime}
            </Typography>
            <Typography variant="h4">{value ? `${value}回` : "データ無し"}</Typography>
          </Stack>
          {icon}
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBudget.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
