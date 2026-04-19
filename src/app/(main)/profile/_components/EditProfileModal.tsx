import { TmAvatar, TmButton, TmInput, TmModal } from "@/shared/components";
import { AVATAR_COLORS } from "../_constants";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  alias: string;
  bio: string;
  avatarColor: string;
  onAliasChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onAvatarColorChange: (value: string) => void;
  onSave: () => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  alias,
  bio,
  avatarColor,
  onAliasChange,
  onBioChange,
  onAvatarColorChange,
  onSave,
}: EditProfileModalProps) {
  return (
    <TmModal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-tm-navy">แก้ไขข้อมูลผู้ใช้</h2>
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-tm-navy">สีโปรไฟล์</p>
          <div className="flex items-center gap-3">
            <TmAvatar size="lg" color={avatarColor} />
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onAvatarColorChange(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform ${
                    avatarColor === c
                      ? "border-tm-navy scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <TmInput
          label="นามแฝง"
          value={alias}
          onChange={(e) => onAliasChange(e.target.value)}
        />
        <TmInput
          label="คำอธิบาย"
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="บอกเล่าเกี่ยวกับตัวคุณ..."
        />
        <TmButton onClick={onSave}>บันทึก</TmButton>
      </div>
    </TmModal>
  );
}
