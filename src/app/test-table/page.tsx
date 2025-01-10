import React from "react";

const Table = () => {
  const users = [
    {
      id: 1,
      name: "Jese Leos",
      role: "Administrator",
      status: "Active",
      social: ["facebook", "twitter", "github", "google"],
      promote: true,
      rating: 4.7,
      lastLogin: "20 Nov 2022",
    },
    {
      id: 2,
      name: "Bonnie Green",
      role: "Viewer",
      status: "Active",
      social: ["facebook", "twitter", "github"],
      promote: false,
      rating: 3.9,
      lastLogin: "23 Nov 2022",
    },
    {
      id: 3,
      name: "Leslie Livingston",
      role: "Moderator",
      status: "Inactive",
      social: ["facebook", "github", "google"],
      promote: false,
      rating: 4.8,
      lastLogin: "19 Nov 2022",
    },
    {
      id: 4,
      name: "Micheal Gough",
      role: "Moderator",
      status: "Active",
      social: ["facebook", "twitter"],
      promote: true,
      rating: 5.0,
      lastLogin: "27 Nov 2022",
    },
    {
      id: 5,
      name: "Karen Nelson",
      role: "Viewer",
      status: "Inactive",
      social: ["facebook", "github"],
      promote: false,
      rating: 4.1,
      lastLogin: "18 Nov 2022",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border border-gray-200 bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">
                User
              </th>
              <th scope="col" className="px-4 py-3">
                User Role
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Social Profile
              </th>
              <th scope="col" className="px-4 py-3">
                Promote
              </th>
              <th scope="col" className="px-4 py-3">
                Rating
              </th>
              <th scope="col" className="px-4 py-3">
                Last Login
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                {/* User */}
                <td className="flex items-center px-4 py-4">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-200"></div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </td>

                {/* User Role */}
                <td className="px-4 py-4">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      user.role === "Administrator"
                        ? "bg-blue-100 text-blue-800"
                        : user.role === "Moderator"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                {/* Social Profile */}
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    {user?.social.map((platform, index) => (
                      <span
                        key={index}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600"
                      >
                        {platform ? platform[0].toUpperCase() : ""}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Promote */}
                <td className="px-4 py-4">
                  <label className="inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={user.promote}
                      className="form-checkbox h-4 w-4 rounded border-gray-300 text-blue-600"
                      readOnly
                    />
                  </label>
                </td>

                {/* Rating */}
                <td className="px-4 py-4">
                  <span
                    className={`font-bold ${
                      user.rating >= 4.5
                        ? "text-green-600"
                        : user.rating >= 4
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {user.rating}
                  </span>
                </td>

                {/* Last Login */}
                <td className="px-4 py-4">{user.lastLogin}</td>

                {/* Actions */}
                <td className="px-4 py-4 text-right">
                  <button className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button className="ml-4 text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
