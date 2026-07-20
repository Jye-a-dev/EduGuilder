"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuthContext, type User } from "@/components/providers/AuthProvider";
import { useStudentGrades, type StudentGrade } from "@/hooks/useStudentGrades";
import { useStudentVerifications } from "@/hooks/useStudentVerifications";
import { useUniversities } from "@/hooks/useUniversities";
import { apiClient } from "@/libs/apiClient";

// Import split subcomponents
import ProfileIdentityCard from "./ProfileIdentityCard";
import StudentVerificationCard from "./StudentVerificationCard";
import AccountSettingsForm from "./AccountSettingsForm";
import StudentGradesTable from "./StudentGradesTable";
import UniversityInfoPanel from "./UniversityInfoPanel";
import EmailChangeModal from "./EmailChangeModal";
import GradeCrudModal from "./GradeCrudModal";

export default function ProfilePage() {
  const { user, token, login } = useAuthContext();

  const {
    universities,
    fetchUniversities,
    singleUniversity,
    fetchUniversityById,
    updateUniversity,
    isLoading: isUniLoading
  } = useUniversities(token);
  const { grades, fetchGrades, createGrade, updateGrade, deleteGrade } = useStudentGrades(token);
  const { verification, fetchVerification, createVerification } = useStudentVerifications(token);

  // Account settings
  const [fullName, setFullName] = useState(() => user?.full_name || "");
  const [password, setPassword] = useState("");
  const [currentGrade, setCurrentGrade] = useState<number | "">(() => user?.current_grade ?? "");
  const [selectedUniId, setSelectedUniId] = useState(() => user?.university_id ?? "");
  const [accountFeedback, setAccountFeedback] = useState<string | null>(null);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Email change modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Student verification
  const [verifyCardKey, setVerifyCardKey] = useState("");
  const [verifyFeedback, setVerifyFeedback] = useState<string | null>(null);
  const [isRequestingVerify, setIsRequestingVerify] = useState(false);

  // Grade modal
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<StudentGrade | null>(null);
  const [gradeSemester, setGradeSemester] = useState("Học kỳ 1.1");
  const [gradeSubject, setGradeSubject] = useState("");
  const [gradeScore, setGradeScore] = useState<number | "">("");
  const [gradeFeedback, setGradeFeedback] = useState<string | null>(null);
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      setFullName(user.full_name);
      setCurrentGrade(user.current_grade ?? "");
      setSelectedUniId(user.university_id ?? "");
      setNewEmail(user.email);
    }, 0);

    fetchUniversities();

    if (user.role === "student") {
      fetchGrades(user.id);
      fetchVerification(user.id);
    } else if (user.role === "uni" && user.university_id) {
      fetchUniversityById(user.university_id);
    }

    return () => clearTimeout(timer);
  }, [user, token, fetchUniversities, fetchGrades, fetchVerification, fetchUniversityById]);

  if (!user || !token) return null;

  const handleAccountUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsUpdatingAccount(true);
    setAccountFeedback(null);
    try {
      const payload: Record<string, string | number | null> = {
        full_name: fullName,
      };
      if (password) payload.password = password;
      if (user.role === "student") {
        payload.current_grade = currentGrade ? Number(currentGrade) : null;
        payload.university_id = selectedUniId || null;
      }
      const updatedUser = await apiClient.patch<User>(`/users/${user.id}`, payload, { token });
      login(token, updatedUser);
      setPassword("");
      setAccountFeedback("Cập nhật thành công! ✨");
      setTimeout(() => setAccountFeedback(null), 3000);
    } catch (err: unknown) {
      setAccountFeedback(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleEmailUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsUpdatingEmail(true);
    setEmailFeedback(null);
    try {
      const updatedUser = await apiClient.patch<User>(`/users/${user.id}`, { email: newEmail }, { token });
      login(token, updatedUser);
      setIsEmailModalOpen(false);
      setEmailFeedback(null);
    } catch (err: unknown) {
      setEmailFeedback(err instanceof Error ? err.message : "Không thể đổi email.");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!verifyCardKey.trim()) return;
    setIsRequestingVerify(true);
    setVerifyFeedback(null);
    try {
      await createVerification(user.id, verifyCardKey);
      setVerifyCardKey("");
      setVerifyFeedback("Gửi yêu cầu xác thực thành công! Đang chờ admin duyệt. 📑");
      fetchVerification(user.id);
      setTimeout(() => setVerifyFeedback(null), 3000);
    } catch (err: unknown) {
      setVerifyFeedback(err instanceof Error ? err.message : "Lỗi gửi yêu cầu xác thực.");
    } finally {
      setIsRequestingVerify(false);
    }
  };

  const openAddGradeModal = () => {
    setEditingGrade(null);
    setGradeSemester("Học kỳ 1.1");
    setGradeSubject("");
    setGradeScore("");
    setGradeFeedback(null);
    setIsGradeModalOpen(true);
  };

  const openEditGradeModal = (g: StudentGrade) => {
    setEditingGrade(g);
    setGradeSemester(g.semester);
    setGradeSubject(g.subject_name);
    setGradeScore(g.score);
    setGradeFeedback(null);
    setIsGradeModalOpen(true);
  };

  const handleGradeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (gradeScore === "" || !gradeSubject.trim()) return;
    setIsSubmittingGrade(true);
    setGradeFeedback(null);
    try {
      const scoreNum = Number(gradeScore);
      if (scoreNum < 0 || scoreNum > 10) throw new Error("Điểm phải nằm trong khoảng 0 – 10.");
      if (editingGrade) {
        await updateGrade(editingGrade.id, { semester: gradeSemester, subject_name: gradeSubject, score: scoreNum });
      } else {
        await createGrade(user.id, { semester: gradeSemester, subject_name: gradeSubject, score: scoreNum });
      }
      setIsGradeModalOpen(false);
    } catch (err: unknown) {
      setGradeFeedback(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  const handleDeleteGrade = async (id: string) => {
    if (!window.confirm("Xóa điểm môn học này?")) return;
    try {
      await deleteGrade(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi xóa điểm.");
    }
  };

  const handleInlineUpdate = async (payload: { full_name?: string; password?: string }) => {
    try {
      const updatedUser = await apiClient.patch<User>(`/users/${user.id}`, payload, { token });
      login(token, updatedUser);
      return updatedUser;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : "Cập nhật thất bại.");
    }
  };

  const gpa = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(2)
    : "Chưa có dữ liệu";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 relative">
      <div>
        <h1 className="text-3xl font-black text-text-main tracking-tight font-sans uppercase">Hồ Sơ Cá Nhân 👤</h1>
        <p className="text-xs text-text-sub font-light mt-1">
          {user.role === "uni"
            ? "Thông tin tài khoản và trường đại học liên kết."
            : "Cập nhật hồ sơ cá nhân và cấu hình thông tin tài khoản."}
        </p>
      </div>

      {user.role === "uni" ? (
        <div className="max-w-md mx-auto">
          <ProfileIdentityCard
            user={user}
            gpa={gpa}
            onOpenEmailModal={() => {
              setNewEmail(user.email);
              setIsEmailModalOpen(true);
            }}
            university={singleUniversity}
            onUpdateUser={handleInlineUpdate}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-1">
            <ProfileIdentityCard
              user={user}
              gpa={gpa}
              onOpenEmailModal={() => {
                setNewEmail(user.email);
                setIsEmailModalOpen(true);
              }}
            />

            {user.role === "student" && (
              <StudentVerificationCard
                verification={verification}
                verifyCardKey={verifyCardKey}
                setVerifyCardKey={setVerifyCardKey}
                verifyFeedback={verifyFeedback}
                isRequestingVerify={isRequestingVerify}
                onSubmit={handleVerificationSubmit}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:col-span-2">
            <AccountSettingsForm
              user={user}
              fullName={fullName}
              setFullName={setFullName}
              password={password}
              setPassword={setPassword}
              currentGrade={currentGrade}
              setCurrentGrade={setCurrentGrade}
              selectedUniId={selectedUniId}
              setSelectedUniId={setSelectedUniId}
              universities={universities}
              accountFeedback={accountFeedback}
              isUpdatingAccount={isUpdatingAccount}
              onSubmit={handleAccountUpdate}
            />

            {user.role === "student" && (
              <StudentGradesTable
                grades={grades}
                openAddGradeModal={openAddGradeModal}
                openEditGradeModal={openEditGradeModal}
                handleDeleteGrade={handleDeleteGrade}
              />
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <EmailChangeModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        emailFeedback={emailFeedback}
        isUpdatingEmail={isUpdatingEmail}
        onSubmit={handleEmailUpdate}
      />

      <GradeCrudModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        editingGrade={editingGrade}
        gradeSemester={gradeSemester}
        setGradeSemester={setGradeSemester}
        gradeSubject={gradeSubject}
        setGradeSubject={setGradeSubject}
        gradeScore={gradeScore}
        setGradeScore={setGradeScore}
        gradeFeedback={gradeFeedback}
        isSubmittingGrade={isSubmittingGrade}
        onSubmit={handleGradeSubmit}
      />
    </div>
  );
}
