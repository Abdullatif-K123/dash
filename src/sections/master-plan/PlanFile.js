import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import DocumentIcon from "@heroicons/react/24/solid/DocumentIcon";
import Topic from "./Topic";
import { useRef, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { FormControl } from "@mui/material";
import { Input } from "@mui/material";
import { InputLabel } from "@mui/material";
import TablePlan from "./TablePlan";
export const PlanFile = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    handleRemove,
  } = props;
  const [choose, setChoose] = useState("");
  const [topic, setTopic] = useState([]);
  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const handleSelect = (title) => {
    setChoose(title);
    const titleFind = items.find((context) => {
      return context.title === title;
    });
    console.log(titleFind);
    setTopic(titleFind.topics);
  };
  return (
    <>
      <p
        onClick={() => {
          setTopic([]);
          setChoose("");
        }}
      >
        {choose}
      </p>
      <Card>
        {/* Delete dialog */}
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Plan title</TableCell>
                  <TableCell></TableCell>
                  <TableCell>CreatedAt</TableCell>
                  <TableCell>UpdatedAt</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topic.length
                  ? topic.map((customer) => {
                      const dateCreatedString = customer.dateCreated;
                      const dateCreated = new Date(dateCreatedString);

                      const options = { year: "numeric", month: "long", day: "numeric" };
                      const formattedDate = dateCreated.toLocaleDateString(undefined, options);

                      const isSelected = selected.includes(customer.id);
                      // const createdAt = format(customer.createdAt, "dd/MM/yyyy");

                      return (
                        <TablePlan
                          customer={customer}
                          isSelected={isSelected}
                          key={customer.id}
                          handleRemove={handleRemove}
                          handleSelect={handleSelect}
                        />
                      );
                    })
                  : items.map((customer) => {
                      const dateCreatedString = customer.dateCreated;
                      const dateCreated = new Date(dateCreatedString);

                      const options = { year: "numeric", month: "long", day: "numeric" };
                      const formattedDate = dateCreated.toLocaleDateString(undefined, options);

                      const isSelected = selected.includes(customer.id);
                      // const createdAt = format(customer.createdAt, "dd/MM/yyyy");

                      return (
                        <TablePlan
                          customer={customer}
                          isSelected={isSelected}
                          key={customer.id}
                          handleRemove={handleRemove}
                          handleSelect={handleSelect}
                        />
                      );
                    })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};

PlanFile.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
