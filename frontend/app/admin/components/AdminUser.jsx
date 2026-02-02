"use client";

import React, { useEffect, useState } from "react";

const USERS_PER_PAGE = 10;

const AdminUsersPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/admin/users", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.statusCode === 200) {
        setAllUsers(data.data.users);
        setUsers(data.data.users);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= FILTER (FRONTEND) ================= */
  useEffect(() => {
    let filtered = [...allUsers];

    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.includes(q))
      );
    }

    setUsers(filtered);
    setPage(1);
  }, [search, roleFilter, allUsers]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  /* ================= BLOCK / UNBLOCK ================= */
  const toggleBlock = async (user) => {
    try {
      setActionLoading(true);

      const res = await fetch(
        `http://localhost:8000/admin/users/${user._id}/block`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.statusCode === 200) {
        fetchUsers();
      } else {
        alert(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        User Management
      </h1>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search username / email / phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border w-full md:w-80 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border w-full md:w-48 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">All Roles</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.username}</span>
                  </td>

                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone || "-"}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
                    >
                      View
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => toggleBlock(user)}
                      className={`px-3 py-1 rounded-md text-sm text-white ${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {user.isBlocked ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ================= USER DETAILS MODAL ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-4 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedUser.username}
            </h2>

            <div className="space-y-2 text-sm">
              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Phone:</b> {selectedUser.phone || "-"}</p>
              <p><b>Role:</b> {selectedUser.role}</p>
              <p><b>Blocked:</b> {selectedUser.isBlocked ? "Yes" : "No"}</p>
              <p className="text-gray-500">
                Joined:{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
