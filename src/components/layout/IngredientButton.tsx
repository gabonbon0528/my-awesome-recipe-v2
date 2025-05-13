"use client";

import { FaBurger } from "react-icons/fa6";
import { SidebarButton } from "./SidebarButton";

export default function IngredientButton() {
  return <SidebarButton href="/ingredient" icon={FaBurger} tooltipContent="原料" />;
}
