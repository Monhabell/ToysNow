import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  console.log("API FALSA RECIBIÓ:", body);

  // Simula éxito
  return NextResponse.json(
    {
      message: "Usuario recibido correctamente (API falsa)",
    },
    { status: 200 }
  );
}
