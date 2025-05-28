export default function FailurePage() {
  return (
    <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Pago fallido</h1>
        <p>No pudimos procesar tu pago. Por favor intenta nuevamente.</p>
      </div>
    </div>
  )
}