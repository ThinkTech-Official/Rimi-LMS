

import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { TbEdit } from 'react-icons/tb';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useFetchTests, type TestEntry } from '../hooks/useFetchTests';
import { useDeleteTest } from '../hooks/useDeleteTest';

const EditCourse: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const testsPerPage = 5;

  const {
    tests = [],
    total,
    loading,
    error,
  } = useFetchTests(courseId!, currentPage, testsPerPage);

  const {
    deleteTest,
    loading: deleting,
    error: deleteError,
  } = useDeleteTest(courseId!);

  // local copy to sync front-end after delete
  const [localTests, setLocalTests] = useState<TestEntry[]>([]);
  useEffect(() => {
    setLocalTests(tests);
  }, [tests]);

  const [modalTestId, setModalTestId] = useState<number | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filtered = localTests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(total / testsPerPage));
  const startIndex = (currentPage - 1) * testsPerPage;
  const paginatedTests = filtered.slice(
    startIndex,
    startIndex + testsPerPage
  );

  const handleCreateTest = () => {
    navigate(`/admin/edit-course/${courseId}/create-test`);
  };

  const handleDeleteClick = (id: number) => {
    setModalTestId(id);
  };

  const handleConfirmDelete = async () => {
    if (modalTestId === null) return;
    try {
      await deleteTest(modalTestId);
      setLocalTests((prev) => prev.filter((t) => t.id !== modalTestId));
      setModalTestId(null);
    } catch {
      // error shown in modal
    }
  };

  const handleCancelDelete = () => {
    setModalTestId(null);
  };

  const handleTestEdit  = (testId: number) => {
    navigate(`/admin/edit-course/${courseId}/edit-test/${testId}`)
  }

  return (
    <section className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Attached Tests
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center border border-[#DBDADE] w-[230px] sm:w-[330px]">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-2 sm:px-4 py-1 sm:py-3 w-[200px] sm:w-[330px] focus:outline-none"
            />
            <button className="px-1 sm:px-3 cursor-pointer">
              <BiSearch className="text-[#6F6B7D]" />
            </button>
          </div>
          <button
            onClick={handleCreateTest}
            className="inline-block text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150 w-fit"
          >
            Create New Test
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <p>Loading tests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : paginatedTests.length > 0 ? (
        <>
          {/* Table */}
          {/* <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-white text-[16px] 2xl:text-xl text-center">
                <tr>
                  <th className="px-2 py-3 font-medium">Test Name</th>
                  <th className="px-2 py-3 font-medium"># Questions</th>
                  <th className="px-2 py-3 font-medium">Duration</th>
                  <th className="px-2 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody
                className="bg-white text-[#808080] text-sm 2xl:text-xl text-center"
                style={{ border: '1px solid #AAA9A9' }}
              >
                {paginatedTests.map((test) => (
                  <tr key={test.id}>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{ border: '0 1px 1px 0 solid #AAA9A9' }}
                    >
                      {test.name}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{ border: '0 1px 1px 0 solid #AAA9A9' }}
                    >
                      {test.questionCount}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{ border: '0 1px 1px 0 solid #AAA9A9' }}
                    >
                      {test.duration}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap text-center"
                      style={{ border: '0 1px 1px 0 solid #AAA9A9' }}
                    >
                      <div className="flex gap-1.5 justify-center">
                        <button
                          onClick={() => handleDeleteClick(test.id)}
                          className="text-primary hover:underline font-medium"
                        >
                          <RiDeleteBinLine className="w-5 h-5" />
                        </button>
                        <button className="text-primary hover:underline font-medium">
                          <TbEdit className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}

          {/* table */}
          <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-white text-[16px] 2xl:text-xl text-center">
                <tr>
                  <th className="px-2 py-3 font-medium">Test Name</th>
                  <th className="px-2 py-3 font-medium">Questions</th>
                  <th className="px-2 py-3 font-medium">Start Point</th>
                  <th className="px-2 py-3 font-medium">Duration</th>
                  <th className="px-2 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody
                className="bg-white text-[#808080] text-sm 2xl:text-xl text-center"
                style={{ border: "1px solid #AAA9A9" }}
              >
                {filtered.map((test: TestEntry) => (
                  <tr key={test.id}>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      {test.name}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      {test.questionCount}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      {test.startTime}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      {test.duration}
                    </td>
                    <td
                      className="px-2 py-4 text-center whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      <div className="flex gap-1.5 justify-center">
                        <button onClick={() => handleDeleteClick(test.id)} className="text-primary hover:underline font-medium">
                          <RiDeleteBinLine className="w-5 h-5 cursor-pointer text-red-400" />
                        </button>
                        <button onClick={() => handleTestEdit(test.id)} className="text-primary hover:underline font-medium">
                          <TbEdit className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center p-4 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-2 cursor-pointer ${
                  num === currentPage ? 'bg-primary text-white' : 'bg-[#F1F0F2] text-[#808080]'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <p>No tests attached to this course yet.</p>
      )}

      {/* Delete Confirmation Modal */}
      {modalTestId !== null && (
        <div className="fixed inset-0 bg-primary/10  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p className="mt-4">Are you sure you want to delete this test?</p>
            {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditCourse;




