"use client";
import React, { useCallback, useEffect, useState } from "react";

import Button from "../ui/button/Button";
import { BaseParams, initialPageInfo, PaginatedResponse } from "@/types/shared/commonModel";
import Pagination from "../shared/Pagination";
import { getNoRow } from "@/utils/pageIndexHelper";
import TableDropdown from "../common/TableDropdown";
import { encodeId } from "@/utils/idHasher";
import { useGlobalModal } from "@/context/ModalContext";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/icons";
import { getInvoices } from "@/services/invoiceService";
import { Invoice } from "@/types/invoice/invoice";
import { dateFormatReadable } from "@/utils/dateFormatter";
import { formatIDR } from "@/utils/currencyFormatter";

interface Sort {
  key: keyof Invoice;
  asc: boolean;
}

const FilterDropdown: React.FC<{
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
}> = ({ showFilter, setShowFilter }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setShowFilter]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        onClick={() => setShowFilter(!showFilter)}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M14.6537 5.90414C14.6537 4.48433 13.5027 3.33331 12.0829 3.33331C10.6631 3.33331 9.51206 4.48433 9.51204 5.90415M14.6537 5.90414C14.6537 7.32398 13.5027 8.47498 12.0829 8.47498C10.663 8.47498 9.51204 7.32398 9.51204 5.90415M14.6537 5.90414L17.7087 5.90411M9.51204 5.90415L2.29199 5.90411M5.34694 14.0958C5.34694 12.676 6.49794 11.525 7.91777 11.525C9.33761 11.525 10.4886 12.676 10.4886 14.0958M5.34694 14.0958C5.34694 15.5156 6.49794 16.6666 7.91778 16.6666C9.33761 16.6666 10.4886 15.5156 10.4886 14.0958M5.34694 14.0958L2.29199 14.0958M10.4886 14.0958L17.7087 14.0958"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Filter
      </button>
      {showFilter && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Invoice
            </label>
            <input
              type="text"
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Search invoice..."
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Customer
            </label>
            <input
              type="text"
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              placeholder="Search customer..."
            />
          </div>
          <button className="bg-brand-500 hover:bg-brand-600 h-10 w-full rounded-lg px-3 py-2 text-sm font-medium text-white">
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default function InvoiceListTable() {
  const router = useRouter();
  const { openModal } = useGlobalModal();
  const [invoices, setInvoices] = useState<PaginatedResponse<Invoice>>({
    data: [],
    page_info: initialPageInfo
  });
  const [params, setParams] = useState<BaseParams>({
    page: 1,
    limit: 10
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState(params.name);
  const [sort, setSort] = useState<Sort>({ key: "no_invoice", asc: true });
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [showFilter, setShowFilter] = useState(false);

  const fetchData = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const data = await getInvoices(params);
        setInvoices(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    },
    [params],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== params.name) {
        setParams(prev => ({
          ...prev,
          name: searchQuery,
          page: 1,
        }));
      }

    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handlerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (selected: Invoice) => {
    openModal({
      title: "Delete Invoice",
      content: `Are you sure you want to delete ${selected.no_invoice} - Customer ${selected.order_name} ?`,
      type: "confirm",
      onConfirm: () => {
        handleDeleteInvoice(selected.id);
      },
    })
  }

  const handleDeleteInvoice = async (id: number) => {
    try {
      // TODO : delete invoice
      fetchData();

    } catch (error) {
      console.error("Gagal menghapus invoices:", error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= invoices.page_info.total_page) {
      setParams(prev => ({
        ...prev,
        page: page
      }));
    }
  };

  const sortedCategories = () => {
    return [...invoices.data].sort((a, b) => {
      let valA = a[sort.key];
      let valB = b[sort.key];
      if (sort.key === "amount") {
        valA = parseFloat(String(valA).replace(/[^\d.]/g, ""));
        valB = parseFloat(String(valB).replace(/[^\d.]/g, ""));
      }
      if (valA < valB) return sort.asc ? -1 : 1;
      if (valA > valB) return sort.asc ? 1 : -1;
      return 0;
    });
  };

  const paginatedCategories = () => {
    const start = (page - 1) * perPage;
    return sortedCategories().slice(start, start + perPage);
  };

  const sortBy = (key: keyof Invoice) => {
    setSort((prev) => ({
      key,
      asc: prev.key === key ? !prev.asc : true,
    }));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Invoice List
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your store&apos;s progress to boost your sales.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            Export
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M16.667 13.3333V15.4166C16.667 16.1069 16.1074 16.6666 15.417 16.6666H4.58295C3.89259 16.6666 3.33295 16.1069 3.33295 15.4166V13.3333M10.0013 13.3333L10.0013 3.33325M6.14547 9.47942L9.99951 13.331L13.8538 9.47942"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <Button
            size="sm"
            variant="primary"
            endIcon={<PlusIcon />}
            onClick={() => router.push('/invoices/create')}
          >
            Add
          </Button>
        </div>
      </div>
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="flex gap-3 sm:justify-between">
          <div className="relative flex-1 sm:flex-auto">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04199 9.37336937363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              value={searchQuery}
              onChange={handlerSearch}
            />
          </div>
          <FilterDropdown
            showFilter={showFilter}
            setShowFilter={setShowFilter}
          />
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                No
              </th>
              <th
                onClick={() => sortBy("no_invoice")}
                className="cursor-pointer px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <div className="flex items-center gap-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    No Invoice
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.key === "no_invoice" && sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className={
                        sort.key === "no_invoice" && !sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </th>
              <th
                onClick={() => sortBy("order_name")}
                className="cursor-pointer px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Customer
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.key === "order_name" && sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className={
                        sort.key === "order_name" && !sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-400/50"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </th>
              <th
                onClick={() => sortBy("amount")}
                className="cursor-pointer px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Total Amount
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.key === "amount" && sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className={
                        sort.key === "amount" && !sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </th>
              <th
                onClick={() => sortBy("branch_name")}
                className="cursor-pointer px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Branch
                  </p>
                  <span className="flex flex-col gap-0.5">
                    <svg
                      className={
                        sort.key === "branch_name" && sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg
                      className={
                        sort.key === "branch_name" && !sort.asc
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300"
                      }
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Creation Date
              </th>
              {/* <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="relative">
                  <span className="sr-only">Action</span>
                </div>
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-x divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedCategories().map((invoice, index) => (
              <tr
                key={invoice.id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="w-14 px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getNoRow(index, invoices.page_info.page_number, invoices.page_info.page_size)}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="text-theme-sm font-medium text-gray-700 group-hover:underline dark:text-gray-400">
                    {invoice.no_invoice}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {invoice.order_name}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {formatIDR(invoice.amount)}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {invoice.branch_name}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {dateFormatReadable(invoice.created_at)}
                  </p>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="relative flex justify-center dropdown">
                    <TableDropdown
                      dropdownButton={
                        <button className="text-gray-500 dark:text-gray-400 ">
                          <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      }
                      dropdownContent={
                        <>
                          <button
                            onClick={() => router.push(`/invoices/${encodeId(invoice.id)}`)}
                            className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          >
                            View More
                          </button>
                          <button
                            onClick={() => router.push(`/invoices/${encodeId(invoice.id)}/edit`)}
                            className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(invoice)}
                            className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            Delete
                          </button>
                        </>
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          {/* Left side: Showing entries */}
          <div className="pb-3 xl:pb-0">
            <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
              Showing {invoices.page_info.page_number} to {invoices.page_info.total_page} of {invoices.page_info.total_data} entries
            </p>
          </div>
          <Pagination
            currentPage={invoices.page_info.page_number}
            totalPages={invoices.page_info.total_page}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div >
  );
};