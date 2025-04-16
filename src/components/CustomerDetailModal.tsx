import React from 'react';
import { CustomerData } from '../apiService';

interface CustomerDetailModalProps {
  customer: CustomerData | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ customer, isOpen, onClose }) => {
  if (!isOpen || !customer) return null;

  return (
    <>
    <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
/>

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-8 font-merriweather">Customer Details</h2>
        
        {/* First Row: First Name and Last Name */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#F8F9FA] p-4 rounded-lg shadow flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <span className="text-xl font-bold">{customer.first_name.charAt(0)}</span>
            </div>
            <div className="ml-4">
              <p className="text-blue-600 font-semibold">First Name</p>
              <p>{customer.first_name}</p>
            </div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-lg shadow flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <span className="text-xl font-bold">{customer.last_name.charAt(0)}</span>
            </div>
            <div className="ml-4">
              <p className="text-blue-600 font-semibold">Last Name</p>
              <p>{customer.last_name}</p>
            </div>
          </div>
        </div>

        {/* Second Row: PAN and AADHAR */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#F8F9FA] p-4 rounded-lg shadow flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <i className="fas fa-id-card text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-blue-600 font-semibold">PAN</p>
              <p>{customer.pan}</p>
            </div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-lg shadow flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <i className="fas fa-fingerprint text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-blue-600 font-semibold">AADHAR</p>
              <p>{customer.adhaar}</p>
            </div>
          </div>
        </div>

        {/* Third Row: Contact Details */}
        <div className="grid grid-cols-3 gap-4">
  <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
  <div className="flex items-center">
  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
    <i className="fas fa-phone text-xl"></i>
  </div>
  <p className="text-black font-semibold text-lg mb-2.5 ml-4">Contact Details</p>
</div>    
    <div>
      <p className="text-blue-600 font-semibold">Mobile</p>
      <p>{customer.mobile}</p>
    </div>
    <div>
      <p className="text-blue-600 font-semibold">Email</p>
      <p>{customer.email}</p>
    </div>
  </div>
  
  <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
  <div className="flex items-center">
  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
    <i className="fas fa-user text-xl"></i>
  </div>
  <p className="text-black font-semibold text-lg mb-2.5 ml-4">Spoc Details</p>
</div>    
    <div>
      <p className="text-blue-600 font-semibold">SPOC Mobile</p>
      <p>{customer.spoc_mobile}</p>
    </div>
    <div>
      <p className="text-blue-600 font-semibold">SPOC Name</p>
      <p>{customer.spoc_name}</p>
    </div>
  </div>
  
  <div className="bg-[#F8F9FA] p-4 rounded-lg shadow">
  <div className="flex items-center">
  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
    <i className="fas fa-building text-xl"></i>
  </div>
  <p className="text-black font-semibold text-lg mb-2.5 ml-4">Company Details</p>
</div>

    <div>
      <p className="text-blue-600 font-semibold">Company Name</p>
      <p>{customer.company_name}</p>
    </div>
    <div>
      <p className="text-blue-600 font-semibold">Company GST</p>
      <p>{customer.company_gst}</p>
    </div>
    <div>
      <p className="text-blue-600 font-semibold">Company Registration Number</p>
      <p>{customer.company_registration_number}</p>
    </div>
    <div>
      <p className="text-blue-600 font-semibold">Company Mobile</p>
      <p>{customer.company_mobile}</p>
    </div>
  </div>
</div>

      </div>
    </div>
    </>
  );
};

export default CustomerDetailModal;
