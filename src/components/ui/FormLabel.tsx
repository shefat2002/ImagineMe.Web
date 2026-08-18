import { LabelHTMLAttributes } from 'react';

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export default function FormLabel({ className = '', required, children, ...props }: FormLabelProps) {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

export interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

export interface FormHelperProps {
  text?: string;
}

export function FormHelper({ text }: FormHelperProps) {
  if (!text) return null;
  return <p className="mt-1 text-sm text-gray-500">{text}</p>;
}