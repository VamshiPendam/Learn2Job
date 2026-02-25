
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
   const { user, updateUser, token } = useAuth();
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState({
      username: user?.username || '',
      title: user?.title || 'AI Enthusiast',
      about: user?.about || 'Exploring the frontiers of Artificial Intelligence.',
      profileImage: user?.profileImage || ''
   });
   const [isLoading, setIsLoading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setFormData({ ...formData, profileImage: reader.result as string });
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSave = async () => {
      setIsLoading(true);
      try {
         const response = await fetch('/api/auth/update-profile', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'x-auth-token': token || ''
            },
            body: JSON.stringify(formData)
         });

         const updatedUser = await response.json();

         if (!response.ok) {
            throw new Error(updatedUser.message || 'Failed to update profile');
         }

         updateUser({ ...user, ...updatedUser }); // Merge mostly to keep ID if needed, though backend returns full obj usually
         setIsEditing(false);
      } catch (error) {
         console.error("Error updating profile:", error);
         alert("Failed to update profile. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
         <div className="w-full max-w-2xl bg-gradient-to-br from-[#131b21] to-[#0a0f12] p-12 rounded-3xl border border-[#1e293b] flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden shadow-2xl">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full flex justify-end absolute top-6 right-6">
               <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={isLoading}
                  className={`${isEditing ? 'bg-green-500 text-white' : 'bg-[#0a0f12] text-primary border border-primary/30 hover:bg-primary/10'} px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all`}
               >
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : isEditing ? 'fa-save' : 'fa-edit'}`}></i>
                  <span>{isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
               </button>
            </div>

            <div className="relative group mt-4">
               <img
                  src={formData.profileImage || `https://ui-avatars.com/api/?name=${formData.username}&background=0D8ABC&color=fff`}
                  alt="Avatar"
                  className="w-40 h-40 rounded-3xl border-4 border-[#1e293b] p-1 object-cover shadow-lg"
               />

               {isEditing && (
                  <>
                     <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                     >
                        <i className="fas fa-camera text-white text-3xl"></i>
                     </div>
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                     />
                  </>
               )}

               <div className={`absolute -bottom-3 -right-3 w-8 h-8 rounded-full border-4 border-[#131b21] ${isEditing ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            </div>

            <div className="w-full max-w-md space-y-6">
               {isEditing ? (
                  <div className="space-y-4">
                     <div className="space-y-1 text-left">
                        <label className="text-xs text-gray-500 font-bold ml-1 uppercase tracking-wider">Username</label>
                        <input
                           type="text"
                           name="username"
                           value={formData.username}
                           onChange={handleInputChange}
                           className="w-full bg-[#0a0f12] border border-[#1e293b] rounded-xl px-4 py-3 text-white font-bold text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                           placeholder="Username"
                        />
                     </div>
                     <div className="space-y-1 text-left">
                        <label className="text-xs text-gray-500 font-bold ml-1 uppercase tracking-wider">Job Title</label>
                        <input
                           type="text"
                           name="title"
                           value={formData.title}
                           onChange={handleInputChange}
                           className="w-full bg-[#0a0f12] border border-[#1e293b] rounded-xl px-4 py-3 text-primary text-sm font-bold text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none tracking-widest uppercase transition-all placeholder-gray-700"
                           placeholder="Job Title"
                        />
                     </div>
                  </div>
               ) : (
                  <div className="text-center">
                     <h3 className="text-4xl font-black text-white">{user?.username}</h3>
                     <p className="text-primary font-bold tracking-[0.2em] uppercase text-sm mt-2">{user?.title || 'AI Enthusiast'}</p>
                  </div>
               )}
            </div>

            <div className="w-full max-w-md">
               {isEditing ? (
                  <div className="space-y-1 text-left">
                     <label className="text-xs text-gray-500 font-bold ml-1 uppercase tracking-wider">Bio</label>
                     <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        className="w-full bg-[#0a0f12] border border-[#1e293b] rounded-xl px-4 py-3 text-gray-400 text-sm text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all placeholder-gray-700"
                        rows={4}
                        placeholder="Tell us about yourself..."
                     />
                  </div>
               ) : (
                  <div className="px-8 py-6 bg-[#0a0f12]/50 border border-[#1e293b] rounded-2xl text-base text-gray-400 leading-relaxed max-w-lg mx-auto backdrop-blur-sm">
                     "{user?.about || 'No bio yet.'}"
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default Profile;
