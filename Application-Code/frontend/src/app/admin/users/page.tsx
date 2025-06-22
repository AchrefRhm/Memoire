"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  AlertTriangle,
  CheckCircle,
  User,
  Users,
  RefreshCw,
  Mail,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  job: string;
  subs?: string;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  img?: string;
  isAdmin?: boolean;
  isActivated?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    username: "",
    email: "",
    password: "",
    job: "",
  });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.job.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/auth/list-users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      showNotification("Failed to fetch users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/auth/register", newUser);
      setNewUser({ username: "", email: "", password: "", job: "" });
      fetchUsers();
      setIsAddModalOpen(false);
      showNotification("User added successfully", "success");
    } catch (error) {
      showNotification("Failed to add user", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!currentUser?._id) return;
    setIsLoading(true);
    try {
      await axios.put(`/api/auth/update-user/${currentUser._id}`, currentUser);
      fetchUsers();
      setIsEditModalOpen(false);
      showNotification("User updated successfully", "success");
    } catch (error) {
      showNotification("Failed to update user", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser?._id) return;
    setIsLoading(true);
    try {
      await axios.delete(`/api/auth/delete-user/${currentUser._id}`);
      fetchUsers();
      setIsDeleteModalOpen(false);
      showNotification("User deleted successfully", "success");
    } catch (error) {
      showNotification("Failed to delete user", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!currentUser?._id) return;
    setIsLoading(true);
    try {
      await axios.put(`/api/auth/toggle-activation/${currentUser._id}`);
      fetchUsers();
      setIsSuspendModalOpen(false);
      showNotification(
        `User ${currentUser.isActivated ? "suspended" : "activated"} successfully`,
        "success",
      );
    } catch (error) {
      showNotification(
        `Failed to ${currentUser?.isActivated ? "suspend" : "activate"} user`,
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const openEditModal = (user: User) => {
    setCurrentUser({ ...user });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const openSuspendModal = (user: User) => {
    setCurrentUser(user);
    setIsSuspendModalOpen(true);
  };

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header with title and actions */}
          <div className="mb-8 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                User Management
              </h1>
              <p className="mt-1 text-gray-500">
                Manage, add, edit, and remove users
              </p>
            </div>
            <div className="flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-4 md:space-y-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-gray-700 focus:border-blue-500 focus:outline-none md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchUsers()}
                  className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Job Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-gray-500">Loading users...</p>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p className="text-gray-500">No users found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                              {user.img ? (
                                <img
                                  src={
                                    user.img.startsWith("https")
                                      ? user.img
                                      : `http://k8s-threetie-mainlb-11c5700e30-1182053200.us-east-1.elb.amazonaws.com${user.img}`
                                  }
                                  alt={user.username}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {user.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {user.job || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {user.subs || "None"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              user.isActivated
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActivated ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="rounded-md bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openSuspendModal(user)}
                              className={`rounded-md p-2 transition ${
                                user.isActivated
                                  ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                                  : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                              }`}
                              title={user.isActivated ? "Suspend" : "Activate"}
                            >
                              {user.isActivated ? (
                                <AlertTriangle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New User
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 py-2 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter username"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="block w-full rounded-md border-gray-300 py-2 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="user@example.com"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Job Role
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 py-2 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter job role"
                      value={newUser.job}
                      onChange={(e) =>
                        setNewUser({ ...newUser, job: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={isLoading}
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading && (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 py-2 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={currentUser.username}
                      onChange={(e) =>
                        setCurrentUser({
                          ...currentUser,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="block w-full rounded-md border-gray-300 py-2 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={currentUser.email}
                      onChange={(e) =>
                        setCurrentUser({
                          ...currentUser,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Job Role
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 py-2 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={currentUser.job || ""}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, job: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading && (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete User
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete {currentUser.username}? This
                    action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-t border-gray-200 p-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="ml-3 flex flex-1 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:bg-red-300"
              >
                {isLoading && (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend/Activate User Modal */}
      {isSuspendModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                {currentUser.isActivated ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentUser.isActivated ? "Suspend User" : "Activate User"}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {currentUser.isActivated
                      ? `Are you sure you want to suspend ${currentUser.username}? They will lose access to the system.`
                      : `Are you sure you want to activate ${currentUser.username}? They will regain access to the system.`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-t border-gray-200 p-6">
              <button
                onClick={() => setIsSuspendModalOpen(false)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={isLoading}
                className={`ml-3 flex flex-1 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50 ${
                  currentUser.isActivated
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isLoading && (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                )}
                {currentUser.isActivated ? "Suspend User" : "Activate User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg">
          <div
            className={`flex items-center rounded-lg px-4 py-3 ${
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="mr-2 h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5-w-5 mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
