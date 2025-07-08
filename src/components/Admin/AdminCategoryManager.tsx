


import React, { useState } from 'react';
import { useCategoriesAdmin, type Category } from '../../hooks/useCategoriesAdmin';


const AdminCategoryManager: React.FC = () => {
  const {
    categories,
    loading: fetching,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoriesAdmin();

 // local state just for the Add button
  const [creating, setCreating] = useState(false);

  // form state
  const [newName, setNewName]       = useState('');
  const [editing, setEditing]       = useState<Category | null>(null);
  const [editName, setEditName]     = useState('');
  const [updating, setUpdating]     = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

    //  while fetching the initial list, show a placeholder
  if (fetching && categories.length === 0) {
    return (
      <div className="p-4 max-w-2xl mx-auto text-center">
        <p>Loading categories…</p>
      </div>
    );
  }


  // Create form submit
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await createCategory(newName.trim());
      setNewName('');
    } finally {
      setCreating(false);
    }
  };


  // Open edit modal
  const openEdit = (cat: Category) => {
    setEditing(cat);
    setEditName(cat.name);
  };
;

  // Edit form submit
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editName.trim()) return;
    setUpdating(true);
    try {
      await updateCategory(editing.id, editName.trim());
      setEditing(null);
    } finally {
      setUpdating(false);
    }
  };


  const closeModal = () => {
    setEditing(null);
    setEditName('');
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>

      {error && (
        <div className="text-red-600 mb-2">
          {error}
        </div>
      )}

      {/* Create */}
      <form onSubmit={handleCreate} className="flex mb-6">
        <input
          className="border rounded-l px-3 py-2 flex-1"
          placeholder="New category name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button
          type="submit"
           disabled={creating}
          className="bg-primary text-white px-4 py-2 rounded-r cursor-pointer disabled:opacity-50"
        >
          {creating ? 'Processing…' : 'Add'}
        </button>
      </form>

      {/* List */}
      <table className="w-full table-auto bg-white shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id} className="border-t">
              <td className="px-4 py-2">{cat.id}</td>
              <td className="px-4 py-2">{cat.name}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-700 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-80">
            <h3 className="text-lg font-medium mb-4">Edit Category</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                className="w-full border px-3 py-2"
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-primary text-white disabled:opacity-50"
                >
                  {updating ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryManager;