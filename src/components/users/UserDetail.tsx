"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "../ui/button/Button";
import CustomLoadingPage from "../common/CustomLoadingPage";
import { useRouter } from "next/navigation";
import { getUserDetail } from "@/services/userService";
import { UserDetail } from "@/types/user/userDetail";
import UserMetaCard from "./UserMetaCard";
import UserInfoCard from "./UserInfoCard";

interface UserDetailProps {
  user_id: number;
}

export default function UserDetailMain({ user_id }: UserDetailProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserDetail | null>(null);

  const fetchData = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const data = await getUserDetail(user_id);
        setUser(data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user_id],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <CustomLoadingPage />;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-full">
      <div className=" justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 w-full">
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
        </div>
      </div>

      <div className="p-5 xl:p-8">
        <div className="flex items-center justify-end gap-3">
          <Button onClick={() => router.back()} variant="outline">Back</Button>
        </div>
      </div>
    </div>
  );
}
