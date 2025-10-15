import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { USER_ROLES } from '../utils/roleUtils';

const RoleManager = () => {
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const updateUserRole = async (role) => {
    if (!user) return;

    setIsUpdating(true);
    setMessage('');

    try {
      // Update user metadata with the selected role
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          role: role,
        },
      });
      
      setMessage(`Role updated to ${role} successfully!`);
      setSelectedRole('');
      
      // Optionally reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error updating user role:', error);
      setMessage('Error updating role. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentRole = user?.publicMetadata?.role;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Role Management
      </h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Current Role:</p>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          currentRole === USER_ROLES.ADMIN ? 'bg-red-100 text-red-800' :
          currentRole === USER_ROLES.TUTOR ? 'bg-blue-100 text-blue-800' :
          currentRole === USER_ROLES.STUDENT ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {currentRole || 'Not Set'}
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select New Role:
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isUpdating}
        >
          <option value="">Choose a role...</option>
          <option value={USER_ROLES.STUDENT}>Student</option>
          <option value={USER_ROLES.TUTOR}>Tutor</option>
          <option value={USER_ROLES.ADMIN}>Admin</option>
        </select>
      </div>

      <button
        onClick={() => updateUserRole(selectedRole)}
        disabled={!selectedRole || isUpdating}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          !selectedRole || isUpdating
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isUpdating ? 'Updating...' : 'Update Role'}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500">
        <p><strong>Note:</strong> This component is for development/testing. In production, role assignment should be handled through admin controls or during registration.</p>
      </div>
    </div>
  );
};

export default RoleManager;