"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

// Layout
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";

// Custom API Hooks
import { useUniversities } from "@/hooks/useUniversities";

// Sub-components
import UniversitiesTab from "./UniversitiesTab";
import CreateUniversityModal from "./Modals/CreateUniversityModal";
import EditUniversityModal from "./Modals/EditUniversityModal";

// Types
import type { University, ModalType } from "../types";

export default function UniversitiesPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Active Modals & Selected Edit Target
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  // Bind Hook
  const {
    universities,
    fetchUniversities,
    createUniversity,
    updateUniversity,
    toggleUniversityVerification,
    deleteUniversity,
  } = useUniversities(token);

  // --- FORM STATES ---
  const [newUniCode, setNewUniCode] = useState("");
  const [newUniName, setNewUniName] = useState("");
  const [newUniTuition, setNewUniTuition] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUniCode, setEditUniCode] = useState("");
  const [editUniName, setEditUniName] = useState("");
  const [editUniTuition, setEditUniTuition] = useState("");
  const [editUniVerified, setEditUniVerified] = useState(false);

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
      fetchUniversities();
    }
  }, [token, fetchUniversities]);

  const closeModal = () => {
    setActiveModal(null);
    setModalFeedback(null);
    setEditingId(null);
  };

  const handleCreateUniversitySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalFeedback(null);
    try {
      await createUniversity(newUniCode, newUniName, newUniTuition);
      setNewUniCode("");
      setNewUniName("");
      setNewUniTuition("");
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const openEditUniversity = (u: University) => {
    setEditingId(u.id);
    setEditUniCode(u.code);
    setEditUniName(u.name);
    setEditUniTuition(u.tuition_fees || "");
    setEditUniVerified(u.is_verified);
    setActiveModal("edit-university");
  };

  const handleEditUniversitySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setModalFeedback(null);
    try {
      await updateUniversity(editingId, {
        code: editUniCode,
        name: editUniName,
        tuition_fees: editUniTuition || null,
        is_verified: editUniVerified,
      });
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const handleToggleUniversityVerification = async (id: string, currentStatus: boolean) => {
    try {
      await toggleUniversityVerification(id, currentStatus);
    } catch {
      window.alert("Không thể cập nhật xác thực.");
    }
  };

  const handleDeleteUniversity = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa trường đại học này?")) return;
    try {
      await deleteUniversity(id);
    } catch {
      window.alert("Không thể xóa trường đại học.");
    }
  };

  return (
    <DashboardSetup>
      <UniversitiesTab
        universities={universities}
        handleToggleUniversityVerification={handleToggleUniversityVerification}
        openEditUniversity={openEditUniversity}
        handleDeleteUniversity={handleDeleteUniversity}
        setActiveModal={(modal: "create-university" | null) => setActiveModal(modal)}
      />

      <CreateUniversityModal
        isOpen={activeModal === "create-university"}
        closeModal={closeModal}
        modalFeedback={modalFeedback}
        newUniCode={newUniCode}
        setNewUniCode={setNewUniCode}
        newUniName={newUniName}
        setNewUniName={setNewUniName}
        newUniTuition={newUniTuition}
        setNewUniTuition={setNewUniTuition}
        onSubmit={handleCreateUniversitySubmit}
      />

      <EditUniversityModal
        isOpen={activeModal === "edit-university"}
        closeModal={closeModal}
        modalFeedback={modalFeedback}
        editUniCode={editUniCode}
        setEditUniCode={setEditUniCode}
        editUniName={editUniName}
        setEditUniName={setEditUniName}
        editUniTuition={editUniTuition}
        setEditUniTuition={setEditUniTuition}
        editUniVerified={editUniVerified}
        setEditUniVerified={setEditUniVerified}
        onSubmit={handleEditUniversitySubmit}
      />
    </DashboardSetup>
  );
}
