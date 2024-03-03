import React, { useState, useEffect, ReactNode } from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";
import { MessageCircle } from "react-feather";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import faker from "faker";

import DashboardLayout from "../layouts/Dashboard";

import {
  Avatar,
  AvatarGroup as MuiAvatarGroup,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { orange, green, blue } from "@mui/material/colors";
import { Add as AddIcon } from "@mui/icons-material";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)<{ pb?: number }>`
  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

const AvatarGroup = styled(MuiAvatarGroup)`
  display: inline-flex;
`;

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const TaskWrapper = styled(Card)`
  border: 1px solid ${(props) => props.theme.palette.grey[300]};
  margin-bottom: ${(props) => props.theme.spacing(4)};
  cursor: grab;

  &:hover {
    background: ${(props) => props.theme.palette.background.default};
  }
`;

const TaskWrapperContent = styled(CardContent)`
  position: relative;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

const TaskAvatars = styled.div`
  margin-top: ${(props) => props.theme.spacing(1)};
`;

const MessageCircleIcon = styled(MessageCircle)`
  color: ${(props) => props.theme.palette.grey[500]};
  vertical-align: middle;
`;

const TaskBadge = styled.div`
  background: ${(props) => props.color};
  width: 40px;
  height: 6px;
  border-radius: 6px;
  display: inline-block;
  margin-right: ${(props) => props.theme.spacing(2)};
`;

const TaskNotifications = styled.div`
  display: flex;
  position: absolute;
  bottom: ${(props) => props.theme.spacing(4)};
  right: ${(props) => props.theme.spacing(4)};
`;

const TaskNotificationsAmount = styled.div`
  color: ${(props) => props.theme.palette.grey[500]};
  font-weight: 600;
  margin-right: ${(props) => props.theme.spacing(1)};
  line-height: 1.75;
`;

const Typography = styled(MuiTypography)(spacing);

const TaskTitle = styled(Typography)`
  font-weight: 600;
  font-size: 15px;
  margin-right: ${(props) => props.theme.spacing(10)};
`;

const mockItems1 = [
  {
    id: faker.datatype.uuid(),
    title: "Redesign the homepage",
    badges: [green[600], orange[600]],
    notifications: 2,
    avatars: [1, 2, 3, 4],
  },
  {
    id: faker.datatype.uuid(),
    title: "Upgrade dependencies to latest versions",
    badges: [green[600]],
    notifications: 1,
    avatars: [2],
  },
  {
    id: faker.datatype.uuid(),
    title: "Google Adwords best practices",
    badges: [],
    notifications: 0,
    avatars: [2, 3],
  },
  {
    id: faker.datatype.uuid(),
    title: "Improve site speed",
    badges: [green[600]],
    notifications: 3,
    avatars: [],
  },
  {
    id: faker.datatype.uuid(),
    title: "Stripe payment integration",
    badges: [blue[600]],
    notifications: 0,
    avatars: [],
  },
];

const mockItems2 = [
  {
    id: faker.datatype.uuid(),
    title: "Google Adwords best practices",
    badges: [],
    notifications: 0,
    avatars: [2, 3],
  },
  {
    id: faker.datatype.uuid(),
    title: "Stripe payment integration",
    badges: [blue[600]],
    notifications: 0,
    avatars: [2],
  },
];

const mockItems3 = [
  {
    id: faker.datatype.uuid(),
    title: "Improve site speed",
    badges: [green[600]],
    notifications: 3,
    avatars: [1, 2],
  },
  {
    id: faker.datatype.uuid(),
    title: "Google Adwords best practices",
    badges: [],
    notifications: 0,
    avatars: [2],
  },
  {
    id: faker.datatype.uuid(),
    title: "Redesign the homepage",
    badges: [green[600], orange[600]],
    notifications: 2,
    avatars: [],
  },
];

const mockColumns = {
  [faker.datatype.uuid()]: {
    title: "Backlog",
    description: "Nam pretium turpis et arcu. Duis arcu.",
    items: mockItems1,
  },
  [faker.datatype.uuid()]: {
    title: "In Progress",
    description: "Curabitur ligula sapien, tincidunt non.",
    items: mockItems2,
  },
  [faker.datatype.uuid()]: {
    title: "Completed",
    description: "Aenean posuere, tortor sed cursus feugiat.",
    items: mockItems3,
  },
};

const onDragEnd = (result: DropResult, columns: any, setColumns: any) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

interface LaneProps {
  column: {
    title: string;
    description: string;
  };
  children: ReactNode;
}

const Lane = ({ column, children }: LaneProps) => {
  return (
    <Grid item xs={12} lg={4} xl={4}>
      <Card mb={6}>
        <CardContent pb={0}>
          <Typography variant="h6" gutterBottom>
            {column.title}
          </Typography>
          <Typography variant="body2" mb={4}>
            {column.description}
          </Typography>
          {children}
          <Button color="primary" variant="contained" fullWidth>
            <AddIcon />
            Add new task
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface TaskProps {
  item: {
    badges: any;
    title: string;
    avatars: any;
    notifications: any;
  };
}

const Task = ({ item }: TaskProps) => {
  return (
    <TaskWrapper mb={4}>
      <TaskWrapperContent>
        {item.badges &&
          item.badges.map((color: any, i: number) => (
            <TaskBadge color={color} key={i} />
          ))}

        <TaskTitle variant="body1" gutterBottom>
          {item.title}
        </TaskTitle>

        <TaskAvatars>
          <AvatarGroup max={3}>
            {!!item.avatars &&
              item.avatars.map((avatar: any, i: number) => (
                <Avatar
                  src={`/static/img/avatars/avatar-${avatar}.jpg`}
                  key={i}
                />
              ))}
          </AvatarGroup>
        </TaskAvatars>

        {!!item.notifications && item.notifications > 0 && (
          <TaskNotifications>
            <TaskNotificationsAmount>
              {item.notifications}
            </TaskNotificationsAmount>
            <MessageCircleIcon />
          </TaskNotifications>
        )}
      </TaskWrapperContent>
    </TaskWrapper>
  );
};

function Tasks() {
  const [columns, setColumns] = useState(mockColumns);
  const [documentReady, setDocumentReady] = useState(false);

  useEffect(() => {
    setDocumentReady(true);
  }, []);

  return (
    <React.Fragment>
      <Helmet title="Tasks" />
      <Typography variant="h3" gutterBottom display="inline">
        Tasks
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <NextLink href="/" passHref>
          <Link>Dashboard</Link>
        </NextLink>
        <NextLink href="/" passHref>
          <Link>Pages</Link>
        </NextLink>
        <Typography>Tasks</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        {!!documentReady && (
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column]) => (
              <Lane key={columnId} column={column}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          minHeight: 50,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Task item={item} />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </Lane>
            ))}
          </DragDropContext>
        )}
      </Grid>
    </React.Fragment>
  );
}

Tasks.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Tasks;
