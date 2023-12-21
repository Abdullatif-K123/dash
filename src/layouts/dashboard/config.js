import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import Messages from "@heroicons/react/24/solid/DocumentTextIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/DocumentIcon";
import FilmIcon from "@heroicons/react/24/solid/NewspaperIcon";
import WindowIcon from "@heroicons/react/24/solid/WindowIcon";
import BriefcaseIcon from "@heroicons/react/24/solid/BriefcaseIcon";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Overview",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Documents",
    path: "/documents",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Blogs",
    path: "/blogs",
    icon: (
      <SvgIcon fontSize="small">
        <FilmIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Messages",
    path: "/messages",
    icon: (
      <SvgIcon fontSize="small">
        <Messages />
      </SvgIcon>
    ),
  },
  {
    title: "Stakeholders",
    path: "/companies",
    icon: (
      <SvgIcon fontSize="small">
        <BriefcaseIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Account",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Settings",
    path: "/settings",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Login",
    path: "/auth/login",
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Register",
    path: "/auth/register",
    icon: (
      <SvgIcon fontSize="small">
        <UserPlusIcon />
      </SvgIcon>
    ),
  },
];
