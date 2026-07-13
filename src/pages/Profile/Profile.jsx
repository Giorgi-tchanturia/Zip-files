import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import styles from './Profile.module.css';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

export const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { ownedItems, cartItems, clearLibrary } = useLibrary();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState(user?.username || '');
  const [nameError, setNameError] = useState('');
  const [avatarError, setAvatarError] = useState('');

  const initial = (user?.username || user?.email || '?').charAt(0).toUpperCase();

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError('');

    if (!file.type.startsWith('image/')) {
      setAvatarError('ატვირთეთ მხოლოდ სურათის ფაილი!');
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError('სურათი არ უნდა აღემატებოდეს 2MB-ს!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    updateProfile({ avatar: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveName = () => {
    const trimmed = usernameDraft.trim();
    if (!trimmed) {
      setNameError('მომხმარებლის სახელი არ შეიძლება იყოს ცარიელი!');
      return;
    }
    updateProfile({ username: trimmed });
    setIsEditingName(false);
    setNameError('');
  };

  const handleCancelName = () => {
    setUsernameDraft(user?.username || '');
    setIsEditingName(false);
    setNameError('');
  };

  const handleLogout = () => {
    logout();
    clearLibrary();
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.avatarSection}>
          <button
            type="button"
            className={styles.avatarButton}
            onClick={handleAvatarClick}
            aria-label="შეცვალე პროფილის ფოტო"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className={styles.avatarImage} />
            ) : (
              <span className={styles.avatarInitial}>{initial}</span>
            )}
            <span className={styles.avatarOverlay}>შეცვლა</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={handleAvatarChange}
          />
          {avatarError && <span className={styles.errorText}>{avatarError}</span>}
          {user?.avatar && (
            <button type="button" className={styles.linkBtn} onClick={handleRemoveAvatar}>
              ფოტოს წაშლა
            </button>
          )}
        </div>

        <div className={styles.info}>
          {isEditingName ? (
            <div className={styles.nameEdit}>
              <input
                type="text"
                value={usernameDraft}
                onChange={(e) => setUsernameDraft(e.target.value)}
                className={nameError ? styles.errorInput : styles.nameInput}
                autoFocus
              />
              <div className={styles.nameEditActions}>
                <button type="button" className={styles.saveBtn} onClick={handleSaveName}>
                  შენახვა
                </button>
                <button type="button" className={styles.cancelBtn} onClick={handleCancelName}>
                  გაუქმება
                </button>
              </div>
              {nameError && <span className={styles.errorText}>{nameError}</span>}
            </div>
          ) : (
            <div className={styles.nameRow}>
              <h1 className={styles.username}>{user?.username}</h1>
              <button
                type="button"
                className={styles.editBtn}
                onClick={() => setIsEditingName(true)}
              >
                ✎ რედაქტირება
              </button>
            </div>
          )}

          <p className={styles.email}>{user?.email}</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{ownedItems.length}</span>
            <span className={styles.statLabel}>შეძენილი თამაში</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{cartItems.length}</span>
            <span className={styles.statLabel}>კალათაში</span>
          </div>
        </div>

        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          გამოსვლა
        </button>
      </div>
    </div>
  );
};
