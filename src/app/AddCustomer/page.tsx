//src/app/AddCustomer/page.tsx
"use client"
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import { addCustomer } from '../../apiService';  // Import the addCustomer function
import ToastContainer, { showToast } from '../../components/ToastContainer'; // Adjust the path as necessary
import Link from 'next/link';
import { redirect } from 'next/navigation'


interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  pan: string;
  adhaar: string;
  spoc_name: string;
  spoc_mobile: string;
  company_name: string;
  company_gst: string;
  company_registration_number: string;
  company_mobile: string;
} 

const AddCustomer = () => {
 
  useEffect(() => {
    const sessionEmail = localStorage.getItem('sessionEmail');
    if (!sessionEmail) {
      redirect('/UserLogin'); // Redirect to a 404 page or your desired route
    }
  }, []);

  const [formValues, setFormValues] = useState<FormValues>({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    pan: '',
    adhaar: '',
    spoc_name: '',
    spoc_mobile: '',
    company_name: '',
    company_gst: '',
    company_registration_number: '',
    company_mobile: '',
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const validate = (fieldName: keyof FormValues, value: string): string | undefined => {
  const trimmedValue = value.trim();
  
  switch (fieldName) {
    case 'first_name':
    case 'last_name':
    case 'spoc_name':
      if (!trimmedValue) return 'This field is required';
      if (!/^[a-zA-Z\s]*$/.test(trimmedValue)) return 'Should only contain alphabets';
      break;
    case 'company_name':
      if (!/^[a-zA-Z\s]*$/.test(trimmedValue)) return 'Should only contain alphabets';
      break;
    case 'email':
      if (!trimmedValue) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(trimmedValue)) return 'Invalid email address';
      break;
    case 'mobile':
      if (!trimmedValue) return 'Mobile Number is required';
      if (!/^\d{10}$/.test(trimmedValue)) return 'Mobile Number should be 10 digits';
      break;
    case 'pan':
      if (!trimmedValue) return 'PAN Number is required';
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(trimmedValue)) return 'Invalid PAN Number';
      break;
    case 'adhaar':
      if (!trimmedValue) return 'AADHAR Number is required';
      if (!/^\d{12}$/.test(trimmedValue)) return 'AADHAR Number should be 12 digits';
      break;
    case 'spoc_mobile':
      if (!trimmedValue) return 'SPOC Mobile Number is required';
      if (!/^\d{10}$/.test(trimmedValue)) return 'Mobile Number should be 10 digits';
      break;
    case 'company_gst':
      if (trimmedValue && !/^[a-zA-Z0-9\s]*$/.test(trimmedValue)) return 'Invalid Company GST Number';
      break;
    case 'company_registration_number':
      if (trimmedValue && !/^[a-zA-Z0-9\s]*$/.test(trimmedValue)) return 'Invalid Company Registration Number';
      break;
    case 'company_mobile':
      if (trimmedValue && !/^\d{10}$/.test(trimmedValue)) return 'Company Mobile Number should be 10 digits';
      break;
    default:
      return undefined;
  }
  return undefined;
};

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validate(name as keyof FormValues, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Partial<FormValues> = validateFormValues(formValues);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const customerData = {
          ...formValues,
          first_name: toTitleCase(formValues.first_name.trim()),
          last_name: toTitleCase(formValues.last_name.trim()),
          spoc_name: toTitleCase(formValues.spoc_name.trim()),
          company_name: toTitleCase(formValues.company_name.trim()),
          company_gst: formValues.company_gst.trim(),
          company_registration_number: formValues.company_registration_number.trim(),
          company_mobile: formValues.company_mobile.trim(),
          email: formValues.email.trim(),
          mobile: formValues.mobile.trim(),
          pan: formValues.pan.trim(),
          adhaar: formValues.adhaar.trim(),
          spoc_mobile: formValues.spoc_mobile.trim()
        };
        await addCustomer(customerData);
        showToast('Customer added successfully', 'success');
        // Redirect after 5 seconds
        setTimeout(() => {
          window.location.href = '/ViewCustomer';
        }, 5000);
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.errors) {
          const errorMessages = error.response.data.errors;
          Object.keys(errorMessages).forEach((fieldName) => {
            const errorMessage = errorMessages[fieldName];
            showToast(errorMessage, 'error');
            setErrors((prevErrors) => ({
              ...prevErrors,
              [fieldName]: errorMessage,
            }));
          });
        } else {
          showToast(error.message || 'Failed to add customer', 'error');
        }
      }
    }
  };

  const validateFormValues = (values: FormValues): Partial<FormValues> => {
    const newErrors: Partial<FormValues> = {};
    Object.keys(values).forEach((key) => {
      const fieldName = key as keyof FormValues;
      const value = values[fieldName];
      const error = validate(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    return newErrors;
  };

  const resetForm = () => {
    setFormValues({
      first_name: '',
      last_name: '',
      email: '',
      mobile: '',
      pan: '',
      adhaar: '',
      spoc_name: '',
      spoc_mobile: '',
      company_name: '',
      company_gst: '',
      company_registration_number: '',
      company_mobile: '',
    });
    setErrors({});
  };

  return (
    <>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
      <div className="bg-[#F8F9FA] min-h-screen overflow-hidden">
        <Header />
        <ToastContainer />
        <div className="flex">
          <SideBar />
          <div className="flex-grow p-12 py-0 mt-2 ml-52 h-full overflow-x-hidden">
            <div className="mx-auto w-full bg-white p-8 rounded-2xl min-h-[85vh]">
              <form className="font-roboto" onSubmit={handleSubmit}>
                <div className="-mx-3 flex flex-wrap">
                  {[
                    { name: 'first_name', label: 'First Name', placeholder: 'Enter Your First Name', icon: 'fas fa-user' },
                    { name: 'last_name', label: 'Last Name', placeholder: 'Enter Your Last Name', icon: 'fas fa-user' },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter Your Email Address', icon: 'fas fa-envelope' },
                    { name: 'mobile', label: 'Mobile Number', placeholder: 'Enter Your Mobile Number', icon: 'fas fa-phone' },
                    { name: 'pan', label: 'PAN Number', placeholder: 'Enter Your PAN Number', icon: 'fas fa-id-card' },
                    { name: 'adhaar', label: 'AADHAR Number', placeholder: 'Enter Your AADHAR Number', icon: 'fas fa-fingerprint' },
                    { name: 'spoc_name', label: 'SPOC Name', placeholder: 'Enter Your SPOC Name', icon: 'fas fa-user' },
                    { name: 'spoc_mobile', label: 'SPOC Mobile Number', placeholder: 'Enter SPOC Mobile Number', icon: 'fas fa-phone' },
                    { name: 'company_name', label: 'Company Name', placeholder: 'Enter Your Company Name', icon: 'fas fa-building' },
                    { name: 'company_gst', label: 'Company GST Number', placeholder: 'Enter Your Company GST Number', icon: 'fas fa-file-invoice-dollar' },
                    { name: 'company_registration_number', label: 'Company Registration Number', placeholder: 'Enter Your Company Registration Number', icon: 'fas fa-registered' },
                    { name: 'company_mobile', label: 'Company Mobile Number', placeholder: 'Enter Your Company Mobile Number', icon: 'fas fa-phone' }
                  ].map((field) => (
                    <div key={field.name} className="w-full px-3 sm:w-1/2 lg:w-1/3 2xl:w-1/4">
                      <div className="mb-6">
                        <label htmlFor={field.name} className="mb-2 px-2 block text-base font-medium text-[#07074D]">
                          {field.label}
                          {['first_name', 'last_name', 'email', 'mobile', 'pan', 'adhaar', 'spoc_name', 'spoc_mobile'].includes(field.name) && (
                            <span className="text-red-600 text-lg">*</span>
                          )}
                        </label>
                        <div className="flex mb-4">
                          <span className="inline-flex items-center px-3 text-lg text-gray-900 bg-gray-200 border border-gray-300 rounded-l-md">
                            <i className={field.icon}></i>
                          </span>
                          <input
                            type={field.type || 'text'}
                            name={field.name}
                            id={field.name}
                            placeholder={field.placeholder}
                            value={formValues[field.name]}
                            onChange={handleChange}
                            className={`text-gray-900 border border-gray-300 rounded-md rounded-end focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full p-3 text-sm ${errors[field.name] ? 'border-red-500' : ''}`}
                          />
                        </div>

                        {errors[field.name] && <span className="text-red-500 text-sm">{errors[field.name]}</span>}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex justify-center items-center font-roboto">
              <button type="submit" className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 text-center text-base font-semibold text-white outline-none">
                  <i className="fas fa-check mr-2"></i>
                  Submit
                </button>
                <button type="reset" onClick={resetForm} className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 ml-10 text-center text-base font-semibold text-white outline-none">
                <i className="fas fa-redo mr-2"></i>
                Reset
                </button>
                <Link href="/ViewCustomer">
                    <button
                      type="button"
                      className="hover:shadow-form rounded-md bg-blue-600 py-3 px-5 mt-10 ml-10 text-center text-base font-semibold text-white outline-none"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Cancel
                    </button>
                  </Link>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddCustomer;