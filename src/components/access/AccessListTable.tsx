"use client";
import React, { useCallback, useEffect, useState } from "react";

import { BaseParams, initialPageInfo, PaginatedResponse } from "@/types/shared/commonModel";
import Pagination from "../shared/Pagination";
import { getNoRow } from "@/utils/pageIndexHelper";
import { useGlobalModal } from "@/context/ModalContext";
import { Access } from "@/types/access/access";
import { createAccess, deleteAccess, getAccess, updateAccess } from "@/services/accessService";
import Switch from "../form/switch/Switch";
import AddAccessModal from "./AddAccessModal";
import CustomLoadingPage from "../common/CustomLoadingPage";
import { AccessDataRequest } from "@/types/access/accessDataRequest";
import { showToast } from "@/utils/alertToast";
import { GlobalMessages } from "@/constants/message";

interface Sort {
  key: keyof Access;
  asc: boolean;
}

export default function AccessListTable() {
  const { openModal } = useGlobalModal();
  const [access, setAccess] = useState<PaginatedResponse<Access>>({
    data: [],
    page_info: initialPageInfo
  });
  const [params, setParams] = useState<BaseParams>({
    page: 1,
    limit: 50
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState(params.name);
  const [sort, setSort] = useState<Sort>({ key: "menu", asc: true });
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const fetchData = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const data = await getAccess(params);
        setAccess(data);
      } catch (error) {
        console.error("Gagal memuat access:", error);
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

  const handleDelete = (selectedAccess: Access) => {
    openModal({
      title: "Delete Access",
      content: `Are you sure you want to delete ${selectedAccess.menu}?`,
      type: "confirm",
      onConfirm: () => {
        handleDeleteAccess(selectedAccess.id);
      },
    })
  }

  const handleCreateAccess = async (request: AccessDataRequest) => {
    try {
      setIsLoading(true);
      await createAccess(request);
      fetchData();
    } catch (error) {
      console.error("Gagal membuat access:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateAccess = async (key: keyof Access, data: Access, value: boolean) => {
    try {
      setIsDisable(true);
      const request: AccessDataRequest = {
        menu: data.menu,
        path: data.path,
        is_create: key === "is_create" ? value : data.is_create,
        is_read: key === "is_read" ? value : data.is_read,
        is_update: key === "is_update" ? value : data.is_update,
        is_delete: key === "is_delete" ? value : data.is_delete,
        is_maintenece: key === "is_maintenece" ? value : data.is_maintenece
      }
      await updateAccess(data.id, request);
      showToast({ type: "success", message: GlobalMessages.SUCCESS.UPDATED });
      fetchData();
    } catch (error) {
      console.error("Gagal update access:", error);
    } finally {
      setIsDisable(false);
    }
  }

  const handleDeleteAccess = async (accessId: number) => {
    try {
      await deleteAccess(accessId);

      fetchData();

    } catch (error) {
      console.error("Gagal menghapus access:", error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= access.page_info.total_page) {
      setParams(prev => ({
        ...prev,
        page: page
      }));
    }
  };

  const sortedAccess = () => {
    return [...access.data].sort((a, b) => {
      let valA = a[sort.key];
      let valB = b[sort.key];
      if (valA < valB) return sort.asc ? -1 : 1;
      if (valA > valB) return sort.asc ? 1 : -1;
      return 0;
    });
  };

  const paginatedProducts = () => {
    const start = (page - 1) * (params.limit as number);
    return sortedAccess().slice(start, start + (params.limit as number));
  };

  const sortBy = (key: keyof Access) => {
    setSort((prev) => ({
      key,
      asc: prev.key === key ? !prev.asc : true,
    }));
  };

  if (isLoading) {
    return <CustomLoadingPage />
  }

  return (
    <div className="relative">
      {isDisable && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 pointer-events-auto"></div>
      )}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Access List
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your store&apos;s progress to boost your sales.
            </p>
          </div>

          <div className="flex gap-3">
            <AddAccessModal
              onCreateAccess={handleCreateAccess}
              isLoading={isLoading}
            />
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
                  onClick={() => sortBy("menu")}
                  className="cursor-pointer px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Menu Name
                    </p>
                    <span className="flex flex-col gap-0.5">
                      <svg
                        className={
                          sort.key === "menu" && sort.asc
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
                          sort.key === "menu" && !sort.asc
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
                  onClick={() => sortBy("path")}
                  className="cursor-pointer px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Path
                    </p>
                    <span className="flex flex-col gap-0.5">
                      <svg
                        className={
                          sort.key === "path" && sort.asc
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
                          sort.key === "path" && !sort.asc
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
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Create
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Read
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Update
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Delete
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Maintenance
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-x divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedProducts().map((accessData, index) => (
                <tr
                  key={accessData.id}
                  className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="w-14 px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getNoRow(index, access.page_info.page_number, access.page_info.page_size)}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                      {accessData.menu}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {accessData.path}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Switch
                      defaultChecked={accessData.is_create}
                      onChange={(value) => handleUpdateAccess("is_create", accessData, value)}
                    />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Switch
                      defaultChecked={accessData.is_read}
                      onChange={(value) => handleUpdateAccess("is_read", accessData, value)}
                    />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Switch
                      defaultChecked={accessData.is_update}
                      onChange={(value) => handleUpdateAccess("is_update", accessData, value)}
                    />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Switch
                      defaultChecked={accessData.is_delete}
                      onChange={(value) => handleUpdateAccess("is_delete", accessData, value)}
                    />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Switch
                      defaultChecked={accessData.is_maintenece}
                      onChange={(value) => handleUpdateAccess("is_maintenece", accessData, value)}
                    />
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      className="hover:text-error-500 dark:hover:text-error-500 text-gray-500 dark:text-gray-400"
                      onClick={() => handleDelete(accessData)}
                    >
                      <svg
                        className="fill-current"
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.04142 4.29199C7.04142 3.04935 8.04878 2.04199 9.29142 2.04199H11.7081C12.9507 2.04199 13.9581 3.04935 13.9581 4.29199V4.54199H16.1252H17.166C17.5802 4.54199 17.916 4.87778 17.916 5.29199C17.916 5.70621 17.5802 6.04199 17.166 6.04199H16.8752V8.74687V13.7469V16.7087C16.8752 17.9513 15.8678 18.9587 14.6252 18.9587H6.37516C5.13252 18.9587 4.12516 17.9513 4.12516 16.7087V13.7469V8.74687V6.04199H3.8335C3.41928 6.04199 3.0835 5.70621 3.0835 5.29199C3.0835 4.87778 3.41928 4.54199 3.8335 4.54199H4.87516H7.04142V4.29199ZM15.3752 13.7469V8.74687V6.04199H13.9581H13.2081H7.79142H7.04142H5.62516V8.74687V13.7469V16.7087C5.62516 17.1229 5.96095 17.4587 6.37516 17.4587H14.6252C15.0394 17.4587 15.3752 17.1229 15.3752 16.7087V13.7469ZM8.54142 4.54199H12.4581V4.29199C12.4581 3.87778 12.1223 3.54199 11.7081 3.54199H9.29142C8.87721 3.54199 8.54142 3.87778 8.54142 4.29199V4.54199ZM8.8335 8.50033C9.24771 8.50033 9.5835 8.83611 9.5835 9.25033V14.2503C9.5835 14.6645 9.24771 15.0003 8.8335 15.0003C8.41928 15.0003 8.0835 14.6645 8.0835 14.2503V9.25033C8.0835 8.83611 8.41928 8.50033 8.8335 8.50033ZM12.9168 9.25033C12.9168 8.83611 12.581 8.50033 12.1668 8.50033C11.7526 8.50033 11.4168 8.83611 11.4168 9.25033V14.2503C11.4168 14.6645 11.7526 15.0003 12.1668 15.0003C12.581 15.0003 12.9168 14.6645 12.9168 14.2503V9.25033Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
            <div className="pb-3 xl:pb-0">
              <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
                Showing {access.page_info.page_number} to {access.page_info.total_page} of {access.page_info.total_data} entries
              </p>
            </div>
            <Pagination
              currentPage={access.page_info.page_number}
              totalPages={access.page_info.total_page}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};