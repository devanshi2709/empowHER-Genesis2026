import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => {
  return <div className={`glass-surface ${className}`.trim()}>{children}</div>;
};

export default GlassCard;
