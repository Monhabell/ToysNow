import { NextResponse } from "next/server";
import { signIn } from "next-auth/react"; // Si estás usando esto en el cliente

export async function POST(request: Request) {
  const API_URL = `${process.env.API_TENANT_BASE_URL_V1}/login`;
  const body = await request.json();
  
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY || ''
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "Error al procesar la solicitud" },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Si estás manejando esto en el cliente, deberías hacer el signIn allí
    // Pero en una ruta de API, puedes preparar la respuesta para el cliente
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id, // Asegúrate de que estos campos coincidan con tu API
        name: data.user.name,
        email: data.user.email,
        image: data.user.image || null // Asegúrate de que tu API devuelva una imagen si es necesario
      },

    });

  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}