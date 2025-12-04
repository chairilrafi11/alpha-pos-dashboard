"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { ProductDataRequest } from "@/types/product/productDataRequest";
import { createProduct, getProductDetail, updateProduct } from "@/services/productService";
import { getMerchantOptions } from "@/services/merchantService";
import { getCategoryOptions } from "@/services/categoryService";
import Select from "../form/Select";

interface UserFormProps {
  productId?: number;
  mode: 'create' | 'update';
}

const initialFormState: ProductDataRequest = {
  barcode: '',
  category_id: 0,
  description: '',
  external_id: 'product',
  harga_jual: 0,
  harga_beli: 0,
  image: '',
  name: '',
  qty_stock: 0,
  satuan_kecil: '',
};

export default function ProductFormCreateEdit({ productId, mode }: UserFormProps) {
  const [formData, setFormData] = useState<ProductDataRequest>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMerchant, setSelectedMerchant] = useState<OptionData | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<OptionData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<OptionData | null>(null);

  const [defaultMerchantOptions, setDefaultMerchantOptions] = useState<OptionData[]>([]);
  const [defaultBranchOptions, setDefaultBranchOptions] = useState<OptionData[]>([]);
  const [defaultCategoryOptions, setDefaultCategoryOptions] = useState<OptionData[]>([]);

  const unitOptions: OptionData[] = [
    { value: "qty", label: 'Qty' },
    { value: "pcs", label: 'Pcs' },
    { value: "pax", label: 'pax' },
    { value: "kilo", label: 'kilo' },
  ];

  // --- FETCH DATA (Initial Load & Update Mode) ---
  const fetchData = useCallback(
    async () => {
      setIsLoading(true);

      try {
        // 1. Load Merchant Options Default

        if (mode === 'update' && productId) {
          const data = await getProductDetail(productId);

          const merchantOptions = await getMerchantOptions('');
          setDefaultMerchantOptions(merchantOptions);

          setFormData({
            barcode: data.barcode,
            category_id: data.category_id,
            description: data.description,
            external_id: data.external_id,
            harga_beli: data.buy_price,
            harga_jual: data.sell_price,
            image: data.image,
            name: data.name,
            qty_stock: data.qty_stock,
            satuan_kecil: data.satuan_kecil,
          });

          setSelectedMerchant({ value: data.merchant_id, label: data.merchant_name });
          setSelectedBranch({ value: data.branch_id, label: data.branch_name });
          setSelectedCategory({ value: data.category_id, label: data.category_name });

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
    [productId, mode],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- HANDLERS ---

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Handle number inputs specifically
    if (['harga_beli', 'harga_jual', 'qty_stock'].includes(id)) {
      setFormData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  }, []);

  const handleTextareaChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, description: value })); // Fix: key harus description bukan address
  }, []);

  const handleSelectUnitChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, satuan_kecil: value }));
  }, []);

  // --- FIX GLITCH: CASCADE SELECT HANDLERS ---

  const handleMerchantChange = useCallback(async (option: OptionData | null) => {
    // 1. Update State Local
    setSelectedMerchant(option);

    // 2. Reset Anak-anaknya (Branch & Category)
    setSelectedBranch(null);
    setSelectedCategory(null);
    setDefaultBranchOptions([]); // Kosongkan opsi branch
    setDefaultCategoryOptions([]); // Kosongkan opsi category
    setFormData(prev => ({ ...prev, category_id: 0 })); // Reset ID category di form

    // 3. Fetch Data Baru (Gunakan 'option', BUKAN 'selectedMerchant' state)
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
    // 1. Update State Local
    setSelectedBranch(option);

    // 2. Reset Anak-anaknya (Category)
    setSelectedCategory(null);
    setDefaultCategoryOptions([]);
    setFormData(prev => ({ ...prev, category_id: 0 }));

    // 3. Fetch Data Baru (Gunakan 'option', BUKAN 'selectedBranch' state)
    if (option != null) {
      try {
        const resultCategory = await getCategoryOptions({ branch_id: option.value });
        setDefaultCategoryOptions(resultCategory);
      } catch (err) {
        console.error("Failed loading categories", err);
      }
    }
  }, []);

  const handleCategoryChange = useCallback((option: OptionData | null) => {
    setSelectedCategory(option);
    setFormData(prev => ({
      ...prev,
      category_id: option ? (option.value as number) : 0
    }));
  }, []);

  // --- LOAD OPTIONS (MEMOIZED & DEPENDENT) ---

  const loadMerchantOptions: LoadOptionsType = useCallback((inputValue: string) => {
    return getMerchantOptions(inputValue);
  }, []);

  const loadBranchOptions: LoadOptionsType = useCallback((inputValue: string) => {
    // Gunakan selectedMerchant?.value di sini. 
    // Karena ini dipanggil saat user mengetik di branch (setelah merchant dipilih), state sudah aman.
    if (!selectedMerchant?.value) return Promise.resolve([]);
    return getBranchOptions({ merchant_id: selectedMerchant.value, name: inputValue });
  }, [selectedMerchant]);

  const loadCategoryOptions: LoadOptionsType = useCallback((inputValue: string) => {
    if (!selectedBranch?.value) return Promise.resolve([]);
    return getCategoryOptions({ branch_id: selectedBranch.value, name: inputValue });
  }, [selectedBranch]);


  // --- SUBMIT ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.harga_jual || !formData.harga_beli || formData.category_id === 0) {
      showToast({ type: 'error', message: GlobalMessages.VALIDATION.FILL_FORM });
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'create') {
        await createProduct(formData);
        setFormData(initialFormState);
        // Reset Selects
        setSelectedMerchant(null);
        setSelectedBranch(null);
        setSelectedCategory(null);
      } else if (mode === 'update' && productId) {
        await updateProduct(productId, formData);
      } else {
        throw new Error("Invalid mode or missing Product ID.");
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
    <ComponentCard title={mode === 'create' ? "Form Create Product" : "Form Update Product"}>
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              placeholder="Enter product name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="harga_beli">Buy Price</Label>
            <Input
              type="number"
              min="0"
              placeholder="Enter buy price"
              id="harga_beli"
              value={formData.harga_beli || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="harga_jual">Sell Price</Label>
            <Input
              type="number"
              placeholder="Enter sell price"
              id="harga_jual"
              value={formData.harga_jual || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="unit">Unit</Label>
            <Select
              options={unitOptions}
              placeholder="Select unit"
              // Handle Select change untuk component Select biasa
              defaultValue={formData.satuan_kecil}
              onChange={handleSelectUnitChange}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="qty_stock">Stock</Label>
            <Input
              type="number"
              placeholder="Enter stock"
              id="qty_stock"
              value={formData.qty_stock || ''}
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
            <Label htmlFor="category">Category</Label>
            <SelectAutoCompleteAsync
              defaultOptions={defaultCategoryOptions}
              loadOptions={loadCategoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Cari Kategori..."
              disabled={mode === 'update' || !selectedBranch}
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