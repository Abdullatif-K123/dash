import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
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

export const MessagesOverView = (props) => {
  const { data = [], sx } = props;
  const router = useRouter();
  return (
    <Card sx={sx}>
      <CardHeader title="Latest Messages" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell sortDirection="desc">Feedback Type</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((order) => {
                return (
                  <TableRow
                    hover
                    key={order.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      router.push("/messages ");
                    }}
                  >
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.feedbackType}</TableCell>
                    <TableCell>
                      <SeverityPill
                        color={statusMap[order.status === "opened" ? ["delivered"] : ["refunded"]]}
                      >
                        {order.status}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

MessagesOverView.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
