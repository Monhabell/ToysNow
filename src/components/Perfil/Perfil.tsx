/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';



interface Pedido {
    id: string;
    total: string; // Viene como string desde la API
    status: string;
    notes?: string;
    shipping_city: string;
    delivery_info: string;
    items: Array<{
        product: {
            id: number;
            name: string;
            price: string;
            slug: string; // Agregado para evitar el error de compilación
        };
        quantity: number;
        unit_price: string;
    }>;
}

const UserProfile = () => {
    const { data: session } = useSession();
    const nombre = session?.user?.name || 'Usuario';
    const token = session?.apiToken || '';

    const [userData, setUserData] = useState({
        name: nombre,
        email: session?.user?.email || 'juan.perez@example.com',
        phone: '',
        address: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [pedidos, setPedidos] = useState<Pedido[]>([]); // Aquí guardamos los pedidos
    const [loadingPedidos, setLoadingPedidos] = useState(true);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Datos actualizados:', userData);
        setIsEditing(false);
    };

    const mispedidos = async () => {
        const response = await fetch('/api/pedidos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los pedidos');
        }

        return await response.json();
    };

    // Ejecutamos la consulta cuando el componente esté listo
    useEffect(() => {
        if (!token) return;

        const cargarPedidos = async () => {
            try {
                setLoadingPedidos(true);
                const data = await mispedidos();
                // Asegúrate de que siempre sea un array
                const pedidosArray = data.data || [];

                console.log("Pedidos procesados:", pedidosArray);

                setPedidos(pedidosArray);
            } catch (err) {
                console.error("Error cargando pedidos:", err);
            } finally {
                setLoadingPedidos(false);
            }
        };

        cargarPedidos();
    }, [token]);

    return (
        <div className="min-h-screen perfil-container text-gray-100">
            <Head>
                <title>Mi Perfil - SexChop</title>
                <meta name="description" content="Gestión de tu perfil en SexChop" />
            </Head>

            <div className="sensual-content mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-amber-500 border-b-2 border-amber-500 pb-2">
                    MI PERFIL
                </h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4 bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
                        <div className="flex flex-col items-center py-4 border-b border-gray-700 pb-6">
                            <div className="w-24 h-24 rounded-full bg-gray-700 mb-4 flex items-center justify-center text-2xl font-bold text-amber-500 border-2 border-amber-500">
                                {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <h2 className="text-xl font-semibold">{userData.name}</h2>
                            <p className="text-gray-400 text-sm">{userData.email}</p>
                        </div>

                        <nav className="mt-6 space-y-2">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`w-full text-left cursor-pointer px-4 py-3 rounded-md flex items-center transition-all ${activeTab === 'personal' ? 'bg-amber-500/10 text-amber-500 font-medium border-l-4 border-amber-500' : 'text-gray-300 hover:bg-gray-700 hover:text-amber-400'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Información Personal
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full text-left cursor-pointer px-4 py-3 rounded-md flex items-center transition-all ${activeTab === 'security' ? 'bg-amber-500/10 text-amber-500 font-medium border-l-4 border-amber-500' : 'text-gray-300 hover:bg-gray-700 hover:text-amber-400'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Seguridad
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full text-left cursor-pointer px-4 py-3 rounded-md flex items-center transition-all ${activeTab === 'orders' ? 'bg-amber-500/10 text-amber-500 font-medium border-l-4 border-amber-500' : 'text-gray-300 hover:bg-gray-700 hover:text-amber-400'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Mis Pedidos
                            </button>
                            <button
                                onClick={() => setActiveTab('wishlist')}
                                className={`w-full text-left cursor-pointer px-4 py-3 rounded-md flex items-center transition-all ${activeTab === 'wishlist' ? 'bg-amber-500/10 text-amber-500 font-medium border-l-4 border-amber-500' : 'text-gray-300 hover:bg-gray-700 hover:text-amber-400'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Lista de Deseos
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
                        {activeTab === 'personal' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold text-amber-500 flex items-center">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Información Personal
                                    </h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2 rounded-md font-medium transition flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar Perfil
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancelar
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-400 mb-2">Nombre completo</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={userData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 mb-2">Correo electrónico</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={userData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 mb-2">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={userData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 mb-2">Dirección</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={userData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <button
                                                type="submit"
                                                className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2 rounded-md font-medium transition flex items-center"
                                            >
                                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Guardar Cambios
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <h3 className="text-gray-400 mb-1 text-sm">Nombre completo</h3>
                                            <p className="text-lg font-medium">{userData.name}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <h3 className="text-gray-400 mb-1 text-sm">Correo electrónico</h3>
                                            <p className="text-lg font-medium">{userData.email}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <h3 className="text-gray-400 mb-1 text-sm">Teléfono</h3>
                                            <p className="text-lg font-medium">{userData.phone}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <h3 className="text-gray-400 mb-1 text-sm">Dirección</h3>
                                            <p className="text-lg font-medium">{userData.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-2xl font-semibold text-amber-500 mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Seguridad
                                </h2>
                                <form onSubmit={handleSubmit} className="max-w-lg">
                                    <div className="mb-6">
                                        <label className="block text-gray-400 mb-2">Contraseña actual</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={userData.password}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-gray-400 mb-2">Nueva contraseña</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={userData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, incluyendo mayúsculas, números y símbolos</p>
                                    </div>
                                    <div className="mb-8">
                                        <label className="block text-gray-400 mb-2">Confirmar nueva contraseña</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={userData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2 rounded-md font-medium transition flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Cambiar Contraseña
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-2xl font-semibold text-amber-500 mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Mis Pedidos
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-700 text-amber-500">
                                            <tr>
                                                <th className="px-4 py-3">N° Pedido</th>
                                                <th className="px-4 py-3">Total</th>
                                                <th className="px-4 py-3">Estado</th>
                                                <th className="px-4 py-3">Ciudad</th>
                                                <th className="px-4 py-3">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loadingPedidos ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-4 text-gray-400">Cargando pedidos...</td>
                                                </tr>
                                            ) : pedidos.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-4 text-gray-400">No tienes pedidos aún.</td>
                                                </tr>
                                            ) : (
                                                pedidos.filter(pedido => pedido.status !== 'pending').map((pedido) => (

                                                    <tr key={pedido.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                                                        <td className="px-4 py-3">{pedido.items.map((item, index) => (
                                                            <div key={index}>{item.product.name}</div>
                                                        ))}</td>
                                                        <td className="px-4 py-3">${Number(pedido.total).toFixed(0)}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pedido.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                {pedido.status === 'pending' ? 'Pendiente' : 'Completado'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">{pedido.shipping_city}</td>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                className="text-amber-500 hover:text-amber-400 transition flex items-center"
                                                                onClick={() => console.log('Mostrar detalles', pedido)}
                                                            >
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Detalles
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div>
                                <h2 className="text-2xl font-semibold text-amber-500 mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Lista de Deseos
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(() => {
                                        // Crear un Set para IDs únicos
                                        const uniqueIds = new Set();
                                        const uniqueProducts = [];

                                        // Filtrar pedidos pendientes
                                        const pendingOrders = pedidos.filter(pedido => pedido.status === 'pending');

                                        // Recorrer todos los items de pedidos pendientes
                                        for (const pedido of pendingOrders) {
                                            for (const item of pedido.items) {
                                                // Si el ID no ha sido procesado, agregarlo al array único
                                                if (!uniqueIds.has(item.product.id)) {
                                                    uniqueIds.add(item.product.id);
                                                    uniqueProducts.push(item);
                                                }
                                            }
                                        }

                                        // Renderizar productos únicos
                                        return uniqueProducts.map((item, index) => (
                                            <div key={index} className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-amber-500/10 transition border border-gray-600">
                                                <div className="h-48 bg-gray-600 flex items-center justify-center relative">
                                                    <span className="text-gray-400">Imagen del producto</span>
                                                    <Image
                                                        src={"/images/default.webp"}
                                                        onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.onerror = null;
                                                        target.src = '/images/default.webp';
                                                        }}
                                                        fill
                                                        alt={item.product.name}
                                                        title={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    
                                                    <button className="absolute top-2 right-2 text-red-500 hover:text-red-400 transition">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-lg font-medium mb-2">{item.product.name}</h3>
                                                    <p className="text-amber-500 font-semibold mb-3">{item.product.price}</p>
                                                    <div className="flex justify-between">

                                                        

                                                                                                                                                                    
                                                        <Link
                                                            href={`/productos/${item.product.slug}`}
                                                            className="text-gray-400 hover:text-amber-500 transition flex items-center text-sm cursor-pointer"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Detalles
                                                            
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>


                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;