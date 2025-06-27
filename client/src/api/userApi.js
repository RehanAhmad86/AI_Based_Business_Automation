const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const deleteUserAccount = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication token if required
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete account');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

export { deleteUserAccount };