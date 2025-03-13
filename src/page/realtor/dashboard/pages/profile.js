import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa"; // Import edit icon

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("editProfile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fetch user data from localStorage
  const storedRealtorData = localStorage.getItem("realtorData");
  const parsedData = JSON.parse(storedRealtorData);
  const username = parsedData?.username; // Ensure this key matches what’s stored in localStorage

  useEffect(() => {
    if (parsedData) {
      setUser(parsedData);
      setPreviewUrl(parsedData.profileImage || "");
    } else {
      setUser({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        accountName: "",
        accountNumber: "",
        bank: "",
        address: "",
        country: "",
        state: "",
      });
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false); // Reset edit mode when switching tabs
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "giweexpv");

    try {
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dwpoik1jm/image/upload",
        formData
      );

      const imageUrl = cloudinaryResponse.data.secure_url;

      // Update user profile image in the database
      const response = await axios.put(
        "https://newportal-backend.onrender.com/realtor/update-profile-image/",
        {
          userId: user._id,
          image: imageUrl,
        }
      );

      // Update user state and localStorage
      const updatedUser = { ...user, profileImage: imageUrl };
      setUser(updatedUser);
      localStorage.setItem("realtorData", JSON.stringify(updatedUser));

      toast.success("Profile image updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error updating profile image");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `https://newportal-backend.onrender.com/realtor/edit-profile`,
        {
          userId: user._id,
          ...user,
        }
      );

      // Update user state and localStorage
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem("realtorData", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
      setIsEditing(false); // Disable edit mode after saving
    } catch (error) {
      console.log(error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate password
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `https://newportal-backend.onrender.com/realtor/change-password`,
        {
          userId: user._id,
          newPassword: newPassword,
        }
      );

      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (error) {
      console.log(error);
      toast.error("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pb-32">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-10 p-6">
        <div className="flex justify-around border-b mb-6">
          <button
            className={`py-2 px-4 ${
              activeTab === "editProfile" ? "border-b-2 border-green-600 font-bold" : ""
            }`}
            onClick={() => handleTabChange("editProfile")}
          >
            Edit Profile
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "updateProfilePic" ? "border-b-2 border-green-600 font-bold" : ""
            }`}
            onClick={() => handleTabChange("updateProfilePic")}
          >
            Update Profile Pic
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "changePassword" ? "border-b-2 border-green-600 font-bold" : ""
            }`}
            onClick={() => handleTabChange("changePassword")}
          >
            Change Password
          </button>
        </div>

        {activeTab === "editProfile" && (
          <form className="space-y-4" onSubmit={handleEditProfile}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Profile Details</h2>
              <button
                type="button"
                className="text-green-600 hover:text-green-700"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FaEdit size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-left">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                    isEditing ? "focus:ring-green-300" : "bg-gray-200"
                  }`}
                  value={user?.firstName || ""}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-700 text-left">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                    isEditing ? "focus:ring-green-300" : "bg-gray-200"
                  }`}
                  value={user?.lastName || ""}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-left">Phone Number</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                  isEditing ? "focus:ring-green-300" : "bg-gray-200"
                }`}
                value={user?.phone || ""}
                disabled // Disable editing for phone number
              />
            </div>
            <div>
              <label className="block text-gray-700 text-left">Email</label>
              <input
                type="email"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                  isEditing ? "focus:ring-green-300" : "bg-gray-200"
                }`}
                value={user?.email || ""}
                disabled // Disable editing for email
              />
            </div>
            <div>
              <label className="block text-gray-700 text-left">Account Name</label>
              <input
                type="text"
                name="accountName"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                  isEditing ? "focus:ring-green-300" : "bg-gray-200"
                }`}
                value={user?.accountName || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-left">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                    isEditing ? "focus:ring-green-300" : "bg-gray-200"
                  }`}
                  value={user?.accountNumber || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-left">Bank Name</label>
                <input
                  type="text"
                  name="bank"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                    isEditing ? "focus:ring-green-300" : "bg-gray-200"
                  }`}
                  value={user?.bank || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-left">Address</label>
              <input
                type="text"
                name="address"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                  isEditing ? "focus:ring-green-300" : "bg-gray-200"
                }`}
                value={user?.address || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-left">Country</label>
                <input
                  type="text"
                  name="country"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                    isEditing ? "focus:ring-green-300" : "bg-gray-200"
                  }`}
                  value={user?.country || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-left">State</label>
                <input
                  type="text"
                  name="state"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                    isEditing ? "focus:ring-green-300" : "bg-gray-200"
                  }`}
                  value={user?.state || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {isEditing && (
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            )}
          </form>
        )}

        {activeTab === "updateProfilePic" && (
          <div className="space-y-4">
              {previewUrl && (
              <div className="mt-4 flex justify-center">
                <img src={previewUrl} alt="Profile Preview" className="w-32 h-32 rounded-full" />
              </div>
            )}
            <div>
              <label className="block text-gray-700">Upload Profile Picture</label>
              <input
                type="file"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                onChange={handleImageChange}
              />
            </div>
          
            <button
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              onClick={handleImageUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Update Profile Picture"}
            </button>
          </div>
        )}

        {activeTab === "changePassword" && (
          <form className="space-y-4" onSubmit={handleChangePassword}>
            <div>
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProfilePage;