import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // In a real app we'd fetch from DB and use bcrypt.compare against ADMIN_PASSWORD_HASH
    const adminEmail = process.env.ADMIN_EMAIL || "abdelbadie.kertimi1212@gmail.com";
    
    if (email === adminEmail && password === "12345678") {
       const response = NextResponse.json({ success: true });
       
       // Issue a mock signed JWT { role: "superadmin" }
       response.cookies.set('admin_token', 'mock_superadmin_jwt_123', { 
         httpOnly: true, 
         path: '/',
         sameSite: 'strict',
         maxAge: 86400 // 1 day
       });
       return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
