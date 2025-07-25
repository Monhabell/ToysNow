import { NextResponse } from "next/server";

export async function POST(request: Request) {
  
  const API_URL = `${process.env.API_TENANT_BASE_URL_V1}/login`;
  const body = await request.json();
  const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
              email: body.email,
              password: body.password,
              device_name: "WebApp",
            }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY || ''

      },
      cache: 'no-store'
    })

  if (!res.ok) {
    // Si la respuesta no es exitosa, lanza un error
    const errorData = await res.json();
    return NextResponse.json(
      { error: errorData.message || "Error al procesar la solicitud" },
      { status: res.status }
    );
  }


  const data = await res.json();
  return NextResponse.json(data, { status: res.status });

}

