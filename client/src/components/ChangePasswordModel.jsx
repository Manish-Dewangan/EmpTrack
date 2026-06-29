import { LockIcon,X } from "lucide-react"
import { useState } from "react"


const ChangePasswordModel = ({open, onClose, }) => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({type :"", text: ""})


    const handleSubmit = async (e)=> {
        e.preventDefault();
    }

    if(!open) return null

    return (
        <div  className='fixed inset-0  flex items-center justify-center p-4'>

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in" onClick={(e)=> e.stopPropagation()}>
                <div>
                    <div className=" flex items-center justify-between p-6 pb-0">
                        <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2"><LockIcon className="w-5 h-5 text-slate-600"/> Change Password</h2>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>

                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {message.text && (
                            <div className={`p-3 rounded-xl text-sm flex gap-3 ${message.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${message.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}/>
                                {message.text}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                            <input type="password" name="currentPassword" required placeholder="Enter your current password"/>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                            <input type="password" name="newPassword" required placeholder="Enter your new password"/>

                        </div>


                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center flex-1">
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <LockIcon className="w-4 h-4 mr-2"/>}
                                {loading ? "Updating" : "Update"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
            
        </div>
    )

    
}

export default ChangePasswordModel