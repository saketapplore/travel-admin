/**
 * Services Index
 * Central export point for all service modules
 */

export { authService } from './authService';
export { bookingService } from './bookingService';
export { propertyService } from './propertyService';
export { userService } from './userService';
export { accountService } from './accountService';
export { roleService } from './roleService';
export { permissionService } from './permissionService';
export { faqService } from './faqService';
export { transactionService } from './transactionService';
export { staffService } from './staffService';
export { discountService } from './discountService';
export { activityLogService } from './activityLogService';
export { reportingService } from './reportingService';

// Export the base API instance as well
export { default as api } from './api';

