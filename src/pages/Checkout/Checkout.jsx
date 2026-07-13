import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Checkout.module.css';

export const Checkout = () => {
  const { cartItems, cartTotal, checkoutCart } = useLibrary();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    address: '',
    city: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  // ცარიელი კალათით checkout-ზე შესვლა არ შეიძლება
  if (cartItems.length === 0 && !isComplete) {
    return <Navigate to="/library" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ბარათის ნომრის ავტომატური ფორმატირება 4-4-4-4
  const handleCardNumberChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  // ვადის ავტომატური ფორმატირება MM/YY
  const handleExpiryChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted =
      digitsOnly.length > 2 ? `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}` : digitsOnly;
    setFormData((prev) => ({ ...prev, expiry: formatted }));
    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const cardDigits = formData.cardNumber.replace(/\s/g, '');

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'სახელის შეყვანა აუცილებელია!';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'მისამართის შეყვანა აუცილებელია!';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'ქალაქის შეყვანა აუცილებელია!';
    }

    if (!cardDigits) {
      newErrors.cardNumber = 'ბარათის ნომრის შეყვანა აუცილებელია!';
    } else if (!/^\d{16}$/.test(cardDigits)) {
      newErrors.cardNumber = 'ბარათის ნომერი უნდა შედგებოდეს 16 ციფრისგან!';
    }

    if (!formData.expiry) {
      newErrors.expiry = 'ვადის შეყვანა აუცილებელია!';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'ფორმატი უნდა იყოს MM/YY!';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV კოდის შეყვანა აუცილებელია!';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV უნდა შედგებოდეს 3-4 ციფრისგან!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    checkoutCart();
    setOrderNumber(`CG-${Date.now().toString().slice(-8)}`);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>შეკვეთა წარმატებით შესრულდა!</h2>
          <p className={styles.orderNumber}>შეკვეთის ნომერი: {orderNumber}</p>
          <p className={styles.successText}>
            თამაშები დამატებულია შენს ბიბლიოთეკაში და ხელმისაწვდომია ნებისმიერ დროს.
          </p>
          <button className={styles.primaryBtn} onClick={() => navigate('/library')}>
            გადასვლა ბიბლიოთეკაში
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Checkout</h1>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.sectionTitle}>Billing details</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Full name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? styles.errorInput : ''}
              placeholder="Giorgi Beridze"
            />
            {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? styles.errorInput : ''}
              placeholder="Rustaveli Ave 12"
            />
            {errors.address && <span className={styles.errorText}>{errors.address}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? styles.errorInput : ''}
              placeholder="Tbilisi"
            />
            {errors.city && <span className={styles.errorText}>{errors.city}</span>}
          </div>

          <h2 className={styles.sectionTitle}>Payment</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="cardNumber">Card number</label>
            <input
              type="text"
              inputMode="numeric"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              className={errors.cardNumber ? styles.errorInput : ''}
              placeholder="4242 4242 4242 4242"
            />
            {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="expiry">Expiry (MM/YY)</label>
              <input
                type="text"
                inputMode="numeric"
                id="expiry"
                name="expiry"
                value={formData.expiry}
                onChange={handleExpiryChange}
                className={errors.expiry ? styles.errorInput : ''}
                placeholder="09/28"
              />
              {errors.expiry && <span className={styles.errorText}>{errors.expiry}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                inputMode="numeric"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className={errors.cvv ? styles.errorInput : ''}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            გადახდა · ${cartTotal.toFixed(2)}
          </button>
        </form>

        <aside className={styles.summary}>
          <h2 className={styles.sectionTitle}>Order summary</h2>
          <div className={styles.summaryList}>
            {cartItems.map((item) => (
              <div key={item.dealID} className={styles.summaryItem}>
                <img src={item.thumb} alt={item.title} className={styles.summaryImage} />
                <span className={styles.summaryTitle}>{item.title}</span>
                <span className={styles.summaryPrice}>${item.salePrice}</span>
              </div>
            ))}
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};