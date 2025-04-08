"use client";
import { Breadcrumb } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";

interface BreadCrumbItem {
  label: string;
  href: string;
}

const BREADCRUMBS_MAP = new Map<string, BreadCrumbItem[]>([
  ["/", [{ label: "首頁", href: "/" }]],
  [
    "/recipe",
    [
      { label: "首頁", href: "/" },
      { label: "食譜", href: "/recipe" },
    ],
  ],
  [
    "/recipe/[id]",
    [
      { label: "首頁", href: "/" },
      { label: "食譜", href: "/recipe" },
      { label: "編輯食譜", href: "/recipe/[id]" },
    ],
  ],
  [
    "/recipe/create",
    [
      { label: "首頁", href: "/" },
      { label: "食譜", href: "/recipe" },
      { label: "新增食譜", href: "/recipe/create" },
    ],
  ],
  [
    "/ingredient",
    [
      { label: "首頁", href: "/" },
      { label: "原料", href: "/ingredient" },
    ],
  ],
  [
    "/ingredient/[id]",
    [
      { label: "首頁", href: "/" },
      { label: "原料", href: "/ingredient" },
      { label: "編輯原料", href: "/ingredient/[id]" },
    ],
  ],
  [
    "/ingredient/create",
    [
      { label: "首頁", href: "/" },
      { label: "原料", href: "/ingredient" },
      { label: "新增原料", href: "/ingredient/create" },
    ],
  ],
]);

export const BreadCrumbs = () => {
  const pathname = usePathname();

  const breadCrumbs = useMemo(() => {
    // 檢查路徑是否包含動態路由參數（例如：/recipe/123）
    const hasDynamicParam = /\/[^/]+\/[^/]+$/.test(pathname);
    
    // 只在有動態參數時才進行路徑標準化
    const normalizedPath = hasDynamicParam 
      ? pathname.replace(/\/[^/]+$/, "/[id]")
      : pathname;

    return BREADCRUMBS_MAP.get(normalizedPath)?.map((crumb) => ({
      ...crumb,
      href: crumb.href === "/[id]" ? pathname : crumb.href,
    }));
  }, [pathname]);

  if (!breadCrumbs) {
    return null;
  }

  return (
    <Breadcrumb.Root size="lg">
      <Breadcrumb.List>
        {breadCrumbs.map((crumb, index) => (
          <Fragment key={crumb.href}>
            {index !== 0 && <Breadcrumb.Separator />}
            <Breadcrumb.Item>
              {index === breadCrumbs.length - 1 ? (
                <Breadcrumb.CurrentLink>{crumb.label}</Breadcrumb.CurrentLink>
              ) : (
                <Breadcrumb.Link href={crumb.href}>
                  {crumb.label}
                </Breadcrumb.Link>
              )}
            </Breadcrumb.Item>
          </Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};
