"use client";

import { FaBookBookmark } from "react-icons/fa6";
import { SidebarButton } from "./SidebarButton";

export default function RecipeButton() {
  return <SidebarButton href="/recipe" icon={FaBookBookmark} tooltipContent="食譜" />;
}
