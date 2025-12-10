"use client";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import Image from "next/image";
import { formatIDR } from "@/utils/currencyFormatter";
import { TopProduct } from "@/types/dashboard/topProduct";

type Props = {
  topProductList: TopProduct[] | undefined;
}

const WatchlistItem: React.FC<TopProduct> = ({
  id,
  name,
  image_dir,
  site_name,
  sell_price,
  buy_price,
  total_items_sold,
  total_revenue,
  total_profit,
}) => {
  return (
    <div className="flex items-center justify-between pt-4 pb-4 border-b border-gray-200 first:pt-0 last:border-b-0 last:pb-0 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10">
          <Image width={40} height={40} src="./images/brand/brand-01.svg" alt={id.toString()} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {name}
          </h3>
          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
            {site_name}
          </span>
        </div>
      </div>
      <div>
        <h4 className="mb-1 font-medium text-right text-gray-700 text-theme-sm dark:text-gray-400">
          {formatIDR(sell_price)}
        </h4>
        <span
          className={`flex items-center justify-end gap-1 font-medium text-theme-xs`}>
          {total_items_sold} Sold
        </span>
      </div>
    </div>
  );
};

export const TopProductList = ({ topProductList = [] }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top Products
        </h3>
        <div className="relative h-fit">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="flex h-[372px] flex-col">
        <div className="flex flex-col h-auto pr-3 overflow-y-auto custom-scrollbar">
          {topProductList.map((item, i) => (
            <WatchlistItem key={i + 1} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
