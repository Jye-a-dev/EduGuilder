"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

// Layout
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";

// Custom API Hooks
import { useStudentVerifications } from "@/hooks/useStudentVerifications";

// Sub-components
import VerificationsTab from "./VerificationsTab";
import CreateVerificationModal from "./Modals/CreateVerificationModal";
import EditVerificationModal from "./Modals/EditVerificationModal";

// Types
import type { StudentVerification, ModalType, VerifyStatus } from "../types";

export default function VerificationsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Active Modals & Selected Edit Target
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  // Bind Hook
  const {
    verifications,
    fetchVerifications,
    createVerification,
    updateVerification,
    approveVerification,
    rejectVerification,
    deleteVerification,
  } = useStudentVerifications(token);

  // --- FORM STATES ---
  const [newVerStudentId, setNewVerStudentId] = useState("");
  const [newVerCardImageKey, setNewVerCardImageKey] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVerStudentId, setEditVerStudentId] = useState("");
  const [editVerCardImageKey, setEditVerCardImageKey] = useState("");
  const [editVerStatus, setEditVerStatus] = useState<VerifyStatus>("pending");
  const [editVerRejectReason, setEditVerRejectReason] = useState("");

  // Authenticate user on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      router.push("/");
      return;
    }
    setTimeout(() => {
      setToken(storedToken);
    }, 0);
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchVerifications();
    }
  }, [token, fetchVerifications]);

  const closeModal = () => {
    setActiveModal(null);
    setModalFeedback(null);
    setEditingId(null);
  };

  const handleCreateVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalFeedback(null);
    try {
      await createVerification(newVerStudentId, newVerCardImageKey);
      setNewVerStudentId("");
      setNewVerCardImageKey("");
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const openEditVerification = (v: StudentVerification) => {
    setEditingId(v.id);
    setEditVerStudentId(v.student_id);
    setEditVerCardImageKey(v.card_image_key);
    setEditVerStatus(v.status);
    setEditVerRejectReason(v.reject_reason || "");
    setActiveModal("edit-verification");
  };

  const handleEditVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setModalFeedback(null);
    try {
      await updateVerification(editingId, {
        student_id: editVerStudentId,
        card_image_key: editVerCardImageKey,
        status: editVerStatus,
        reject_reason: editVerStatus === "rejected" ? editVerRejectReason : null,
      });
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const handleApproveVerification = async (id: string) => {
    try {
      await approveVerification(id);
    } catch {
      window.alert("Không thể duyệt yêu cầu.");
    }
  };

  const handleRejectVerification = async (id: string) => {
    const reason = window.prompt("Nhập lý do từ chối:");
    if (reason === null) return;
    try {
      await rejectVerification(id, reason);
    } catch {
      window.alert("Không thể từ chối yêu cầu.");
    }
  };

  const handleDeleteVerification = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa yêu cầu xác thực này?")) return;
    try {
      await deleteVerification(id);
    } catch {
      window.alert("Không thể xóa yêu cầu.");
    }
  };

  return (
    <DashboardSetup>
      <VerificationsTab
        verifications={verifications}
        handleApproveVerification={handleApproveVerification}
        handleRejectVerification={handleRejectVerification}
        openEditVerification={openEditVerification}
        handleDeleteVerification={handleDeleteVerification}
        setActiveModal={(modal: "create-verification" | null) => setActiveModal(modal)}
      />

      <CreateVerificationModal
        isOpen={activeModal === "create-verification"}
        closeModal={closeModal}
        modalFeedback={modalFeedback}
        newVerStudentId={newVerStudentId}
        setNewVerStudentId={setNewVerStudentId}
        newVerCardImageKey={newVerCardImageKey}
        setNewVerCardImageKey={setNewVerCardImageKey}
        onSubmit={handleCreateVerificationSubmit}
      />

      <EditVerificationModal
        isOpen={activeModal === "edit-verification"}
        closeModal={closeModal}
        modalFeedback={modalFeedback}
        editVerStudentId={editVerStudentId}
        setEditVerStudentId={setEditVerStudentId}
        editVerCardImageKey={editVerCardImageKey}
        setEditVerCardImageKey={setEditVerCardImageKey}
        editVerStatus={editVerStatus}
        setEditVerStatus={setEditVerStatus}
        editVerRejectReason={editVerRejectReason}
        setEditVerRejectReason={setEditVerRejectReason}
        onSubmit={handleEditVerificationSubmit}
      />
    </DashboardSetup>
  );
}
