"use client";

import { useState, useEffect, type FormEvent } from "react";

// Layout
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";
import { useDashboard } from "@/components/layouts/(dashboard)/DashboardContext";

// Custom API Hooks
import { useAccounts } from "@/hooks/useAccounts";
import { useUniversities } from "@/hooks/useUniversities";

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

  const { universities, fetchUniversities } = useUniversities(token);

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

  // --- CONFIRMATION/ALERT MODAL state ---
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    title: string;
    message: string;
    actionType: "soft-delete" | "hard-delete" | "restore" | "alert";
    targetId?: string;
  } | null>(null);

  // Fetch accounts once token is available from context
  useEffect(() => {
    fetchAccounts();
    fetchUniversities();
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
        university_id: (editRole === "uni" || editRole === "student") && editUniversityId ? editUniversityId : null,
        current_grade: editRole === "student" && editCurrentGrade ? parseInt(editCurrentGrade, 10) : null,
      });
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const openConfirmModal = (
    title: string,
    message: string,
    actionType: "soft-delete" | "hard-delete" | "restore",
    targetId: string
  ) => {
    setConfirmModalConfig({ title, message, actionType, targetId });
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setConfirmModalConfig(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmModalConfig?.targetId) return;
    const { actionType, targetId } = confirmModalConfig;
    try {
      if (actionType === "soft-delete") {
        await softDeleteAccount(targetId);
      } else if (actionType === "hard-delete") {
        await hardDeleteAccount(targetId);
      } else if (actionType === "restore") {
        await restoreAccount(targetId);
      }
      closeConfirmModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể thực hiện hành động.";
      setConfirmModalConfig({
        title: "Lỗi Hệ Thống",
        message: msg,
        actionType: "alert",
      });
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
        handleSoftDeleteAccount={(id) =>
          openConfirmModal(
            "Vô Hiệu Hóa Tài Khoản",
            "Bạn có chắc chắn muốn vô hiệu hóa (soft delete) tài khoản này không? Người dùng sẽ không thể đăng nhập cho đến khi được khôi phục.",
            "soft-delete",
            id
          )
        }
        handleHardDeleteAccount={(id) =>
          openConfirmModal(
            "Xóa Vĩnh Viễn Tài Khoản",
            "CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này? Hành động này không thể hoàn tác và sẽ xóa sạch dữ liệu liên quan.",
            "hard-delete",
            id
          )
        }
        handleRestoreAccount={(id) =>
          openConfirmModal(
            "Khôi Phục Tài Khoản",
            "Bạn có muốn khôi phục tài khoản này hoạt động bình thường không?",
            "restore",
            id
          )
        }
        setActiveModal={(modal) => setActiveModal(modal)}
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
        universities={universities}
      />

      {/* Reusable Confirmation Modal Overlay */}
      {confirmModalOpen && confirmModalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="glow-border w-full max-w-sm rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative">
            <h3 className="text-sm font-bold text-white mb-2 uppercase font-mono tracking-wider">
              {confirmModalConfig.title}
            </h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
              {confirmModalConfig.message}
            </p>
            <div className="flex justify-end gap-2.5">
              {confirmModalConfig.actionType === "alert" ? (
                <button
                  type="button"
                  onClick={closeConfirmModal}
                  className="px-4 py-2 rounded-lg bg-cyber-primary text-xs font-bold text-white"
                >
                  Đóng
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={closeConfirmModal}
                    className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAction}
                    className={`px-4 py-2 rounded-lg text-xs font-bold text-white ${
                      confirmModalConfig.actionType === "hard-delete"
                        ? "bg-cyber-alert hover:opacity-90"
                        : "bg-cyber-primary hover:opacity-90"
                    }`}
                  >
                    Đồng ý
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
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
