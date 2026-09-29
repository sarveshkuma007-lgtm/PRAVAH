import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  X,
  CheckCircle2,
} from "lucide-react";
import { USER_ROLES } from "../utils/constants";

export function ManageUsers() {
  const [usersList, setUsersList] = useState([
    {
      id: "u-1",
      name: "Dr. Rajeshwar Sharma",
      email: "r.sharma@cwc.gov.in",
      role: USER_ROLES.ADMIN,
      organization: "Central Water Commission, New Delhi",
      status: "ACTIVE",
    },
    {
      id: "u-2",
      name: "Smt. Ananya Senapati, IAS",
      email: "collector-sambalpur@odisha.gov.in",
      role: USER_ROLES.GOVT_OFFICIAL,
      organization: "District Administration Sambalpur",
      status: "ACTIVE",
    },
    {
      id: "u-3",
      name: "Commandant Vikram Rathore",
      email: "vikram.ndrf3@gov.in",
      role: USER_ROLES.DISASTER_OFFICER,
      organization: "NDRF 3rd Battalion, Cuttack",
      status: "ACTIVE",
    },
    {
      id: "u-4",
      name: "Aarav Mishra",
      email: "aarav.citizen@gmail.com",
      role: USER_ROLES.PUBLIC_USER,
      organization: "Resident of Sambalpur Ward 4",
      status: "ACTIVE",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState(USER_ROLES.DISASTER_OFFICER);
  const [newOrg, setNewOrg] = useState("");

  const handleAddUser = (e) => {
    e.preventDefault();

    if (!newName.trim() || !newEmail.trim()) return;

    setUsersList((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        name: newName,
        email: newEmail,
        role: newRole,
        organization: newOrg || "Disaster Response Wing",
        status: "ACTIVE",
      },
    ]);

    setNewName("");
    setNewEmail("");
    setNewRole(USER_ROLES.DISASTER_OFFICER);
    setNewOrg("");
    setShowAddModal(false);
  };

  const activeUsers = usersList.filter(
    (user) => user.status === "ACTIVE"
  ).length;

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                User & Access Management
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage personnel accounts and role-based access across
                disaster-response teams.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Provision Account
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Total Users
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {usersList.length}
          </p>
        </div>

        <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Active Accounts
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {activeUsers}
          </p>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Government Roles
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {
              usersList.filter(
                (user) =>
                  user.role !== USER_ROLES.PUBLIC_USER
              ).length
            }
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Public Users
          </p>
          <p className="text-2xl font-bold text-slate-700 mt-1">
            {
              usersList.filter(
                (user) =>
                  user.role === USER_ROLES.PUBLIC_USER
              ).length
            }
          </p>
        </div>
      </div>

      {/* Users table */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />

            <div>
              <h2 className="font-semibold text-slate-900">
                Personnel Directory
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Registered users and their current access roles.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                  User
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Role
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Organization
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Email
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {usersList.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {user.organization}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {user.email}
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 border border-green-100 text-green-700 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Permission matrix */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Role Permission Matrix
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                System capabilities available to each user category.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  System Capability
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Admin
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Govt Official
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Disaster Officer
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Public User
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {[
                [
                  "View Live Telemetry & Maps",
                  "Granted",
                  "Granted",
                  "Granted",
                  "Granted",
                ],
                [
                  "Broadcast Emergency Bulletins",
                  "Granted",
                  "Granted",
                  "Granted",
                  "Restricted",
                ],
                [
                  "Sluice Gate Aperture Override",
                  "Granted",
                  "Granted",
                  "Restricted",
                  "Restricted",
                ],
                [
                  "Delft3D AI Breach Simulation",
                  "Granted",
                  "Granted",
                  "Granted",
                  "Read-Only",
                ],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {row[0]}
                  </td>

                  {row.slice(1).map((value, index) => (
                    <td key={index} className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          value === "Restricted"
                            ? "text-red-600"
                            : value === "Read-Only"
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {value !== "Restricted" && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}

                        {value}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add user modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">

          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl">

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900">
                  Provision Official Account
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Create a new PRAVAH user account.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleAddUser}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Official full name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Official Email
                </label>

                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="official@example.gov.in"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Role
                </label>

                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {Object.values(USER_ROLES).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Agency / Department
                </label>

                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="Agency or department"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  <UserPlus className="w-4 h-4" />
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;