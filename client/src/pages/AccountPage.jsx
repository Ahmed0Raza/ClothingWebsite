import React, { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import clsx from "clsx"
import { Edit2, User, Mail, Lock, ChevronRight, Package, ShoppingCart, LogOut } from "react-feather"
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { UserContext, CartContext } from '@/App'
import Container from "@/components/Container"
import Input from "@/components/Input"
import Button from "@/components/Button"
import api from '@/api'

export default function AccountPage() {
  const navigate = useNavigate()
  const {user, setUser} = useContext(UserContext)
  const {cartDispatch} = useContext(CartContext)
  const [showEditForm, setShowEditForm] = useState(false)
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    console.log('Form submission started with data:', {
      fullname: formData.fullname,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
      passwordsMatch: formData.newPassword === formData.confirmPassword
    })
  
    if (formData.newPassword !== formData.confirmPassword) {
      console.error("Validation failed: Passwords don't match", {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })
      return
    }
  
    try {
      console.log('Calling updateUser with:', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        fullname: formData.fullname
      })
      const result = await api.updateUser(
        formData.currentPassword,
        formData.newPassword,
        formData.fullname
      )
      console.log('Update successful, received result:', result)
      
      setUser(prevUser => {
        console.log('Updating user context:', {
          previousFullname: prevUser.fullname,
          newFullname: result.fullname,
          entirePrevUser: prevUser,
          entireNewResult: result
        })
        return {
          ...prevUser,
          fullname: result.fullname
        }
      })
      
      setShowEditForm(false)
      console.log('Resetting form with data:', {
        newFullname: result.fullname,
        clearedPassword: '',
      })
      setFormData({
        fullname: result.fullname,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      console.log('Form reset complete')
      
    } catch (error) {
      console.error("Update failed with error:", {
        error,
        formData
      })
    }
  }

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <main className="min-h-screen bg-white py-2">
      <Container heading="Your Account" type="page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <section className="flex flex-col items-center text-center space-y-3 p-6">
            <div className={clsx(
              "h-20 w-20 overflow-hidden mb-4",
              "sm:w-24 sm:h-24",
              "focus:ring-1 ring-black outline-none"
            )}>
              <AccountCircleIcon className="text-black" style={{ fontSize: 86 }} />
            </div>
            {showEditForm ? (
              <form 
                className="flex flex-col gap-3 w-full max-w-sm"
                onSubmit={handleEdit}
              >
                <Input 
                  icon={<User />} 
                  type="text" 
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Full name"
                />
                <Input 
                  icon={<Mail />} 
                  type="email" 
                  value={user.email} 
                  disabled 
                />
                <Input 
                  icon={<Lock />} 
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Current Password" 
                />
                <Input 
                  icon={<Lock />} 
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="New Password" 
                />
                <Input 
                  icon={<Lock />} 
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm New Password" 
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button 
                    secondary 
                    onClick={() => {
                      setShowEditForm(false)
                      setFormData({
                        fullname: user.fullname,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      })
                    }}
                    className="bg-white text-black border border-black hover:bg-black hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-black text-white hover:bg-white hover:text-black hover:border-black border border-transparent"
                  >
                    Update
                  </Button>
                </div>
              </form>
            ) : (
              <div className="w-full">
                <div className="mb-4">
                  <h3 className="text-xl font-normal text-black mb-1">{user.fullname}</h3>
                  <span className="text-black/70">{user.email}</span>
                </div>
                <Button 
                  secondary 
                  onClick={() => {
                    setShowEditForm(true)
                    setFormData(prev => ({
                      ...prev,
                      fullname: user.fullname
                    }))
                  }}
                  className="bg-white text-black border border-black hover:bg-black hover:text-white"
                >
                  <Edit2 width={10} height={10} className="mr-2" />Edit
                </Button>
              </div>
            )}
          </section>
          <section className="px-6 py-2">
            <ul className="max-w-sm mx-auto space-y-2">
              <AccountLink to="/orders">
                <Package className="mr-2" width={18} />My Orders
              </AccountLink>
              <AccountLink to="/cart">
                <ShoppingCart className="mr-2" width={18} />My Shopping Cart
              </AccountLink>
              <AccountLink to="mailto:contact@brand.com">
                <Mail className="mr-2" width={18} />Need Help? Contact Us
              </AccountLink>
              <AccountLink 
                to="/" 
                onClick={() => {
                  api.logoutUser()
                  setUser(null)
                  cartDispatch({type: "RESET"})
                }}
              >
                <LogOut className="mr-2" width={18} />Log out from this Account
              </AccountLink>
            </ul>
          </section>
        </div>
      </Container>
    </main>
  )
}

function AccountLink({ children, ...props }) {
  return (
    <Link {...props}>
      <li className={clsx(
        "flex items-center",
        "px-4 py-3",
        "text-black bg-white", 
        "border border-black/10",
        "hover:border-black transition-colors duration-200",
      )}>
        {children}
        <ChevronRight className="ml-auto" width={18} />
      </li>
    </Link>
  )
}