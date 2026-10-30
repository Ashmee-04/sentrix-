import React, { useState } from 'react';
import {
  User,
  Heart,
  Users,
  ShieldCheck,
  Settings,
  Trash2,
  Plus,
  RefreshCw,
  Phone,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, TrustedContact, Role } from '../../types';
import { StorageService, INITIAL_USER } from '../../services/storage';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onRoleSwitch: (role: Role) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onRoleSwitch,
}) => {
  const [profile, setProfile] = useState<UserProfile>(user);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveUserProfile(profile);
    onUpdateUser(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      alert('Please provide contact name and phone number.');
      return;
    }

    const newContact: TrustedContact = {
      id: `c-${Date.now()}`,
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRel || 'Family',
      notifyOnSos: true,
      isVerified: true,
    };

    const updatedProfile = {
      ...profile,
      contacts: [...profile.contacts, newContact],
    };

    setProfile(updatedProfile);
    StorageService.saveUserProfile(updatedProfile);
    onUpdateUser(updatedProfile);

    setNewContactName('');
    setNewContactPhone('');
    setNewContactRel('');
  };

  const handleRemoveContact = (id: string) => {
    const updated = {
      ...profile,
      contacts: profile.contacts.filter((c) => c.id !== id),
    };
    setProfile(updated);
    StorageService.saveUserProfile(updated);
    onUpdateUser(updated);
  };

  const handleToggleNotify = (id: string) => {
    const updated = {
      ...profile,
      contacts: profile.contacts.map((c) =>
        c.id === id ? { ...c, notifyOnSos: !c.notifyOnSos } : c
      ),
    };
    setProfile(updated);
    StorageService.saveUserProfile(updated);
    onUpdateUser(updated);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2F5952] uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            Citizen Identity & Permissions
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">Profile & Emergency Settings</h2>
          <p className="text-xs sm:text-sm text-[#657780] mt-1">
            Manage your emergency contacts, medical ID card, and consent authorizations.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            Saved
          </span>
        )}
      </div>

      {/* Demo Persona Switcher */}
      <div className="bg-[#FAF8F2] border border-[#EBE3C8] rounded-3xl p-4 sm:p-5 text-xs space-y-2.5">
        <div className="font-bold text-[#6F5B24] flex items-center gap-1.5 text-xs uppercase tracking-wide">
          <Users className="w-4 h-4 text-[#A17C18]" />
          Quick Switch Persona (Demo & Evaluation Mode)
        </div>
        <p className="text-[11px] text-[#6F5B24] leading-relaxed">
          Switch user profile to test various roles across the Bengaluru safety and responder infrastructure:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => {
              setProfile(INITIAL_USER);
              onUpdateUser(INITIAL_USER);
              onRoleSwitch('citizen');
            }}
            className="cursor-pointer px-3 py-1.5 rounded-xl bg-white border border-[#E0D7BA] text-[#1E282D] font-bold text-xs hover:bg-[#FFFDF7] shadow-2xs"
          >
            Citizen: Priya Sharma (Indiranagar)
          </button>
          <button
            onClick={() => onRoleSwitch('responder')}
            className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#2F5952] text-white font-bold text-xs hover:bg-[#1E3B36] shadow-2xs"
          >
            Police Responder: Inspector Manjunath K. (BLR 112 Command)
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#1E282D] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#2F5952]" />
            1. Citizen Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              />
            </div>
            <div>
              <label className="block text-neutral-600 font-semibold mb-1">Phone Number (Emergency)</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              />
            </div>
            <div>
              <label className="block text-neutral-600 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              />
            </div>
            <div>
              <label className="block text-neutral-600 font-semibold mb-1">Home Ward / Locality</label>
              <input
                type="text"
                value={profile.homeWard}
                onChange={(e) => setProfile({ ...profile, homeWard: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              />
            </div>
          </div>
        </div>

        {/* Medical ID */}
        <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#1E282D] uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            2. Medical ID (Accessed by 108 Ambulance Responders)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-semibold mb-1">Blood Group</label>
              <select
                value={profile.bloodGroup}
                onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-neutral-600 font-semibold mb-1">Allergies</label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Peanuts, Latex"
                value={profile.allergies || ''}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-neutral-600 font-semibold mb-1">
                Medical Conditions / Inhaler / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Asthma, Diabetic, Pacemaker"
                value={profile.medicalNotes || ''}
                onChange={(e) => setProfile({ ...profile, medicalNotes: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              />
            </div>
          </div>
        </div>

        {/* Trusted Contacts Manager */}
        <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1E282D] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2F5952]" />
              3. Trusted Emergency Contacts ({profile.contacts.length})
            </h3>
          </div>

          <div className="space-y-2">
            {profile.contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3 rounded-2xl bg-[#FBFDFB] border border-[#E4EAE5] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#1E282D] flex items-center gap-2">
                    <span>{contact.name}</span>
                    <span className="text-[10px] font-normal text-neutral-500">
                      ({contact.relationship})
                    </span>
                  </div>
                  <div className="font-mono text-neutral-600 text-[11px] mt-0.5">
                    {contact.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] cursor-pointer text-neutral-600">
                    <input
                      type="checkbox"
                      checked={contact.notifyOnSos}
                      onChange={() => handleToggleNotify(contact.id)}
                      className="rounded text-[#2F5952] focus:ring-[#2F5952]"
                    />
                    <span>Notify on SOS</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveContact(contact.id)}
                    className="cursor-pointer p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Contact Row */}
          <div className="pt-2 border-t border-[#F2F5F3]">
            <span className="text-xs font-bold text-[#1E282D] block mb-2">Add New Contact</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="text-xs p-2 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9]"
              />
              <input
                type="text"
                placeholder="Phone (+91...)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="text-xs p-2 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Relationship"
                  value={newContactRel}
                  onChange={(e) => setNewContactRel(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9]"
                />
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="cursor-pointer px-3 py-2 rounded-xl bg-[#2F5952] hover:bg-[#1E3B36] text-white text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Permissions Consent */}
        <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#1E282D] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2F5952]" />
            4. Hardware Permissions & Revocable Consent
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAFBF9] border border-[#E4EAE5] cursor-pointer">
              <div>
                <span className="font-bold text-[#1E282D] block">GPS Geolocation Consent</span>
                <span className="text-[11px] text-neutral-500">
                  Allows SENTRIX to query live coordinates during emergency SOS and journey sharing.
                </span>
              </div>
              <input
                type="checkbox"
                checked={profile.consentLocation}
                onChange={(e) => setProfile({ ...profile, consentLocation: e.target.checked })}
                className="w-4 h-4 rounded text-[#2F5952] focus:ring-[#2F5952]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAFBF9] border border-[#E4EAE5] cursor-pointer">
              <div>
                <span className="font-bold text-[#1E282D] block">Microphone Speech-to-Text Consent</span>
                <span className="text-[11px] text-neutral-500">
                  Permits voice transcription for hands-free incident reporting.
                </span>
              </div>
              <input
                type="checkbox"
                checked={profile.consentMicrophone}
                onChange={(e) => setProfile({ ...profile, consentMicrophone: e.target.checked })}
                className="w-4 h-4 rounded text-[#2F5952] focus:ring-[#2F5952]"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full py-4 rounded-2xl bg-[#2F5952] hover:bg-[#1E3B36] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          SAVE PROFILE & EMERGENCY SETTINGS
        </button>
      </form>
    </div>
  );
};
