import type { RouteObject } from "react-router";
import { HomeUI } from "./ui.tsx";

export const homeRoute = {
  index: true,
  element: <HomeUI />,
} satisfies RouteObject;
