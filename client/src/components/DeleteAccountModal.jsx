// import React, { useState } from 'react';
// import { deleteUserAccount } from '../api/userApi';

// const DeleteAccountModal = ({ isOpen, onClose, userEmail, onAccountDeleted }) => {
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [confirmText, setConfirmText] = useState('');
//   const [error, setError] = useState('');

//   const handleDeleteAccount = async () => {
//     if (confirmText !== 'DELETE') {
//       setError('Please type "DELETE" to confirm');
//       return;
//     }

//     setIsDeleting(true);
//     setError('');

//     try {
//       await deleteUserAccount(userEmail);
      
//       // Clear all local storage
//       localStorage.clear();
      
//       // Call the callback to handle post-deletion logic
//       onAccountDeleted();
      
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//    if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border">
//         <div className="px-6 py-4 border-b">
//           <h3 className="text-lg font-semibold text-red-600">Delete Account</h3>
//         </div>
        
//         <div className="px-6 py-4">
//           <div className="mb-4">
//             <p className="text-gray-700 mb-2">
//               This action cannot be undone. This will permanently delete your account and all associated data.
//             </p>
//             <p className="text-sm text-gray-600">
//               Type <strong>DELETE</strong> to confirm:
//             </p>
//           </div>
          
//           <input
//             type="text"
//             value={confirmText}
//             onChange={(e) => setConfirmText(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//             placeholder="Type DELETE here"
//             disabled={isDeleting}
//           />
          
//           {error && (
//             <p className="text-red-600 text-sm mt-2">{error}</p>
//           )}
//         </div>
        
//         <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             disabled={isDeleting}
//             className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleDeleteAccount}
//             disabled={isDeleting || confirmText !== 'DELETE'}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isDeleting ? 'Deleting...' : 'Delete Account'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeleteAccountModal;

import React, { useState } from 'react';
import { deleteUserAccount } from '../api/userApi';

const DeleteAccountModal = ({ isOpen, onClose, userEmail, onAccountDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deleteUserAccount(userEmail);
      
      // Clear all local storage
      localStorage.clear();
      
      // Call the callback to handle post-deletion logic
      onAccountDeleted();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
        </div>
        
        <div className="px-6 py-4">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              This action cannot be undone. This will permanently delete your account and all associated data.
            </p>
            <p className="text-sm text-gray-600">
              Type <strong>DELETE</strong> to confirm:
            </p>
          </div>
          
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type DELETE here"
            disabled={isDeleting}
          />
          
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting || confirmText !== 'DELETE'}
            className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;