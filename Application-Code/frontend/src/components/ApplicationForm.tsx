import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

export default function ApplicationForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title *
          </label>
          <input
            type="text"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />

          <p className="mt-1 text-sm text-red-600">errors.jobTitle.message</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company *
          </label>
          <input
            type="text"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />

          <p className="mt-1 text-sm text-red-600">errors.company.message</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Application Date *
          </label>
          <input
            type="date"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />

          <p className="mt-1 text-sm text-red-600">
            errors.applicationDate.message
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status *
          </label>
          <select className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="applied">Applied</option>
            <option value="interview">Interview Scheduled</option>
            <option value="offer">Offer Received</option>
            <option value="rejected">Rejected</option>
            <option value="follow-up">Follow-up Needed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority *
          </label>
          <select className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Follow-up Date
          </label>
          <input
            type="date"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Interview Date
          </label>
          <input
            type="date"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Name
          </label>
          <input
            type="text"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            type="email"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />

          <p className="mt-1 text-sm text-red-600">
            errors.contactEmail.message
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Phone
          </label>
          <input
            type="text"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job URL
          </label>
          <input
            type="url"
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />

          <p className="mt-1 text-sm text-red-600">errors.url.message</p>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            rows={4}
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            rows={4}
            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {/* {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="focus:ring-primary-500 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update Application"
              : "Create Application"} */}

        {/* </button> */}
      </div>
    </form>
  );
}
