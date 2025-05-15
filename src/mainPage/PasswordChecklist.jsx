import React from 'react';
import PasswordChecklist from 'react-password-checklist';

const PasswordChecklistComponent = ({ password, confirmPassword }) => {
  return (
    <PasswordChecklist
      rules={['minLength', 'specialChar', 'number', 'capital']}
      minLength={8}
      value={password}
      valueAgain={confirmPassword}
      messages={{
        minLength: 'At least 8 characters.',
        specialChar: 'At least 1 special character.',
        number: 'At least 1 number.',
        capital: 'At least 1 capitalized character.',
      }}
    />
  );
};

export default PasswordChecklistComponent;
