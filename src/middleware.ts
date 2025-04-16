// src/middleware.ts

import { NextResponse } from 'next/server';

export function middleware(req) {
  const sessionEmail = req.cookies.get('sessionEmail') || req.headers.get('Session-Email');

  if (!sessionEmail) {
    return NextResponse.redirect(new URL('/not-found', req.url)); // Redirect to a 404 or a custom not found page
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ViewPermission', '/AddCustomer', '/AddEnquiry','/AddUser',
            '/RoleMaster','/UpdateCustomer','/UpdateUser','/ViewCustomer','/ViewDocument',
            '/ViewEnquiry','/ViewUser','/Work','/WorkMaster',
            ], // Add your protected routes here
};
