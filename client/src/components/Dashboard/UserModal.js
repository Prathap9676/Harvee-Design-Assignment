import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './UserModal.css';

const UserModal = ({ user, mode, onClose, onUpdate, onSwitchToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    profile_image: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        state: user.state || '',
        city: user.city || '',
        country: user.country || '',
        pincode: user.pincode || '',
        profile_image: null
      });
      if (user.profile_image) {
        setImagePreview(`http://localhost:5000${user.profile_image}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile_image') {
      const file = files[0];
      if (file) {
        if (!file.type.match('image/jpeg|image/jpg|image/png')) {
          setErrors(prev => ({
            ...prev,
            profile_image: 'Only JPEG, JPG, and PNG images are allowed'
          }));
          return;
        }

        if (file.size > 2 * 1024 * 1024) {
          setErrors(prev => ({
            ...prev,
            profile_image: 'Image size must be less than 2MB'
          }));
          return;
        }

        setFormData(prev => ({
          ...prev,
          profile_image: file
        }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        if (errors.profile_image) {
          setErrors(prev => ({
            ...prev,
            profile_image: ''
          }));
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only alphabets';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10-15 digits';
    }

    if (formData.address && formData.address.length > 150) {
      newErrors.address = 'Address must not exceed 150 characters';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{4,10}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 4-10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('pincode', formData.pincode);

      if (formData.profile_image) {
        formDataToSend.append('profile_image', formData.profile_image);
      }

      const response = await api.put(`/users/${user._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('User updated successfully');
        onUpdate();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);

      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.param || err.path] = err.msg || err.message;
        });
        setErrors(prev => ({ ...prev, ...apiErrors }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'view' ? 'User Details' : 'Edit User'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {mode === 'view' ? (
          <div className="user-details">
            {user.profile_image && (
              <div className="user-image-container">
                <img
                  src={`http://localhost:5000${user.profile_image}`}
                  alt={user.name}
                  className="user-image-large"
                />
              </div>
            )}
            <div className="detail-row">
              <strong>Name:</strong> <span>{user.name}</span>
            </div>
            <div className="detail-row">
              <strong>Email:</strong> <span>{user.email}</span>
            </div>
            <div className="detail-row">
              <strong>Phone:</strong> <span>{user.phone}</span>
            </div>
            <div className="detail-row">
              <strong>Address:</strong> <span>{user.address || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <strong>State:</strong> <span>{user.state}</span>
            </div>
            <div className="detail-row">
              <strong>City:</strong> <span>{user.city}</span>
            </div>
            <div className="detail-row">
              <strong>Country:</strong> <span>{user.country}</span>
            </div>
            <div className="detail-row">
              <strong>Pincode:</strong> <span>{user.pincode}</span>
            </div>
            <div className="detail-row">
              <strong>Role:</strong> <span>{user.role}</span>
            </div>
            <div className="detail-row">
              <strong>Created:</strong> <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="modal-actions">
              <button onClick={() => onSwitchToEdit && onSwitchToEdit(user)} className="btn btn-primary">
                Edit User
              </button>
              <button onClick={onClose} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? 'error' : ''}`}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <input
                type="file"
                name="profile_image"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleChange}
                className={`form-control ${errors.profile_image ? 'error' : ''}`}
              />
              {errors.profile_image && <span className="error-message">{errors.profile_image}</span>}
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '5px' }} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-control ${errors.address ? 'error' : ''}`}
                rows="3"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`form-control ${errors.state ? 'error' : ''}`}
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`form-control ${errors.city ? 'error' : ''}`}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`form-control ${errors.country ? 'error' : ''}`}
                />
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`form-control ${errors.pincode ? 'error' : ''}`}
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update User'}
              </button>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserModal;

