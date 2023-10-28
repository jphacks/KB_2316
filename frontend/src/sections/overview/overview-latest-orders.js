import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};

export const OverviewLatestOrders = (props) => {
  const { orders = [], sx, uuid } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="直近の記録" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>日付</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                return (
                  <TableRow hover key={order.id}>
                    <Link href={`/dashboard/${uuid}/${order.time}`}>
                      <TableCell>{order.time}</TableCell>
                    </Link>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
