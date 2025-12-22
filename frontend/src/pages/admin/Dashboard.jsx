import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, Plus, Trash2, Edit2, X, ShoppingBag, Palette, Menu } from 'lucide-react';
import api from '../../api/axios';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 w-full text-left p-2 rounded transition-colors ${active ? 'bg-gray-800 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Delete State
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteType, setDeleteType] = useState('category'); // 'category' | 'product'

    // Products State
    const [products, setProducts] = useState([]);
    const [productFormData, setProductFormData] = useState({
        categoryId: '',
        code: '',
        dimensions: '',
        weight: '',
        materialType: '',
        enTitle: '', enDesc: '',
        ruTitle: '', ruDesc: '',
        azTitle: '', azDesc: '',
        images: []
    });

    // Category Form State
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        imagePath: '',
        icon: 'Box',
        parentId: '',
        enName: '', enSlug: '',
        ruName: '', ruSlug: '',
        azName: '', azSlug: ''
    });

    // Texture State
    const [textures, setTextures] = useState([]);
    const [textureFormData, setTextureFormData] = useState({
        name: '', type: 'standard', imagePath: ''
    });

    // Slider State
    const [slides, setSlides] = useState([]);
    const [slideFormData, setSlideFormData] = useState({
        imagePath: '',
        azTitle: '', azSubtitle: '',
        enTitle: '', enSubtitle: '',
        ruTitle: '', ruSubtitle: ''
    });

    // Projects State
    const [projects, setProjects] = useState([]);
    const [projectFormData, setProjectFormData] = useState({
        azTitle: '', azDesc: '',
        enTitle: '', enDesc: '',
        ruTitle: '', ruDesc: '',
        images: []
    });

    const [activeTab, setActiveTab] = useState('directions'); // 'directions' | 'all' | 'products' | 'colors' | 'slider' | 'projects'

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        } else {
            fetchCategories();
            fetchProducts();
            fetchTextures();
            fetchSlides();
            fetchProjects();
        }
    }, [navigate]);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/admin/categories');
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories', error);
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/admin/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const fetchTextures = async () => {
        try {
            const { data } = await api.get('/textures');
            setTextures(data);
        } catch (error) {
            console.error('Error fetching textures', error);
        }
    };

    const fetchSlides = async () => {
        try {
            const { data } = await api.get('/hero-slides');
            setSlides(data);
        } catch (error) {
            console.error('Error fetching slides', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/admin/projects');
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handleAddNew = () => {
        setEditId(null);
        if (activeTab === 'products') {
            setProductFormData({
                categoryId: '', code: '', dimensions: '', weight: '', materialType: '',
                enTitle: '', enDesc: '', ruTitle: '', ruDesc: '', azTitle: '', azDesc: '', images: []
            });
        } else if (activeTab === 'colors') {
            setTextureFormData({ name: '', type: 'standard', imagePath: '' });
        } else if (activeTab === 'slider') {
            setSlideFormData({ imagePath: '', azTitle: '', azSubtitle: '', enTitle: '', enSubtitle: '', ruTitle: '', ruSubtitle: '' });
        } else if (activeTab === 'projects') {
            setProjectFormData({ azTitle: '', azDesc: '', enTitle: '', enDesc: '', ruTitle: '', ruDesc: '', images: [] });
        } else {
            setFormData({ imagePath: '', icon: 'Box', parentId: '', enName: '', enSlug: '', ruName: '', ruSlug: '', azName: '', azSlug: '' });
        }
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setEditId(category.id);
        const en = category.translations.find(t => t.locale === 'en') || {};
        const ru = category.translations.find(t => t.locale === 'ru') || {};
        const az = category.translations.find(t => t.locale === 'az') || {};
        setFormData({
            imagePath: category.imagePath || '',
            icon: category.icon || 'Box',
            parentId: category.parentId || '',
            enName: en.name || '', enSlug: en.slug || '',
            ruName: ru.name || '', ruSlug: ru.slug || '',
            azName: az.name || '', azSlug: az.slug || ''
        });
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditId(product.id);
        const en = product.translations.find(t => t.locale === 'en') || {};
        const ru = product.translations.find(t => t.locale === 'ru') || {};
        const az = product.translations.find(t => t.locale === 'az') || {};
        setProductFormData({
            categoryId: product.categoryId || '',
            code: product.code || '',
            dimensions: product.dimensions || '',
            weight: product.weight || '',
            materialType: product.materialType || '',
            enTitle: en.title || '', enDesc: en.description || '',
            ruTitle: ru.title || '', ruDesc: ru.description || '',
            azTitle: az.title || '', azDesc: az.description || '',
            images: product.images || []
        });
        setIsModalOpen(true);
    };

    const handleEditTexture = (texture) => {
        setEditId(texture.id);
        const az = texture.translations?.find(t => t.locale === 'az') || {};
        setTextureFormData({
            name: az.name || '',
            type: texture.type || 'standard',
            imagePath: texture.imagePath || ''
        });
        setIsModalOpen(true);
    };

    const handleEditSlide = (slide) => {
        setEditId(slide.id);
        const en = slide.translations.find(t => t.locale === 'en') || {};
        const ru = slide.translations.find(t => t.locale === 'ru') || {};
        const az = slide.translations.find(t => t.locale === 'az') || {};
        setSlideFormData({
            imagePath: slide.imagePath,
            azTitle: az.title || '', azSubtitle: az.subtitle || '',
            enTitle: en.title || '', enSubtitle: en.subtitle || '',
            ruTitle: ru.title || '', ruSubtitle: ru.subtitle || ''
        });
        setIsModalOpen(true);
    };

    const handleEditProject = (project) => {
        setEditId(project.id);
        const en = project.translations.find(t => t.locale === 'en') || {};
        const ru = project.translations.find(t => t.locale === 'ru') || {};
        const az = project.translations.find(t => t.locale === 'az') || {};
        setProjectFormData({
            azTitle: az.title || '', azDesc: az.description || '',
            enTitle: en.title || '', enDesc: en.description || '',
            ruTitle: ru.title || '', ruDesc: ru.description || '',
            images: project.images || []
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id, type) => {
        setDeleteId(id);
        setDeleteType(type);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            if (deleteType === 'category') {
                await api.delete(`/categories/${deleteId}`);
                fetchCategories();
            } else if (deleteType === 'product') {
                await api.delete(`/admin/products/${deleteId}`);
                fetchProducts();
            } else if (deleteType === 'texture') {
                await api.delete(`/admin/textures/${deleteId}`);
                fetchTextures();
            } else if (deleteType === 'slide') {
                await api.delete(`/admin/hero-slides/${deleteId}`);
                fetchSlides();
            } else if (deleteType === 'project') {
                await api.delete(`/admin/projects/${deleteId}`);
                fetchProjects();
            }
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            if (activeTab === 'products') {
                if (editId) {
                    await api.put(`/admin/products/${editId}`, productFormData);
                } else {
                    await api.post('/admin/products', productFormData);
                }
                fetchProducts();
            } else if (activeTab === 'colors') {
                if (editId) {
                    await api.put(`/admin/textures/${editId}`, textureFormData);
                } else {
                    await api.post('/admin/textures', textureFormData);
                }
                fetchTextures();
            } else if (activeTab === 'slider') {
                if (editId) {
                    await api.put(`/admin/hero-slides/${editId}`, slideFormData);
                } else {
                    await api.post('/admin/hero-slides', slideFormData);
                }
                fetchSlides();
            } else if (activeTab === 'projects') {
                if (editId) {
                    await api.put(`/admin/projects/${editId}`, projectFormData);
                } else {
                    await api.post('/admin/projects', projectFormData);
                }
                fetchProjects();
            } else { // Categories
                if (editId) {
                    await api.put(`/categories/${editId}`, formData);
                } else {
                    await api.post('/categories', formData);
                }
                fetchCategories();
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving item:', error);
        } finally {
            setUploading(false);
        }
    };

    // Missing Handlers restored
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append('image', file);
        setUploading(true);
        try {
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': undefined }
            });
            setFormData(prev => ({ ...prev, imagePath: res.data.url }));
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleProjectImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const uploadedUrls = [];
            for (const file of files) {
                const data = new FormData();
                data.append('image', file);
                const res = await api.post('/upload', data, { headers: { 'Content-Type': undefined } });
                uploadedUrls.push(res.data.url);
            }
            setProjectFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const removeProjectImage = (index) => {
        setProjectFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-black text-white p-4 flex justify-between items-center sticky top-0 z-30">
                <span className="font-bold font-sans">ProTerra Admin</span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-black text-white p-6 fixed h-full z-40 transition-transform duration-300 md:translate-x-0 top-0 left-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} pt-20 md:pt-6`}>
                <h2 className="text-xl font-sans font-bold mb-8 hidden md:block">ProTerra Admin</h2>
                <nav className="space-y-2">
                    <button
                        onClick={() => { setActiveTab('directions'); setIsSidebarOpen(false); }}
                        className={`flex items-center gap-2 w-full text-left p-2 rounded transition-colors ${activeTab === 'directions' ? 'bg-gray-800 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                    >
                        <Package size={20} />
                        Directions
                    </button>
                    <button
                        onClick={() => { setActiveTab('all'); setIsSidebarOpen(false); }}
                        className={`flex items-center gap-2 w-full text-left p-2 rounded transition-colors ${activeTab === 'all' ? 'bg-gray-800 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                    >
                        <div className="flex items-center justify-center w-5 h-5 border border-current rounded-sm text-[10px] font-bold">ALL</div>
                        All Categories
                    </button>
                    <button
                        onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
                        className={`flex items-center gap-2 w-full text-left p-2 rounded transition-colors ${activeTab === 'products' ? 'bg-gray-800 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                    >
                        <ShoppingBag size={18} />
                        Products
                    </button>
                    <button
                        onClick={() => { setActiveTab('colors'); setIsSidebarOpen(false); }}
                        className={`flex items-center gap-2 w-full text-left p-2 rounded transition-colors ${activeTab === 'colors' ? 'bg-gray-800 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                    >
                        <Palette size={18} />
                        Colors
                    </button>
                    <SidebarItem icon={Package} label="Hero Slider" active={activeTab === 'slider'} onClick={() => { setActiveTab('slider'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={Palette} label="Projects" active={activeTab === 'projects'} onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }} />
                </nav>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full text-left mt-12 pt-4 border-t border-gray-800">
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>

            {/* Content */}
            <main className="flex-1 p-4 md:p-8 md:ml-64 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold font-sans uppercase tracking-wider">
                        {activeTab === 'directions' ? 'Directions' : activeTab === 'products' ? 'Products' : activeTab === 'colors' ? 'Colors & Textures' : activeTab === 'slider' ? 'Hero Slider' : activeTab === 'projects' ? 'Projects' : 'Categories'}
                    </h1>
                    <button onClick={handleAddNew} className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors w-full md:w-auto justify-center">
                        <Plus size={20} />
                        Add New
                    </button>
                </div>

                {(activeTab === 'directions' || activeTab === 'all') && (
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 font-medium text-gray-500 text-sm">ID</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Preview</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Name (AZ)</th>
                                        {activeTab === 'all' && <th className="p-4 font-medium text-gray-500 text-sm">Parent</th>}
                                        <th className="p-4 font-medium text-gray-500 text-sm">Slug</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Icon</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={activeTab === 'all' ? 8 : 7} className="p-8 text-center">Loading...</td></tr>
                                    ) : categories
                                        .filter(c => activeTab === 'all' ? true : !c.parentId)
                                        .sort((a, b) => a.id - b.id)
                                        .map(cat => {
                                            const az = cat.translations.find(t => t.locale === 'az') || {};
                                            const parent = cat.parentId ? categories.find(p => p.id === cat.parentId) : null;
                                            const parentName = parent ? (parent.translations.find(t => t.locale === 'az')?.name || `ID ${parent.id}`) : '-';

                                            return (
                                                <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="p-4">{cat.id}</td>
                                                    <td className="p-4">
                                                        {cat.imagePath ? <img src={cat.imagePath.startsWith('http') ? cat.imagePath : `http://localhost:3000${cat.imagePath}`} alt="" className="w-16 h-16 object-cover rounded border" /> : '-'}
                                                    </td>
                                                    <td className="p-4 font-medium text-lg">{az.name || 'No Name'}</td>
                                                    {activeTab === 'all' && <td className="p-4 text-gray-500">{parentName}</td>}
                                                    <td className="p-4 text-gray-500">{az.slug}</td>
                                                    <td className="p-4 text-gray-500">{cat.icon}</td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(cat.id, 'category')} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Product Table */}
                {activeTab === 'products' && (
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 font-medium text-gray-500 text-sm">ID</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Image</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Code (SKU)</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Price</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Name (AZ)</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Category</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(prod => {
                                        const az = prod.translations.find(t => t.locale === 'az') || {};
                                        const mainImg = prod.images.find(i => i.isMain) || prod.images[0];
                                        const catName = prod.category ? (prod.category.translations.find(t => t.locale === 'az')?.name) : '-';
                                        return (
                                            <tr key={prod.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-4">{prod.id}</td>
                                                <td className="p-4">
                                                    {mainImg ? <img src={mainImg.imagePath.startsWith('http') ? mainImg.imagePath : `http://localhost:3000${mainImg.imagePath}`} alt="" className="w-16 h-16 object-cover rounded border" /> : '-'}
                                                </td>
                                                <td className="p-4 font-mono text-sm">{prod.code}</td>
                                                <td className="p-4 font-mono text-sm">{prod.price || '-'}</td>
                                                <td className="p-4 font-medium">{az.title || 'No Title'}</td>
                                                <td className="p-4 text-gray-600">{catName}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEditProduct(prod)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(prod.id, 'product')} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {products.length === 0 && (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">No products found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Colors Table */}
                {activeTab === 'colors' && (
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 font-medium text-gray-500 text-sm">ID</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Image</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Name</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm">Type</th>
                                        <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {textures.map(tex => (
                                        <tr key={tex.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4">{tex.id}</td>
                                            <td className="p-4">
                                                {tex.imagePath ? <img src={tex.imagePath.startsWith('http') ? tex.imagePath : `http://localhost:3000${tex.imagePath}`} alt="" className="w-16 h-16 object-cover rounded border" /> : '-'}
                                            </td>
                                            <td className="p-4 font-medium">
                                                {tex.translations?.find(t => t.locale === 'az')?.name || 'No Name'}
                                            </td>
                                            <td className="p-4 font-mono text-xs uppercase">{tex.type}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEditTexture(tex)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(tex.id, 'texture')} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Hero Slider Table */}
                {activeTab === 'slider' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-gray-600">Image</th>
                                        <th className="text-left p-4 font-semibold text-gray-600">Title (EN)</th>
                                        <th className="text-right p-4 font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {slides && slides.map((slide) => {
                                        const enTrans = slide.translations?.find(t => t.locale === 'en');
                                        return (
                                            <tr key={slide.id} className="hover:bg-gray-50">
                                                <td className="p-4">
                                                    <img
                                                        src={slide.imagePath.startsWith('http') ? slide.imagePath : `http://localhost:3000${slide.imagePath}`}
                                                        alt=""
                                                        className="w-24 h-16 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="p-4 font-medium text-gray-800">{enTrans?.title || 'No Title'}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEditSlide(slide)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(slide.id, 'slide')} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
                }

                {/* Projects Table */}
                {
                    activeTab === 'projects' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-gray-600">Image</th>
                                            <th className="text-left p-4 font-semibold text-gray-600">Title (EN)</th>
                                            <th className="text-right p-4 font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {projects.length === 0 && (
                                            <tr><td colSpan="3" className="p-8 text-center text-gray-500">No projects found.</td></tr>
                                        )}
                                        {projects && projects.map((project) => {
                                            const enTrans = project.translations?.find(t => t.locale === 'en');
                                            const mainImage = project.images && project.images.length > 0 ? project.images[0].imagePath : null;
                                            return (
                                                <tr key={project.id} className="hover:bg-gray-50">
                                                    <td className="p-4">
                                                        {mainImage ? (
                                                            <img src={mainImage.startsWith('http') ? mainImage : `http://localhost:3000${mainImage}`} alt="" className="w-24 h-16 object-cover rounded" />
                                                        ) : (
                                                            <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 font-medium text-gray-800">{enTrans?.title || 'No Title'}</td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleEditProject(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(project.id, 'project')} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }
            </main >

            {/* Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold">{editId ? 'Edit Item' : 'New Item'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Product Form */}
                            {activeTab === 'products' ? (
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Category Select */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={productFormData.categoryId}
                                            onChange={e => setProductFormData({ ...productFormData, categoryId: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <React.Fragment key={c.id}>
                                                    <option value={c.id} className="font-bold">
                                                        {c.translations.find(t => t.locale === 'az')?.name || c.id}
                                                    </option>
                                                    {c.children && c.children.map(child => (
                                                        <option key={child.id} value={child.id}>
                                                            &nbsp;&nbsp;-- {child.translations.find(t => t.locale === 'az')?.name || child.id}
                                                        </option>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Basic Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="SKU Code" value={productFormData.code || ''} onChange={e => setProductFormData({ ...productFormData, code: e.target.value })} className="p-2 border rounded" required />
                                        <input placeholder="Price (e.g. 100 AZN)" value={productFormData.price || ''} onChange={e => setProductFormData({ ...productFormData, price: e.target.value })} className="p-2 border rounded" />
                                        <input placeholder="Dimensions" value={productFormData.dimensions || ''} onChange={e => setProductFormData({ ...productFormData, dimensions: e.target.value })} className="p-2 border rounded" />
                                        <input placeholder="Weight" value={productFormData.weight || ''} onChange={e => setProductFormData({ ...productFormData, weight: e.target.value })} className="p-2 border rounded" />
                                        <input placeholder="Material" value={productFormData.materialType || ''} onChange={e => setProductFormData({ ...productFormData, materialType: e.target.value })} className="p-2 border rounded" />
                                    </div>

                                    {/* Translations */}
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                            <h3 className="font-bold text-sm mb-3">Azerbaijani</h3>
                                            <input placeholder="Title" value={productFormData.azTitle || ''} onChange={e => setProductFormData({ ...productFormData, azTitle: e.target.value })} className="w-full p-2 border rounded mb-2" required />
                                            <textarea placeholder="Description" value={productFormData.azDesc || ''} onChange={e => setProductFormData({ ...productFormData, azDesc: e.target.value })} className="w-full p-2 border rounded" rows="2" />
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                            <h3 className="font-bold text-sm mb-3">English</h3>
                                            <input placeholder="Title" value={productFormData.enTitle || ''} onChange={e => setProductFormData({ ...productFormData, enTitle: e.target.value })} className="w-full p-2 border rounded mb-2" />
                                            <textarea placeholder="Description" value={productFormData.enDesc || ''} onChange={e => setProductFormData({ ...productFormData, enDesc: e.target.value })} className="w-full p-2 border rounded" rows="2" />
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                            <h3 className="font-bold text-sm mb-3">Russian</h3>
                                            <input placeholder="Title" value={productFormData.ruTitle || ''} onChange={e => setProductFormData({ ...productFormData, ruTitle: e.target.value })} className="w-full p-2 border rounded mb-2" />
                                            <textarea placeholder="Description" value={productFormData.ruDesc || ''} onChange={e => setProductFormData({ ...productFormData, ruDesc: e.target.value })} className="w-full p-2 border rounded" rows="2" />
                                        </div>
                                    </div>

                                    <div className="border p-4 rounded">
                                        <label className="block text-sm font-medium mb-2">Images</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {productFormData.images.map((img, idx) => (
                                                <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden group">
                                                    <img src={img.imagePath.startsWith('http') ? img.imagePath : `http://localhost:3000${img.imagePath}`} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => {
                                                        const newImages = productFormData.images.filter((_, i) => i !== idx);
                                                        setProductFormData({ ...productFormData, images: newImages });
                                                    }} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100"><X size={12} /></button>
                                                    {img.isMain && <span className="absolute bottom-0 left-0 bg-green-500 text-white text-[10px] px-1">Main</span>}
                                                    {!img.isMain && <button type="button" onClick={() => {
                                                        const newImages = productFormData.images.map((im, i) => ({ ...im, isMain: i === idx }));
                                                        setProductFormData({ ...productFormData, images: newImages });
                                                    }} className="absolute bottom-0 right-0 bg-blue-500 text-white text-[10px] px-1 opacity-0 group-hover:opacity-100">Make Main</button>}
                                                </div>
                                            ))}
                                        </div>
                                        <label className={`px-4 py-2 rounded cursor-pointer transition-colors text-sm font-medium ${productFormData.images.length >= 5 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                                            {productFormData.images.length >= 5 ? 'Limit Reached (5)' : 'Add Images'}
                                            <input type="file" className="hidden" accept="image/*" multiple disabled={productFormData.images.length >= 5} onChange={async (e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    const files = Array.from(e.target.files);
                                                    const remainingSlots = 5 - productFormData.images.length;

                                                    if (files.length > remainingSlots) {
                                                        alert(`You can only add ${remainingSlots} more photo(s).`);
                                                        return;
                                                    }

                                                    // Temporary loading state
                                                    const btn = e.target.parentElement;
                                                    const originalText = btn.innerText;
                                                    btn.innerText = 'Uploading...';

                                                    try {
                                                        const newImages = [];
                                                        for (const file of files) {
                                                            const fd = new FormData();
                                                            fd.append('image', file);
                                                            const res = await api.post('/upload', fd, {
                                                                headers: { 'Content-Type': 'multipart/form-data' }
                                                            });
                                                            newImages.push({
                                                                imagePath: res.data.url,
                                                                isMain: productFormData.images.length === 0 && newImages.length === 0,
                                                                sortOrder: productFormData.images.length + newImages.length
                                                            });
                                                        }

                                                        setProductFormData(prev => ({
                                                            ...prev,
                                                            images: [...prev.images, ...newImages]
                                                        }));
                                                    } catch (err) {
                                                        alert('Upload failed');
                                                        console.error(err);
                                                    } finally {
                                                        btn.innerText = originalText;
                                                        e.target.value = null;
                                                    }
                                                }
                                            }} />
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
                                            {editId ? 'Save Product' : 'Create Product'}
                                        </button>
                                    </div>
                                </form>
                            ) : activeTab === 'colors' ? (
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Image Upload */}
                                    <div className="border border-dashed border-gray-300 p-6 rounded bg-gray-50 text-center">
                                        {textureFormData.imagePath ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={textureFormData.imagePath.startsWith('http') ? textureFormData.imagePath : `http://localhost:3000${textureFormData.imagePath}`}
                                                    alt="Preview"
                                                    className="h-32 object-cover rounded mx-auto mb-2"
                                                />
                                                <p className="text-xs text-gray-500 break-all">{textureFormData.imagePath}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 mb-2">No image selected</p>
                                        )}
                                        <div className="mt-4">
                                            <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer transition-colors inline-block">
                                                {uploading ? 'Uploading...' : 'Choose Image File'}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        const data = new FormData();
                                                        data.append('image', file);

                                                        setUploading(true);
                                                        try {
                                                            const res = await api.post('/upload', data, {
                                                                headers: { 'Content-Type': undefined }
                                                            });
                                                            setTextureFormData(prev => ({ ...prev, imagePath: res.data.url }));
                                                        } catch (err) {
                                                            alert('Upload failed');
                                                            console.error(err);
                                                        } finally {
                                                            setUploading(false);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-3">
                                            <div className="p-3 bg-gray-50 border rounded">
                                                <label className="block text-xs font-bold text-blue-600 mb-1">Azerbaijani Name</label>
                                                <input
                                                    value={textureFormData.azName || ''}
                                                    onChange={e => setTextureFormData({ ...textureFormData, azName: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    required
                                                />
                                            </div>
                                            <div className="p-3 bg-gray-50 border rounded">
                                                <label className="block text-xs font-bold text-green-600 mb-1">English Name</label>
                                                <input
                                                    value={textureFormData.enName || ''}
                                                    onChange={e => setTextureFormData({ ...textureFormData, enName: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="p-3 bg-gray-50 border rounded">
                                                <label className="block text-xs font-bold text-red-600 mb-1">Russian Name</label>
                                                <input
                                                    value={textureFormData.ruName || ''}
                                                    onChange={e => setTextureFormData({ ...textureFormData, ruName: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <select
                                                value={textureFormData.type}
                                                onChange={e => setTextureFormData({ ...textureFormData, type: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            >
                                                <option value="standard">Standard Colors</option>
                                                <option value="exposed">Exposed Aggregate</option>
                                                <option value="terrazzo">Terrazzo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                        <button type="submit" className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">{editId ? 'Save Color' : 'Add Color'}</button>
                                    </div>
                                </form>
                            ) : activeTab === 'projects' ? (
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Projects Form */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-gray-900 border-b pb-2">English Content</h3>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={projectFormData.enTitle}
                                                        onChange={e => setProjectFormData({ ...projectFormData, enTitle: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                    <textarea
                                                        rows="3"
                                                        value={projectFormData.enDesc}
                                                        onChange={e => setProjectFormData({ ...projectFormData, enDesc: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-gray-900 border-b pb-2">Russian Content</h3>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={projectFormData.ruTitle}
                                                        onChange={e => setProjectFormData({ ...projectFormData, ruTitle: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                    <textarea
                                                        rows="3"
                                                        value={projectFormData.ruDesc}
                                                        onChange={e => setProjectFormData({ ...projectFormData, ruDesc: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-gray-900 border-b pb-2">Azerbaijani Content</h3>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={projectFormData.azTitle}
                                                        onChange={e => setProjectFormData({ ...projectFormData, azTitle: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                    <textarea
                                                        rows="3"
                                                        value={projectFormData.azDesc}
                                                        onChange={e => setProjectFormData({ ...projectFormData, azDesc: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mt-4">
                                                <h3 className="font-semibold text-gray-900 border-b pb-2">Project Images</h3>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                                    <input
                                                        type="file"
                                                        onChange={handleProjectImageUpload}
                                                        multiple
                                                        className="hidden"
                                                        id="project-images"
                                                    />
                                                    <label htmlFor="project-images" className="cursor-pointer flex flex-col items-center gap-2">
                                                        <Plus className="w-8 h-8 text-gray-400" />
                                                        <span className="text-sm text-gray-600 font-medium">Click to upload multiple images</span>
                                                    </label>
                                                </div>

                                                {projectFormData.images.length > 0 && (
                                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                                        {projectFormData.images.map((img, index) => (
                                                            <div key={index} className="relative group aspect-square">
                                                                <img src={img.startsWith('http') ? img : `http://localhost:3000${img}`} alt="" className="w-full h-full object-cover rounded-lg" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeProjectImage(index)}
                                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                        <button type="submit" className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">{editId ? 'Save Project' : 'Add Project'}</button>
                                    </div>
                                </form>
                            ) : activeTab === 'slider' ? (
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Slide Image */}
                                    <div className="border border-dashed border-gray-300 p-6 rounded bg-gray-50 text-center">
                                        {slideFormData.imagePath ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={slideFormData.imagePath.startsWith('http') ? slideFormData.imagePath : `http://localhost:3000${slideFormData.imagePath}`}
                                                    alt="Preview"
                                                    className="h-32 object-cover rounded mx-auto mb-2"
                                                />
                                                <p className="text-xs text-gray-500 break-all">{slideFormData.imagePath}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 mb-2">No image selected</p>
                                        )}
                                        <div className="mt-4">
                                            <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer transition-colors inline-block">
                                                {uploading ? 'Uploading...' : 'Choose Background Image'}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;
                                                        const data = new FormData();
                                                        data.append('image', file);
                                                        setUploading(true);
                                                        try {
                                                            const res = await api.post('/upload', data, {
                                                                headers: { 'Content-Type': undefined }
                                                            });
                                                            setSlideFormData(prev => ({ ...prev, imagePath: res.data.url }));
                                                        } catch (err) {
                                                            console.error(err); alert('Upload failed');
                                                        } finally {
                                                            setUploading(false);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-gray-50 border rounded space-y-3">
                                            <h3 className="font-bold text-blue-600 text-xs">Azerbaijani Content</h3>
                                            <input placeholder="Title" value={slideFormData.azTitle} onChange={e => setSlideFormData({ ...slideFormData, azTitle: e.target.value })} className="w-full p-2 border rounded" required />
                                            <input placeholder="Subtitle" value={slideFormData.azSubtitle} onChange={e => setSlideFormData({ ...slideFormData, azSubtitle: e.target.value })} className="w-full p-2 border rounded" />
                                        </div>
                                        <div className="p-4 bg-gray-50 border rounded space-y-3">
                                            <h3 className="font-bold text-green-600 text-xs">English Content</h3>
                                            <input placeholder="Title" value={slideFormData.enTitle} onChange={e => setSlideFormData({ ...slideFormData, enTitle: e.target.value })} className="w-full p-2 border rounded" />
                                            <input placeholder="Subtitle" value={slideFormData.enSubtitle} onChange={e => setSlideFormData({ ...slideFormData, enSubtitle: e.target.value })} className="w-full p-2 border rounded" />
                                        </div>
                                        <div className="p-4 bg-gray-50 border rounded space-y-3">
                                            <h3 className="font-bold text-red-600 text-xs">Russian Content</h3>
                                            <input placeholder="Title" value={slideFormData.ruTitle} onChange={e => setSlideFormData({ ...slideFormData, ruTitle: e.target.value })} className="w-full p-2 border rounded" />
                                            <input placeholder="Subtitle" value={slideFormData.ruSubtitle} onChange={e => setSlideFormData({ ...slideFormData, ruSubtitle: e.target.value })} className="w-full p-2 border rounded" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                        <button type="submit" className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">{editId ? 'Save Slide' : 'Add Slide'}</button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Category Image Upload */}
                                    <div className="border border-dashed border-gray-300 p-6 rounded bg-gray-50 text-center">
                                        {formData.imagePath ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={formData.imagePath.startsWith('http') ? formData.imagePath : `http://localhost:3000${formData.imagePath}`}
                                                    alt="Preview"
                                                    className="h-32 object-cover rounded mx-auto mb-2"
                                                />
                                                <p className="text-xs text-gray-500 break-all">{formData.imagePath}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 mb-2">No image selected</p>
                                        )}
                                        <div className="mt-4">
                                            <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer transition-colors inline-block">
                                                {uploading ? 'Uploading...' : 'Choose Image File'}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Parent Category & Icon */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                                            <select
                                                value={formData.parentId}
                                                onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            >
                                                <option value="">None (Top Level)</option>
                                                {categories
                                                    .filter(c => !c.parentId && c.id !== editId)
                                                    .map(c => (
                                                        <option key={c.id} value={c.id}>
                                                            {c.translations.find(t => t.locale === 'az')?.name || `Category ${c.id}`}
                                                        </option>
                                                    ))}
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">Select a parent to make this a sub-category.</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Lucide Icon Name</label>
                                            <input
                                                type="text"
                                                value={formData.icon}
                                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded"
                                                placeholder="e.g. Layers, Box"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">For top-level categories.</p>
                                        </div>
                                    </div>

                                    {/* Language Translations */}
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                            <h3 className="font-bold text-sm mb-3 text-blue-600">Azerbaijani (AZ)</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={formData.azName}
                                                    onChange={e => setFormData({ ...formData, azName: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    placeholder="Name"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.azSlug}
                                                    onChange={e => setFormData({ ...formData, azSlug: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    placeholder="Slug"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                            <h3 className="font-bold text-sm mb-3 text-green-600">English (EN)</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={formData.enName}
                                                    onChange={e => setFormData({ ...formData, enName: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    placeholder="Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.enSlug}
                                                    onChange={e => setFormData({ ...formData, enSlug: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    placeholder="Slug"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                            <h3 className="font-bold text-sm mb-3 text-red-600">Russian (RU)</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={formData.ruName}
                                                    onChange={e => setFormData({ ...formData, ruName: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    placeholder="Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.ruSlug}
                                                    onChange={e => setFormData({ ...formData, ruSlug: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    placeholder="Slug"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
                                            {editId ? 'Save Changes' : 'Create Category'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div >
                )
            }

            {/* Delete Confirmation Modal */}
            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-sm rounded-lg shadow-xl p-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                    <Trash2 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Delete {deleteType === 'product' ? 'Product' : 'Category'}?</h3>
                                <p className="text-gray-500">
                                    Are you sure you want to delete this {deleteType}? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 w-full pt-2">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminDashboard;
