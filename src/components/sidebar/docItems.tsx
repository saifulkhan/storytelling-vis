import { SidebarItemsType } from "../../types/sidebar";

import {
  ArrowRightCircle,
  Code,
  Droplet,
  Globe,
  Info,
  List,
  Mail,
  Shield,
  Users,
} from "react-feather";

const gettingStartedSection = [
  {
    href: "/documentation/welcome",
    icon: Info,
    title: "Welcome",
  },
  {
    href: "/documentation/getting-started",
    icon: Code,
    title: "Getting Started",
  },
] as SidebarItemsType[];

const developmentSection = [
  {
    href: "/documentation/routing",
    icon: ArrowRightCircle,
    title: "Routing",
  },
  {
    href: "/documentation/auth",
    icon: Users,
    title: "Authentication",
    children: [
      {
        href: "/documentation/auth/auth0",
        title: "Auth0",
      },
      {
        href: "/documentation/auth/cognito",
        title: "Cognito",
      },
      {
        href: "/documentation/auth/firebase",
        title: "Firebase",
      },
      {
        href: "/documentation/auth/jwt",
        title: "JWT",
      },
    ],
  },
  {
    href: "/documentation/guards",
    icon: Shield,
    title: "Guards",
  },
  {
    href: "/documentation/theming",
    icon: Droplet,
    title: "Theming",
  },
  {
    href: "/documentation/api-calls",
    icon: ArrowRightCircle,
    title: "API Calls",
  },
  {
    href: "/documentation/redux",
    icon: ArrowRightCircle,
    title: "Redux",
  },
  {
    href: "/documentation/internationalization",
    icon: Globe,
    title: "Internationalization",
  },
  {
    href: "/documentation/environment-variables",
    icon: ArrowRightCircle,
    title: "Environment Variables",
  },
  {
    href: "/documentation/eslint-and-prettier",
    icon: ArrowRightCircle,
    title: "ESLint & Prettier",
  },
  {
    href: "/documentation/deployment",
    icon: ArrowRightCircle,
    title: "Deployment",
  },
] as SidebarItemsType[];

const supportSection = [
  {
    href: "/documentation/support",
    icon: Mail,
    title: "Support",
  },
  {
    href: "/changelog",
    icon: List,
    title: "Changelog",
    badge: "v4.2.0",
  },
] as SidebarItemsType[];

const navItems = [
  {
    title: "Getting started",
    pages: gettingStartedSection,
  },
  {
    title: "Development",
    pages: developmentSection,
  },
  {
    title: "Help",
    pages: supportSection,
  },
];

export default navItems;
