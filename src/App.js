import { Routes, Route } from "react-router-dom";
import "./App.css";

// SuperAdmin Pages 
import SuperAdminLogin from "./page/superadmin/login.js";
import SuperAdminLayout from "./AdminLayout";
import SuperAdminDashboard from "./page/superadmin/dashboard/page/dasboard.js";
import SuperViewClient from "./page/superadmin/dashboard/page/view-client.js"
import SuperFundingHistory from "./page/superadmin/dashboard/page/FundingHistory.js"
import SuperActivationCommission from "./page/superadmin/dashboard/page/activation/ActivationCommission.js"
import SuperActivationEarnings from "./page/superadmin/dashboard/page/activation/ActivationEarnings.js"
import SuperBirthdayMessage from "./page/superadmin/dashboard/page/birthday/BirthdayMessage.js";
import SuperTodaysBirthdays from "./page/superadmin/dashboard/page/birthday/TodaysBirthdays.js";
import SuperApprovedSalesTable from "./page/superadmin/dashboard/page/propertysales/approved-sales.js";
import SuperPendingSalesHistory from "./page/superadmin/dashboard/page/propertysales/pending-sales.js";
import SuperUnbalancedSales from "./page/superadmin/dashboard/page/propertysales/unbalanced-sales.js"
import SuperRejectedSalesHistory from "./page/superadmin/dashboard/page/propertysales/rejected-sales.js"
import SuperPendingWithdrawals from "./page/superadmin/dashboard/page/withdraws.js"
import SuperAddFAQ from "./page/superadmin/dashboard/page/faq/add-faq.js"
import SuperViewFAQ from "./page/superadmin/dashboard/page/faq/viewfaq.js"
import  SuperAddPropertyForm from "./page/superadmin/dashboard/page/properties/add-properties.js"
import SuperPropertyList from "./page/superadmin/dashboard/page/properties/view-properties.js"
import SuperViewMessages from "./page/superadmin/dashboard/page/messages.js"
import SuperViewrealtors from "./page/superadmin/dashboard/page/view-realtors.js"
import AdminManagement from "./page/superadmin/dashboard/page/AdminManagement.js";
import TestimonialsManagement from "./page/superadmin/dashboard/page/testimonials.js";
import SuperAdminActivity from "./page/superadmin/dashboard/page/activity.js";

import SuperAdminProtectedRoute from "./page/superadmin/protexted.js";

// admin Pages
import AdminLogin from "./page/admin/login.js";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./page/admin/dashboard/page/dasboard.js";
import ViewClient from "./page/admin/dashboard/page/view-client.js"
import FundingHistory from "./page/admin/dashboard/page/FundingHistory.js"
import ActivationCommission from "./page/admin/dashboard/page/activation/ActivationCommission.js"
import ActivationEarnings from "./page/admin/dashboard/page/activation/ActivationEarnings.js"
import BirthdayMessage from "./page/admin/dashboard/page/birthday/BirthdayMessage.js";
import TodaysBirthdays from "./page/admin/dashboard/page/birthday/TodaysBirthdays.js";
import ApprovedSalesTable from "./page/admin/dashboard/page/propertysales/approved-sales.js";
import PendingSalesHistory from "./page/admin/dashboard/page/propertysales/pending-sales.js";
import UnbalancedSales from "./page/admin/dashboard/page/propertysales/unbalanced-sales.js"
import RejectedSalesHistory from "./page/admin/dashboard/page/propertysales/rejected-sales.js"
import PendingWithdrawals from "./page/admin/dashboard/page/withdraws.js"
import AddFAQ from "./page/admin/dashboard/page/faq/add-faq.js"
import ViewFAQ from "./page/admin/dashboard/page/faq/viewfaq.js"
import  AddPropertyForm from "./page/admin/dashboard/page/properties/add-properties.js"
import PropertyList from "./page/admin/dashboard/page/properties/view-properties.js"
import ViewMessages from "./page/admin/dashboard/page/messages.js"
import Viewrealtors from "./page/admin/dashboard/page/view-realtors.js"
import AdminActivity from "./page/admin/dashboard/page/activity.js"

import AdminProtectedRoute from "./page/admin/protexted.js";

// Realtors Pages
import RealtorsLogin from "./page/realtor/login.js";
import RegistrationForm from "./page/realtor/register.js";
import RealtorsLayout from "./realtorlayout.js"; // Import RealtorsLayout
import RealtorsDashboard from "./page/realtor/dashboard/pages/dashboard.js";
import ProfilePage from "./page/realtor/dashboard/pages/profile.js";
import FundNowPage from "./page/realtor/dashboard/pages/fund/uploadpaid.js";
import FundingHistoryPage from "./page/realtor/dashboard/pages/fund/fundhistory.js";
import TeamTable from "./page/realtor/dashboard/pages/viewteam.js";
import ViewClients from "./page/realtor/dashboard/pages/viewclients.js";
import Withdraw from "./page/realtor/dashboard/pages/withdraw/withdraw.js";
import Transactionrealtors from "./page/realtor/dashboard/pages/withdraw/transactions.js";
import CommissionPage from "./page/realtor/dashboard/pages/commission.js";
import FAQPage from "./page/realtor/dashboard/pages/faq.js";
import ContactSupport from "./page/realtor/dashboard/pages/contact.js";
import WithdrawalPage from "./page/realtor/dashboard/pages/withdraw/request.js";
import Properties from "./page/realtor/dashboard/pages/properties.js"
import AddTestimonials from "./page/realtor/dashboard/pages/AddTestimonials.js";
import Support from "./page/realtor/dashboard/pages/support.js"
import ActivityPage from "./page/realtor/dashboard/pages/activity.js";

import ProtectedRoute from "./page/realtor/protected.js";

//import for clients
import ClientDashboardLayout from "./client"
import ClientDashboard from "./page/clients/dashboard/dashboard.js";
import Profile from "./page/clients/dashboard/profile.js";
import DataUploadPage from "./page/clients/dashboard/DataUpload";
import Products from "./page/clients/dashboard/products";
import LoginForm from "./page/clients/auth/login.js";
import RegisterForm from "./page/clients/auth/register.js";
import ClientProtectedRoute from "./page/clients/auth/protected.js";
import ClientPurchaseHistory from "./page/clients/dashboard/PurchaseRecord.js";
import RemRemindersTable from "./page/clients/dashboard/unsettled-sales.js"
import ClientSupport from "./page/clients/dashboard/support.js"
import ClientActivity from "./page/clients/dashboard/activity.js"

import ClientFAq from "./page/clients/dashboard/faq.js";
import ClientTestimonials from "./page/clients/dashboard/testimonials.js"
import ClientMessageSupport from "./page/clients/dashboard/contact-support.js"

function App() {
  return (
    <div className="App h-full">
      <Routes>
       

        {/* realtor Routes */}
        <Route path="/realtor/login" element={<RealtorsLogin />} />
        <Route path="/realtor/registrationForm/:referralId" element={<RegistrationForm />} />
        
        {/* realtor Dashboard Layout with Nested Routes */}
        <Route path="/realtor-dashboard" element={ <ProtectedRoute /> }>
          <Route index element={<RealtorsDashboard />} /> {/* Default dashboard page */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="fund-now" element={<FundNowPage />} />
          <Route path="fund-history" element={<FundingHistoryPage />} />
          <Route path="view-team" element={<TeamTable />} />
          <Route path="view-clients" element={<ViewClients />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="transactions" element={<Transactionrealtors />} />
          <Route path="commission" element={<CommissionPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact-support" element={<ContactSupport />} />
          <Route path="withdrawal" element={<WithdrawalPage />} />
          <Route path="properties" element={<Properties />} />
          <Route path="add-testimonials" element={<AddTestimonials />} />
          <Route path="support" element={<Support />} />
          <Route path="activity-log" element={<ActivityPage />} />
        </Route>

         {/* SuperAdmin Routes */}
         <Route path="/superadmin/login" element={<SuperAdminLogin />} />


         <Route path="/superadmin-dashboard" element={ <SuperAdminProtectedRoute>  <SuperAdminLayout /> </SuperAdminProtectedRoute>}>
          <Route index element={<SuperAdminDashboard />} />
          
          {/* Commissions & Funding */}
          <Route path="commissions" element={<SuperActivationEarnings />} />
          <Route path="funding" element={<SuperFundingHistory />} />
          <Route path="commission-activation" element={<SuperActivationCommission />} />

          {/* Birthday */}
          <Route path="birthday-message" element={<SuperBirthdayMessage />} />
          <Route path="todays-birthdays" element={<SuperTodaysBirthdays />} />

          {/* Property Sales */}
          <Route path="pending-sales" element={<SuperPendingSalesHistory />} />
          <Route path="approved-sales" element={<SuperApprovedSalesTable />} />
          <Route path="unbalanced-sales" element={<SuperUnbalancedSales />} />
          <Route path="rejected-sales" element={<SuperRejectedSalesHistory />} />

          {/* Withdrawals */}
          <Route path="withdrawal" element={<SuperPendingWithdrawals />} />

          {/* FAQ */}
          <Route path="add-faq" element={<SuperAddFAQ />} />
          <Route path="view-faq" element={<SuperViewFAQ />} />

          {/* Properties */}
          <Route path="add-property" element={<SuperAddPropertyForm />} />
          <Route path="view-properties" element={<SuperPropertyList />} />

          {/* Admins */}
          <Route path="admin-management" element={<AdminManagement />} />

          {/* Messages */}
          <Route path="messages" element={<SuperViewMessages />} />

          <Route path="view-realtors" element={<SuperViewrealtors />} />
          <Route path="view-client" element={<SuperViewClient />} />

          <Route path="testimonials" element={<TestimonialsManagement />} />
          <Route path="activity-log" element={<SuperAdminActivity />} />
        </Route>


         {/* Admin Routes */}
         <Route path="/admin/login" element={<AdminLogin />} />


         <Route path="/admin-dashboard" element={ <AdminProtectedRoute>  <AdminLayout /> </AdminProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          
          {/* Commissions & Funding */}
          <Route path="commissions" element={<ActivationEarnings />} />
          <Route path="funding" element={<FundingHistory />} />
          <Route path="commission-activation" element={<ActivationCommission />} />

          {/* Birthday */}
          <Route path="birthday-message" element={<BirthdayMessage />} />
          <Route path="todays-birthdays" element={<TodaysBirthdays />} />

          {/* Property Sales */}
          <Route path="pending-sales" element={<PendingSalesHistory />} />
          <Route path="approved-sales" element={<ApprovedSalesTable />} />
          <Route path="unbalanced-sales" element={<UnbalancedSales />} />
          <Route path="rejected-sales" element={<RejectedSalesHistory />} />

          {/* Withdrawals */}
          <Route path="withdrawal" element={<PendingWithdrawals />} />

          {/* FAQ */}
          <Route path="add-faq" element={<AddFAQ />} />
          <Route path="view-faq" element={<ViewFAQ />} />

          {/* Properties */}
          <Route path="add-property" element={<AddPropertyForm />} />
          <Route path="view-properties" element={<PropertyList />} />

          {/* Messages */}
          <Route path="messages" element={<ViewMessages />} />

          <Route path="view-realtors" element={<Viewrealtors />} />
          <Route path="view-client" element={<ViewClient />} />

          <Route path="activity-log" element={<AdminActivity />} />
        </Route>

        <Route path="/client/signin/:referralId" element={<RegisterForm />} />
        <Route path="/client/login" element={<LoginForm />} />

        <Route path="/client-dashboard" element={<ClientProtectedRoute> <ClientDashboardLayout /> </ClientProtectedRoute> }>
          <Route index element={<ClientDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
          <Route path="purchasehistory" element={<ClientPurchaseHistory />} />
          <Route path="upload" element={<DataUploadPage />} />
          <Route path="unsettled-sales" element={<RemRemindersTable />} />

          <Route path="support" element={<ClientSupport />} />
          <Route path="faq" element={<ClientFAq />} />
          <Route path="add-testimonials" element={<ClientTestimonials />} />
          <Route path="upload" element={<DataUploadPage />} />
          <Route path="contact-support" element={<ClientMessageSupport />} />
          <Route path="activity-log" element={<ClientActivity />} />
          
        </Route>
      </Routes>
    </div>
  );
}

export default App;
