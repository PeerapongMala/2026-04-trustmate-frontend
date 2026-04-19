import { TmButton, TmInput, TmModal } from "@/shared/components";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  newPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onSubmit: () => void;
  error: string;
  success: string;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  currentPassword,
  newPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onSubmit,
  error,
  success,
}: ChangePasswordModalProps) {
  return (
    <TmModal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-tm-navy">เปลี่ยนรหัสผ่าน</h2>
      <div className="flex flex-col gap-4">
        <TmInput
          label="รหัสผ่านปัจจุบัน"
          type="password"
          value={currentPassword}
          onChange={(e) => onCurrentPasswordChange(e.target.value)}
        />
        <TmInput
          label="รหัสผ่านใหม่"
          type="password"
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          placeholder="อย่างน้อย 6 ตัวอักษร"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <TmButton onClick={onSubmit}>บันทึก</TmButton>
      </div>
    </TmModal>
  );
}

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  return (
    <TmModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            className="h-8 w-8"
          >
            <path
              d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-tm-navy">ลบบัญชีผู้ใช้</h2>
        <p className="text-center text-sm text-tm-gray">
          คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>
        <div className="flex gap-3">
          <TmButton variant="outline" size="sm" onClick={onClose}>
            ยกเลิก
          </TmButton>
          <button
            onClick={onConfirm}
            className="rounded-full bg-red-500 px-6 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            ลบบัญชี
          </button>
        </div>
      </div>
    </TmModal>
  );
}
