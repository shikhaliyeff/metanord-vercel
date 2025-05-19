/**
 * Admin Theme Management
 * This file contains utilities for managing the admin panel theme
 */
```typescript
/**
 * Load the admin CSS stylesheet if it's not already loaded
 */
export const loadAdminCSS = () => {
  const id = 'admin-css';
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/src/styles/admin.css';
    link.id = id;
    document.head.appendChild(link);
  }
};
```typescript
/**
 * Unload the admin CSS stylesheet if it's loaded
 */
export const unloadAdminCSS = () => {
  const link = document.getElementById('admin-css');
  if (link) {
    document.head.removeChild(link);
  }
};
```typescript
/**
 * Configuration for admin theme root CSS variables
 */
export const adminThemeConfig = {
  light: {
    '--admin-bg': '#f9fafb',
    '--admin-text': '#111827',
    '--admin-text-muted': '#6b7280',
    '--admin-border': '#e5e7eb',
    '--admin-header-bg': '#ffffff',
    '--admin-sidebar-bg': '#ffffff',
    '--admin-sidebar-hover': '#f3f4f6',
    '--admin-sidebar-active': '#e5e7eb',
    '--admin-card-bg': '#ffffff',
    '--admin-highlight': 'rgba(59, 130, 246, 0.05)',
    '--admin-panel-shadow': '0 1px 3px rgba(0, 0, 0, 0.1)',
  }
};

/**
 * Apply admin theme based on dark mode preference
 * @param isDark Whether to apply dark theme (true) or light theme (false)
 */
export const applyAdminTheme = (isDark: boolean) => {
  // Set data-theme attribute on html element
  document.documentElement.setAttribute('data-admin-theme', 'light');
  
  // Apply CSS variables
  const theme = adminThemeConfig.light;
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  
  // Add admin-mode class to body
  document.body.classList.add('admin-mode');
};

/**
 * Reset admin theme by removing all admin-specific CSS variables
 */
export const resetAdminTheme = () => {
  // Remove data-admin-theme attribute
  document.documentElement.removeAttribute('data-admin-theme');
  
  // Remove CSS variables
  Object.keys(adminThemeConfig.light).forEach((key) => {
    document.documentElement.style.removeProperty(key);
  });
  
  // Remove admin-mode class from body
  document.body.classList.remove('admin-mode');
};