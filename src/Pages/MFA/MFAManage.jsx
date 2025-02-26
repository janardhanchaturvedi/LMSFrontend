import React, { useState } from 'react';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import MFASetup from './MFASetup';


const MFAManage = ({ 
  isEnabled, 
  onEnable, 
  onDisable,
  onResetBackupCodes
}) => {
  const [showSetup, setShowSetup] = useState(false);
  const [showConfirmDisable, setShowConfirmDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resettingCodes, setResettingCodes] = useState(false);
  const [newBackupCodes, setNewBackupCodes] = useState([]);
  
  const handleEnable = (secret, backupCodes) => {
    if (onEnable) {
      onEnable(secret, backupCodes);
    }
    setShowSetup(false);
  };
  
  const handleDisable = async () => {
    setLoading(true);
    
    try {
      if (onDisable) {
        await onDisable();
      }
      setShowConfirmDisable(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetBackupCodes = async () => {
    if (!onResetBackupCodes) return;
    
    setResettingCodes(true);
    
    try {
      const newCodes = await onResetBackupCodes();
      setNewBackupCodes(newCodes);
    } finally {
      setResettingCodes(false);
    }
  };
  
  if (showSetup) {
    return (
      <MFASetup 
        onComplete={handleEnable}
        onCancel={() => setShowSetup(false)}
      />
    );
  }
  
  if (showConfirmDisable) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-700">
        <div className="mb-6 flex justify-center">
          <AlertTriangle className="h-12 w-12 text-yellow-400" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Disable two-factor authentication?</h2>
        
        <p className="mb-6 text-gray-300">
          This will make your account less secure. Without two-factor authentication, you'll only need your password to sign in.
        </p>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleDisable}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              loading ? 'bg-red-800 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            } text-white flex items-center justify-center`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Disable two-factor authentication'
            )}
          </button>
          
          <button
            onClick={() => setShowConfirmDisable(false)}
            disabled={loading}
            className="w-full py-2 px-4 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  
  if (newBackupCodes.length > 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">New backup codes</h2>
        <p className="mb-6 text-gray-300">
          Your old backup codes are no longer valid. Save these new codes in a safe place.
          Each code can only be used once.
        </p>
        
        <div className="mb-6 grid grid-cols-2 gap-2">
          {newBackupCodes.map((code, index) => (
            <div key={index} className="bg-gray-700 p-2 rounded text-center font-mono text-gray-300 border border-gray-600">
              {code}
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            <strong className="text-gray-300">Important:</strong> Store these codes in a safe place. You won't be able to view them again.
          </p>
        </div>
        
        <button
          onClick={() => setNewBackupCodes([])}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          I've saved these codes
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-700">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-red-400 mr-3" />
        <h2 className="text-2xl font-bold text-white">Two-factor authentication</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className={`h-4 w-4 rounded-full mr-2 ${isEnabled ? 'bg-green-500' : 'bg-gray-600'}`}></div>
          <span className="font-medium text-white">{isEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
        <p className="text-gray-300">
          {isEnabled 
            ? 'Your account is protected with two-factor authentication.' 
            : 'Add an extra layer of security to your account by enabling two-factor authentication.'}
        </p>
      </div>
      
      {isEnabled ? (
        <div className="space-y-4">
          <button
            onClick={() => setShowConfirmDisable(true)}
            className="w-full py-2 px-4 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
          >
            Disable two-factor authentication
          </button>
          
          {onResetBackupCodes && (
            <button
              onClick={handleResetBackupCodes}
              disabled={resettingCodes}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                resettingCodes ? 'bg-red-800 cursor-not-allowed text-gray-400' : 'bg-red-600 hover:bg-red-700 text-white'
              } flex items-center justify-center`}
            >
              {resettingCodes ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Generating new codes...
                </>
              ) : (
                'Generate new backup codes'
              )}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowSetup(true)}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Enable two-factor authentication
        </button>
      )}
    </div>
  );
};

export default MFAManage;