"use client";
import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Thumbnail {
  url: string;
}

interface VideoSnippet {
  title: string;
  description: string;
  thumbnails: {
    medium: Thumbnail;
  };
}

interface VideoStatistics {
  viewCount: string;
}

export interface Video {
  id: string;
  snippet: VideoSnippet;
  statistics?: VideoStatistics;
}

const Recommendations: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userInterest, setUserInterest] = useState<string>("");
  const [submittedInterest, setSubmittedInterest] = useState<string>("");

  const fetchVideos = async (interest: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/recommendations", {
        userInterest: interest,
      });

      setVideos(response.data.videos);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error fetching recommendations",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userInterest.trim() === "") return;
    setSubmittedInterest(userInterest);
    fetchVideos(userInterest);
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-100 py-10 dark:bg-boxdark">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-center text-4xl font-bold">
            Recommended YouTube Videos
          </h1>
          <form
            onSubmit={handleSearchSubmit}
            className="mb-8 flex justify-center"
          >
            <input
              type="text"
              value={userInterest}
              onChange={(e) => setUserInterest(e.target.value)}
              placeholder="Enter your interest, e.g. CSS, JavaScript..."
              className="w-full max-w-md rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="rounded-r-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Search
            </button>
          </form>

          {submittedInterest && (
            <p className="mb-4 text-center text-lg">
              Showing recommendations for:{" "}
              <span className="font-semibold">{submittedInterest}</span>
            </p>
          )}

          {loading && (
            <div className="flex items-center justify-center">
              <p className="text-xl font-semibold">
                Loading recommendations...
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center">
              <p className="text-xl text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="overflow-hidden rounded-lg bg-white shadow-lg"
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h2 className="mb-2 text-xl font-semibold">
                      {video.snippet.title}
                    </h2>
                    <p className="mb-4 text-sm text-gray-700">
                      {video.snippet.description.length > 100
                        ? video.snippet.description.substring(0, 100) + "..."
                        : video.snippet.description}
                    </p>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded bg-red-600 py-2 text-center text-white transition-colors hover:bg-red-700"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && videos.length === 0 && submittedInterest && (
            <div className="flex items-center justify-center">
              <p className="text-xl">
                No videos found for "{submittedInterest}"
              </p>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Recommendations;
