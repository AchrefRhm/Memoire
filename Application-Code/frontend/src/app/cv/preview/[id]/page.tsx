// client/src/app/preview/[id]/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function CVPreview() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.id;

  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const divRef = useRef(null);

  const handlePrint = () => {
    if (divRef.current) {
      const printContents = divRef.current.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      window.location.reload();
    }
  };
  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/cv/detail/${cvId}`);
        setCv(response.data);
      } catch (error) {
        console.error("Error fetching CV:", error);
        setError("Failed to load CV. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (cvId) {
      fetchCV();
    }
  }, [cvId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading CV preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center overflow-y-scroll">
        <p className="mb-4 text-red-600">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!cv) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Header with controls */}
        <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
          <h1 className="text-xl font-bold">{cv.name}</h1>
          <div className="space-x-2">
            <button
              onClick={handlePrint}
              className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              Print / Export PDF
            </button>
            <button
              onClick={() => router.push(`/cv/edit/${cvId}`)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => router.push("/cv")}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              Back
            </button>
          </div>
        </div>

        {/* CV Content */}
        <div className="overflow-y-scroll p-8" id="cv-content" ref={divRef}>
          {/* Personal Info */}
          <div className="mb-8 border-b pb-6">
            <h1
              className="mb-2 text-3xl font-bold"
              style={{ color: cv.titleColor }}
            >
              {cv.personalInfo.name}
            </h1>
            {cv.personalInfo.title && (
              <h2 className="mb-4 text-xl text-gray-700">
                {cv.personalInfo.title}
              </h2>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-600">
              {cv.personalInfo.email && (
                <div>Email: {cv.personalInfo.email}</div>
              )}
              {cv.personalInfo.phone && (
                <div>Phone: {cv.personalInfo.phone}</div>
              )}
              {cv.personalInfo.location && (
                <div>Location: {cv.personalInfo.location}</div>
              )}
              {cv.personalInfo.website && (
                <div>Website: {cv.personalInfo.website}</div>
              )}
            </div>
          </div>

          {/* Summary */}
          {cv.summary.content && (
            <div className="mb-8">
              <h2
                className="mb-3 border-b pb-2 text-2xl font-bold"
                style={{ color: cv.titleColor }}
              >
                Professional Summary
              </h2>
              <p style={{ color: cv.summary.color }}>{cv.summary.content}</p>
            </div>
          )}

          {/* Experience */}
          {cv.experience.length > 0 && cv.experience[0].title && (
            <div className="mb-8">
              <h2
                className="mb-3 border-b pb-2 text-2xl font-bold"
                style={{ color: cv.titleColor }}
              >
                Work Experience
              </h2>

              {cv.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-start justify-between">
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: exp.color }}
                    >
                      {exp.title}
                    </h3>
                    <div className="text-gray-600">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="font-medium" style={{ color: exp.color }}>
                      {exp.company}
                    </span>
                    {exp.location && (
                      <span className="text-gray-600"> • {exp.location}</span>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-gray-700" style={{ color: exp.color }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {cv.education.length > 0 && cv.education[0].institution && (
            <div className="mb-8">
              <h2
                className="mb-3 border-b pb-2 text-2xl font-bold"
                style={{ color: cv.titleColor }}
              >
                Education
              </h2>

              {cv.education.map((edu, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-start justify-between">
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: edu.color }}
                    >
                      {edu.institution}
                    </h3>
                    <div className="text-gray-600">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </div>
                  </div>

                  {(edu.degree || edu.field) && (
                    <div className="mb-2">
                      <span
                        className="font-medium"
                        style={{ color: edu.color }}
                      >
                        {edu.degree}
                        {edu.field && edu.degree ? " in " : ""}
                        {edu.field}
                      </span>
                    </div>
                  )}

                  {edu.description && (
                    <p className="text-gray-700" style={{ color: edu.color }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {cv.skills.length > 0 && cv.skills[0].name && (
            <div>
              <h2
                className="mb-3 border-b pb-2 text-2xl font-bold"
                style={{ color: cv.titleColor }}
              >
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {cv.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="rounded-full border px-3 py-1"
                    style={{ color: skill.color, borderColor: skill.color }}
                  >
                    {skill.name} {skill.level && `(${skill.level})`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
