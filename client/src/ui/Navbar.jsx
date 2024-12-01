import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { UserContext, CartContext } from '@/App';
import Button from '@/components/Button';
import UserDropDown from '@/components/UserDropDown';
import useClickOutside from '@/hooks/useClickOutside';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, Menu as MuiMenu, MenuItem } from '@mui/material';

export default function Navbar() {
    const API_HOST = import.meta.env.VITE_API_HOST
    const { user, setUser } = useContext(UserContext);
    const { cart, cartDispatch } = useContext(CartContext);
    const [showMenu, setShowMenu] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeDiscountCategory, setActiveDiscountCategory] = useState(null);
    const [categories, setCategories] = useState({});
    const [discountCategories, setDiscountCategories] = useState({});
    const menuRef = useClickOutside(() => {
        setShowMenu(false);
        setActiveCategory(null);
        setActiveDiscountCategory(null);
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    useEffect(() => {
       async function fetchCategories() {
            try {
                const [subcategoriesRes, discountedRes] = await Promise.all([
                    fetch(`${API_HOST}/products/apii/productssubcategories`),
                    fetch(`${API_HOST}/products/apiii/discounted-products`)
                ]);

                const subcategories = subcategoriesRes.ok ? await subcategoriesRes.json() : {};
                const discounts = discountedRes.ok ? await discountedRes.json() : {};

                setCategories(subcategories);
                setDiscountCategories(discounts);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }

        fetchCategories();
    }, []);

    return (
        <div className="relative">
            <nav className="w-full flex justify-between items-center sticky top-0 z-40 px-4 py-3 bg-white border-b border-gray-200">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setShowMenu(!showMenu)} 
                        className="focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link to="/">
                        <h1 className="text-2xl font-bold">BRAND</h1>
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link to="/cart" className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        {cart.products.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {cart.products.length}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <UserDropDown 
                            user={user} 
                            onLogout={() => {
                                localStorage.clear();
                                setUser(null);
                                cartDispatch({ type: "RESET" });
                            }} 
                        />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <IconButton onClick={handleClick} size="small">
                                <AccountCircleIcon className="text-gray-700" style={{ fontSize: 32 }} />
                            </IconButton>

                            <MuiMenu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Link to="/login" className="text-gray-700">
                                        Login
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link to="/register" className="text-gray-700">
                                        Register
                                    </Link>
                                </MenuItem>
                            </MuiMenu>
                        </div>
                    )}
                </div>
            </nav>

            <div
                ref={menuRef}
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
                    showMenu ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button onClick={() => setShowMenu(false)} className="focus:outline-none">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="py-4">
                    <div className="px-4 py-2 text-red-500 font-semibold border-b border-gray-200">
                        <DiscountSection 
                            discountCategories={discountCategories}
                            activeCategory={activeDiscountCategory}
                            setActiveCategory={setActiveDiscountCategory}
                            onItemClick={() => setShowMenu(false)}
                        />
                    </div>

                    <div className="space-y-2 mt-4">
                        <CategoryLink 
                            to="/products"
                            onClick={() => setShowMenu(false)}
                        >
                            All Products
                        </CategoryLink>

                        <CategoryGroup
                            title="Men"
                            isActive={activeCategory === 'men'}
                            onClick={() => setActiveCategory(activeCategory === 'men' ? null : 'men')}
                            categories={categories.men || []}
                            baseUrl="/products/men"
                            onItemClick={() => setShowMenu(false)}
                        />

                        <CategoryGroup
                            title="Women"
                            isActive={activeCategory === 'women'}
                            onClick={() => setActiveCategory(activeCategory === 'women' ? null : 'women')}
                            categories={categories.women || []}
                            baseUrl="/products/women"
                            onItemClick={() => setShowMenu(false)}
                        />
                    </div>
                </div>
            </div>

            {showMenu && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}

function CategoryLink({ children, to, onClick, className = "" }) {
    return (
        <Link 
            to={to}
            onClick={onClick}
            className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 ${className}`}
        >
            {children}
        </Link>
    );
}

function CategoryGroup({ title, isActive, onClick, categories, baseUrl, onItemClick }) {
    return (
        <div>
            <button
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                onClick={onClick}
            >
                <span>{title}</span>
                <span className="transform transition-transform duration-200">
                    {isActive ? '−' : '+'}
                </span>
            </button>
            {isActive && (
                <div className="bg-gray-50 py-1 ml-4">
                    <CategoryLink
                        to={baseUrl}
                        onClick={onItemClick}
                        className="font-medium"
                    >
                        All {title}
                    </CategoryLink>
                    {categories.map((category, index) => (
                        <CategoryLink
                            key={index}
                            to={`${baseUrl}/${category}`}
                            onClick={onItemClick}
                            className="text-sm"
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </CategoryLink>
                    ))}
                </div>
            )}
        </div>
    );
}

function DiscountSection({ 
    discountCategories, 
    activeCategory, 
    setActiveCategory, 
    onItemClick 
}) {
    const navigate = useNavigate();

    const handleDiscountClick = (e) => {
        e.preventDefault();
        navigate('/discount');
        onItemClick();
    };

    return (
        <div>
            <Link 
                to="/discount" 
                className="block font-semibold text-gray-800 mb-2 hover:text-red-500"
                onClick={handleDiscountClick}
            >
                SPECIAL PRICES - UPTO 50% OFF
            </Link>

            {Object.entries(discountCategories).map(([gender, categories]) => (
                <div key={gender} className="mt-2">
                    <button
                        className={`w-full px-4 py-2 text-left flex justify-between items-center ${
                            activeCategory === gender ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
                        }`}
                        onClick={() => setActiveCategory(activeCategory === gender ? null : gender)}
                    >
                        <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                        <span>{activeCategory === gender ? '−' : '+'}</span>
                    </button>

                    {activeCategory === gender && (
                        <div className="ml-4">
                            <CategoryLink
                                to={`/discount/${gender}`}
                                onClick={onItemClick}
                                className="font-medium"
                            >
                                All {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </CategoryLink>
                            {categories.map((category, index) => (
                                <CategoryLink
                                    key={index}
                                    to={`/discount/${gender}/${category}`}
                                    onClick={onItemClick}
                                    className="text-sm"
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </CategoryLink>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
