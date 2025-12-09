import InvalidIdMessage from "@/components/common/InvalidMessage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserDetailMain from "@/components/users/UserDetail";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alpha POS | Merchant Detail",
  description: "Ini di halaman merchant",
};

export default function MerchantDetailPage({ params }: { params: { user_id: string } }) {
  const hashedId = params.user_id;
  const userId = decodeId(hashedId);

  if (userId === null) {
    return (
      <InvalidIdMessage
        title="ID User Tidak Valid"
        message="ID User yang Anda akses tidak dapat diproses. Mohon periksa URL Anda."
      />
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="User Detail" />
      <UserDetailMain user_id={userId} />
    </div >
  );
}
