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
      <input
        type="text"
        placeholder="Medicine Name"
        value={medicine.name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      <input
        type="text"
        placeholder="Dosage"
        value={medicine.dosage}
        onChange={(e) => onChange('dosage', e.target.value)}
      />
      <input
        type="text"
        placeholder="Frequency"
        value={medicine.frequency || ''}
        onChange={(e) => onChange('frequency', e.target.value)}
      />
      <input
        type="text"
        placeholder="Duration"
        value={medicine.duration || ''}
        onChange={(e) => onChange('duration', e.target.value)}
      />
      <button onClick={onSave} disabled={saveDisabled}>Save</button>
      <button onClick={onCancel} className="cancel-btn">Cancel</button>
    </div>
  );
};

export default MedicineForm;
