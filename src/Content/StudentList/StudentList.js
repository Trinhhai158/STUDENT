import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import styles from './StudentList.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      const sortedStudents = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setStudents(sortedStudents);
      setFilteredStudents(sortedStudents); // Set filtered students initially
      setLoading(false);
    } catch (error) {
      console.error('There was an error fetching the student data!', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDeletePermanent = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student permanently?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
      setFilteredStudents((prevStudents) => prevStudents.filter((student) => student._id !== id)); // Update filtered list
    } catch (error) {
      console.error('There was an error deleting the student permanently!', error);
    }
  };

  const handleEditClick = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/students/${currentStudent._id}`, currentStudent);
      setStudents((prevStudents) =>
        prevStudents.map((student) => (student._id === currentStudent._id ? currentStudent : student)),
      );
      setFilteredStudents((prevStudents) =>
        prevStudents.map((student) => (student._id === currentStudent._id ? currentStudent : student)),
      ); // Update filtered list
      setIsEditing(false);
      setCurrentStudent(null);
    } catch (error) {
      console.error('There was an error updating the student!', error);
    }
  };

  const handleExportPDF = (student) => {
    const doc = new jsPDF();
    doc.text('Student Information', 10, 10);
    doc.text(`Name: ${student.name}`, 10, 20);
    doc.text(`Age: ${student.age}`, 10, 30);
    doc.text(`Address: ${student.address}`, 10, 40);
    doc.text(`Grade: ${student.grade}`, 10, 50);
    doc.text(`Created At: ${new Date(student.createdAt).toLocaleString()}`, 10, 60);
    doc.save(`${student.name}.pdf`);
  };

  // Function to handle search query change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = students.filter((student) => student.name.includes(query));
    setFilteredStudents(filtered);
  };

  return (
    <div className={cx('student-list')}>
      <h2>Student List</h2>

      {/* Tìm kiếm */}
      <input
        type="text"
        className={cx('search-input')}
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by student name"
      />

      <div
        className={cx('student-list-container', {
          'student-list-container-not': filteredStudents.length === 0,
        })}
      >
        {loading ? (
          <div className={cx('loading-spinner')}>Loading...</div>
        ) : filteredStudents.length === 0 ? (
          <div className={cx('empty-list')}>No students found.</div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student._id} className={cx('student-card')}>
              <div className={cx('student-info')}>
                <div className={cx('student-avatar')}>
                  <img
                    className={cx('avatar')}
                    src={student.avatar || 'https://example.com/default-avatar.jpg'}
                    alt={student.name}
                  />
                </div>
                <p>
                  <span>Name:</span> {student.name}
                </p>
                <p>
                  <span>Age:</span> {student.age}
                </p>
                <p>
                  <span>Address:</span> {student.address}
                </p>
                <p>
                  <span>Grade:</span> {student.grade}
                </p>
                <p>
                  <span>Created At:</span> {new Date(student.createdAt).toLocaleString()}
                </p>
              </div>
              <div className={cx('student-actions')}>
                <button onClick={() => handleEditClick(student)} className={cx('edit-btn')}>
                  Edit
                </button>
                <button className={cx('delete-btn')} onClick={() => handleDeletePermanent(student._id)}>
                  Delete Permanently
                </button>
                <button className={cx('export-pdf-btn')} onClick={() => handleExportPDF(student)}>
                  Export to PDF
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isEditing && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h3>Edit Student</h3>

            <label>
              Avatar URL:
              <input
                type="text"
                value={currentStudent.avatar}
                onChange={(e) => setCurrentStudent({ ...currentStudent, avatar: e.target.value })}
                placeholder="Enter Avatar URL"
              />
            </label>

            {currentStudent.avatar && (
              <div className={cx('image-preview')}>
                <img src={currentStudent.avatar} alt="Avatar Preview" className={cx('avatar-preview')} />
              </div>
            )}

            <label>
              Name:
              <input
                type="text"
                value={currentStudent.name}
                onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
              />
            </label>
            <label>
              Age:
              <input
                type="number"
                value={currentStudent.age}
                onChange={(e) => setCurrentStudent({ ...currentStudent, age: e.target.value })}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={currentStudent.address}
                onChange={(e) => setCurrentStudent({ ...currentStudent, address: e.target.value })}
              />
            </label>
            <label>
              Grade:
              <input
                type="text"
                value={currentStudent.grade}
                onChange={(e) => setCurrentStudent({ ...currentStudent, grade: e.target.value })}
              />
            </label>

            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
