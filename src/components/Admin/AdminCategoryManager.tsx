import React, { useState } from "react";
import {
  useCategoriesAdmin,
  type Category,
} from "../../hooks/useCategoriesAdmin";
import { MdClose } from "react-icons/md";
import Spinner from "../loaders/Spinner";
import useNotification from "../../hooks/useNotification";
import { useTranslation } from "react-i18next";
import { RxCross2 } from "react-icons/rx";

const AdminCategoryManager: React.FC = () => {
  const {
    categories,
    loading: fetching,
    error,
    setError,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoriesAdmin();

  // local state just for the Add button
  const [creating, setCreating] = useState(false);

  // form state
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { triggerNotification, NotificationComponent } = useNotification();
  const { t } = useTranslation();
  const [nameError, setNameError] = useState<string>("");
  const [editNameError, setEditNameError] = useState<string>("");

  //  while fetching the initial list, show a placeholder
  if (fetching && categories.length === 0) {
    return (
      <div className="fixed flex flex-col gap-2 justify-center items-center top-1/2 left-1/2">
        <Spinner className="w-10 h-10" />
        <p>{t("Loading categories")}…</p>
      </div>
    );
  }

  // Create form submit
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return setNameError("Category name is required");
    if (newName.trim().length < 4) {
      setNameError("Category name must be at least 4 characters");
      return;
    }
    if (newName.trim().length > 50) {
      setNameError("Category name must be less than 50 characters");
      return;
    }

    setCreating(true);
    try {
      await createCategory(newName.trim());
      triggerNotification({
        type: "success",
        message: t("Category created successfully"),
        duration: 3000,
      });
      setNewName("");
    } finally {
      setCreating(false);
    }
  };

  // Open edit modal
  const openEdit = (cat: Category) => {
    setEditing(cat);
    setEditName(cat.name);
  };
  // Edit form submit
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditNameError("");
    if (!editName.trim()) return setEditNameError("Category name is required");
    if (editName.trim().length < 4) {
      setEditNameError("Category name must be at least 4 characters");
      return;
    }
    if (editName.trim().length > 50) {
      setEditNameError("Category name must be less than 50 characters");
      return;
    }
    setUpdating(true);
    try {
      await updateCategory(editing!.id, editName.trim());
      triggerNotification({
        type: "success",
        message: t("Category updated successfully"),
        duration: 3000,
      });
      setEditing(null);
    } finally {
      setUpdating(false);
      setEditing(null);
    }
  };

  const closeModal = () => {
    setEditing(null);
    setEditName("");
    setEditNameError("");
  };

  const handleDeleteConfirm = (id: number) => {
    setDeletingId(id);
    setDeleting(true);
  };

  // Delete
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteCategory(id);
      triggerNotification({
        type: "success",
        message: t("Category deleted successfully"),
        duration: 3000,
      });
    } finally {
      setDeletingId(null);
      setDeleting(false);
    }
  };
  const handleSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
    const trimmedName = e.target.value.trim();
    if (trimmedName.length <= 0) {
      setNameError("");
    }
    if (trimmedName.length >= 4) {
      setNameError("");
    }
  };
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-text-dark">
        {t("Manage Categories")}
      </h2>

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <div className="bg-white text-text-light-2 w-full max-w-md p-6 rounded shadow-lg flex flex-col gap-6">
            <p>{t("Are you sure you want to delete this category?")}</p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleting(false)}
                className="px-4 py-2 border border-inputBorder text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId || 0)}
                className="px-4 py-2 bg-red-500 text-white disabled:opacity-50 hover:bg-red-600 transition cursor-pointer"
              >
                {fetching ? `${t("Deleting")}…` : t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-text-light-2 mb-2 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-md p-10 shadow-lg border border-inputBorder z-50 text-center">
          <p className="text-red-500 mb-2 text-center">{t("Error")}:</p>
          {t(String(error))}
          <MdClose
            onClick={() => setError("")}
            className="absolute top-2 right-2 cursor-pointer text-xl"
          />
        </div>
      )}

      {/* Create */}
      <div className="flex flex-col mb-6">
        <form onSubmit={handleCreate} className="flex">
          <div className="relative w-full">
            <input
              className="w-full border border-inputBorder px-3 py-3 flex-1 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={t("New category name")}
              value={newName}
              onChange={handleSetName}
            />
            {newName && (
              <RxCross2
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer h-5 w-5"
                onClick={() => setNewName("")}
              />
            )}
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 sm:py-3 text-nowrap bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700"
          >
            {creating ? `${t("Adding")}…` : t("Add")}
          </button>
        </form>
        {nameError && (
          <p className="text-sm text-red-500 mt-1">{t(nameError)}</p>
        )}
      </div>
      {/* List */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-primary text-white text-[16px] 2xl:text-xl">
          <tr>
            <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
              {t("ID")}
            </th>
            <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
              {t("name")}
            </th>
            <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
              {t("Actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white" style={{ border: "1px solid #AAA9A9" }}>
          {categories.map((cat, i) => (
            <tr key={cat.id} className="text-[#808080] text-sm 2xl:text-xl">
              <td
                className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap"
                style={{
                  borderWidth: "0px 1px 1px 0px",
                  borderStyle: "solid",
                  borderColor: "#AAA9A9",
                }}
              >
                {i + 1}
              </td>
              <td
                className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap"
                style={{
                  borderWidth: "0px 1px 1px 0px",
                  borderStyle: "solid",
                  borderColor: "#AAA9A9",
                }}
              >
                {cat.name}
              </td>
              <td
                className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap space-x-2"
                style={{
                  borderWidth: "0px 1px 1px 0px",
                  borderStyle: "solid",
                  borderColor: "#AAA9A9",
                }}
              >
                <button
                  onClick={() => openEdit(cat)}
                  className="text-primary hover:underline cursor-pointer"
                >
                  {t("Edit")}
                </button>
                <button
                  onClick={() => handleDeleteConfirm(cat.id)}
                  className="text-red-700 hover:underline cursor-pointer"
                >
                  {t("Delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-lg min-w-[300px] sm:min-w-[400px]">
            <h3 className="text-lg font-medium mb-4 text-text-dark">
              {t("Edit Category")}
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4 w-full">
              <input
                className="w-full border border-inputBorder px-3 py-2 flex-1 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              {editNameError && (
                <p className="text-sm text-red-500 -mt-3">{t(editNameError)}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 w-[110px] border cursor-pointer border-inputBorder"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700"
                >
                  {updating ? `${t("Saving")}…` : t("Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {NotificationComponent}
    </div>
  );
};

export default AdminCategoryManager;
