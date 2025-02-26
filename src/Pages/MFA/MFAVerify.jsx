import React, { useState } from 'react';
import { RefreshCw, Key } from 'lucide-react';


const MFAVerify = ({ onVerify, onCancel }) => {
  const [code, setCode] = useState('');
  const [isBackupCode, setIsBackupCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code) {
      setError('Please enter a verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would validate the code with your backend
      const success = await onVerify(code, isBackupCode);
      
      if (!success) {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-700">
      <div className="mb-6 flex justify-center">
        <Key className="h-12 w-12 text-red-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Two-factor authentication</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="verification-code" className="block text-sm font-medium text-gray-300 mb-2">
            {isBackupCode ? 'Backup code' : 'Authentication code'}
          </label>
          <input
            id="verification-code"
            type="text"
            value={code}
            onChange={(e) => {
              setCode(isBackupCode ? e.target.value : e.target.value.replace(/\D/g, '').substring(0, 6));
              setError('');
            }}
            maxLength={isBackupCode ? 9 : 6}
            placeholder={isBackupCode ? "XXXX-XXXX" : "123456"}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-gray-600'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-gray-200`}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsBackupCode(!isBackupCode)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              {isBackupCode 
                ? "Use authentication code instead" 
                : "Use a backup code instead"}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            disabled={loading || (!isBackupCode && code.length !== 6) || (isBackupCode && !code)}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              loading || (!isBackupCode && code.length !== 6) || (isBackupCode && !code)
                ? 'bg-red-800 cursor-not-allowed text-gray-400'
                : 'bg-red-600 hover:bg-red-700 text-white'
            } flex items-center justify-center`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-full py-2 px-4 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MFAVerify;