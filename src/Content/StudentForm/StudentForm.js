import React, { useState } from 'react';
import axios from 'axios';
import styles from './StudentForm.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function StudentForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [grade, setGrade] = useState('');
  const [avatar, setAvatar] = useState(''); // Lưu URL ảnh
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      // Gửi thông tin lên backend (bao gồm URL ảnh)
      const response = await axios.post('http://localhost:5000/api/students', {
        name,
        age,
        address,
        grade,
        avatar, // Gửi URL của avatar
      });
      console.log('Student added:', response.data);
      // Reset form
      setName('');
      setAge('');
      setAddress('');
      setGrade('');
      setAvatar(''); // Reset avatar
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cx('student-form')} onSubmit={handleSubmit}>
      <h2>Student Information</h2>

      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student's name"
          required
        />
      </div>

      <div className="form-group">
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter student's age"
          required
        />
      </div>

      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter student's address"
          required
        />
      </div>

      <div className="form-group">
        <label>Grade:</label>
        <input
          type="number"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Enter student's grade"
          required
        />
      </div>

      <div className="form-group">
        <label>Avatar URL:</label>
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)} // Nhận URL từ input
          placeholder="Enter avatar image URL"
        />
      </div>

      <a href="/">
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </a>
    </form>
  );
}

export default StudentForm;
