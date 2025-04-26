import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

/**
 * Reusable Button component that can render as a button, Link, or anchor
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, text)
 * @param {string} [props.size='medium'] - Button size (small, medium, large)
 * @param {string} [props.to] - If provided, renders as a Link to this path
 * @param {string} [props.href] - If provided, renders as an anchor link
 * @param {boolean} [props.download] - Whether the link should download the resource
 * @param {string} [props.target] - Target attribute for anchor links
 * @param {string} [props.rel] - Rel attribute for anchor links
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.ReactNode} props.children - Button content
 * @param {function} [props.onClick] - Click handler
 * @param {boolean} [props.fullWidth] - Whether the button should take full width
 * @returns {React.ReactElement} - Button component
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  to,
  href,
  className = '',
  fullWidth = false,
  download,
  target,
  rel,
  ...props
}) => {
  // Build CSS class names
  const buttonClass = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${className}`;
  
  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link to={to} className={buttonClass} {...props}>
        {children}
      </Link>
    );
  }
  
  // Render as anchor if 'href' prop is provided
  if (href) {
    return (
      <a 
        href={href} 
        className={buttonClass} 
        download={download} 
        target={target} 
        rel={rel} 
        {...props}
      >
        {children}
      </a>
    );
  }
  
  // Otherwise render as a button
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
