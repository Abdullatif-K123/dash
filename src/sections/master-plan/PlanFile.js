import PropTypes from "prop-types";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useState } from "react";
import TablePlan from "./TablePlan";
import TopicPlan from "./TopicPlan";
import SupTopic from "./SupTopic";
import SubAddendum from "./SupAddendum";
import CustomizedSnackbars from "src/components/Snackbar";
export const PlanFile = (props) => {
  const { items = [], selected = [], handleRemove } = props;
  const [topic, setTopic] = useState([]);
  const [supTopic, setSupTopic] = useState([]);
  const [subAddendum, setSubAddendum] = useState([]);
  const [method, setMethod] = useState(props.node);
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("success");
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };
  // Notification snackbar for methods
  const handleNotification = (status, message) => {
    setOpenSnack(true);
    setStatus(status);
    setMessage(message);
  };
  const handleSelect = (title) => {
    const titleFind = items.find((context) => {
      return context.title === title;
    });

    if (titleFind.topics.length) {
      setMethod("topic");
      setTopic(titleFind.topics);
    } else {
      handleNotification("error", "No topics found please click add to add some topic");
    }
  };
  const handleSelectSupTopic = (title, id) => {
    const supTopicFind = topic.find((sup) => {
      return sup.title === title;
    });
    if (supTopicFind.subTopics.length) {
      setMethod("sup-topic");
      setSupTopic(supTopicFind.subTopics);
    } else {
      handleNotification("error", "No Sub-topics found please click add to add sub-topics");
    }
  };
  const handleSelectSupTopicAddendum = (title) => {
    const supTopicAddendum = supTopic.find((sup_topic) => {
      return (sup_topic.title = title);
    });
    if (supTopicAddendum.subTopicSection.length) {
      setMethod("subAddendum");
      setSubAddendum(supTopicAddendum.subTopicSection);
      console.log(supTopicAddendum.subTopicSection);
    } else {
      handleNotification("error", "No Sub Addendum found please click add to add Sub Addendum");
    }
  };
  const handleNavigationTree = () => {
    method === "topic"
      ? setMethod("root")
      : method === "sup-topic"
      ? setMethod("topic")
      : setMethod("sup-topic");
  };

  return (
    <>
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
                {method === "topic"
                  ? items.map((customer) => {
                      const isSelected = selected.includes(customer.id);
                      return (
                        <TopicPlan
                          notification={handleNotification}
                          customer={customer}
                          isSelected={isSelected}
                          key={customer.id}
                          handleRemove={handleRemove}
                          handleSelect={handleSelectSupTopic}
                          addingTitle={"sub-topic"}
                          method={"plan"}
                        />
                      );
                    })
                  : method === "sup-topic"
                  ? items.map((customer) => {
                      const isSelected = selected.includes(customer.id);
                      // const createdAt = format(customer.createdAt, "dd/MM/yyyy");
                      return (
                        <SupTopic
                          customer={customer}
                          notification={handleNotification}
                          isSelected={isSelected}
                          key={customer.id}
                          handleRemove={handleRemove}
                          handleSelect={handleSelectSupTopicAddendum}
                          method={"supTopic"}
                        />
                      );
                    })
                  : method === "subAddendum"
                  ? items.map((customer) => {
                      const isSelected = selected.includes(customer.id);
                      return (
                        <SubAddendum
                          notification={handleNotification}
                          customer={customer}
                          isSelected={isSelected}
                          key={customer.id}
                          handleRemove={handleRemove}
                          handleSelect={handleSelect}
                          method={"root"}
                        />
                      );
                    })
                  : items.map((customer) => {
                      const isSelected = selected.includes(customer.id);
                      return (
                        <TablePlan
                          notification={handleNotification}
                          customer={customer}
                          isSelected={isSelected}
                          key={customer.id}
                          handleRemove={handleRemove}
                          handleSelect={handleSelect}
                          addingTitle={"+Plan"}
                          method={"root"}
                        />
                      );
                    })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <CustomizedSnackbars
          handleClose={handleCloseSnack}
          open={openSnack}
          type={status}
          message={message}
        />
      </Card>
    </>
  );
};
