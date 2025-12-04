"use client";
import React, { useCallback, useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import SelectAutoCompleteAsync, { LoadOptionsType } from "../form/SelectAutoCompleate";
import { OptionData } from "@/types/shared/optionData";
import { getBranchOptions } from "@/services/branchService";
import { showToast } from "@/utils/alertToast";
import { GlobalMessages } from "@/constants/message";
import { getMerchantOptions } from "@/services/merchantService";
import { createCategory, getCategoryDetail, updateCategory } from "@/services/categoryService";
import { CategoryDataRequest } from "@/types/category/categoryDataRequest";
import Switch from "../form/switch/Switch";

interface UserFormProps {
  categoryId?: number;
  mode: 'create' | 'update';
}

const initialFormState: CategoryDataRequest = {
  branch_id: 0,
  name: '',
  description: '',
  threshold_harga_percentage: 0,
  image: '',
  status: 'active',
};

export default function CategoryFormCreateEdit({ categoryId, mode }: UserFormProps) {
  const [formData, setFormData] = useState<CategoryDataRequest>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMerchant, setSelectedMerchant] = useState<OptionData | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<OptionData | null>(null);

  const [defaultMerchantOptions, setDefaultMerchantOptions] = useState<OptionData[]>([]);
  const [defaultBranchOptions, setDefaultBranchOptions] = useState<OptionData[]>([]);

  const fetchData = useCallback(
    async () => {
      setIsLoading(true);

      try {

        if (mode === 'update' && categoryId) {
          const data = await getCategoryDetail(categoryId);

          const merchantOptions = await getMerchantOptions('');
          setDefaultMerchantOptions(merchantOptions);

          setFormData({
            branch_id: data.branch_id,
            name: data.name,
            description: data.description,
            threshold_harga_percentage: data.threshold_harga_percentage,
            image: data.image,
            status: data.status
          });

        } else {
          const merchantOptions = await getMerchantOptions('');
          setDefaultMerchantOptions(merchantOptions);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [categoryId, mode],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (['threshold_harga_percentage'].includes(id)) {
      setFormData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  }, []);

  const handleTextareaChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  }, []);

  const handleMerchantChange = useCallback(async (option: OptionData | null) => {
    setSelectedMerchant(option);

    setSelectedBranch(null);
    setDefaultBranchOptions([]);
    setFormData(prev => ({ ...prev, category_id: 0 }));
    if (option != null) {
      try {
        const resultBranch = await getBranchOptions({ merchant_id: option.value });
        setDefaultBranchOptions(resultBranch);
      } catch (err) {
        console.error("Failed loading branches", err);
      }
    }
  }, []);

  const handleBranchChange = useCallback(async (option: OptionData | null) => {
    setSelectedBranch(option);
    if (option != null) {
      setFormData(prev => ({ ...prev, branch_id: option ? (option.value as number) : 0 }));
    }
  }, []);

  const loadMerchantOptions: LoadOptionsType = useCallback((inputValue: string) => {
    return getMerchantOptions(inputValue);
  }, []);

  const loadBranchOptions: LoadOptionsType = useCallback((inputValue: string) => {
    if (!selectedMerchant?.value) return Promise.resolve([]);
    return getBranchOptions({ merchant_id: selectedMerchant.value, name: inputValue });
  }, [selectedMerchant]);

  const handleStatusChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || formData.branch_id === 0) {
      showToast({ type: 'error', message: GlobalMessages.VALIDATION.FILL_FORM });
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'create') {
        await createCategory(formData);
        setFormData(initialFormState);

        setSelectedMerchant(null);
        setSelectedBranch(null);
      } else if (mode === 'update' && categoryId) {
        await updateCategory(categoryId, formData);
      } else {
        throw new Error("Invalid mode or missing Category ID.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ComponentCard title={mode === 'create' ? "Form Create Category" : "Form Update Category"}>
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              placeholder="Enter category name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="threshold_harga_percentage">Treshold Percentage</Label>
            <Input
              type="number"
              min="0"
              placeholder="Enter Treshold Percentage ex : 10%"
              id="threshold_harga_percentage"
              value={formData.threshold_harga_percentage || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="merchant">Merchant</Label>
            <SelectAutoCompleteAsync
              defaultOptions={defaultMerchantOptions}
              loadOptions={loadMerchantOptions}
              value={selectedMerchant}
              onChange={handleMerchantChange}
              placeholder="Cari Merchant..."
              disabled={mode === 'update'}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="branch">Cabang</Label>
            <SelectAutoCompleteAsync
              defaultOptions={defaultBranchOptions}
              loadOptions={loadBranchOptions}
              value={selectedBranch}
              onChange={handleBranchChange}
              placeholder="Cari Cabang..."
              disabled={mode === 'update' || !selectedMerchant}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="branch">Aktif</Label>
            <Switch
              defaultChecked={formData.status == 'active'}
              onChange={handleStatusChange}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <TextArea
              placeholder="Enter description..."
              rows={6}
              value={formData.description}
              onChange={handleTextareaChange}
              className=" bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="sm:col-span-2">
            <Button size="sm" className="w-full" disabled={isLoading} isLoading={isLoading}>
              {"Submit"}
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}