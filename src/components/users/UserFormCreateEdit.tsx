"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { UserDataRequest } from "@/types/user/userDataRequest";
import { checkUserEmailAvailability, createUser, getUserDetail, updateUser } from "@/services/userService";
import DatePicker from "../form/date-picker";
import SelectAutoCompleteAsync, { LoadOptionsType } from "../form/SelectAutoCompleate";
import { OptionData } from "@/types/shared/optionData";
import { getBranchOptions } from "@/services/branchService";
import { ValidateEmail } from "@/utils/validator/inputValidator";
import { showToast } from "@/utils/alertToast";
import { GlobalMessages } from "@/constants/message";

interface UserFormProps {
  userId?: number;
  mode: 'create' | 'update';
}

const initialFormState: UserDataRequest = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  role_id: 0,
  site_id: 0,
  address: '',
  password: '',
  status: 'active',
};

const useDebouncedCallback = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

export default function UserFormCreateEdit({ userId, mode }: UserFormProps) {
  const [formData, setFormData] = useState<UserDataRequest>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<OptionData | null>(null);
  const [defaultBranchOptions, setDefaultBranchOptions] = useState<OptionData[]>([]);
  const [errorEmail, setErrorEmail] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);

  const roleOptions: OptionData[] = [
    { value: 2, label: "Owner" },
    { value: 3, label: "Admin" },
    { value: 4, label: "Kasir" },
    { value: 5, label: "Produksi" },
    { value: 6, label: "Kiosk" },
  ];
  const genderOptions: OptionData[] = [
    { value: "L", label: "Male" },
    { value: "P", label: "Female" },
  ];

  const fetchData = useCallback(
    async () => {
      setIsLoading(true);

      try {
        const branchOptions = await getBranchOptions('');
        setDefaultBranchOptions(branchOptions);

        if (mode === 'update' && userId) {
          const data = await getUserDetail(userId);

          setFormData({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: '',
            address: data.address,
            dob: data.dob,
            gender: data.gender,
            status: data.status,
            role_id: data.role_id,
            site_id: data.site_id,
          });

          setSelectedBranch(branchOptions.find(opt => opt.value === data.site_id) || null);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, mode],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const handleSelectRoleChange = useCallback((value: string | number) => {
    const typeValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, role_id: typeValue }));
  }, []);

  const handleSelectGenderChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  }, []);

  const handleTextareaChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, address: value }));
  }, []);

  const handleBranchChange = useCallback((option: OptionData | null) => {
    setSelectedBranch(option);
    setFormData(prev => ({
      ...prev,
      site_id: option ? (option.value as number) : 0
    }));
  }, []);

  const validateEmail = useCallback(async (email: string) => {
    const isValidFormat = ValidateEmail(email);

    if (!isValidFormat) {
      setIsEmailError(true);
      setErrorEmail("This is an invalid email address.");
      return;
    }

    try {
      const isAvailable = await checkUserEmailAvailability(email);

      if (isAvailable) {
        setIsEmailError(false);
        setErrorEmail("");
        setFormData(prev => ({ ...prev, email: email }));
      } else {
        setIsEmailError(true);
        setErrorEmail("Email already exists.");
      }
    } catch (error) {
      console.error("Error checking email availability:", error);
      setIsEmailError(true);
      setErrorEmail("Failed to check email availability.");
    }

  }, []);

  const debouncedEmailValidation = useDebouncedCallback(validateEmail, 700);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    debouncedEmailValidation(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || formData.role_id === 0 || formData.site_id === 0) {
      showToast({ type: 'error', message: GlobalMessages.VALIDATION.FILL_FORM });
      return;
    }

    if (isEmailError) {
      console.error("Perbaiki kesalahan email sebelum submit.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'create') {
        await createUser(formData);
        setFormData(initialFormState);
        setSelectedBranch(null);
      } else if (mode === 'update' && userId) {
        await updateUser(userId, formData);
      } else {
        throw new Error("Invalid mode or missing User ID for update.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBranchOptions: LoadOptionsType = (inputValue: string) => {
    return getBranchOptions(inputValue);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ComponentCard title="Form Create User">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-full">
            <h4 className="pb-4 text-base font-medium text-gray-800 border-b border-gray-200 dark:border-gray-800 dark:text-white/90">
              Personal Info
            </h4>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="name">User Name</Label>
            <Input
              type="text"
              placeholder="Enter user name"
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
              error={isEmailError}
              value={formData.email}
              onChange={handleEmailChange}
              // Tampilkan pesan error jika ada
              hint={isEmailError ? errorEmail : undefined}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="phone">Password</Label>
            <Input
              type="text"
              placeholder="Enter password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="role">Role</Label>
            <Select
              options={roleOptions}
              placeholder="Select Role"
              defaultValue={formData.role_id > 0 ? formData.role_id.toString() : ""}
              onChange={handleSelectRoleChange}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="branch">Cabang</Label>
            <SelectAutoCompleteAsync
              defaultOptions={defaultBranchOptions}
              loadOptions={loadBranchOptions as any}
              value={selectedBranch as any}
              onChange={handleBranchChange as any}
              placeholder="Cari Cabang (Ketik min 2 karakter)"
            />
          </div>

          <div className="col-span-full">
            <h4 className="pb-4 text-base font-medium text-gray-800 border-b border-gray-200 dark:border-gray-800 dark:text-white/90">
              Others Info
            </h4>
          </div>

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
            <DatePicker
              id="date-picker"
              label="Date of Birth"
              placeholder="Select a date"
              onChange={(dates, currentDateString) => {
                setFormData(prev => ({
                  ...prev,
                  dob: currentDateString,
                }));
              }}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="gender">Gender</Label>
            <Select
              options={genderOptions}
              placeholder="Select Gender"
              defaultValue={formData.gender || ""}
              onChange={handleSelectGenderChange}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <TextArea
              placeholder="Enter address..."
              rows={6}
              value={formData.address}
              onChange={handleTextareaChange}
              className=" bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="sm:col-span-2">
            <Button size="sm" className="w-full" disabled={isLoading || isEmailError} isLoading={isLoading}>
              {"Submit"}
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}