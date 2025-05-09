import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = () => {
  const [step, setStep] = useState('login'); // 'login' | 'signup' | 'otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [birthday, setBirthday] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        // handle token/data
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone_number: phoneNumber,
          gender,
          birthday,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Assume server returns an OTP or triggers send
        setGeneratedOtp(data.otp || null);
        setStep('otp');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Verification successful! You can now log in.');
        setStep('login');
        setName(''); setEmail(''); setPassword('');
        setPhoneNumber(''); setGender('Male'); setBirthday('');
        setOtp(''); setGeneratedOtp(null);
      } else {
        alert(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };
  return (
    <div className="auth-container">
      {step === 'login' && (
        <>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <div className="auth-toggle">
            Don't have an account? <span onClick={() => setStep('signup')}>Sign up</span>
          </div>
        </>
      )}

      {step === 'signup' && (
        <>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
            <button type="submit">Register & Send OTP</button>
          </form>
          <div className="auth-toggle">
            Already have an account? <span onClick={() => setStep('login')}>Login</span>
          </div>
        </>
      )}

      {step === 'otp' && (
        <>
          <h2>Verify OTP</h2>
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            <button type="submit">Verify</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AuthForm;