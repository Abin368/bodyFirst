import React, { useState } from 'react';
import Header from '@/components/common/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { signupVerifyOtp } from '@/services/authService';


export const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, role, fullName, password } = location.state || {};

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) return alert('Enter OTP');
    setLoading(true);
    try {
      const res = await signupVerifyOtp({ email, role, fullName, password, otp });

      alert(res.message);

      if (role === 'member') {
        navigate('/member/dashboard');
      } else {
        navigate('/owner/onboarding/step-1');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-20 p-5 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <Button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </div>
    </>
  );
};
