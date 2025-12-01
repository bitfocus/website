import React, { type ReactNode } from "react";
import DocsVersionDropdownNavbarItem from "@theme-original/NavbarItem/DocsVersionDropdownNavbarItem";
import type DocsVersionDropdownNavbarItemType from "@theme/NavbarItem/DocsVersionDropdownNavbarItem";
import type { WrapperProps } from "@docusaurus/types";
import { useLocation } from "@docusaurus/router";

type Props = WrapperProps<typeof DocsVersionDropdownNavbarItemType>;

export default function DocsVersionDropdownNavbarItemWrapper(
  props: Props
): ReactNode {
  const { pathname } = useLocation();

  // Custom logic: only show on specific path
  const showOnlyForPath = (props as any).showOnlyForPath as string | undefined;
  if (showOnlyForPath && !pathname.startsWith(showOnlyForPath)) return null;

  return (
    <>
      <DocsVersionDropdownNavbarItem {...props} />
    </>
  );
}
