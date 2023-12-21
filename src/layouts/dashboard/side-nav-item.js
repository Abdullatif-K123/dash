import NextLink from "next/link";
import PropTypes from "prop-types";
import { Box, ButtonBase } from "@mui/material";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ArrowRight from "@heroicons/react/24/solid/ArrowRightIcon";
import { useState } from "react";
import SvgIcon from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, icon1 } = props;
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  const pathHome = "/home-page";
  const pathAbout = "/about-page";
  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};
  const linkPropsHome = pathHome
    ? external
      ? {
          component: "a",
          href: pathHome,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: pathHome,
        }
    : {};
  const linkPropsAbout = pathAbout
    ? external
      ? {
          component: "a",
          href: pathAbout,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: pathAbout,
        }
    : {};
  if (title === "Settings") {
    return (
      <li>
        <ButtonBase
          onClick={handleToggle}
          sx={{
            alignItems: "center",
            borderRadius: 1,
            display: "flex",
            justifyContent: "flex-start",
            pl: "16px",
            pr: "16px",
            py: "6px",
            textAlign: "left",
            width: "100%",
            ...(active && {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
            }),
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
            },
          }}
        >
          {icon && (
            <Box
              component="span"
              sx={{
                alignItems: "center",
                color: "neutral.400",
                display: "inline-flex",
                justifyContent: "center",
                mr: 2,
                ...(active && {
                  color: "primary.main",
                }),
              }}
            >
              {icon}
            </Box>
          )}
          <Box
            component="span"
            sx={{
              color: "neutral.400",
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "24px",
              whiteSpace: "nowrap",
              ...(active && {
                color: "common.white",
              }),
              ...(disabled && {
                color: "neutral.500",
              }),
            }}
          >
            {title}
          </Box>
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: "neutral.400",
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
              ...(active && {
                color: "primary.main",
              }),
            }}
          >
            {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </Box>
        </ButtonBase>

        {expanded && (
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <TreeItem
              nodeId="1"
              label={
                <li>
                  <ButtonBase
                    sx={{
                      alignItems: "center",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      pl: "16px",
                      pr: "16px",
                      py: "6px",
                      textAlign: "left",
                      width: "100%",
                      ...(active && {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      }),
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                    {...linkPropsHome}
                  >
                    {icon1 && (
                      <Box
                        component="span"
                        sx={{
                          alignItems: "center",
                          color: "neutral.400",
                          display: "inline-flex",
                          justifyContent: "center",
                          mr: 2,
                          ...(active && {
                            color: "primary.main",
                          }),
                        }}
                      >
                        {icon1}
                      </Box>
                    )}
                    <Box
                      component="span"
                      sx={{
                        color: "neutral.400",
                        flexGrow: 1,
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: "24px",
                        whiteSpace: "nowrap",
                        ...(active && {
                          color: "common.white",
                        }),
                        ...(disabled && {
                          color: "neutral.500",
                        }),
                      }}
                    >
                      Home Page Settings
                    </Box>
                  </ButtonBase>
                </li>
              }
            />
            <TreeItem
              nodeId="2"
              label={
                <li>
                  <ButtonBase
                    sx={{
                      alignItems: "center",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      pl: "16px",
                      pr: "16px",
                      py: "6px",
                      textAlign: "left",
                      width: "100%",
                      ...(active && {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      }),
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                    {...linkPropsAbout}
                  >
                    {icon1 && (
                      <Box
                        component="span"
                        sx={{
                          alignItems: "center",
                          color: "neutral.400",
                          display: "inline-flex",
                          justifyContent: "center",
                          mr: 2,
                          ...(active && {
                            color: "primary.main",
                          }),
                        }}
                      >
                        {icon1}
                      </Box>
                    )}
                    <Box
                      component="span"
                      sx={{
                        color: "neutral.400",
                        flexGrow: 1,
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: "24px",
                        whiteSpace: "nowrap",
                        ...(active && {
                          color: "common.white",
                        }),
                        ...(disabled && {
                          color: "neutral.500",
                        }),
                      }}
                    >
                      About Page Settings
                    </Box>
                  </ButtonBase>
                </li>
              }
            />
          </TreeView>
        )}
      </li>
    );
  }
  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          justifyContent: "flex-start",
          pl: "16px",
          pr: "16px",
          py: "6px",
          textAlign: "left",
          width: "100%",
          ...(active && {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          }),
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          },
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: "neutral.400",
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
              ...(active && {
                color: "primary.main",
              }),
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: "neutral.400",
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "24px",
            whiteSpace: "nowrap",
            ...(active && {
              color: "common.white",
            }),
            ...(disabled && {
              color: "neutral.500",
            }),
          }}
        >
          {title}
        </Box>
      </ButtonBase>
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
};
