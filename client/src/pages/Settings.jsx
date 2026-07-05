import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Lock, Moon, Sun } from "lucide-react";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordModel from "../components/ChangePasswordModel";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import toast from "react-hot-toast";


const Settings = () => {

  const {user} = useAuth()
  const {theme, toggleTheme} = useTheme()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile')
      const profile = res.data
      if(profile){
        setProfile(profile)
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  if (loading) return <Loading />

  return <div className="animate-fade-in">
    <div className="page-header">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Manage your account and preferences</p>
    </div>

    {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile}/>}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Change Password trigger */}
      <div className="card p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <Lock className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Password</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password</p>
          </div>
        </div>
        <button onClick={() => setShowPasswordModal(true)} className="btn-secondary text-sm">
          Change
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="card p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
            {theme === "light" ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">App Theme</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Toggle light or dark mode</p>
          </div>
        </div>
        <button onClick={toggleTheme} className="btn-secondary text-sm flex items-center gap-2">
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </div>

    <ChangePasswordModel open={showPasswordModal} onClose={()=> setShowPasswordModal(false)}/>
  </div>;
};

export default Settings;
