import React from 'react';

interface MedicineFormProps {
  medicine: {
    name: string;
    dosage: string;
    frequency?: string;
    duration?: string;
  };
  onChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saveDisabled?: boolean;
}

const MedicineForm: React.FC<MedicineFormProps> = ({
  medicine,
  onChange,
  onSave,
  onCancel,
  saveDisabled = false,
}) => {
  return (
    <div className="medicine-form">
      <div className="form-group">
        <label>Medicine Name</label>
        <input
          type="text"
          placeholder="e.g., Paracetamol"
          value={medicine.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Dosage</label>
        <input
          type="text"
          placeholder="e.g., 500 mg"
          value={medicine.dosage}
          onChange={(e) => onChange('dosage', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Frequency</label>
        <input
          type="text"
          placeholder="e.g., Twice daily"
          value={medicine.frequency || ''}
          onChange={(e) => onChange('frequency', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Duration</label>
        <input
          type="text"
          placeholder="e.g., 5 days"
          value={medicine.duration || ''}
          onChange={(e) => onChange('duration', e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={onCancel} className="cancel-btn">Cancel</button>
        <button onClick={onSave} disabled={saveDisabled}>Save</button>
      </div>
    </div>
  );
};

export default MedicineForm;
