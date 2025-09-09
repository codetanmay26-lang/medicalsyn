import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from './components/WelcomeHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import TestCredentials from './components/TestCredentials';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'doctor',
    rememberMe: false
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole) {
      redirectToRoleDashboard(userRole);
    }
  }, []);

  const redirectToRoleDashboard = (role) => {
    const roleRoutes = {
      doctor: '/doctor-dashboard',
      patient: '/patient-portal',
      pharmacy: '/pharmacy-dashboard',
      admin: '/admin-analytics'
    };
    
    navigate(roleRoutes?.[role] || '/doctor-dashboard');
  };

  const validateCredentials = (credentials) => {
    const validAccounts = {
      'doctor@healthsync.com': { password: 'doctor123', role: 'doctor' },
      'patient@healthsync.com': { password: 'patient123', role: 'patient' },
      'pharmacy@healthsync.com': { password: 'pharmacy123', role: 'pharmacy' },
      'admin@healthsync.com': { password: 'admin123', role: 'admin' }
    };

    const account = validAccounts?.[credentials?.email?.toLowerCase()];
    
    if (!account) {
      return { isValid: false, message: 'Invalid email address. Please use demo credentials.' };
    }
    
    if (account?.password !== credentials?.password) {
      return { isValid: false, message: 'Invalid password. Please check your credentials.' };
    }
    
    if (account?.role !== credentials?.role) {
      return { isValid: false, message: `This email is registered for ${account?.role} role, not ${credentials?.role}.` };
    }
    
    return { isValid: true, role: account?.role };
  };

  const handleLogin = async (loginData) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate credentials
      const validation = validateCredentials(loginData);
      
      if (!validation?.isValid) {
        setError(validation?.message);
        setIsLoading(false);
        return;
      }

      // Store authentication data
      const authToken = `jwt_token_${Date.now()}_${validation?.role}`;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userRole', validation?.role);
      localStorage.setItem('userEmail', loginData?.email);
      localStorage.setItem('sessionStart', new Date()?.toISOString());
      
      if (loginData?.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect to appropriate dashboard
      redirectToRoleDashboard(validation?.role);
      
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  const handleCredentialSelect = (credentials) => {
    setFormData(credentials);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <WelcomeHeader />
            
            <div className="bg-surface border border-border rounded-xl shadow-medical-md p-8">
              <LoginForm
                onLogin={handleLogin}
                isLoading={isLoading}
                error={error}
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            <TestCredentials onCredentialSelect={handleCredentialSelect} />
          </div>
        </div>

        {/* Right Panel - Security Information */}
        <div className="hidden lg:flex lg:w-96 bg-muted/30 border-l border-border">
          <div className="flex items-center justify-center p-8 w-full">
            <div className="w-full max-w-sm">
              <SecurityBadges />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Security Badges */}
      <div className="lg:hidden bg-surface border-t border-border p-6">
        <SecurityBadges />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg shadow-medical-md p-6 flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-text-primary font-medium">Signing you in...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;