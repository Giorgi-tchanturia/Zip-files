import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import styles from './Auth.module.css';

export const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [isLogin, setIsLogin] = useState(true); 
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });


  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };


  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (!formData.email.trim()) {
      newErrors.email = 'ელ-ფოსტის შეყვანა აუცილებელია!';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'გთხოვთ, შეიყვანოთ სწორი ელ-ფოსტის ფორმატი!';
    }

    if (!formData.password) {
      newErrors.password = 'პაროლის შეყვანა აუცილებელია!';
    } else if (formData.password.length < 6) {
      newErrors.password = 'პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან!';
    }

    if (!isLogin && !formData.username.trim()) {
      newErrors.username = 'მომხმარებლის სახელის შეყვანა აუცილებელია!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const userData = {
        email: formData.email,
        username: isLogin ? formData.email.split('@')[0] : formData.username,
        token: 'mock-jwt-token-12345'
      };

      login(userData); 
      
      navigate('/');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          
          {/* Username */}
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? styles.errorInput : ''}
                placeholder="Enter username"
              />
              {errors.username && <span className={styles.errorText}>{errors.username}</span>}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
              placeholder="example@mail.com"
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.errorInput : ''}
              placeholder="******"
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? 'Log In' : 'Register'}
          </button>
        </form>

        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button" 
            className={styles.toggleBtn}
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};