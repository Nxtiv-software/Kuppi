// src/components/tabs.jsx
import React from "react";
import { cn } from "../utils/utils";

const Tabs = ({ value, onValueChange, children, className }) => {
  return (
    <div data-active-tab={value} className={className}>
      {React.Children.map(children, (child) => {
        // Automatically inject props to TabsTrigger and TabsContent
        if (child.type === TabsList) {
          return React.cloneElement(child, { onValueChange, activeValue: value });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeValue: value });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, onValueChange, activeValue, className = "" }) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { 
          onClick: onValueChange,
          isActive: child.props.value === activeValue 
        });
      })}
    </div>
  );
};

const TabsTrigger = ({ value, onClick, children, className = "", isActive }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-background text-foreground shadow-sm",
        className
      )}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, activeValue, children, className = "" }) => {
  if (value !== activeValue) return null;
  return (
    <div 
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      data-state={value === activeValue ? "active" : "inactive"}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
