import React, { useState } from "react";
import MFASetup from "./MFASetup";
import MFAVerify from "./MFAVerify";
import MFAManage from "./MFAmanage";
import HomeLayout from "../../Layouts/HomeLayout";

export default function MFA() {
  const [view, setView] = useState("setup");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);

  // Handle MFA setup completion
  const handleMFASetup = (secret, codes) => {
    setSecret(secret);
    setBackupCodes(codes);
    setMfaEnabled(true);
    setView("manage");
  };

  // Handle MFA verification
  const handleVerify = async (code, isBackupCode) => {
    // In a real app, this would validate with your backend
    console.log(
      `Verifying ${
        isBackupCode ? "backup code" : "authentication code"
      }: ${code}`
    );

    // Mock successful verification
    return true;
  };

  // Handle MFA disable
  const handleDisable = async () => {
    setMfaEnabled(false);
    setSecret("");
    setBackupCodes([]);
  };

  // Handle backup codes reset
  const handleResetBackupCodes = async () => {
    // In a real app, this would generate new backup codes from your backend
    const generateBackupCodes = () => {
      const codes = [];
      for (let i = 0; i < 10; i++) {
        let code = "";
        for (let j = 0; j < 8; j++) {
          code += Math.floor(Math.random() * 10);
        }
        // Format as XXXX-XXXX
        codes.push(`${code.substring(0, 4)}-${code.substring(4)}`);
      }
      return codes;
    };

    const newCodes = generateBackupCodes();
    setBackupCodes(newCodes);
    return newCodes;
  };

  return (
    <HomeLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Navigation tabs */}
          <div className="bg-gray-800 rounded-t-lg shadow-md mb-4 flex">
            <button
              onClick={() => setView("setup")}
              className={`flex-1 py-3 text-center ${
                view === "setup"
                  ? "border-b-2 border-red-500 text-red-600 font-medium"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Setup
            </button>
            <button
              onClick={() => setView("verify")}
              className={`flex-1 py-3 text-center ${
                view === "verify"
                  ? "border-b-2 border-red-500 text-red-600 font-medium"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Verify
            </button>
            <button
              onClick={() => setView("manage")}
              className={`flex-1 py-3 text-center ${
                view === "manage"
                  ? "border-b-2 border-red-500 text-red-600 font-medium"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Manage
            </button>
          </div>

          {/* Component views */}
          {view === "setup" && (
            <MFASetup
              onComplete={handleMFASetup}
              onCancel={() => setView("manage")}
            />
          )}

          {view === "verify" && (
            <MFAVerify
              onVerify={handleVerify}
              onCancel={() => setView("manage")}
            />
          )}

          {view === "manage" && (
            <MFAManage
              isEnabled={mfaEnabled}
              onEnable={handleMFASetup}
              onDisable={handleDisable}
              onResetBackupCodes={handleResetBackupCodes}
            />
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
