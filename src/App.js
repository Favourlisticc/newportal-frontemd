import { Routes, Route } from "react-router-dom";
import "./App.css";

// Admin Pages
import AdminLogin from "./page/admin/login";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./page/admin/dashboard/page/dasboard";
import ViewClient from "./page/admin/dashboard/page/view-client.js"
import FundingHistory from "./page/admin/dashboard/page/FundingHistory"
import ActivationCommission from "./page/admin/dashboard/page/activation/ActivationCommission"
import ActivationEarnings from "./page/admin/dashboard/page/activation/ActivationEarnings"
import BirthdayMessage from "./page/admin/dashboard/page/birthday/BirthdayMessage";
import TodaysBirthdays from "./page/admin/dashboard/page/birthday/TodaysBirthdays";
import ApprovedSalesTable from "./page/admin/dashboard/page/propertysales/approved-sales";
import PendingSalesHistory from "./page/admin/dashboard/page/propertysales/pending-sales";
import UnbalancedSales from "./page/admin/dashboard/page/propertysales/unbalanced-sales.js"
import RejectedSalesHistory from "./page/admin/dashboard/page/propertysales/rejected-sales"
import PendingWithdrawals from "./page/admin/dashboard/page/withdraws"
import AddFAQ from "./page/admin/dashboard/page/faq/add-faq"
import ViewFAQ from "./page/admin/dashboard/page/faq/viewfaq"
import  AddPropertyForm from "./page/admin/dashboard/page/properties/add-properties"
import PropertyList from "./page/admin/dashboard/page/properties/view-properties"
import ViewMessages from "./page/admin/dashboard/page/messages"
import Viewconsult from "./page/admin/dashboard/page/view-consult.js"

import AdminProtectedRoute from "./page/admin/protexted.js";

// Consult Pages
import ConsultLogin from "./page/consult/login";
import RegistrationForm from "./page/consult/register";
import ConsultLayout from "./consultlayout"; // Import ConsultLayout
import ConsultDashboard from "./page/consult/dashboard/pages/dashboard";
import ProfilePage from "./page/consult/dashboard/pages/profile";
import FundNowPage from "./page/consult/dashboard/pages/fund/uploadpaid";
import FundingHistoryPage from "./page/consult/dashboard/pages/fund/fundhistory";
import TeamTable from "./page/consult/dashboard/pages/viewteam";
import ViewClients from "./page/consult/dashboard/pages/viewclients";
import Withdraw from "./page/consult/dashboard/pages/withdraw/withdraw";
import Transactionconsult from "./page/consult/dashboard/pages/withdraw/transactions";
import CommissionPage from "./page/consult/dashboard/pages/commission";
import FAQPage from "./page/consult/dashboard/pages/faq";
import ContactSupport from "./page/consult/dashboard/pages/contact";
import WithdrawalPage from "./page/consult/dashboard/pages/withdraw/request.js";
import Properties from "./page/consult/dashboard/pages/properties.js"

import ProtectedRoute from "./page/consult/protected.js";

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

function App() {
  return (
    <div className="App h-full">
      <Routes>
       

        {/* Consult Routes */}
        <Route path="/consult/login" element={<ConsultLogin />} />
        <Route path="/consult/registrationForm/:referralId" element={<RegistrationForm />} />
        
        {/* Consult Dashboard Layout with Nested Routes */}
        <Route path="/consult-dashboard" element={ <ProtectedRoute>  <ConsultLayout /> </ProtectedRoute>}>
          <Route index element={<ConsultDashboard />} /> {/* Default dashboard page */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="fund-now" element={<FundNowPage />} />
          <Route path="fund-history" element={<FundingHistoryPage />} />
          <Route path="view-team" element={<TeamTable />} />
          <Route path="view-clients" element={<ViewClients />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="transactions" element={<Transactionconsult />} />
          <Route path="commission" element={<CommissionPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact-support" element={<ContactSupport />} />
          <Route path="withdrawal" element={<WithdrawalPage />} />
          <Route path="properties" element={<Properties />} />
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

          <Route path="view-consult" element={<Viewconsult />} />
          <Route path="view-client" element={<ViewClient />} />
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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
