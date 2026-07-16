"use client";

import { useState, useEffect, type FormEvent } from "react";

// Layout
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";
import { useDashboard } from "@/components/layouts/(dashboard)/DashboardContext";

// Custom API Hooks
import { useAccounts } from "@/hooks/useAccounts";

// Sub-components
import AccountsTab from "./AccountsTab";
import CreateAccountModal from "./Modals/CreateAccountModal";
import EditAccountModal from "./Modals/EditAccountModal";

// Types
import type { Account, ModalType, UserRole } from "../types";

/** Inner component: has access to DashboardContext (token guaranteed). */
function AccountsInner() {
  const { token } = useDashboard();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  const {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    softDeleteAccount,
    hardDeleteAccount,
    restoreAccount,
  } = useAccounts(token);

  // --- CREATE form state ---
  const [newEmail, setNewEmail] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("student");

  // --- EDIT form state ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("student");
  const [editEcoPoints, setEditEcoPoints] = useState(0);
  const [editUniversityId, setEditUniversityId] = useState("");
  const [editCurrentGrade, setEditCurrentGrade] = useState("");

  // Fetch accounts once token is available from context
  useEffect(() => {
    fetchAccounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const closeModal = () => {
    setActiveModal(null);
    setModalFeedback(null);
    setEditingId(null);
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalFeedback(null);
    try {
      await createAccount(newEmail, newFullName, newPassword, newRole);
      setNewEmail("");
      setNewFullName("");
      setNewPassword("");
      setNewRole("student");
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const openEditAccount = (a: Account) => {
    setEditingId(a.id);
    setEditFullName(a.full_name);
    setEditRole(a.role);
    setEditEcoPoints(a.eco_points);
    setEditUniversityId(a.university_id || "");
    setEditCurrentGrade(a.current_grade?.toString() || "");
    setActiveModal("edit-account");
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setModalFeedback(null);
    try {
      await updateAccount(editingId, {
        full_name: editFullName,
        role: editRole,
        eco_points: editEcoPoints,
        university_id: editRole === "uni" ? editUniversityId || null : null,
        current_grade:
          editRole === "student" && editCurrentGrade
            ? Number(editCurrentGrade)
            : null,
      });
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const handleSoftDeleteAccount = async (id: string) => {
    if (!window.confirm("Vô hiệu hóa tài khoản này? (Soft delete, có thể khôi phục)")) return;
    try {
      await softDeleteAccount(id);
    } catch {
      window.alert("Không thể vô hiệu hóa tài khoản.");
    }
  };

  const handleHardDeleteAccount = async (id: string) => {
    if (!window.confirm("XÓA VĨNH VIỄN tài khoản này? Hành động không thể hoàn tác!")) return;
    try {
      await hardDeleteAccount(id);
    } catch {
      window.alert("Không thể xóa tài khoản.");
    }
  };

  const handleRestoreAccount = async (id: string) => {
    try {
      await restoreAccount(id);
    } catch {
      window.alert("Không thể khôi phục tài khoản.");
    }
  };

  return (
    <>
      <AccountsTab
        accounts={accounts}
        isLoading={isLoading}
        error={error}
        onRetry={fetchAccounts}
        openEditAccount={openEditAccount}
        handleSoftDeleteAccount={handleSoftDeleteAccount}
        handleHardDeleteAccount={handleHardDeleteAccount}
        handleRestoreAccount={handleRestoreAccount}
        setActiveModal={(modal: "create-account" | null) => setActiveModal(modal)}
      />

      <CreateAccountModal
        isOpen={activeModal === "create-account"}
        closeModal={closeModal}
        modalFeedback={modalFeedback}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        newFullName={newFullName}
        setNewFullName={setNewFullName}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        newRole={newRole}
        setNewRole={setNewRole}
        onSubmit={handleCreateSubmit}
      />

      <EditAccountModal
        isOpen={activeModal === "edit-account"}
        closeModal={closeModal}
        modalFeedback={modalFeedback}
        editFullName={editFullName}
        setEditFullName={setEditFullName}
        editRole={editRole}
        setEditRole={setEditRole}
        editEcoPoints={editEcoPoints}
        setEditEcoPoints={setEditEcoPoints}
        editUniversityId={editUniversityId}
        setEditUniversityId={setEditUniversityId}
        editCurrentGrade={editCurrentGrade}
        setEditCurrentGrade={setEditCurrentGrade}
        onSubmit={handleEditSubmit}
      />
    </>
  );
}

export default function AccountsPage() {
  return (
    <DashboardSetup>
      <AccountsInner />
    </DashboardSetup>
  );
}
