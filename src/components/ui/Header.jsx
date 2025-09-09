import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'doctor', userName = 'Dr. Sarah Johnson', isCollapsed = false, onToggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleBasedNavigation = () => {
    switch (userRole) {
      case 'doctor':
        return [
          { label: 'Dashboard', path: '/doctor-dashboard', icon: 'Activity' },
          { label: 'Patients', path: '/patient-profile', icon: 'Users' },
          { label: 'Analytics', path: '/admin-analytics', icon: 'BarChart3' },
        ];
      case 'patient':
        return [
          { label: 'My Portal', path: '/patient-portal', icon: 'User' },
          { label: 'Medications', path: '/patient-portal', icon: 'Pill' },
        ];
      case 'pharmacy':
        return [
          { label: 'Dashboard', path: '/pharmacy-dashboard', icon: 'Package' },
          { label: 'Inventory', path: '/pharmacy-dashboard', icon: 'Archive' },
        ];
      case 'admin':
        return [
          { label: 'Analytics', path: '/admin-analytics', icon: 'BarChart3' },
          { label: 'Users', path: '/admin-analytics', icon: 'Users' },
        ];
      default:
        return [];
    }
  };

  const getSecondaryNavigation = () => {
    return [
      { label: 'Settings', path: '/settings', icon: 'Settings' },
      { label: 'Help', path: '/help', icon: 'HelpCircle' },
      { label: 'Support', path: '/support', icon: 'MessageCircle' },
    ];
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const primaryNav = getRoleBasedNavigation();
  const secondaryNav = getSecondaryNavigation();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-1000">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="Heart" size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-text-primary">HealthSync</span>
              <span className="text-xs text-text-secondary">Healthcare Management</span>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {primaryNav?.map((item) => (
              <Button
                key={item?.path}
                variant="ghost"
                size="sm"
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                onClick={() => handleNavigation(item?.path)}
                className="text-text-secondary hover:text-text-primary hover:bg-muted transition-medical"
              >
                {item?.label}
              </Button>
            ))}

            {/* More Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
                iconSize={16}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="text-text-secondary hover:text-text-primary hover:bg-muted transition-medical"
              >
                More
              </Button>

              {showMoreMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-medical-md z-1020">
                  <div className="py-1">
                    {secondaryNav?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => {
                          handleNavigation(item?.path);
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-medical"
                      >
                        <Icon name={item?.icon} size={16} className="mr-2" />
                        {item?.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Section - Time and User */}
        <div className="flex items-center space-x-4">
          {/* Current Time */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-text-primary">
              {currentTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-xs text-text-secondary">
              {currentTime?.toLocaleDateString()}
            </span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-medical"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-text-primary">{userName}</span>
                <span className="text-xs text-text-secondary capitalize">{userRole}</span>
              </div>
              <Icon name="ChevronDown" size={16} className="text-text-secondary" />
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-medical-md z-1020">
                <div className="py-1">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">{userName}</p>
                    <p className="text-xs text-text-secondary capitalize">{userRole} Account</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleNavigation('/profile');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-medical"
                  >
                    <Icon name="User" size={16} className="mr-2" />
                    Profile Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      handleNavigation('/preferences');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-medical"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Preferences
                  </button>
                  
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-error/10 transition-medical"
                    >
                      <Icon name="LogOut" size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            iconName="Menu"
            iconSize={20}
            onClick={onToggleSidebar}
            className="md:hidden text-text-secondary hover:text-text-primary"
          />
        </div>
      </div>
      {/* Mobile Navigation Overlay */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 bg-black/20 z-1025 md:hidden"
          onClick={() => setShowMoreMenu(false)}
        />
      )}
      {showUserMenu && (
        <div 
          className="fixed inset-0 bg-black/20 z-1025"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;