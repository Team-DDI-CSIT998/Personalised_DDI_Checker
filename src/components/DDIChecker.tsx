import React, { useState } from "react";
import { TextField, PrimaryButton } from "@fluentui/react";
import "./DDIChecker.css";

const DDIChecker: React.FC = () => {
  const [medications, setMedications] = useState<string[]>([""]);

  const addMedication = () => {
    setMedications([...medications, ""]);
  };

  return (
    <div className="ddi-checker">
      <h2>DDI Checker</h2>
      {medications.map((_, index) => (
        <TextField 
          key={index} 
          placeholder="Write medicine name" 
          onChange={(e, newValue) => {
            const updatedMedications = [...medications];
            updatedMedications[index] = newValue || "";
            setMedications(updatedMedications);
          }} 
        />
      ))}
      <div className="button-group">
        <PrimaryButton onClick={addMedication} className="add-button">
          Add Medicine
        </PrimaryButton>
        <PrimaryButton className="check-button">Check Interactions</PrimaryButton>
      </div>
    </div>
  );
};

export default DDIChecker;
