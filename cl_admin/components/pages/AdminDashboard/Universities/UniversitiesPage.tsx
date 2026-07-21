"use client";

import { useState, useEffect, type FormEvent } from "react";

// Layout
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";
import { useDashboard } from "@/components/layouts/(dashboard)/DashboardContext";

// Custom API Hooks
import { useUniversities } from "@/hooks/useUniversities";

// Sub-components
import UniversitiesTab from "./UniversitiesTab";
import CreateUniversityModal from "./Modals/CreateUniversityModal";
import EditUniversityModal from "./Modals/EditUniversityModal";

// Types
import type { University, ModalType } from "../types";

function UniversitiesInner() {
  const { token } = useDashboard();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  const {
    universities,
    isLoading,
    error,
    fetchUniversities,
    createUniversity,
    updateUniversity,
    toggleUniversityVerification,
    deleteUniversity,
  } = useUniversities(token);

  const [newUniCode, setNewUniCode] = useState("");
  const [newUniName, setNewUniName] = useState("");
  const [newUniRegion, setNewUniRegion] = useState("");
  const [newUniTuition, setNewUniTuition] = useState("");
  const [newUniWebsiteUrl, setNewUniWebsiteUrl] = useState("");
  const [newUniType, setNewUniType] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUniCode, setEditUniCode] = useState("");
  const [editUniName, setEditUniName] = useState("");
  const [editUniRegion, setEditUniRegion] = useState("");
  const [editUniTuition, setEditUniTuition] = useState("");
  const [editUniWebsiteUrl, setEditUniWebsiteUrl] = useState("");
  const [editUniType, setEditUniType] = useState("");
  const [editUniVerified, setEditUniVerified] = useState(false);

  useEffect(() => {
    fetchUniversities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const closeModal = () => {
    setActiveModal(null);
    setModalFeedback(null);
    setEditingId(null);
  };

  const handleCreateUniversitySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalFeedback(null);
    try {
      await createUniversity(
        newUniCode,
        newUniName,
        newUniTuition,
        newUniRegion || null,
        newUniWebsiteUrl || null,
        newUniType || null
      );
      setNewUniCode("");
      setNewUniName("");
      setNewUniRegion("");
      setNewUniTuition("");
      setNewUniWebsiteUrl("");
      setNewUniType("");
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const openEditUniversity = (u: University) => {
    setEditingId(u.id);
    setEditUniCode(u.code);
    setEditUniName(u.name);
    setEditUniRegion(u.region || "");
    setEditUniTuition(u.tuition_fees || "");
    setEditUniWebsiteUrl(u.website_url || "");
    setEditUniType(u.type || "");
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
        region: editUniRegion || null,
        tuition_fees: editUniTuition || null,
        website_url: editUniWebsiteUrl || null,
        type: editUniType || null,
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
    <>
      <UniversitiesTab
        universities={universities}
        isLoading={isLoading}
        error={error}
        onRetry={fetchUniversities}
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
        newUniRegion={newUniRegion}
        setNewUniRegion={setNewUniRegion}
        newUniTuition={newUniTuition}
        setNewUniTuition={setNewUniTuition}
        newUniWebsiteUrl={newUniWebsiteUrl}
        setNewUniWebsiteUrl={setNewUniWebsiteUrl}
        newUniType={newUniType}
        setNewUniType={setNewUniType}
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
        editUniRegion={editUniRegion}
        setEditUniRegion={setEditUniRegion}
        editUniTuition={editUniTuition}
        setEditUniTuition={setEditUniTuition}
        editUniWebsiteUrl={editUniWebsiteUrl}
        setEditUniWebsiteUrl={setEditUniWebsiteUrl}
        editUniType={editUniType}
        setEditUniType={setEditUniType}
        editUniVerified={editUniVerified}
        setEditUniVerified={setEditUniVerified}
        onSubmit={handleEditUniversitySubmit}
      />
    </>
  );
}

export default function UniversitiesPage() {
  return (
    <DashboardSetup>
      <UniversitiesInner />
    </DashboardSetup>
  );
}
