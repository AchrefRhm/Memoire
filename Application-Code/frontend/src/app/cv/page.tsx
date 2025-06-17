"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Home() {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await axios.get(`/api/cv/${userId}`);
        setCvs(response.data);
      } catch (error) {
        console.error("Error fetching CVs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchCVs();
  }, [userId]);

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Prevent navigation
    if (confirm("Are you sure you want to delete this resume?")) {
      try {
        await axios.delete(`/api/cv/${id}`);
        setCvs(cvs.filter((cv) => cv._id !== id));
      } catch (error) {
        console.error("Error deleting CV:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DefaultLayout>
      <main className="min-h-screen bg-gray-100 p-6 dark:bg-boxdark">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                My Resumes
              </h1>
              <p className="mt-2 text-gray-600 dark:text-white">
                Manage and create professional CVs
              </p>
            </div>
            <Link
              href="/cv/create"
              className="group flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-md transition-all hover:bg-indigo-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Create New Resume</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
          ) : cvs.length === 0 ? (
            <div className="overflow-hidden rounded-xl bg-white p-10 text-center shadow-md">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10 text-indigo-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                No Resumes Found
              </h2>
              <p className="mb-8 text-gray-600">
                Create your first professional resume and stand out from the
                crowd
              </p>
              <Link
                href="/cv/create"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-md transition-all hover:bg-indigo-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span>Create Your First Resume</span>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cvs.map((cv, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
                  style={{ aspectRatio: "8.5/11", maxHeight: "450px" }}
                >
                  {/* Header with options */}
                  <div className="flex items-center justify-between border-b bg-white p-4">
                    <div className="flex-1">
                      <h3 className="text-md line-clamp-1 font-medium text-gray-900">
                        {cv.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Created: {formatDate(cv.createdAt)}
                      </p>
                    </div>

                    {/* Three-dot menu */}
                    <div className="relative">
                      <div className="group/menu cursor-pointer rounded-full p-1 hover:bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5 text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                          />
                        </svg>

                        {/* Dropdown menu */}
                        <div className="invisible absolute right-0 z-10 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg group-hover/menu:visible">
                          <Link
                            href={`/cv/edit/${cv._id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/cv/preview/${cv._id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Preview
                          </Link>
                          <button
                            onClick={(e) => handleDelete(cv._id, e)}
                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CV Preview with fixed aspect ratio */}
                  <div className="relative h-full w-full overflow-hidden">
                    <Link
                      href={`/cv/preview/${cv._id}`}
                      className="block h-full"
                    >
                      {/* CV Preview content */}
                      <div
                        className="h-full px-4"
                        style={{ transform: "scale(0.9)" }}
                      >
                        {/* Personal Info */}
                        <div className="border-b pb-2 ">
                          <h1
                            className="m-0 text-xl font-bold"
                            style={{ color: cv.titleColor || "#1f2937" }}
                          >
                            {cv.personalInfo.name}
                          </h1>
                          {cv.personalInfo.title && (
                            <h2 className="text-sm text-gray-700">
                              {cv.personalInfo.title}
                            </h2>
                          )}

                          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-600">
                            {cv.personalInfo.email && (
                              <div className="truncate">
                                {cv.personalInfo.email}
                              </div>
                            )}
                            {cv.personalInfo.phone && (
                              <div className="truncate">
                                {cv.personalInfo.phone}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Experience */}
                        {cv.experience.length > 0 && cv.experience[0].title && (
                          <div className="mt-2 border-b pb-2">
                            <h2
                              className="mb-1 text-sm font-semibold"
                              style={{ color: cv.titleColor || "#1f2937" }}
                            >
                              Work Experience
                            </h2>

                            <div className="text-xs">
                              <div className="flex items-start justify-between">
                                <div
                                  className="font-medium"
                                  style={{
                                    color: cv.experience[0].color || "#374151",
                                  }}
                                >
                                  {cv.experience[0].title}
                                </div>
                                <div className="text-gray-500">
                                  {cv.experience[0].startDate &&
                                    cv.experience[0].startDate.substring(0, 4)}
                                </div>
                              </div>

                              <div className="text-gray-600">
                                {cv.experience[0].company}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {cv.education.length > 0 &&
                          cv.education[0].institution && (
                            <div className="mt-2 border-b pb-2">
                              <h2
                                className="mb-1 text-sm font-semibold"
                                style={{ color: cv.titleColor || "#1f2937" }}
                              >
                                Education
                              </h2>

                              <div className="text-xs">
                                <div className="flex items-start justify-between">
                                  <div
                                    className="font-medium"
                                    style={{
                                      color: cv.education[0].color || "#374151",
                                    }}
                                  >
                                    {cv.education[0].institution}
                                  </div>
                                  <div className="text-gray-500">
                                    {cv.education[0].startDate &&
                                      cv.education[0].startDate.substring(0, 4)}
                                  </div>
                                </div>

                                <div className="text-gray-600">
                                  {cv.education[0].degree}
                                  {cv.education[0].field &&
                                  cv.education[0].degree
                                    ? " in "
                                    : ""}
                                  {cv.education[0].field}
                                </div>
                              </div>
                            </div>
                          )}

                        {/* Skills */}
                        {cv.skills.length > 0 && cv.skills[0].name && (
                          <div className="mt-2">
                            <h2
                              className="mb-1 text-sm font-semibold"
                              style={{ color: cv.titleColor || "#1f2937" }}
                            >
                              Skills
                            </h2>

                            <div className="flex flex-wrap gap-1">
                              {cv.skills.slice(0, 3).map((skill, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-full border px-2 py-0.5 text-xs"
                                  style={{
                                    color: skill.color || "#4b5563",
                                    borderColor: skill.color || "#d1d5db",
                                  }}
                                >
                                  {skill.name}
                                </div>
                              ))}
                              {cv.skills.length > 3 && (
                                <div className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                                  +{cv.skills.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* View resume overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-0 opacity-0 transition-all group-hover:bg-opacity-30 group-hover:opacity-100">
                      <Link
                        href={`/cv/preview/${cv._id}`}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-md"
                      >
                        View Resume
                      </Link>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
                </div>
              ))}

              {/* "Create New" card */}
              <Link
                href="/cv/create"
                className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-indigo-300 hover:bg-gray-100"
                style={{ aspectRatio: "8.5/11", maxHeight: "450px" }}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-8 w-8 text-indigo-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                  <p className="mb-1 text-lg font-medium text-gray-900">
                    Create New Resume
                  </p>
                  <p className="text-sm text-gray-500">
                    Design your next career opportunity
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </main>
    </DefaultLayout>
  );
}
