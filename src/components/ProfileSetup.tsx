import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";

type LocationState = {
  role: "doctor" | "patient";
};

interface ProfileData {
  fullName: string;
  phone: string;
  specialization?: string;
  qualifications?: string;
  experienceYears?: number;
  age?: number;
  gender?: string;
  patientAge?: number;
  patientGender?: string;
  height?: number;
  weight?: number;
  profileImage?: string;
}

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const role = (state as LocationState)?.role;

  const [form, setForm] = useState<ProfileData>({ fullName: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const defaultAvatars = {
    doctor: {
      male: "https://img.icons8.com/color/96/doctor-male.png",
      female: "https://img.icons8.com/color/96/doctor-female.png",
    },
    patient: {
      male: "https://img.icons8.com/color/96/user-male-circle.png",
      female: "https://img.icons8.com/color/96/user-female-circle.png",
    },
  };

  useEffect(() => {
    if (!role) navigate("/");
  }, [role, navigate]);

  useEffect(() => {
    const genderKey = role === "doctor" ? form.gender : form.patientGender;
  
    if (
      role &&
      genderKey &&
      (genderKey === "male" || genderKey === "female") &&
      !form.profileImage
    ) {
      const defaultImage =
        defaultAvatars[role as "doctor" | "patient"][
          genderKey as "male" | "female"
        ];
  
      setForm(prev => ({ ...prev, profileImage: defaultImage }));
      setPreviewImage(defaultImage);
    }
  }, [form.gender, form.patientGender, form.profileImage, role]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setForm(prev => ({ ...prev, profileImage: base64 }));
        setPreviewImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      setSubmitting(false);
      return;
    }

    const profileData =
      role === "doctor"
        ? {
            doctorProfile: {
              fullName: form.fullName,
              phone: form.phone,
              specialization: form.specialization,
              qualifications: form.qualifications,
              experienceYears: form.experienceYears,
              age: form.age,
              gender: form.gender,
              profileImage: form.profileImage,
            },
          }
        : {
            patientProfile: {
              fullName: form.fullName,
              phone: form.phone,
              age: form.patientAge,
              gender: form.patientGender,
              height: form.height,
              weight: form.weight,
              profileImage: form.profileImage,
            },
          };


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
      if (!response.ok) throw new Error(data.error || "Profile update failed");
      toast.success("Profile updated successfully!");
      navigate(role === "doctor" ? "/MedMatchDoctorPortal" : "/PatientPortal");
    } catch (err: any) {
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
        <p className="profile-subtitle">Please complete your {role} profile to continue.</p>

        <form className="profile-form" onSubmit={onSubmit}>
          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" value={form.fullName} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" type="tel" value={form.phone} onChange={onChange} required />
          </div>

          {/* Doctor Fields */}
          {role === "doctor" && (
            <>
              <div className="form-group">
                <label htmlFor="specialization">Specialization</label>
                <input id="specialization" type="text" value={form.specialization || ""} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="qualifications">Qualifications</label>
                <input id="qualifications" type="text" value={form.qualifications || ""} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="experienceYears">Years of Experience</label>
                <input id="experienceYears" type="number" min="0" value={form.experienceYears || ""} onChange={onChange} />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input id="age" type="number" min="18" value={form.age || ""} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" value={form.gender || ""} onChange={onChange} required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {/* Upload and Preview */}
              <div className="form-group">
                <label>Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
            </>
          )}

          {/* Patient Fields */}
          {role === "patient" && (
            <>
              <div className="form-group">
                <label htmlFor="patientAge">Age</label>
                <input id="patientAge" type="number" min="0" value={form.patientAge || ""} onChange={onChange} />
              </div>
              <div className="form-group">
                <label htmlFor="patientGender">Gender</label>
                <select id="patientGender" value={form.patientGender || ""} onChange={onChange}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input id="height" type="number" min="0" value={form.height || ""} onChange={onChange} />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input id="weight" type="number" min="0" value={form.weight || ""} onChange={onChange} />
              </div>
              {/* Upload and Preview */}
              <div className="form-group">
                <label>Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
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
