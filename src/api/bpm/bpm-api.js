// API imports
import { login, logout } from './auth';
import {
    getLeads,
    getLead,
    createLeadLog,
    getLeadLogs,
    updateLead,
    createLead,
    addItemToLead,
    getLeadSystemItems,
    deleteLeadSystemItem,
    editLeadSystemItem,
    addFileToLead,
    getLeadFiles,
    deleteFileFromLead,
    addExtraToLead,
    getLeadExtras,
    deleteExtraFromLead,
    updateLeadExtra,
} from './leads';
import {
    changePassword,
    createUser,
    getCurrentUser,
    getUsers,
    updateCurrentUser,
    updateUser,
} from './users';
import {
    getExistingSystemOptions,
    getInstallStatusOptions,
    getLeadSources,
    getLeadStatusOptions,
    getPhaseOptions,
    getRoofPitchOptions,
    getRoofTypeOptions,
    getServiceStatusOptions,
    getStoryOptions,
    getValidRoles,
} from './info';
import {
    getInstalls,
    getInstall,
    createInstallLog,
    getInstallLogs,
    updateInstall,
    createInstall,
    addItemToInstall,
    getInstallSystemItems,
    deleteInstallSystemItem,
    editInstallSystemItem,
    addFileToInstall,
    getInstallFiles,
    deleteFileFromInstall,
    addExtraToInstall,
    getInstallExtras,
    deleteExtraFromInstall,
    updateInstallExtra,
    createInstallDirectly,
} from './installs';
import {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    createCustomerLog,
    getCustomerLogs,
    searchCustomer,
    getCustomerInstalls,
    getCustomerServices,
} from './customers';
import {
    addFileToInstaller,
    createInstaller,
    deleteFileFromInstaller,
    getInstaller,
    getInstallerFiles,
    getInstallers,
    updateInstaller,
} from './installers';
import { getEvents, createEvent, updateEvent, deleteEvent } from './events';
import {
    createStockItem,
    getActiveStockItems,
    getStockItems,
    getStockTypes,
    updateStockItem,
} from './stock';
import {
    addFile,
    deleteFile,
    downloadFile,
    downloadMultipleFiles,
    getFile,
} from './files';
import {
    createNotification,
    deleteNotification,
    getNotifications,
} from './notifications';
import {
    addFileToService,
    addItemToService,
    createService,
    createServiceLog,
    deleteFileFromService,
    deleteItemFromService,
    getService,
    getServiceFiles,
    getServiceItems,
    getServiceLogs,
    getServices,
    updateService,
    updateServiceItem,
} from './services';
import { getArchive } from './archive';

class API {}

// Auth
API.prototype.login = login;
API.prototype.logout = logout;

// Leads
API.prototype.getLeads = getLeads;
API.prototype.getLead = getLead;
API.prototype.createLeadLog = createLeadLog;
API.prototype.getLeadLogs = getLeadLogs;
API.prototype.updateLead = updateLead;
API.prototype.createLead = createLead;
API.prototype.addItemToLead = addItemToLead;
API.prototype.getLeadSystemItems = getLeadSystemItems;
API.prototype.deleteLeadSystemItem = deleteLeadSystemItem;
API.prototype.editLeadSystemItem = editLeadSystemItem;
API.prototype.addFileToLead = addFileToLead;
API.prototype.getLeadFiles = getLeadFiles;
API.prototype.deleteFileFromLead = deleteFileFromLead;
API.prototype.addExtraToLead = addExtraToLead;
API.prototype.getLeadExtras = getLeadExtras;
API.prototype.deleteExtraFromLead = deleteExtraFromLead;
API.prototype.updateLeadExtra = updateLeadExtra;

// Installs
API.prototype.getInstalls = getInstalls;
API.prototype.getInstall = getInstall;
API.prototype.createInstallLog = createInstallLog;
API.prototype.getInstallLogs = getInstallLogs;
API.prototype.updateInstall = updateInstall;
API.prototype.createInstall = createInstall;
API.prototype.getInstallStatusOptions = getInstallStatusOptions;
API.prototype.addItemToInstall = addItemToInstall;
API.prototype.getInstallSystemItems = getInstallSystemItems;
API.prototype.deleteInstallSystemItem = deleteInstallSystemItem;
API.prototype.editInstallSystemItem = editInstallSystemItem;
API.prototype.addFileToInstall = addFileToInstall;
API.prototype.getInstallFiles = getInstallFiles;
API.prototype.deleteFileFromInstall = deleteFileFromInstall;
API.prototype.addExtraToInstall = addExtraToInstall;
API.prototype.getInstallExtras = getInstallExtras;
API.prototype.deleteExtraFromInstall = deleteExtraFromInstall;
API.prototype.updateInstallExtra = updateInstallExtra;
API.prototype.createInstallDirectly = createInstallDirectly;

// Customers
API.prototype.getCustomers = getCustomers;
API.prototype.getCustomer = getCustomer;
API.prototype.updateCustomer = updateCustomer;
API.prototype.createCustomer = createCustomer;
API.prototype.createCustomerLog = createCustomerLog;
API.prototype.getCustomerLogs = getCustomerLogs;
API.prototype.searchCustomer = searchCustomer;
API.prototype.getCustomerInstalls = getCustomerInstalls;
API.prototype.getCustomerServices = getCustomerServices;

// Users
API.prototype.getUsers = getUsers;
API.prototype.getCurrentUser = getCurrentUser;
API.prototype.updateUser = updateUser;
API.prototype.createUser = createUser;
API.prototype.updateCurrentUser = updateCurrentUser;
API.prototype.changePassword = changePassword;

// Info
API.prototype.getLeadSources = getLeadSources;
API.prototype.getPhaseOptions = getPhaseOptions;
API.prototype.getExistingSystemOptions = getExistingSystemOptions;
API.prototype.getStoryOptions = getStoryOptions;
API.prototype.getRoofTypeOptions = getRoofTypeOptions;
API.prototype.getLeadStatusOptions = getLeadStatusOptions;
API.prototype.getServiceStatusOptions = getServiceStatusOptions;
API.prototype.getValidRoles = getValidRoles;
API.prototype.getRoofPitchOptions = getRoofPitchOptions;

// Installers
API.prototype.getInstallers = getInstallers;
API.prototype.updateInstaller = updateInstaller;
API.prototype.createInstaller = createInstaller;
API.prototype.getInstaller = getInstaller;
API.prototype.addFileToInstaller = addFileToInstaller;
API.prototype.getInstallerFiles = getInstallerFiles;
API.prototype.deleteFileFromInstaller = deleteFileFromInstaller;

// Events
API.prototype.getEvents = getEvents;
API.prototype.createEvent = createEvent;
API.prototype.updateEvent = updateEvent;
API.prototype.deleteEvent = deleteEvent;

// Stock
API.prototype.getStockItems = getStockItems;
API.prototype.getActiveStockItems = getActiveStockItems;
API.prototype.createStockItem = createStockItem;
API.prototype.getStockTypes = getStockTypes;
API.prototype.updateStockItem = updateStockItem;

// Files
API.prototype.getFile = getFile;
API.prototype.addFile = addFile;
API.prototype.deleteFile = deleteFile;
API.prototype.downloadFile = downloadFile;
API.prototype.downloadMultipleFiles = downloadMultipleFiles;

// Notifications
API.prototype.getNotifications = getNotifications;
API.prototype.createNotification = createNotification;
API.prototype.deleteNotification = deleteNotification;

// Services
API.prototype.getServices = getServices;
API.prototype.createService = createService;
API.prototype.getService = getService;
API.prototype.updateService = updateService;
API.prototype.addItemToService = addItemToService;
API.prototype.getServiceItems = getServiceItems;
API.prototype.deleteItemFromService = deleteItemFromService;
API.prototype.updateServiceItem = updateServiceItem;
API.prototype.addFileToService = addFileToService;
API.prototype.getServiceFiles = getServiceFiles;
API.prototype.deleteFileFromService = deleteFileFromService;
API.prototype.getServiceLogs = getServiceLogs;
API.prototype.createServiceLog = createServiceLog;

// Archive
API.prototype.getArchive = getArchive;

export const bpmAPI = new API();
