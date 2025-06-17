import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import Link from "next/link";

interface UserQuiz {
  id: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  questionType: string;
  createdAt: string;
}

interface Props {
  data: UserQuiz[];
  onRowClick: (quiz: UserQuiz) => void;
}

export default function TableComponent({ data, onRowClick }: Props) {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [quizzes, setQuizzes] = useState<UserQuiz[]>(data);

  // Filter rows based on the filter input
  const filteredData = quizzes.filter(
    (quiz) =>
      quiz.topic.toLowerCase().includes(filter.toLowerCase()) ||
      quiz.difficulty.toLowerCase().includes(filter.toLowerCase()) ||
      quiz.questionType.toLowerCase().includes(filter.toLowerCase()) ||
      quiz.createdAt.toLowerCase().includes(filter.toLowerCase()),
  );

  // Paginated data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Delete function
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await axios.delete(`/api/quiz/delete/${id}`); // Adjust API endpoint
        setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
        window.location.reload();
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label
          htmlFor="filter"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Search Quizzes
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            id="filter"
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white p-3 pl-10 text-gray-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-400"
            placeholder="Filter by any field..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-boxdark">
        <TableContainer component={Paper} elevation={0} className="rounded-xl">
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <TableHead className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableCell className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200">
                  Topic
                </TableCell>
                <TableCell className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200">
                  Difficulty
                </TableCell>
                <TableCell className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200">
                  Questions
                </TableCell>
                <TableCell className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200">
                  Type
                </TableCell>
                <TableCell className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200">
                  Created At
                </TableCell>
                <TableCell className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-boxdark">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow
                    key={row.id || row._id}
                    hover
                    onClick={() => onRowClick(row)}
                    className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                      {row.topic}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          row.difficulty === "easy"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : row.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {row.difficulty}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                        {row.questionCount} questions
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {row.questionType === "multiple correct"
                        ? "Multiple Choice"
                        : "Single Choice"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {typeof row.createdAt === "string"
                        ? row.createdAt.slice(0, 10)
                        : new Date(row.createdAt).toISOString().slice(0, 10)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div
                        className="flex space-x-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/quiz/getQuizAnswer/${row._id}`}>
                          <button className="rounded-full p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </Link>
                        <button
                          className="rounded-full p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row._id);
                          }}
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="mb-3 h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium">No quizzes found</p>
                      <p className="mt-1 text-sm">
                        Try adjusting your search or filter to find what you're
                        looking for.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-boxdark">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {paginatedData.length > 0 ? page * rowsPerPage + 1 : 0} -{" "}
          {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
          {filteredData.length} quizzes
        </div>
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
          labelRowsPerPage="Rows:"
          rowsPerPageOptions={[5, 10, 25]}
          className="border-0"
        />
      </div>
    </div>
  );
}
