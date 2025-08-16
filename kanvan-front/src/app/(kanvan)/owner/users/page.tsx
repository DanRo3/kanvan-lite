"use client";

import { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";

import {
  getAllDevelopers,
  deleteUser,
  createUser,
} from "@/api/user/service/user.service";

import CreateDeveloperModal from "@/components/modals/CreateDeveloperModal";
import UpdateDeveloperModal from "@/components/modals/UpdateDeveloperModal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Lógica para manejar la edición
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Lógica para manejar el borrado
  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres borrar este usuario?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((u) => u.id !== userId));
        console.log(`Usuario con ID ${userId} eliminado.`);
      } catch (error) {
        console.error("Error al borrar el usuario:", error);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllDevelopers();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main
      className="p-10 bg-[#181818] min-h-screen font-sans text-[#e0e0e0] relative"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <div
        className={`${
          isEditModalOpen || isAddModalOpen
            ? "filter blur-sm brightness-90 pointer-events-none select-none"
            : ""
        }`}
      >
        <h1 className="m-0 font-bold text-2xl mb-8">Usuarios</h1>
        <button
          type="button"
          className="
            absolute top-5 right-5
            px-5 py-2.5
            rounded-xl border border-white/20
            bg-white/10 backdrop-blur-md
            text-[#e0e0e0] font-semibold
            cursor-pointer
            shadow-[0_8px_32px_rgba(31,38,135,0.37)]
            transition-colors transition-shadow duration-300 ease-in-out
            select-none
            hover:bg-white/20 hover:shadow-[0_10px_40px_rgba(31,38,135,0.6)] hover:text-[#fafafa]
          "
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus className="inline-block mr-2" /> Nuevo Desarrollador
        </button>
        <div
          className="
            mt-0 mx-auto max-w-[1360px]
            p-6 bg-white/10 rounded-xl
            backdrop-filter backdrop-blur-lg
            shadow-[0_8px_32px_rgba(31,38,135,0.37)]
            border border-white/20
          "
        >
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-2 text-white">Usuario</th>
                <th className="px-4 py-2 text-white">Email</th>
                <th className="px-4 py-2 text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700/50 last:border-b-0"
                >
                  <td className="px-4 py-2 text-gray-300">{user.name}</td>
                  <td className="px-4 py-2 text-gray-300">{user.email}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      title="Borrar"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Los modales se renderizan aquí, fuera del contenedor principal con el efecto. */}
      {isEditModalOpen && selectedUser && (
        <UpdateDeveloperModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onUserUpdated={fetchUsers}
        />
      )}
      {isAddModalOpen && (
        <CreateDeveloperModal
          onClose={() => setIsAddModalOpen(false)}
          onUserCreated={fetchUsers}
        />
      )}
    </main>
  );
}
