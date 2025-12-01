"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast?: boolean;
}

interface BreadcrumbProps {
  pageTitle: string;
}

const SeparatorIcon = () => (
  <svg
    className="stroke-current"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
      stroke=""
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  const pathname = usePathname();

  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment.length > 0);

    let items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      const isLastSegment = index === pathSegments.length - 1;

      const label = isLastSegment
        ? pageTitle
        : segment.charAt(0).toUpperCase() + segment.slice(1);

      if (isLastSegment) {
        items.push({
          label: pageTitle,
          href: currentPath,
          isLast: true
        });
      } else {
        items.push({
          label: label,
          href: currentPath,
          isLast: false
        });
      }
    });

    if (items.length === 1 && pathname === '/') {
      items[0].isLast = true;
    } else {
      if (items.length > 1) {
        items[items.length - 2].isLast = false;
      }
    }

    return items;
  }, [pathname, pageTitle]);


  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
      >
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          {breadcrumbItems.map((item, index) => (
            <li key={index}>
              {item.isLast ? (
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {item.label}
                </span>
              ) : (
                <Link
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500"
                  href={item.href}
                >
                  {item.label}
                  <SeparatorIcon />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;