"use client";
import React, { useCallback, useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { BranchDataRequest } from "@/types/branch/branchCreateRequest";
import { createBranch, getBranchDetail, updateBranch } from "@/services/branchService";
import { BranchDetail } from "@/types/branch/branch";

interface BranchFormProps {
  merchantId: number;
  branchId?: number;
  mode: 'create' | 'update';
}

const initialFormState: BranchDataRequest = {
  name: '',
  email: '',
  phone: '',
  address: '',
  business_type_id: 0,
  faktur_prefix: '',
  return_prefix: '',
  status: 'active',
  group_id: 0,
  payment_role_id: 0,
};

export default function BranchFormCreate({ merchantId, branchId, mode }: BranchFormProps) {
  const [formData, setFormData] = useState<BranchDataRequest>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const businessTypeOptions = [
    { value: 1, label: "Restoran & Kafe" },
    { value: 2, label: "Retail & Toko" },
    { value: 3, label: "Jasa & Layanan" },
  ];
  const paymentTypeOptions = [
    { value: 1, label: "Free" },
    { value: 2, label: "Basic" },
  ];

  const fetchData = useCallback(
    async () => {
      if (mode !== 'update' || !branchId) {
        return;
      }

      try {
        setIsLoading(true);

        const data = await getBranchDetail(merchantId, branchId!);
        setBranchFormData(data);

      } catch (error) {
        console.error("Gagal memuat merchant branches:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [merchantId, branchId, mode, setFormData, setIsLoading],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setBranchFormData = (data: BranchDetail) => {
    setFormData({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      business_type_id: data.business_type_id,
      faktur_prefix: data.faktur_prefix,
      return_prefix: data.return_prefix,
      status: data.status,
      group_id: data.group_id,
      payment_role_id: data.payment_role_id
    });

    handleSelectBusinessTypeChange(data.business_type_id);
    handleSelectPaymentTypeChange(data.payment_role_id);
  }

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const handleSelectBusinessTypeChange = useCallback((value: string | number) => {
    const typeValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setFormData(prev => ({
      ...prev,
      business_type: typeValue,
    }));
  }, []);

  const handleSelectPaymentTypeChange = useCallback((value: string | number) => {
    const typeValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setFormData(prev => ({
      ...prev,
      payment_role_id: typeValue,
    }));
  }, []);

  const handleTextareaChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      address: value,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || formData.business_type_id === 0) {
      alert("Mohon lengkapi semua field yang diperlukan.");
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (mode === 'create') {
        result = await createBranch(merchantId, formData);
        setFormData(initialFormState);

      } else if (mode === 'update' && branchId) {
        const result = await updateBranch(merchantId, branchId, formData);
        // setBranchFormData(result);
      } else {
        throw new Error("Invalid mode or missing Branch ID for update.");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentCard title="Form Create Branch">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-2">
            <Label htmlFor="name">Branch Name</Label>
            <Input
              type="text"
              placeholder="Enter merchant name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="email">Email</Label>
            <Input
              type="text"
              placeholder="Enter email address"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Phone */}
          <div className="col-span-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="text"
              placeholder="Enter phone number"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="business_type">Business Type</Label>
            <Select
              options={businessTypeOptions}
              placeholder="Select Business Type"
              defaultValue={formData.business_type_id.toString()}
              onChange={handleSelectBusinessTypeChange}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="business_type">Payment Type</Label>
            <Select
              options={paymentTypeOptions}
              placeholder="Select Payment Type"
              defaultValue={formData.payment_role_id.toString()}
              onChange={handleSelectPaymentTypeChange}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="address">Address</Label>
            <TextArea
              placeholder="Enter address..."
              rows={6}
              value={formData.address}
              onChange={handleTextareaChange}
              className=" bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="email">Faktur Prefix</Label>
            <Input
              type="text"
              placeholder="Enter faktur prefix"
              id="faktur_prefix"
              value={formData.faktur_prefix}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="email">Return Prefix</Label>
            <Input
              type="text"
              placeholder="Enter return prefix"
              id="return_prefix"
              value={formData.return_prefix}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-2">
            <Button size="sm" className="w-full" disabled={isLoading} isLoading={isLoading}>
              {"Submit"}
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}