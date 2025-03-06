import React, { useState } from 'react';

const ProfilePage: React.FC = () => {
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    lastName: '',
    userName: '',
    password: '',
    email: '',
    address: '',
    maritalStatus: '',
  });

  // Handle input and select changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileInfo({
      ...profileInfo,
      [name]: value,
    });
  };

  // Handle textarea changes
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileInfo({
      ...profileInfo,
      [name]: value,
    });
  };

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>
      <form>
        <label htmlFor="name">First Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={profileInfo.name}
          onChange={handleInputChange}
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={profileInfo.lastName}
          onChange={handleInputChange}
        />

        <label htmlFor="userName">Username:</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={profileInfo.userName}
          onChange={handleInputChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={profileInfo.password}
          onChange={handleInputChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={profileInfo.email}
          onChange={handleInputChange}
        />

        <label htmlFor="address">Address:</label>
        <textarea
          id="address"
          name="address"
          value={profileInfo.address}
          onChange={handleTextAreaChange}
        />

        <label htmlFor="maritalStatus">Marital Status:</label>
        <select
          id="maritalStatus"
          name="maritalStatus"
          value={profileInfo.maritalStatus}
          onChange={handleInputChange}
        >
          <option value="">Select Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
        </select>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
