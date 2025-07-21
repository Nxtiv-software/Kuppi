// src/components/tabs.js
import React from "react";

const Tabs = ({ value, onValueChange, children }) => {
  return (
    <div data-active-tab={value}>
      {React.Children.map(children, (child) => {
        // Automatically inject props to TabsTrigger and TabsContent
        if (child.type === TabsList) {
          return React.cloneElement(child, { onValueChange });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeValue: value });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, onValueChange, className = "" }) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
    >
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { onClick: onValueChange });
      })}
    </div>
  );
};

const TabsTrigger = ({ value, onClick, children, className = "" }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
        ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, activeValue, children, className = "" }) => {
  if (value !== activeValue) return null;
  return (
    <div className={`mt-2 ${className}`}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
