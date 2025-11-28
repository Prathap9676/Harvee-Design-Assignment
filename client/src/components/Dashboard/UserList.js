import React from 'react';
import './UserList.css';

const UserList = ({ users, onView, onEdit, onDelete, onSort, sortBy, sortOrder }) => {
  const getSortIcon = (field) => {
    if (sortBy !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="user-list-container">
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => onSort('name')} className="sortable">
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => onSort('email')} className="sortable">
              Email {getSortIcon('email')}
            </th>
            <th>Phone</th>
            <th onClick={() => onSort('state')} className="sortable">
              State {getSortIcon('state')}
            </th>
            <th onClick={() => onSort('city')} className="sortable">
              City {getSortIcon('city')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    {user.profile_image ? (
                      <img
                        src={`http://localhost:5000${user.profile_image}`}
                        alt={user.name}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.state}</td>
                <td>{user.city}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onView(user)}
                      className="btn btn-sm btn-primary"
                      title="View"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="btn btn-sm btn-success"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user._id)}
                      className="btn btn-sm btn-danger"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;

