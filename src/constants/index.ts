import { ChartAreaIcon, Home, Users } from "lucide-react";

export const items = [
  {
    title: "Overview",
    url: `/organization/:slug/overview`,
    icon: ChartAreaIcon,
    tag: "overview",
  },
  {
    title: "Events",
    url: `/organization/:slug/events`,
    icon: Home,
    tag: "events",
  },
  {
    title: "Members",
    url: `/organization/:slug/members`,
    icon: Users,
    tag: "members",
  },
];
