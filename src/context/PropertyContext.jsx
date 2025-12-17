import React, { createContext, useContext, useState, useEffect } from 'react';

const PropertyContext = createContext(null);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Load properties from localStorage
    const savedProperties = localStorage.getItem('properties');
    if (savedProperties) {
      setProperties(JSON.parse(savedProperties));
    }
  }, []);

  // Get property managers from user accounts
  const getPropertyManagers = () => {
    const savedAccounts = localStorage.getItem('userAccounts');
    if (savedAccounts) {
      const accounts = JSON.parse(savedAccounts);
      return accounts
        .filter(account => account.roleKey === 'property-manager' && account.status === 'Active')
        .map(account => ({
          id: account.id,
          name: account.name,
          email: account.email
        }));
    }
    return [];
  };

  const addProperty = (property) => {
    const newProperty = {
      ...property,
      id: Date.now(),
    };
    const updatedProperties = [...properties, newProperty];
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    return newProperty;
  };

  const updateProperty = (id, updatedData) => {
    const updatedProperties = properties.map(prop =>
      prop.id === id ? { ...prop, ...updatedData } : prop
    );
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
  };

  const deleteProperty = (id) => {
    const updatedProperties = properties.filter(prop => prop.id !== id);
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
  };

  const getPropertiesByManager = (managerEmail) => {
    return properties.filter(prop => prop.assignedTo === managerEmail);
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      propertyManagers: getPropertyManagers(),
      addProperty,
      updateProperty,
      deleteProperty,
      getPropertiesByManager
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};

