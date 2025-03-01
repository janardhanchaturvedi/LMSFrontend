import React, { useState, useEffect } from "react";
import { Copy, Check, RefreshCw, Smartphone, Shield, Key } from "lucide-react";
import axios from "axios";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const MFASetup = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState("intro");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [qrcode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({
    enableMFA: false,
    qrCode: false,
    backupCodes: false,
  });

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    setLoading(true);

    try {
      const response = axiosInstance.post("user/verify-mfa", {
        verificationCode,
      });
      toast.promise(response, {
        loading: "Verifying your message...",
        success: "Verification successful",
        error: "Failed to verify the message",
      });
      setLoading(false);
      setError("");
    } catch (error) {
      console.log("🚀 ~ handleVerify ~ error:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(secret, backupCodes);
    }
    setStep("success");
  };

  const handleEnableMFA = async () => {
    try {
      const response = axiosInstance.post("user/enable-mfa");
      toast.promise(response, {
        loading: "Submitting your message...",
        success: "Form submitted successfully",
        error: "Failed to submit the form",
      });
      const responseQRSecret = await response;
      console.log("🚀 ~ handleEnableMFA ~ responseQRSecret:", responseQRSecret);
      setStep("qrcode");
      setCompletedSteps((prev) => ({ ...prev, enableMFA: true }));
      setSecret(responseQRSecret.data.secret);
      setQrCode(responseQRSecret.data.qrCodeUrl);
    } catch (error) {
      console.log("🚀 ~ handleEnableMFA ~ error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  const renderIntro = () => (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <Shield className="h-16 w-16 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-white">
        Enhance Your Account Security
      </h2>
      <p className="mb-6 text-gray-300">
        Two-factor authentication adds an extra layer of security to your
        account. After you enter your password, you'll need to provide a code
        from your authenticator app.
      </p>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => handleEnableMFA()}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Set up two-factor authentication
        </button>
        <button
          onClick={onCancel}
          className="w-full py-2 px-4 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );

  const renderQRCode = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">
        Set up authenticator app
      </h2>
      <p className="mb-6 text-gray-300">
        Scan the QR code below with your authenticator app, or enter the setup
        key manually.
      </p>

      <div className="mb-6 bg-gray-700 p-4 rounded-lg flex justify-center">
        {/* This would be a real QR code in production */}
        <div className="w-48 h-48 bg-gray-800 p-4 border border-gray-600 rounded-md flex items-center justify-center">
          {!qrcode ? (
            <p className="text-gray-400 text-sm text-center">
              QR Code would appear here
              <br />
              (In a real app, this would be generated based on the secret key)
            </p>
          ) : (
            <>
              <img src={qrcode} alt="QR Code" />
            </>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Setup key
        </label>
        <div className="flex">
          <input
            type="text"
            readOnly
            value={secret}
            className="flex-grow px-3 py-2 border border-gray-600 rounded-l-md bg-gray-700 text-gray-300"
          />
          <button
            onClick={handleCopySecret}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 border border-gray-600 border-l-0 rounded-r-md hover:bg-gray-500 transition-colors"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <Copy className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Enter this key into your authenticator app if you can't scan the QR
          code.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={() => {
            setStep("verify");
            setCompletedSteps((prev) => ({ ...prev, qrCode: true }));
          }}
          disabled={!completedSteps.MFASetup}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Next
        </button>
        <button
          onClick={() => setStep("intro")}
          className="w-full py-2 px-4 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderVerify = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Verify setup</h2>
      <p className="mb-6 text-gray-300">
        Enter the 6-digit verification code from your authenticator app to
        confirm setup.
      </p>

      <div className="mb-6">
        <label
          htmlFor="verification-code"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Verification code
        </label>
        <input
          id="verification-code"
          type="text"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setVerificationCode(value);
            setError("");
          }}
          className={`w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-600"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-gray-200`}
          placeholder="123456"
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={handleVerify}
          disabled={loading || verificationCode.length !== 6}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            loading || verificationCode.length !== 6
              ? "bg-red-800 cursor-not-allowed text-gray-400"
              : "bg-red-600 hover:bg-red-700 text-white"
          } flex items-center justify-center`}
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </button>
        <button
          onClick={() => setStep("qrcode")}
          disabled={loading}
          className="w-full py-2 px-4 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderBackupCodes = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Save backup codes</h2>
      <p className="mb-6 text-gray-300">
        If you lose access to your authenticator app, you can use one of these
        backup codes to sign in. Each code can only be used once.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-2">
        {backupCodes.map((code, index) => (
          <div
            key={index}
            className="bg-gray-700 p-2 rounded text-center font-mono text-gray-300 border border-gray-600"
          >
            {code}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-400">
          <strong className="text-gray-300">Important:</strong> Store these
          codes in a safe place. You won't be able to view them again.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={handleComplete}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          I've saved these codes
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <Check className="h-16 w-16 text-green-400" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-white">
        Two-factor authentication enabled
      </h2>
      <p className="mb-6 text-gray-300">
        Your account is now protected with an additional layer of security.
        You'll need to enter a verification code from your authenticator app
        when you sign in.
      </p>
      <button
        onClick={onCancel}
        className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-700">
      {step === "intro" && renderIntro()}
      {step === "qrcode" && renderQRCode()}
      {step === "verify" && renderVerify()}
      {step === "backup" && renderBackupCodes()}
      {step === "success" && renderSuccess()}
    </div>
  );
};

export default MFASetup;
