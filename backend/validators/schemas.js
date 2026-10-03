const { makeValidationMiddleware } = require('./baseValidator');

const schemas = {
  login: {
    username: { required: true, minLength: 3, maxLength: 50, label: 'Username' },
    password: { required: true, minLength: 6, label: 'Password' }
  },

  client: {
    company_name: { required: true, minLength: 2, maxLength: 100, label: 'Company Name' },
    client_name: { required: true, minLength: 2, maxLength: 100, label: 'Client Contact Name' },
    phone: { required: true, regex: /^\+?[0-9\s\-()]{7,20}$/, label: 'Phone Number' },
    email: { required: false, isEmail: true, label: 'Email Address' },
    address: { required: false, label: 'Address' },
    website: { required: false, label: 'Website' },
    gst_number: { required: false, label: 'GST Number' },
    contact_person: { required: false, label: 'ReachSkyline Contact Person' },
    contact_phone: { required: false, label: 'ReachSkyline Contact Number' },
    username: { required: false, label: 'Username' },
    password: { required: false, label: 'Password' },
    industry: { required: true, label: 'Industry' },
    start_date: { required: true, regex: /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/, label: 'Contract Start Date' },
    status: { required: false, regex: /^(active|inactive)$/, label: 'Status' },
    profile_image: { required: false, label: 'Profile Image' },
    logo_url: { required: false, label: 'Logo URL' }
  },

  department: {
    name: { required: true, minLength: 3, maxLength: 100, label: 'Department Name' },
    code: { required: true, regex: /^[A-Z0-9\-]{2,15}$/, label: 'Department Code' },
    description: { required: false, maxLength: 500, label: 'Description' },
    status: { required: true, regex: /^(active|inactive)$/, label: 'Status' }
  },

  manager: {
    full_name: { required: true, minLength: 2, maxLength: 100, label: 'Full Name' },
    username: { required: true, minLength: 3, maxLength: 50, label: 'Username' },
    email: { required: true, isEmail: true, label: 'Email' },
    phone: { required: true, regex: /^\+?[0-9\s\-()]{10,20}$/, label: 'Phone' },
    department_id: { required: true, isNumber: true, label: 'Department' },
    sub_department_id: { required: false, isNumber: true, label: 'Sub-Department' },
    branch: { required: true, label: 'Branch' },
    joining_date: { required: true, regex: /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/, label: 'Joining Date' },
    status: { required: true, regex: /^(active|inactive)$/, label: 'Status' },
    profile_image: { required: false, label: 'Profile Image' },
    avatar_url: { required: false, label: 'Avatar URL' }
  },

  employee: {
    full_name: { required: true, minLength: 2, maxLength: 100, label: 'Full Name' },
    username: { required: true, minLength: 3, maxLength: 50, label: 'Username' },
    email: { required: true, isEmail: true, label: 'Email' },
    phone: { required: true, regex: /^\+?[0-9\s\-()]{10,20}$/, label: 'Phone' },
    department_id: { required: true, isNumber: true, label: 'Department' },
    sub_department_id: { required: false, isNumber: true, label: 'Sub-Department' },
    reporting_manager_id: { required: false, isNumber: true, label: 'Reporting Manager' },
    joining_date: { required: true, regex: /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/, label: 'Joining Date' },
    status: { required: true, regex: /^(active|inactive)$/, label: 'Status' },
    profile_image: { required: false, label: 'Profile Image' },
    avatar_url: { required: false, label: 'Avatar URL' }
  },

  hr: {
    full_name: { required: true, minLength: 2, maxLength: 100, label: 'Full Name' },
    username: { required: true, minLength: 3, maxLength: 50, label: 'Username' },
    email: { required: true, isEmail: true, label: 'Email' },
    phone: { required: true, regex: /^\+?[0-9\s\-()]{10,20}$/, label: 'Phone' },
    joining_date: { required: true, regex: /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/, label: 'Joining Date' },
    status: { required: true, regex: /^(active|inactive)$/, label: 'Status' }
  },

  project: {
    project_name: { required: true, minLength: 3, maxLength: 100, label: 'Project Name' },
    client_id: { required: true, isNumber: true, label: 'Client' },
    department_id: { required: true, isNumber: true, label: 'Department' },
    manager_id: { required: true, isNumber: true, label: 'Manager' },
    description: { required: false, label: 'Description' },
    priority: { required: true, regex: /^(low|medium|high)$/, label: 'Priority' },
    start_date: { required: true, regex: /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/, label: 'Start Date' },
    end_date: { required: true, regex: /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/, label: 'End Date' },
    status: { required: true, regex: /^(pending|active|completed)$/, label: 'Status' }
  },

  deliverable: {
    client_id: { required: true, isNumber: true, label: 'Client' },
    month: { required: true, regex: /^\d{4}-\d{2}$/, label: 'Month' },
    department_id: { required: true, isNumber: true, label: 'Department' },
    deliverable: { required: true, minLength: 2, maxLength: 100, label: 'Deliverable Item' },
    quantity: { required: true, isNumber: true, minNum: 1, label: 'Quantity' },
    assigned_manager_id: { required: true, isNumber: true, label: 'Assigned Manager' },
    assigned_employee_id: { required: true, isNumber: true, label: 'Assigned Employee' },
    priority: { required: true, regex: /^(low|medium|high)$/, label: 'Priority' },
    due_date: { required: true, regex: /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})$/, label: 'Due Date' },
    status: { required: true, regex: /^(pending|assigned|submitted|reassigned|sent_to_client|client_approved|client_rework|approved|completed|cancelled|posted)$/, label: 'Status' }
  },

  template: {
    name: { required: true, minLength: 3, maxLength: 100, label: 'Template Name' },
    description: { required: false, maxLength: 500, label: 'Description' }
  }
};

module.exports = {
  validateLogin: makeValidationMiddleware(schemas.login),
  validateClient: makeValidationMiddleware(schemas.client),
  validateDepartment: makeValidationMiddleware(schemas.department),
  validateManager: makeValidationMiddleware(schemas.manager),
  validateEmployee: makeValidationMiddleware(schemas.employee),
  validateHR: makeValidationMiddleware(schemas.hr),
  validateProject: makeValidationMiddleware(schemas.project),
  validateDeliverable: makeValidationMiddleware(schemas.deliverable),
  validateTemplate: makeValidationMiddleware(schemas.template)
};