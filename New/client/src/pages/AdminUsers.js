import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const user = localStorage.getItem('user');
      const response = await axios.get('/api/admin/users', {
        headers: {
          'Authorization': user
        }
      });
      setUsers(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const user = localStorage.getItem('user');
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: {
            'Authorization': user
          }
        });
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const user = localStorage.getItem('user');
      await axios.put(`/api/admin/users/${editingUser.id}`, editingUser, {
        headers: {
          'Authorization': user
        }
      });
      setShowEditModal(false);
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to update user');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Manage Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button 
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveEdit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        username: e.target.value
                      })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-control"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        role: e.target.value
                      })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditModal && <div className="modal-backdrop show"></div>}
    </div>
  );
}

export default AdminUsers; 