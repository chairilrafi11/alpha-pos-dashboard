"use client";
import React, { useCallback, useEffect, useState } from "react";

import { BaseParams, initialPageInfo, PaginatedResponse } from "@/types/shared/commonModel";
import Pagination from "../shared/Pagination";
import { getNoRow } from "@/utils/pageIndexHelper";
import Switch from "../form/switch/Switch";
import CustomLoadingPage from "../common/CustomLoadingPage";
import { RoleAccess } from "@/types/role/roleAccess";
import { Role } from "@/types/role/role";
import { OptionData } from "@/types/shared/optionData";
import { getRoleAccess, getRoles, syncRoleAccess } from "@/services/roleService";
import { RoleAccessDataRequest } from "@/types/role/roleAccessDataRequest";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { CheckLineIcon } from "@/icons";

interface Sort {
  key: keyof RoleAccess;
  asc: boolean;
}

export default function RoleAccessListTable() {
  const [formData, setFormData] = useState<RoleAccessDataRequest>({
    role_id: 0,
    access_id: []
  });

  const [access, setAccess] = useState<PaginatedResponse<RoleAccess>>({
    data: [],
    page_info: initialPageInfo
  });

  const [roles, setRoles] = useState<OptionData[]>([]);
  const [params, setParams] = useState<BaseParams>({ page: 1, limit: 50 });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sort, setSort] = useState<Sort>({ key: "menu", asc: true });

  const fetchRoles = useCallback(async () => {
    try {
      const data = await getRoles();
      const mapped = data.data.map((role: Role) => ({
        value: role.id,
        label: role.name
      }));

      setRoles(mapped);

      if (mapped.length > 0 && formData.role_id === 0) {
        setFormData(prev => ({ ...prev, role_id: mapped[0].value }));
      }
    } catch (error) {
      console.error("Gagal memuat roles:", error);
    }
  }, []);

  const fetchAccess = useCallback(async (roleId: number) => {
    setIsLoading(true);
    try {
      const accessData = await getRoleAccess(roleId);
      setAccess(accessData);
    } catch (err) {
      console.error("Gagal memuat access:", err);
    }
    setIsLoading(false);
  }, []);

  const handleSyncRoleAccess = async () => {
    try {
      setIsLoading(true);

      const selectedAccessIds = access.data
        .filter(item => item.is_assigned)
        .map(item => item.access_id);

      const payload: RoleAccessDataRequest = {
        role_id: formData.role_id,
        access_id: selectedAccessIds,
      };

      const result = await syncRoleAccess(formData.role_id, payload);
      if (result) fetchAccess(formData.role_id);

    } catch (error) {
      console.error("Failed to sync access:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (formData.role_id > 0) {
      fetchAccess(formData.role_id);
    }
  }, [formData.role_id, fetchAccess]);

  const handleSelectRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role_id: Number(value)
    }));
  };

  const handleAssignedChange = (accessId: number, value: boolean) => {
    setAccess(prev => ({
      ...prev,
      data: prev.data.map(item =>
        item.access_id === accessId ? { ...item, is_assigned: value } : item
      )
    }));
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
    const start = (1 - 1) * (params.limit as number);
    return sortedAccess().slice(start, start + (params.limit as number));
  };

  const sortBy = (key: keyof RoleAccess) => {
    setSort((prev) => ({
      key,
      asc: prev.key === key ? !prev.asc : true,
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= access.page_info.total_page) {
      setParams(prev => ({
        ...prev,
        page: page
      }));
    }
  };

  if (isLoading) {
    return <CustomLoadingPage />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Role Access List
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            List of role access
          </p>
        </div>
      </div>
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <Label htmlFor="unit">Role</Label>
            <div className="flex gap-3 sm:justify-between">
              <div className="relative flex-1 sm:flex-auto">
                <Select
                  options={roles}
                  placeholder="Select Role"
                  defaultValue={formData.role_id.toString()}
                  onChange={handleSelectRoleChange}
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-1 flex justify-end items-start">
            <Button
              size="sm"
              variant="primary"
              endIcon={<CheckLineIcon />}
              onClick={handleSyncRoleAccess}
            >
              Save
            </Button>
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
                Assigned
              </th>
            </tr>
          </thead>
          <tbody className="divide-x divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedProducts().map((roleAccessData, index) => (
              <tr
                key={roleAccessData.access_id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="w-14 px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getNoRow(index, access.page_info.page_number, access.page_info.page_size)}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    {roleAccessData.menu}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {roleAccessData.path}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <Switch
                    defaultChecked={roleAccessData.is_assigned}
                    onChange={(value) => handleAssignedChange(roleAccessData.access_id, value)}
                  />
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
  );
};