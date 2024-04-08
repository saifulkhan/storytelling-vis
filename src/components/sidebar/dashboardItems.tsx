import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckSquare,
  CreditCard,
  Grid,
  Heart,
  Layout,
  List,
  Map,
  ShoppingCart,
  PieChart,
  Sliders,
  Users,
} from "react-feather";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import ScienceIcon from "@mui/icons-material/Science";
import { SidebarItemsType } from "../../types/sidebar";

const pagesSection = [
  {
    href: "/storyboards",
    icon: ModelTrainingIcon,
    title: "Machine Learning",
    children: [
      {
        href: "/storyboards/ml-mv-story",
        title: "Multivariate",
      },
    ],
  },
  {
    href: "/storyboards",
    icon: CoronavirusIcon,
    title: "COVID-19",
    children: [
      {
        href: "/storyboards/covid19-sl-story",
        title: "Single Location",
      },
    ],
  },
] as unknown as SidebarItemsType[];

const testSection = [
  {
    href: "/storyboards/examples",
    icon: ScienceIcon,
    title: "Feature Action Tables",
    children: [
      {
        href: "/storyboards/examples/test-feature-properties-table",
        title: "Feature properties table",
      },
      {
        href: "/storyboards/examples/test-action-properties-table",
        title: "Action properties table",
      },
      {
        href: "/storyboards/examples/test-action-table",
        title: "Action table",
      },
    ],
  },
  {
    href: "/storyboards/examples",
    icon: ScienceIcon,
    title: "MSB Actions",
    children: [
      {
        href: "/storyboards/examples/test-actions",
        title: "Various actions",
      },
    ],
  },
  {
    href: "/storyboards/examples",
    icon: ScienceIcon,
    title: "Plots",
    children: [
      {
        href: "/storyboards/examples/test-line-plot",
        title: "Line plot",
      },
    ],
  },
  {
    href: "/storyboards/examples",
    icon: ScienceIcon,
    title: "Gaussian",
    children: [
      {
        href: "/storyboards/examples/test-gaussian-nts",
        title: "Numerical timeseries",
      },
      {
        href: "/storyboards/examples/test-gaussian-cts",
        title: "Categorical timeseries",
      },
      {
        href: "/storyboards/examples/test-gaussian-combined",
        title: "Gaussian combined",
      },
    ],
  },
] as unknown as SidebarItemsType[];

// const docsSection = [
//   {
//     href: "/documentation/welcome",
//     icon: BookOpen,
//     title: "Documentation",
//   },
//   {
//     href: "/changelog",
//     icon: List,
//     title: "Changelog",
//     badge: "v4.2.0",
//   },
// ] as SidebarItemsType[];

const navItems = [
  {
    title: "STORIES",
    pages: pagesSection,
  },
  {
    title: "TESTS",
    pages: testSection,
  },
  // {
  //   title: "Document",
  //   pages: docsSection,
  // },
];

export default navItems;
