import { useState } from 'react';
import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react'


const UserProfile = () => {


    const { data: session, status } = useSession()

    console.log(session?.user?.name)

    const nombre = session?.user?.name || 'Usuario';

    const token = session?.apiToken|| '';

    const [userData, setUserData] = useState({
        name: nombre,
        email: 'juan.perez@example.com',
        phone: '+1 234 567 890',
        address: 'Calle Falsa 123, Ciudad',
        password: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Aquí iría la lógica para actualizar los datos del usuario
        console.log('Datos actualizados:', userData);
        setIsEditing(false);
    };



    return (
        <div className="min-h-screen bg-black text-gray-100">
            <Head>
                <title>Mi Perfil - Ecommerce</title>
            </Head>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gold-500 border-b-2 border-gold-500 pb-2">
                    Mi Perfil
                </h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4 bg-gray-800 rounded-lg p-4">
                        <div className="flex flex-col items-center py-4">
                            <div className="w-24 h-24 rounded-full bg-gray-700 mb-4 flex items-center justify-center text-2xl font-bold text-gold-500">
                                JP
                            </div>
                            <h2 className="text-xl font-semibold">{userData.name}</h2>
                            <p className="text-gray-400">{userData.email}</p>
                            <p className="text-gray-400">{token}</p>

                        </div>

                        <nav className="mt-6">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`w-full text-left px-4 py-2 rounded-md mb-2 ${activeTab === 'personal' ? 'bg-gold-500 text-gold-600 font-medium' : 'text-gray-300 hover:bg-gray-800'}`}
                            >
                                Información Personal
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full text-left px-4 py-2 rounded-md mb-2 ${activeTab === 'security' ? 'bg-gold-00 text-gold-600 font-medium' : 'text-gray-300 hover:bg-gray-800'}`}
                            >
                                Seguridad
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full text-left px-4 py-2 rounded-md mb-2 ${activeTab === 'orders' ? 'bg-gold-500 text-gold-600 font-medium' : 'text-gray-300 hover:bg-gray-800'}`}
                            >
                                Mis Pedidos
                            </button>
                            <button
                                onClick={() => setActiveTab('wishlist')}
                                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'wishlist' ? 'bg-gold-500 text-gold-600 font-medium' : 'text-gray-300 hover:bg-gray-800'}`}
                            >
                                Lista de Deseos
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 bg-gray-800 rounded-lg p-6">
                        {activeTab === 'personal' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold text-gold-600">Información Personal</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-gold-500 text-gold-600 px-4 py-2 rounded-md hover:bg-gold-600 transition"
                                        >
                                            Editar Perfil
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                                        >
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
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 mb-2">Correo electrónico</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={userData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 mb-2">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={userData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 mb-2">Dirección</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={userData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <button
                                                type="submit"
                                                className="bg-gold-500 text-black px-6 py-2 rounded-md hover:bg-gold-600 transition"
                                            >
                                                Guardar Cambios
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-gray-400 mb-1">Nombre completo</h3>
                                            <p className="text-lg">{userData.name}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-gray-400 mb-1">Correo electrónico</h3>
                                            <p className="text-lg">{userData.email}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-gray-400 mb-1">Teléfono</h3>
                                            <p className="text-lg">{userData.phone}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-gray-400 mb-1">Dirección</h3>
                                            <p className="text-lg">{userData.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gold-500 mb-6">Seguridad</h2>
                                <form onSubmit={handleSubmit} className="max-w-lg">
                                    <div className="mb-6">
                                        <label className="block text-gray-400 mb-2">Contraseña actual</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={userData.password}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
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
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-8">
                                        <label className="block text-gray-400 mb-2">Confirmar nueva contraseña</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={userData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-gold-500 text-gold-600 px-6 py-2 rounded-md hover:bg-gold-600  transition cursor-pointer"
                                    >
                                        Cambiar Contraseña
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gold-500 mb-6">Mis Pedidos</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-800 text-gold-500">
                                            <tr>
                                                <th className="px-4 py-3">N° Pedido</th>
                                                <th className="px-4 py-3">Fecha</th>
                                                <th className="px-4 py-3">Total</th>
                                                <th className="px-4 py-3">Estado</th>
                                                <th className="px-4 py-3">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-800 hover:bg-gray-800">
                                                <td className="px-4 py-3">#12345</td>
                                                <td className="px-4 py-3">15/05/2023</td>
                                                <td className="px-4 py-3">$249.99</td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-green-900 text-green-300 px-2 py-1 rounded-full text-xs">
                                                        Entregado
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button className="text-gold-500 hover:underline">Ver Detalles</button>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-800 hover:bg-gray-800">
                                                <td className="px-4 py-3">#12344</td>
                                                <td className="px-4 py-3">10/05/2023</td>
                                                <td className="px-4 py-3">$129.99</td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded-full text-xs">
                                                        En camino
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button className="text-gold-500 hover:underline">Ver Detalles</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gold-500 mb-6">Lista de Deseos</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-gold-500/20 transition">
                                        <div className="h-48 bg-gray-700 flex items-center justify-center">
                                            <span className="text-gray-500">Imagen del producto</span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-medium mb-2">Producto Ejemplo 1</h3>
                                            <p className="text-gold-500 font-semibold mb-3">$99.99</p>
                                            <div className="flex justify-between">
                                                <button className="cursor-pointer bg-gold-500 text-gold-600 px-3 py-1 rounded-md text-sm hover:bg-gold-600 transition">
                                                    Añadir al carrito
                                                </button>
                                                <button className="text-gray-400 hover:text-red-500 transition">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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