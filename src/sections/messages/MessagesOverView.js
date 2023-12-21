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
import TableMessage from "./TableMessage";
import { useState } from "react";

export const MessagesOverView = (props) => {
  const { datas = [], sx } = props;
  const [data, setData] = useState(props.data);
  const router = useRouter();
  const handleDeleted = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    console.log(updatedData);
    setData(updatedData);
  };
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
                <TableCell>FeedBack Title</TableCell>
                <TableCell sortDirection="desc">Feedback Type</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((order) => {
                return <TableMessage key={order.id} order={order} DeleteItems={handleDeleted} />;
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
