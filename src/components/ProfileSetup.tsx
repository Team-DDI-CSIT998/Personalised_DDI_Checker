import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./profile.css";

type LocationState = {
  role: "doctor" | "patient";
};

interface ProfileData {
  fullName: string;
  phone: string;
  // doctor fields
  specialization?: string;
  qualifications?: string;
  experienceYears?: number;
  age?: number;
  gender?: string;
  // patient fields
  patientAge?: number;
  patientGender?: string;
  height?: number;
  weight?: number;
  address?: string;
  medicalHistory?: string;
}

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const role = (state as LocationState)?.role;
  const [form, setForm] = useState<ProfileData>({ fullName: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role, navigate]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]:
        e.target instanceof HTMLInputElement && e.target.type === "number"
          ? Number(value)
          : value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    console.log("Submitting profile update:", form, "for role:", role);

    // Check if a token exists; if not, tell the user they need to log in.
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      setSubmitting(false);
      return;
    }

    // Prepare profile data based on role
    const profileData =
      role === "doctor"
        ? { doctorProfile: { ...form } }
        : { patientProfile: { ...form } };

    try {
      const response = await fetch("http://localhost:5000/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profileData })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Profile update failed");
      }
      console.log("Profile update success:", data);
      toast.success("Profile updated successfully!");
      navigate(role === "doctor" ? "/MedMatchDoctorPortal" : "/PatientPortal");
    } catch (err: any) {
      console.error("Profile update error:", err.message);
      toast.error(err.message || "Profile update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-title">
          {role === "doctor" ? "Doctor Profile" : "Patient Profile"}
        </h2>
        <p className="profile-subtitle">
          Please complete your {role} profile to continue.
        </p>

        <form className="profile-form" onSubmit={onSubmit}>
          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={onChange}
              required
            />
          </div>

          {/* Doctor‑only Fields */}
          {role === "doctor" && (
            <>
                <div className="form-group">
                <label htmlFor="specialization">Specialization</label>
                <input
                    id="specialization"
                    type="text"
                    value={form.specialization || ""}
                    onChange={onChange}
                    required
                />
                </div>
                <div className="form-group">
                <label htmlFor="qualifications">Qualifications</label>
                <input
                    id="qualifications"
                    type="text"
                    value={form.qualifications || ""}
                    onChange={onChange}
                    required
                />
                </div>
                <div className="form-group">
                <label htmlFor="experienceYears">Years of Experience</label>
                <input
                    id="experienceYears"
                    type="number"
                    min="0"
                    value={form.experienceYears || ""}
                    onChange={onChange}
                />
                </div>
                <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                    id="age"
                    type="number"
                    min="18"
                    value={form.age || ""}
                    onChange={onChange}
                    required
                />
                </div>
                <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" value={form.gender || ""} onChange={onChange} required>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                </div>
            </>
            )}

          {/* Patient‑only Fields */}
          {role === "patient" && (
            <>
              <div className="form-group">
                <label htmlFor="patientAge">Age</label>
                <input
                  id="patientAge"
                  type="number"
                  min="0"
                  value={form.patientAge || ""}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="patientGender">Gender</label>
                <select
                  id="patientGender"
                  value={form.patientGender || ""}
                  onChange={onChange}
                >
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  id="height"
                  type="number"
                  min="0"
                  value={form.height || ""}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  type="number"
                  min="0"
                  value={form.weight || ""}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  type="text"
                  value={form.address || ""}
                  onChange={onChange}
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="medicalHistory">
                  Medical History (max 1000 words)
                </label>
                <textarea
                  id="medicalHistory"
                  rows={5}
                  maxLength={6000}
                  value={form.medicalHistory || ""}
                  onChange={onChange}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
