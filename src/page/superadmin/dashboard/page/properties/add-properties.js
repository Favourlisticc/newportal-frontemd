import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Home,
  Image,
  FileText,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Loader2,
  Type,
  ClipboardList,
  CalendarCheck,
  Percent,
  BadgePercent,
} from "lucide-react";

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    featuredImage: null,
    galleryImages: [],
    subscriptionForm: null,
    propertyName: "",
    amount: "",
    state: "",
    city: "",
    propertyType: "",
    propertyStatus: "",
    bedrooms: "",
    bathrooms: "",
    landSize: "",
    description: "",
    commission: "",
    indirectcommission: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.featuredImage) newErrors.featuredImage = "Featured image is required";
    if (formData.galleryImages.length === 0) newErrors.galleryImages = "At least one gallery image is required";
    if (!formData.subscriptionForm) newErrors.subscriptionForm = "Subscription form is required";
    if (!formData.propertyName.trim()) newErrors.propertyName = "Property name is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Valid amount is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.propertyType.trim()) newErrors.propertyType = "Property type is required";
    if (!formData.propertyStatus) newErrors.propertyStatus = "Property status is required";
    if (!formData.bedrooms || formData.bedrooms <= 0) newErrors.bedrooms = "Valid bedroom count is required";
    if (!formData.bathrooms || formData.bathrooms <= 0) newErrors.bathrooms = "Valid bathroom count is required";
    if (!formData.landSize || formData.landSize <= 0) newErrors.landSize = "Valid land size is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.commission || formData.commission <= 0) newErrors.commission = "Valid commission is required";
    if (!formData.indirectcommission.trim()) newErrors.indirectcommission = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "giweexpv");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dwpoik1jm/image/upload",
      formData
    );
    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Upload files to Cloudinary
      const [featuredImageUrl, subscriptionFormUrl] = await Promise.all([
        uploadToCloudinary(formData.featuredImage),
        uploadToCloudinary(formData.subscriptionForm),
      ]);

      const galleryUrls = await Promise.all(
        [...formData.galleryImages].map((file) => uploadToCloudinary(file))
      );

      // Submit property data
      await axios.post("https://newportal-backend.onrender.com/admin/properties", {
        ...formData,
        featuredImage: featuredImageUrl,
        galleryImages: galleryUrls,
        subscriptionForm: subscriptionFormUrl,
        amount: Number(formData.amount),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        landSize: Number(formData.landSize),
      });

      toast.success("Property added successfully!");
      // Reset form
      setFormData({
        featuredImage: null,
        galleryImages: [],
        subscriptionForm: null,
        propertyName: "",
        amount: "",
        state: "",
        city: "",
        propertyType: "",
        propertyStatus: "",
        bedrooms: "",
        bathrooms: "",
        landSize: "",
        description: "",
        commission: "",
        indirectcommission: "",
      });
      setErrors({});
    } catch (error) {
      toast.error("Error adding property: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setErrors({ ...errors, [name]: null });

    if (name === "galleryImages") {
      setFormData({ ...formData, [name]: [...files] });
    } else {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: null });
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-sm:p-3">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 max-sm:p-3">
        <h2 className="text-3xl font-bold text-[#002657] mb-8 flex items-center gap-2">
          <Home className="w-8 h-8" />
          Add New Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Uploads Section */}
          <div className="space-y-4 border-b pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Featured Image
                </label>
                <input
                  type="file"
                  name="featuredImage"
                  onChange={handleFileChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#002657] file:text-white hover:file:bg-[#001a3d]"
                />
                {errors.featuredImage && <p className="text-red-500 text-sm mt-1">{errors.featuredImage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Gallery Images
                </label>
                <input
                  type="file"
                  name="galleryImages"
                  multiple
                  onChange={handleFileChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#002657] file:text-white hover:file:bg-[#001a3d]"
                />
                {errors.galleryImages && <p className="text-red-500 text-sm mt-1">{errors.galleryImages}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Property Brochure
                </label>
                <input
                  type="file"
                  name="subscriptionForm"
                  onChange={handleFileChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#002657] file:text-white hover:file:bg-[#001a3d]"
                />
                {errors.subscriptionForm && <p className="text-red-500 text-sm mt-1">{errors.subscriptionForm}</p>}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Property Name
              </label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              />
              {errors.propertyName && <p className="text-red-500 text-sm mt-1">{errors.propertyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Amount (₦)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              >
                <option value="">Select Property Type</option>
                <option value="Land Property">Land Property</option>
                <option value="Home Property">Home Property</option>
              </select>
              {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Property Status
              </label>
              <select
                name="propertyStatus"
                value={formData.propertyStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              >
                <option value="">Select Status</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
              {errors.propertyStatus && <p className="text-red-500 text-sm mt-1">{errors.propertyStatus}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <Bed className="w-5 h-5" />
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              />
              {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <Bath className="w-5 h-5" />
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              />
              {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <Percent className="w-5 h-5" />
                Commission
              </label>
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              />
              {errors.commission && <p className="text-red-500 text-sm mt-1">{errors.commission}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <BadgePercent className="w-5 h-5" />
                Indirect Commission
              </label>
              <input
                type="number"
                name="indirectcommission"
                value={formData.indirectcommission}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              />
              {errors.indirectcommission && <p className="text-red-500 text-sm mt-1">{errors.indirectcommission}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                Land Size (sqm)
              </label>
              <input
                type="number"
                name="landSize"
                value={formData.landSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] focus:border-[#E5B30F]"
              />
              {errors.landSize && <p className="text-red-500 text-sm mt-1">{errors.landSize}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#002657] mb-2 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E5B30F] h-32"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#002657] text-white py-3 rounded-lg font-semibold hover:bg-[#001a3d] transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Adding Property...
              </>
            ) : (
              'Add Property'
            )}
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
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

export default AddPropertyForm;