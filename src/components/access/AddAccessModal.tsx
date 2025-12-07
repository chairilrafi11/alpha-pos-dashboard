"use client";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { AccessDataRequest } from "@/types/access/accessDataRequest";
import { GlobalMessages } from "@/constants/message";
import { useState, useCallback } from "react";

export default function AddAccessModal({ onCreateAccess, isLoading }: {
  onCreateAccess: (request: AccessDataRequest) => Promise<void>,
  isLoading: boolean
}) {
  const addAccessModal = useModal();
  const [form, setForm] = useState<AccessDataRequest>({
    menu: '',
    path: '',
    is_create: false,
    is_read: false,
    is_update: false,
    is_delete: false,
    is_maintenece: false
  });
  const [isError, setIsError] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!form.menu || !form.path) {
      setIsError(true);
      return;
    }

    await onCreateAccess(form);
    addAccessModal.closeModal();
  };

  return (
    <>
      <Button onClick={addAccessModal.openModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 10.0002H15.0006M10.0002 5V15.0006"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        Add Access Menu
      </Button>

      <Modal
        isOpen={addAccessModal.isOpen}
        onClose={addAccessModal.closeModal}
        className="relative w-full max-w-[600px] m-5 sm:m-0 rounded-3xl bg-white p-6 lg:p-10 dark:bg-gray-900"
      >
        <div>
          <h4 className="text-title-sm mb-1 font-semibold text-gray-800 dark:text-white/90">
            Create Access Menu
          </h4>
          <p className="mb-7 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Create an access menu for role based access control
          </p>

          <form onSubmit={handleSubmit}>
            <div>
              <Label>Menu name</Label>
              <Input
                type="text"
                id="menu"
                name="menu"
                placeholder="Menu name"
                error={isError}
                hint={form.menu ? "" : GlobalMessages.VALIDATION.FILL_FORM}
                value={form.menu}
                disabled={isLoading}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-4">
              <Label>Path</Label>
              <Input
                type="text"
                id="path"
                name="path"
                placeholder="Path"
                error={isError}
                hint={form.path ? "" : GlobalMessages.VALIDATION.FILL_FORM}
                value={form.path}
                disabled={isLoading}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-8 flex w-full flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={addAccessModal.closeModal}
              >
                Close
              </Button>

              <Button
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create Menu
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
