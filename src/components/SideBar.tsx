import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { faAddressBook, faBriefcase, faShieldAlt, faTasks, faUser, faUserFriends, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SideBar = () => {
  const pathname = usePathname(); // usePathname returns the current pathname

// Function to check if the tab should be active
const isActiveTab = (tab: string) => {
  // Specific logic for 'Enquiry' tab
  if (tab === 'Enquiry') {
    return pathname === '/ViewEnquiry' || pathname === '/AddEnquiry';
  }
  if (tab === 'Customer') {
    return pathname === '/ViewCustomer' || pathname === '/AddCustomer';
  }
  if (tab === 'Employee') {
    return pathname === '/ViewUser' || pathname === '/AddUser';
  }
  return pathname === `/${tab}`;
};
  useEffect(() => {
    if (pathname) {
      isActiveTab(pathname);
    }
  }, [pathname]);

  const handleTabClick = (tab: string) => {
    isActiveTab(tab);
  };

  return (
    
    <div>
    {/* Sidebar*/}
<aside className="bg-[#F8F9FA] transform scale-110 top-24 max-w-52 ease-nav-brand z-990 fixed inset-y-0 my-4 ml-6 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 p-0 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0">
     

      <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
        <ul className="flex flex-col pl-0 mb-0 mt-6">
          <li className="w-full">
          
          <Link href="/Dashboard" legacyBehavior>
            <a
                className={`py-1.5 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors  ${isActiveTab('Dashboard') ? 'bg-white shadow-md' : ''}`}
                onClick={() => handleTabClick('/Dashboard')}
              >
              <div className="bg-blue-600 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                <svg width="12px" height="12px" viewBox="0 0 45 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <title>shop</title>
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-1716.000000, -439.000000)" fill="#FFFFFF" fillRule="nonzero">
                      <g transform="translate(1716.000000, 291.000000)">
                        <g transform="translate(0.000000, 148.000000)">
                          <path className="opacity-60" d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z"></path>
                          <path className="" d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Dashboard</span>
              </a>
              </Link>
          </li>
         
          <li className="w-full mt-4">
            <h6 className="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60">Customer</h6>
          </li>

         {/* Enquiry Tab */}
            <li className="mt-2 w-full">
              <Link href="/ViewEnquiry" legacyBehavior>
                <a
                  className={`py-1.5 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors ${isActiveTab('Enquiry') ? 'bg-white shadow-md' : ''}`}
                >
                  <div className="bg-blue-600 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                    <FontAwesomeIcon icon={faUserFriends} className="text-white" />
                  </div>
                  <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Enquiry</span>
                </a>
              </Link>
            </li>

            {/* Customer Tab */}
            <li className="mt-2 w-full">
              <Link href="/ViewCustomer" legacyBehavior>
                <a
                  className={`py-1.5 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors ${isActiveTab('Customer') ? 'bg-white shadow-md' : ''}`}
                >
                  <div className="bg-blue-600 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                    <FontAwesomeIcon icon={faAddressBook} className="text-white" />
                  </div>
                  <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Customer</span>
                </a>
              </Link>
            </li>
       

         

          <li className="w-full mt-4">
            <h6 className="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60">Employee</h6>
          </li>

          {/* Employee Tab */}
          <li className="mt-2 w-full">
              <Link href="/ViewUser" legacyBehavior>
                <a
                  className={`py-1.5 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors ${isActiveTab('Employee') ? 'bg-white shadow-md' : ''}`}
                >
                  <div className="bg-blue-600 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                    <FontAwesomeIcon icon={faAddressBook} className="text-white" />
                  </div>
                  <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Employee</span>
                </a>
              </Link>
            </li>

          
          <li className="w-full mt-4">
            <h6 className="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60">Work</h6>
          </li>
          <li className="mt-2 w-full">
          <Link href="/Work" legacyBehavior>    
          <a
              className={`py-1.5 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors ${isActiveTab('Work')? 'bg-white shadow-md' : ''}`}
              onClick={() => handleTabClick('/Work')}

            >
          <div className="bg-blue-600 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <FontAwesomeIcon icon={faTasks} className="text-white" />

              </div>
              <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Work</span>
            </a>
          
            </Link>
          </li>
          
          

          <li className="mt-2 w-full">
          <Link href="/WorkMaster" legacyBehavior>    
          <a
              className={`py-1.5 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors ${isActiveTab('WorkMaster' )? 'bg-white shadow-md' : ''}`}
              onClick={() => handleTabClick('/WorkMaster')} >
          <div className="bg-blue-600 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <FontAwesomeIcon icon={faBriefcase} className="text-white" />




              </div>
              <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Work Master</span>
            </a>
          
            </Link>
          </li>

          <li className="mt-2 w-full">
          <Link href="/ViewDocument" legacyBehavior>    

          <a
              className={`py-1.5 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors ${isActiveTab('ViewDocument') ? 'bg-white shadow-md' : ''}`}
              onClick={() => handleTabClick('ViewDocument')}
            >
          <div className="bg-blue-600 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="2 0 18 24" fill="white" className="size-6">
                    <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>


              </div>
              <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Document</span>
            </a>
            </Link>
          </li>

          <li className="w-full mt-4">
            <h6 className="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60">Settings</h6>
          </li>
          <li className="mt-2 w-full">
          <Link href="/RoleMaster" legacyBehavior>    
          <a
              className={`py-1.5 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors ${isActiveTab('RoleMaster' )? 'bg-white shadow-md' : ''}`}
              onClick={() => handleTabClick('/RoleMaster')}
            >
                            <div className="bg-blue-600 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                            <FontAwesomeIcon icon={faUserShield} className="text-white" />

              </div>
              <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Role Master</span>
            </a>
            </Link>
          </li>
          {/* Permission Tab */}
          <li className="mt-2 mb-2 w-full">
          <Link href="/ViewPermission" legacyBehavior>    

          <a
              className={`py-1.5 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors ${isActiveTab('ViewPermission') ? 'bg-white shadow-md' : ''}`}
              onClick={() => handleTabClick('ViewPermission')}
            >
          <div className="bg-blue-600 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <FontAwesomeIcon icon={faShieldAlt} className="text-white" />



              </div>
              <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Permission</span>
            </a>
            </Link>
          </li>
          
          </ul>
          </div></aside>
       </div>
    
      );
}

export default SideBar