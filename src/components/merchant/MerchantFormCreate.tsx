"use client";
import React, { useCallback, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { createMerchant } from "@/services/merchantService";
import { MerchantCreateRequest } from "@/types/merchant/merchantCreateRequest";
import { useGlobalModal } from '@/context/ModalContext';
import { useRouter } from "next/navigation";

const initialFormState: MerchantCreateRequest = {
  name: '',
  email: '',
  phone: '',
  address: '',
  business_type: 0,
};

export default function MerchantFormCreate() {
  const router = useRouter();
  const { openModal } = useGlobalModal();
  const [formData, setFormData] = useState<MerchantCreateRequest>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  const options = [
    { value: 1, label: "Restoran & Kafe" },
    { value: 2, label: "Retail & Toko" },
    { value: 3, label: "Jasa & Layanan" },
  ];

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const handleSelectChange = useCallback((value: string | number) => {
    const typeValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setFormData(prev => ({
      ...prev,
      business_type: typeValue,
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

    if (!formData.name || !formData.email || formData.business_type === 0) {
      alert("Mohon lengkapi semua field yang diperlukan.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createMerchant(formData);
      openModal(
        `Merchant ${formData.name} berhasil dibuat.`,
        'Success',
        () => router.push('/merchant'),
        1500
      );
      setFormData(initialFormState);

    } catch (error) {
      console.error("Gagal membuat merchant:", error);
      alert("Gagal membuat merchant. Cek console untuk detail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentCard title="Form Create Merchant">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Merchant Name */}
          <div className="col-span-2">
            <Label htmlFor="name">Merchant Name</Label>
            <Input
              type="text"
              placeholder="Enter merchant name"
              id="name"
              value={formData.name} // Dikontrol oleh state
              onChange={handleInputChange} // Gunakan handler generik
            />
          </div>

          {/* Email */}
          <div className="col-span-2">
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
          <div className="col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="text"
              placeholder="Enter phone number"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          {/* Business Type */}
          <div className="col-span-2">
            <Label htmlFor="business_type">Business Type</Label>
            <Select
              options={options}
              placeholder="Select Business Type"
              onChange={handleSelectChange}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          {/* Address */}
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

          {/* Submit Button */}
          <div className="col-span-2">
            <Button size="sm" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}