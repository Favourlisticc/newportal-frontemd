import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { Building2, Upload, Briefcase, MapPin, Gift, Heart, Image, Calendar, User, Mail, Phone, Lock, CreditCard, Eye, EyeOff, HandCoins, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from "react-router-dom";
import logo from "../../../public/Baay Realty logo (2).png";


const countryCodes = [
  { code: '+93', name: 'Afghanistan' },
  { code: '+355', name: 'Albania' },
  { code: '+213', name: 'Algeria' },
  { code: '+376', name: 'Andorra' },
  { code: '+244', name: 'Angola' },
  { code: '+1-268', name: 'Antigua and Barbuda' },
  { code: '+54', name: 'Argentina' },
  { code: '+374', name: 'Armenia' },
  { code: '+297', name: 'Aruba' },
  { code: '+61', name: 'Australia' },
  { code: '+43', name: 'Austria' },
  { code: '+994', name: 'Azerbaijan' },
  { code: '+1-242', name: 'Bahamas' },
  { code: '+973', name: 'Bahrain' },
  { code: '+880', name: 'Bangladesh' },
  { code: '+1-246', name: 'Barbados' },
  { code: '+375', name: 'Belarus' },
  { code: '+32', name: 'Belgium' },
  { code: '+501', name: 'Belize' },
  { code: '+229', name: 'Benin' },
  { code: '+1-441', name: 'Bermuda' },
  { code: '+975', name: 'Bhutan' },
  { code: '+591', name: 'Bolivia' },
  { code: '+387', name: 'Bosnia and Herzegovina' },
  { code: '+267', name: 'Botswana' },
  { code: '+55', name: 'Brazil' },
  { code: '+246', name: 'British Indian Ocean Territory' },
  { code: '+1-284', name: 'British Virgin Islands' },
  { code: '+673', name: 'Brunei' },
  { code: '+359', name: 'Bulgaria' },
  { code: '+226', name: 'Burkina Faso' },
  { code: '+257', name: 'Burundi' },
  { code: '+855', name: 'Cambodia' },
  { code: '+237', name: 'Cameroon' },
  { code: '+1', name: 'Canada' },
  { code: '+238', name: 'Cape Verde' },
  { code: '+1-345', name: 'Cayman Islands' },
  { code: '+236', name: 'Central African Republic' },
  { code: '+235', name: 'Chad' },
  { code: '+56', name: 'Chile' },
  { code: '+86', name: 'China' },
  { code: '+61', name: 'Christmas Island' },
  { code: '+61', name: 'Cocos Islands' },
  { code: '+57', name: 'Colombia' },
  { code: '+269', name: 'Comoros' },
  { code: '+682', name: 'Cook Islands' },
  { code: '+506', name: 'Costa Rica' },
  { code: '+385', name: 'Croatia' },
  { code: '+53', name: 'Cuba' },
  { code: '+599', name: 'Curacao' },
  { code: '+357', name: 'Cyprus' },
  { code: '+420', name: 'Czech Republic' },
  { code: '+243', name: 'Democratic Republic of the Congo' },
  { code: '+45', name: 'Denmark' },
  { code: '+253', name: 'Djibouti' },
  { code: '+1-767', name: 'Dominica' },
  { code: '+1-809', name: 'Dominican Republic' },
  { code: '+1-829', name: 'Dominican Republic' },
  { code: '+1-849', name: 'Dominican Republic' },
  { code: '+670', name: 'East Timor' },
  { code: '+593', name: 'Ecuador' },
  { code: '+20', name: 'Egypt' },
  { code: '+503', name: 'El Salvador' },
  { code: '+240', name: 'Equatorial Guinea' },
  { code: '+291', name: 'Eritrea' },
  { code: '+372', name: 'Estonia' },
  { code: '+251', name: 'Ethiopia' },
  { code: '+500', name: 'Falkland Islands' },
  { code: '+298', name: 'Faroe Islands' },
  { code: '+679', name: 'Fiji' },
  { code: '+358', name: 'Finland' },
  { code: '+33', name: 'France' },
  { code: '+689', name: 'French Polynesia' },
  { code: '+241', name: 'Gabon' },
  { code: '+220', name: 'Gambia' },
  { code: '+995', name: 'Georgia' },
  { code: '+49', name: 'Germany' },
  { code: '+233', name: 'Ghana' },
  { code: '+350', name: 'Gibraltar' },
  { code: '+30', name: 'Greece' },
  { code: '+299', name: 'Greenland' },
  { code: '+1-473', name: 'Grenada' },
  { code: '+1-671', name: 'Guam' },
  { code: '+502', name: 'Guatemala' },
  { code: '+44-1481', name: 'Guernsey' },
  { code: '+224', name: 'Guinea' },
  { code: '+245', name: 'Guinea-Bissau' },
  { code: '+592', name: 'Guyana' },
  { code: '+509', name: 'Haiti' },
  { code: '+504', name: 'Honduras' },
  { code: '+852', name: 'Hong Kong' },
  { code: '+36', name: 'Hungary' },
  { code: '+354', name: 'Iceland' },
  { code: '+91', name: 'India' },
  { code: '+62', name: 'Indonesia' },
  { code: '+98', name: 'Iran' },
  { code: '+964', name: 'Iraq' },
  { code: '+353', name: 'Ireland' },
  { code: '+44-1624', name: 'Isle of Man' },
  { code: '+972', name: 'Israel' },
  { code: '+39', name: 'Italy' },
  { code: '+225', name: 'Ivory Coast' },
  { code: '+1-876', name: 'Jamaica' },
  { code: '+81', name: 'Japan' },
  { code: '+44-1534', name: 'Jersey' },
  { code: '+962', name: 'Jordan' },
  { code: '+7', name: 'Kazakhstan' },
  { code: '+254', name: 'Kenya' },
  { code: '+686', name: 'Kiribati' },
  { code: '+383', name: 'Kosovo' },
  { code: '+965', name: 'Kuwait' },
  { code: '+996', name: 'Kyrgyzstan' },
  { code: '+856', name: 'Laos' },
  { code: '+371', name: 'Latvia' },
  { code: '+961', name: 'Lebanon' },
  { code: '+266', name: 'Lesotho' },
  { code: '+231', name: 'Liberia' },
  { code: '+218', name: 'Libya' },
  { code: '+423', name: 'Liechtenstein' },
  { code: '+370', name: 'Lithuania' },
  { code: '+352', name: 'Luxembourg' },
  { code: '+853', name: 'Macau' },
  { code: '+389', name: 'Macedonia' },
  { code: '+261', name: 'Madagascar' },
  { code: '+265', name: 'Malawi' },
  { code: '+60', name: 'Malaysia' },
  { code: '+960', name: 'Maldives' },
  { code: '+223', name: 'Mali' },
  { code: '+356', name: 'Malta' },
  { code: '+692', name: 'Marshall Islands' },
  { code: '+222', name: 'Mauritania' },
  { code: '+230', name: 'Mauritius' },
  { code: '+262', name: 'Mayotte' },
  { code: '+52', name: 'Mexico' },
  { code: '+691', name: 'Micronesia' },
  { code: '+373', name: 'Moldova' },
  { code: '+377', name: 'Monaco' },
  { code: '+976', name: 'Mongolia' },
  { code: '+382', name: 'Montenegro' },
  { code: '+1-664', name: 'Montserrat' },
  { code: '+212', name: 'Morocco' },
  { code: '+258', name: 'Mozambique' },
  { code: '+95', name: 'Myanmar' },
  { code: '+264', name: 'Namibia' },
  { code: '+674', name: 'Nauru' },
  { code: '+977', name: 'Nepal' },
  { code: '+31', name: 'Netherlands' },
  { code: '+687', name: 'New Caledonia' },
  { code: '+64', name: 'New Zealand' },
  { code: '+505', name: 'Nicaragua' },
  { code: '+227', name: 'Niger' },
  { code: '+234', name: 'Nigeria' },
  { code: '+683', name: 'Niue' },
  { code: '+850', name: 'North Korea' },
  { code: '+1-670', name: 'Northern Mariana Islands' },
  { code: '+47', name: 'Norway' },
  { code: '+968', name: 'Oman' },
  { code: '+92', name: 'Pakistan' },
  { code: '+680', name: 'Palau' },
  { code: '+970', name: 'Palestine' },
  { code: '+507', name: 'Panama' },
  { code: '+675', name: 'Papua New Guinea' },
  { code: '+595', name: 'Paraguay' },
  { code: '+51', name: 'Peru' },
  { code: '+63', name: 'Philippines' },
  { code: '+48', name: 'Poland' },
  { code: '+351', name: 'Portugal' },
  { code: '+1-787', name: 'Puerto Rico' },
  { code: '+1-939', name: 'Puerto Rico' },
  { code: '+974', name: 'Qatar' },
  { code: '+242', name: 'Republic of the Congo' },
  { code: '+262', name: 'Reunion' },
  { code: '+40', name: 'Romania' },
  { code: '+7', name: 'Russia' },
  { code: '+250', name: 'Rwanda' },
  { code: '+590', name: 'Saint Barthelemy' },
  { code: '+290', name: 'Saint Helena' },
  { code: '+1-869', name: 'Saint Kitts and Nevis' },
  { code: '+1-758', name: 'Saint Lucia' },
  { code: '+590', name: 'Saint Martin' },
  { code: '+508', name: 'Saint Pierre and Miquelon' },
  { code: '+1-784', name: 'Saint Vincent and the Grenadines' },
  { code: '+685', name: 'Samoa' },
  { code: '+378', name: 'San Marino' },
  { code: '+239', name: 'Sao Tome and Principe' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+221', name: 'Senegal' },
  { code: '+381', name: 'Serbia' },
  { code: '+248', name: 'Seychelles' },
  { code: '+232', name: 'Sierra Leone' },
  { code: '+65', name: 'Singapore' },
  { code: '+1-721', name: 'Sint Maarten' },
  { code: '+421', name: 'Slovakia' },
  { code: '+386', name: 'Slovenia' },
  { code: '+677', name: 'Solomon Islands' },
  { code: '+252', name: 'Somalia' },
  { code: '+27', name: 'South Africa' },
  { code: '+82', name: 'South Korea' },
  { code: '+211', name: 'South Sudan' },
  { code: '+34', name: 'Spain' },
  { code: '+94', name: 'Sri Lanka' },
  { code: '+249', name: 'Sudan' },
  { code: '+597', name: 'Suriname' },
  { code: '+47', name: 'Svalbard and Jan Mayen' },
  { code: '+268', name: 'Swaziland' },
  { code: '+46', name: 'Sweden' },
  { code: '+41', name: 'Switzerland' },
  { code: '+963', name: 'Syria' },
  { code: '+886', name: 'Taiwan' },
  { code: '+992', name: 'Tajikistan' },
  { code: '+255', name: 'Tanzania' },
  { code: '+66', name: 'Thailand' },
  { code: '+228', name: 'Togo' },
  { code: '+690', name: 'Tokelau' },
  { code: '+676', name: 'Tonga' },
  { code: '+1-868', name: 'Trinidad and Tobago' },
  { code: '+216', name: 'Tunisia' },
  { code: '+90', name: 'Turkey' },
  { code: '+993', name: 'Turkmenistan' },
  { code: '+1-649', name: 'Turks and Caicos Islands' },
  { code: '+688', name: 'Tuvalu' },
  { code: '+1-340', name: 'U.S. Virgin Islands' },
  { code: '+256', name: 'Uganda' },
  { code: '+380', name: 'Ukraine' },
  { code: '+971', name: 'United Arab Emirates' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+1', name: 'United States' },
  { code: '+598', name: 'Uruguay' },
  { code: '+998', name: 'Uzbekistan' },
  { code: '+678', name: 'Vanuatu' },
  { code: '+379', name: 'Vatican' },
  { code: '+58', name: 'Venezuela' },
  { code: '+84', name: 'Vietnam' },
  { code: '+681', name: 'Wallis and Futuna' },
  { code: '+212', name: 'Western Sahara' },
  { code: '+967', name: 'Yemen' },
  { code: '+260', name: 'Zambia' },
  { code: '+263', name: 'Zimbabwe' },
  ];

const SignupForm = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { referralId } = useParams();
  const [referrerDetails, setReferrerDetails] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showWhatsappScreen, setShowWhatsappScreen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const otpRefs = useRef([]);

  useEffect(() => {
    document.title = "Baay Realty - Client Registration";
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    passportPhoto: "",
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinEmail: '',
    nextOfKinPhone: '',
    occupation: '',
    officeAddress: '',
    propertyId: '',
    paymentMethod: '',
    amount: '',
    referralCode: referralId,
    termsAccepted: false,
    countryCode: '+234',
  });

  useEffect(() => {
    fetchProperties();
    if (referralId) {
      fetchReferrerDetails(referralId);
    }
  }, [referralId]);

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Timer for OTP expiry
  useEffect(() => {
    let interval;
    if (otpExpiry) {
      interval = setInterval(() => {
        const now = new Date();
        if (now >= otpExpiry) {
          toast.error('OTP expired. Please request a new one.');
          setOtpExpiry(null);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpExpiry]);

  useEffect(() => {
    if (formData.propertyId && properties.length > 0) {
      const property = properties.find(p => p._id === formData.propertyId);
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [formData.propertyId, properties]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('https://newportal-backend.onrender.com/client/properties');
      setProperties(response.data);
    } catch (error) {
      toast.error('Failed to fetch properties');
    }
  };

  const fetchReferrerDetails = async (referralId) => {
    try {
      const response = await axios.get(`https://newportal-backend.onrender.com/client/validate-referral/${referralId}`);
      setReferrerDetails(response.data);
    } catch (error) {
      toast.error('Invalid referral code');
      setReferrerDetails(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus to next input
      if (value && index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      
      for (let i = 0; i < Math.min(digits.length, 6); i++) {
        newOtp[i] = digits[i];
      }
      
      setOtp(newOtp);
      
      // Focus on appropriate input after paste
      const lastIndex = Math.min(digits.length - 1, 5);
      if (lastIndex < 5 && digits.length < 6) {
        otpRefs.current[lastIndex + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.firstName || !formData.lastName) {
      toast.error('First and Last name are required');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!formData.dateOfBirth) {
      toast.error('Date of Birth is required');
      return false;
    }
    if (!formData.gender) {
      toast.error('Gender is required');
      return false;
    }
    if (!formData.passportPhoto) {
      toast.error('Passport Photo is required');
      return false;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.country) {
      toast.error('Address details are required');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.nextOfKinName || !formData.nextOfKinRelationship || !formData.nextOfKinEmail || !formData.nextOfKinPhone) {
      toast.error('Next of Kin Details are required');
      return false;
    }
    if (!formData.occupation || !formData.officeAddress) {
      toast.error('Occupation Details are required');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!formData.propertyId || !formData.paymentMethod || !formData.amount) {
      toast.error('Property Details are required');
      return false;
    }
    if (!formData.termsAccepted) {
      toast.error('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    if (currentStep === 3) return validateStep3();
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    if (showOtpScreen) {
      setShowOtpScreen(false);
      setCurrentStep(3);
    }
    if (showWhatsappScreen) {
      setShowWhatsappScreen(false);
      setShowOtpScreen(true);
    }
  };

  const sendOtp = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      // Send request to generate OTP
      await axios.post('https://newportal-backend.onrender.com/client/send-otp', {
        email: formData.email,
        name: formData.firstName,
      });
  
      // Set OTP expiry time (15 minutes from now)
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 15);
      setOtpExpiry(expiryTime);
  
      // Start resend timer
      setResendTimer(60);
      
      // Show OTP screen
      setShowOtpScreen(true);
      toast.success('Verification code sent to your email');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification code';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Verify OTP
      await axios.post('https://newportal-backend.onrender.com/client/verify-otp', {
        email: formData.email,
        otp: enteredOtp,
      });

      // Move to WhatsApp screen
      setShowOtpScreen(false);
      setShowWhatsappScreen(true);

    } catch (error) {
      toast.error('Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
  
    try {
      if (!selectedProperty) {
        toast.error('Selected property not found');
        return;
      }
      
      // Upload passportPhoto to Cloudinary
      const passportPhotoData = new FormData();
      passportPhotoData.append('file', formData.passportPhoto);
      passportPhotoData.append('upload_preset', 'giweexpv');
      const passportPhotoResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dwpoik1jm/image/upload',
        passportPhotoData
      );
  
      // Concatenate countryCode and phone
      const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
  
      const userData = {
        ...formData,
        passportPhoto: passportPhotoResponse.data.secure_url,
        propertyName: selectedProperty.propertyName,
        propertyActualPrice: selectedProperty.amount,
        phone: fullPhoneNumber,
      };
  
      // Send data to the backend
      const response = await axios.post('https://newportal-backend.onrender.com/client/signup', userData);

      // Handle backend response
      const { token, user } = response.data;

      // Store token in localStorage or state management
      localStorage.setItem('Clienttoken', token);
      localStorage.setItem('Clientuser', JSON.stringify(user));
  
      Swal.fire({
        title: 'Registration Successful!',
        html: `
          Your registration and payment upload for ${selectedProperty.propertyName} was successful.<br>
          Your payment will be confirmed after 48hrs
          <span style="color: #E5B305">Check your email for confirmation.</span>
        `,
        icon: 'success',
        confirmButtonColor: '#002657',
      });
  
      navigate('/client-dashboard');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    sendOtp(); 
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between">
        <div className={`flex flex-col items-center`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#002657] text-white' : 'bg-gray-200'}`}>1</div>
          <span className="text-sm mt-1">Personal</span>
        </div>
        <div className={`flex-1 h-0.5 self-center ${currentStep >= 2 ? 'bg-[#002657]' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#002657] text-white' : 'bg-gray-200'}`}>2</div>
          <span className="text-sm mt-1">Details</span>
        </div>
        <div className={`flex-1 h-0.5 self-center ${currentStep >= 3 ? 'bg-[#002657]' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#002657] text-white' : 'bg-gray-200'}`}>3</div>
          <span className="text-sm mt-1">Property</span>
        </div>
        {(showOtpScreen || showWhatsappScreen) && (
          <>
            <div className={`flex-1 h-0.5 self-center bg-[#002657]`}></div>
            <div className={`flex flex-col items-center`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#002657] text-white`}>4</div>
              <span className="text-sm mt-1">Verification</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className='flex justify-center mb-9 items-center'>
        <img src={logo} className='w-32 h-32' alt="Baay Realty Logo" />
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#002657' }}>
          Complete your payment proof upload and create your account
        </h2>

        <ProgressBar />

        {/* OTP Verification Screen */}
        {showOtpScreen && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6 text-center">Email Verification</h3>
            <div className="text-center mb-6">
              <p className="mb-2">We've sent a verification code to <span className="font-semibold">{formData.email}</span></p>
              <p>Enter the 6-digit code below:</p>
            </div>
            
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={el => otpRefs.current[index] = el}
                  id={`otp-${index}`}
                  type="text"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-md focus:border-[#002657] focus:ring-1 focus:ring-[#E5B305]"
                  maxLength={1}
                />
              ))}
            </div>
            
            <div className="text-center mb-6">
              <p>Code expires in 15 minutes</p>
              <button
                type="button"
                onClick={sendOtp}
                disabled={resendTimer > 0}
                className={`mt-2 text-sm font-semibold ${resendTimer > 0 ? 'text-gray-400' : 'text-[#E5B305] cursor-pointer'}`}
              >
                {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
              </button>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#E5B305' }}
              >
                <ChevronLeft className="mr-2 w-5 h-5" />
                Back
              </button>
              <button
                type="button"
                onClick={verifyOtp}
                disabled={loading || otp.join('').length !== 6}
                className="py-2 px-4 rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#002657' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify Code'
                )}
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Screen */}
        {showWhatsappScreen && selectedProperty && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6 text-center">Complete Verification</h3>
            
            <div className="text-center mb-6">
              <p className="mb-4">Send your payment screenshot to our WhatsApp before proceeding to the dashboard</p>
              
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <p className="font-semibold mb-2">Property Selected: {selectedProperty.propertyName}</p>
                <p className="mb-2">Amount: ₦{selectedProperty.amount}</p>
                <p className="mb-2">Payment Method: {formData.paymentMethod === 'full' ? 'Full Payment' : 'Installment'}</p>
                <p>Amount Paid: ₦{formData.amount}</p>
              </div>
              
              <div className="flex justify-center mb-6">
                <a 
                  href={`https://wa.me/+2348071260398?text=Hello,%20I%20have%20completed%20my%20property%20registration%20for%20${selectedProperty.propertyName}%20and%20I'm%20sending%20my%20payment%20proof.`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-3 rounded-md bg-[#25D366] text-white font-semibold hover:bg-opacity-90 transition-opacity"
                >
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us
                </a>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-semibold mb-2">Important Notes:</p>
                <ul className="text-yellow-700 text-sm list-disc list-inside">
                  <li className="mb-1">Your property sale will not be approved until you send the payment proof</li>
                  <li>Please send the payment screenshot to complete your registration</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#E5B305' }}
              >
                <ChevronLeft className="mr-2 w-5 h-5" />
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="py-2 px-4 rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#002657' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main registration form */}
        {!showOtpScreen && !showWhatsappScreen && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card 1: Personal Information */}
            {currentStep === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Last Name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Mail className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Phone*
                    </label>
                    <div className="flex">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        className="mt-1 block w-2/4 rounded-l-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.code} ({country.name})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-3/4 rounded-r-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Calendar className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Date of Birth*
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Gender*
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Address*
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      City*
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      State*
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Country*
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      ZipCode
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Image className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Passport Photo*
                    </label>
                    <input
                      type="file"
                      name="passportPhoto"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#002657] file:text-white
                        hover:file:bg-[#E5B305]"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#002657' }}
                  >
                    Next
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Card 2: Details */}
            {currentStep === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Next of Kin Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Next of Kin Details</h3>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Full Name*
                      </label>
                      <input
                        type="text"
                        name="nextOfKinName"
                        value={formData.nextOfKinName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Heart className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Relationship*
                      </label>
                      <input
                        type="text"
                        name="nextOfKinRelationship"
                        value={formData.nextOfKinRelationship}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Mail className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Email*
                      </label>
                      <input
                        type="email"
                        name="nextOfKinEmail"
                        value={formData.nextOfKinEmail}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Phone*
                      </label>
                      <input
                        type="tel"
                        name="nextOfKinPhone"
                        value={formData.nextOfKinPhone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                    </div>
                  </div>

                  {/* Work & Referral Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Work & Referral Details</h3>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Briefcase className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Occupation*
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Office Address*
                      </label>
                      <input
                        type="text"
                        name="officeAddress"
                        value={formData.officeAddress}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Gift className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Referral Code
                      </label>
                      <input
                        type="text"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      />
                      {referrerDetails && (
                        <p className="text-sm text-gray-600 mt-1">Referred by: {referrerDetails.firstName} {referrerDetails.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#E5B305' }}
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#002657' }}
                  >
                    Next
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Card 3: Account & Property Payment */}
            {currentStep === 3 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Property Purchase */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Property Purchase</h3>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Building2 className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Select Property*
                      </label>
                      <select
                        name="propertyId"
                        value={formData.propertyId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      >
                        <option value="">Select a property</option>
                        {properties.map(property => (
                          <option key={property._id} value={property._id}>
                            {property.propertyName} - ₦{property.amount}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <CreditCard className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Payment Method*
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      >
                        <option value="">Select payment method</option>
                        <option value="full">Full Payment</option>
                        <option value="installment">Installment</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <HandCoins className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Amount*
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                    </div>

                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#002657] focus:ring-[#E5B305] border-gray-300 rounded"
                        required
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        I accept the terms and conditions*
                      </label>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Create Password</h3>

                    <div className="relative">
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Lock className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Password*
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 pt-8 flex items-center"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <div className="relative">
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Lock className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                        Confirm Password*
                      </label>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 pt-8 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#E5B305' }}
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2 px-4 rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#002657' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Continue to Verification'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default SignupForm;