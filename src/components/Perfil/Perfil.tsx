/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface Pedido {
    id: string;
    total: string;
    status: string;
    notes?: string;
    shipping_city: string;
    delivery_info: string;
    items: Array<{
        product: {
            id: number;
            name: string;
            price: string;
            slug: string;
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
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
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

    useEffect(() => {
        if (!token) return;

        const cargarPedidos = async () => {
            try {
                setLoadingPedidos(true);
                const data = await mispedidos();
                const pedidosArray = data.data || [];
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
        <div className="min-h-screen bg-gradient-to-br  to-purple-950 text-gray-100">
            <Head>
                <title>Mi Perfil - SexShop</title>
                <meta name="description" content="Gestión de tu perfil en nuestra tienda" />
            </Head>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 text-center">
                    MI ESPACIO ÍNTIMO
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 shadow-xl">
                        <div className="flex flex-col items-center py-4 border-b border-pink-500/30 pb-6">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 mb-4 flex items-center justify-center text-2xl font-bold text-white border-4 border-pink-400/50 shadow-lg">
                                {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <h2 className="text-xl font-semibold text-white">{userData.name}</h2>
                            <p className="text-pink-200 text-sm">{userData.email}</p>
                        </div>

                        <nav className="mt-6 space-y-3">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`w-full text-left cursor-pointer px-4 py-3 rounded-xl flex items-center transition-all ${activeTab === 'personal' ? 'bg-pink-600/20 text-pink-400 font-medium border-l-4 border-pink-500 shadow-md' : 'text-gray-300 hover:bg-pink-500/10 hover:text-pink-300'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Información Personal
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full text-left cursor-pointer px-4 py-3 rounded-xl flex items-center transition-all ${activeTab === 'security' ? 'bg-pink-600/20 text-pink-400 font-medium border-l-4 border-pink-500 shadow-md' : 'text-gray-300 hover:bg-pink-500/10 hover:text-pink-300'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Seguridad
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full text-left cursor-pointer px-4 py-3 rounded-xl flex items-center transition-all ${activeTab === 'orders' ? 'bg-pink-600/20 text-pink-400 font-medium border-l-4 border-pink-500 shadow-md' : 'text-gray-300 hover:bg-pink-500/10 hover:text-pink-300'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Mis Pedidos
                            </button>
                            <button
                                onClick={() => setActiveTab('wishlist')}
                                className={`w-full text-left cursor-pointer px-4 py-3 rounded-xl flex items-center transition-all ${activeTab === 'wishlist' ? 'bg-pink-600/20 text-pink-400 font-medium border-l-4 border-pink-500 shadow-md' : 'text-gray-300 hover:bg-pink-500/10 hover:text-pink-300'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Lista de Deseos
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-pink-500/20 shadow-xl">
                        {activeTab === 'personal' && (
                            <div>
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 flex items-center">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Información Personal
                                    </h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center shadow-lg hover:shadow-pink-500/30"
                                        >
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar Perfil
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center border border-gray-600"
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
                                                <label className="block text-pink-200 mb-2">Nombre completo</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={userData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-700/50 border border-pink-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-pink-200 mb-2">Correo electrónico</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={userData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-700/50 border border-pink-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-pink-200 mb-2">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={userData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-700/50 border border-pink-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-pink-200 mb-2">Dirección</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={userData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-700/50 border border-pink-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <button
                                                type="submit"
                                                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center shadow-lg hover:shadow-pink-500/30"
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
                                        <div className="bg-gray-700/30 p-5 rounded-xl border border-pink-500/10">
                                            <h3 className="text-pink-200 mb-1 text-sm">Nombre completo</h3>
                                            <p className="text-lg font-medium text-white">{userData.name}</p>
                                        </div>
                                        <div className="bg-gray-700/30 p-5 rounded-xl border border-pink-500/10">
                                            <h3 className="text-pink-200 mb-1 text-sm">Correo electrónico</h3>
                                            <p className="text-lg font-medium text-white">{userData.email}</p>
                                        </div>
                                        <div className="bg-gray-700/30 p-5 rounded-xl border border-pink-500/10">
                                            <h3 className="text-pink-200 mb-1 text-sm">Teléfono</h3>
                                            <p className="text-lg font-medium text-white">{userData.phone || 'No proporcionado'}</p>
                                        </div>
                                        <div className="bg-gray-700/30 p-5 rounded-xl border border-pink-500/10">
                                            <h3 className="text-pink-200 mb-1 text-sm">Dirección</h3>
                                            <p className="text-lg font-medium text-white">{userData.address || 'No proporcionada'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-8 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Seguridad
                                </h2>
                                <form onSubmit={handleSubmit} className="max-w-lg">
                                    <div className="mb-6">
                                        <label className="block text-pink-200 mb-2">Contraseña actual</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={userData.password}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700/50 border border-pink-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-pink-200 mb-2">Nueva contraseña</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={userData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700/50 border border-pink-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                            required
                                        />
                                        <p className="text-xs text-pink-300 mt-2">Mínimo 8 caracteres, incluyendo mayúsculas, números y símbolos</p>
                                    </div>
                                    <div className="mb-8">
                                        <label className="block text-pink-200 mb-2">Confirmar nueva contraseña</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={userData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700/50 border border-pink-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center shadow-lg hover:shadow-pink-500/30"
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
                                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-8 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Mis Pedidos
                                </h2>
                                <div className="overflow-x-auto rounded-2xl border border-pink-500/20">
                                    <table className="w-full text-left">
                                        <thead className="bg-pink-500/10 text-pink-400">
                                            <tr>
                                                <th className="px-6 py-4">N° Pedido</th>
                                                <th className="px-6 py-4">Total</th>
                                                <th className="px-6 py-4">Estado</th>
                                                <th className="px-6 py-4">Ciudad</th>
                                                <th className="px-6 py-4">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loadingPedidos ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-8 text-pink-300">
                                                        <div className="flex justify-center">
                                                            <svg className="animate-spin h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        </div>
                                                        <p className="mt-2">Cargando tus pedidos...</p>
                                                    </td>
                                                </tr>
                                            ) : pedidos.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-8 text-pink-300">
                                                        <svg className="w-16 h-16 mx-auto text-pink-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                        <p className="mt-4 text-lg">No tienes pedidos aún.</p>
                                                        <Link href="/productos" className="mt-3 inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl font-medium transition-all">
                                                            Descubrir productos
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ) : (
                                                pedidos.filter(pedido => pedido.status !== 'pending').map((pedido) => (
                                                    <tr key={pedido.id} className="border-b border-pink-500/10 hover:bg-pink-500/5 transition-all">
                                                        <td className="px-6 py-4 font-medium">{pedido.id.substring(0, 8)}...</td>
                                                        <td className="px-6 py-4">${Number(pedido.total).toFixed(0)}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${pedido.status === 'pending'
                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                : 'bg-green-500/20 text-green-400'
                                                                }`}>
                                                                {pedido.status === 'pending' ? 'Pendiente' : 'Completado'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">{pedido.shipping_city}</td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                className="text-pink-400 hover:text-pink-300 transition-all flex items-center group"
                                                                onClick={() => console.log('Mostrar detalles', pedido)}
                                                            >
                                                                <svg className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-8 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Lista de Deseos
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(() => {
                                        const uniqueIds = new Set();
                                        const uniqueProducts = [];
                                        const pendingOrders = pedidos.filter(pedido => pedido.status === 'pending');

                                        for (const pedido of pendingOrders) {
                                            for (const item of pedido.items) {
                                                if (!uniqueIds.has(item.product.id)) {
                                                    uniqueIds.add(item.product.id);
                                                    uniqueProducts.push(item);
                                                }
                                            }
                                        }

                                        return uniqueProducts.length > 0 ? (
                                            uniqueProducts.map((item, index) => (
                                                <div key={index} className="bg-gray-700/30 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-pink-500/10 transition-all border border-pink-500/20 group">
                                                    <div className="h-48 bg-gradient-to-br from-pink-600/20 to-purple-600/20 flex items-center justify-center relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                                                        <span className="text-pink-300/70 z-10">Imagen del producto</span>
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
                                                        <button className="absolute top-3 right-3 text-white bg-pink-600/80 hover:bg-pink-600 p-1.5 rounded-full transition-all z-20">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="text-lg font-medium text-white mb-2 line-clamp-1">{item.product.name}</h3>
                                                        <p className="text-pink-400 font-semibold mb-3">{item.product.price}</p>
                                                        <div className="flex justify-between items-center">
                                                            <Link
                                                                href={`/productos/${item.product.slug}`}
                                                                className="text-pink-300 hover:text-pink-200 transition-all flex items-center text-sm group/details"
                                                            >
                                                                <svg className="w-4 h-4 mr-1 group-hover/details:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Ver detalles
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12 text-pink-300">
                                                <svg className="w-16 h-16 mx-auto text-pink-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                <p className="mt-4 text-lg">Tu lista de deseos está vacía.</p>
                                                <p className="text-pink-400/80 mb-4">Explora nuestros productos y guarda tus favoritos aquí.</p>
                                                <Link href="/productos" className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-pink-500/30">
                                                    Explorar productos
                                                </Link>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default UserProfile;