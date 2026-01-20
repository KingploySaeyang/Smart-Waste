window.SW_Translations = window.SW_Translations || {};
window.SW_Translations.en = {
    // =====================================================
    // LOGIN PAGE (Sign In) - EN
    // =====================================================
    /* ---------- Page / SEO ---------- */
    pageTitle_login: "Smart Waste - Sign In",

    /* ---------- Hero (Left Panel) ---------- */
    welcomeTitle: "SMART WASTE",
    welcomeSubtitle: "Smart Waste Management System",
    welcomeDescription:
        "Manage waste bins, garbage trucks, and operations in real time for a cleaner and more sustainable city.",

    /* ---------- Login Card ---------- */
    loginTitle: "Sign In",
    loginHint: "Please sign in to access the Smart Waste system",

    /* ---------- Input Placeholders ---------- */
    usernamePh: "Username",
    passwordPh: "Password",

    /* ---------- Remember / Links ---------- */
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    noAccount: "Don’t have an account?",
    signup: "Sign up",

    /* ---------- Buttons ---------- */
    btnLogin: "Sign In",
    btnOk: "OK",

    /* ---------- Login Status ---------- */
    loginSuccess: "Login successful",
    loginSuccessDriver: "Login successful (Driver)",

    /* ---------- Validation / Errors ---------- */
    errFillAll: "Please fill in all required fields",
    errUserNotFound: "User not found",
    errWrongPassword: "Incorrect password",
    errTempLocked: "Account temporarily locked",
    errAttempt: "Attempt",
    errorGeneric: "An error occurred. Please try again.",

    /* ---------- Lock / Countdown ---------- */
    statusTempLocked: "Temporarily locked",
    statusAccountLocked: "This account is locked",
    statusPleaseWait: "Please wait",
    statusUnlocked: "You can log in again",

    unitHour: "h",
    unitMinute: "m",
    unitSecond: "s",

    /* ---------- Forgot Password ---------- */
    forgotTitle: "Forgot password?",
    forgotInputHint: "Enter your username",
    forgotInputRequired: "Please enter your username",
    forgotSendLink: "Send reset link",
    forgotSendSuccess: "Reset link has been sent to",

    /* ---------- Forgot Password (Driver) ---------- */
    forgotDriverTitle: "Driver Account",
    forgotDriverHint:
        "Please contact the administrator to reset your password",

    /* ---------- Forgot Password Errors ---------- */
    errNoEmail: "This account is not linked to an email address",

    /* ---------- Common ---------- */
    success: "Success",
    error: "Error",
    /* ---------- Password Toggle ---------- */
    showPassword: "Show",
    hidePassword: "Hide",
    loginUsernamePh: "Username",
    loginPasswordPh: "Password",

    // ================================
    // Admin
    // Menu
    // ================================
    register: "Register Bin",
    addDriver: "Drivers",
    schedule: "Collection Schedule",
    truck: "Truck Tracking",
    report: "Reports",
    logout: "Logout",

    logoutTitle: "Sign out?",
    logoutText: "Do you want to sign out?",
    logoutConfirm: "Logout",
    logoutCancel: "Cancel",
    // ================================
    // Admin
    // Bin Registration Page
    // ================================
    /* ---------- Common / Layout ---------- */
    pageTitle_bins: "Smart Waste - Bin List",
    mainTitle_bins: "Bin List",
    mainTitle: "Bin List",
    ariaChangeLanguage: "Change language",

    /* ---------- Add Bin Header ---------- */
    addBinHeaderTitle: "Add Waste Bin",
    btnShowForm: "Add Bin",

    /* ---------- Filters ---------- */
    filterZoneLabel: "Zone",
    filterAreaLabel: "Sub-area",
    filterBinLabel: "BIN / Owner",
    filterBinPlaceholder: "Filter by BIN or owner name",
    filterZoneAll: "All zones",
    filterAreaAll: "All",

    /* ---------- Table ---------- */
    tableHeaderZone: "Zone",
    tableHeaderArea: "Sub-area",
    tableHeaderBin: "BIN",
    tableHeaderOwner: "Bin Owner",
    tableHeaderRfid: "RFID",
    tableHeaderCoords: "Coordinates (lat,lng)",
    tableHeaderDetails: "Details",
    tableHeaderUpdated: "Updated At",
    tableHeaderManage: "Manage",

    /* ---------- Form Labels ---------- */
    labelZone: "Zone",
    labelArea: "Sub-area",
    labelBinId: "Bin Name",
    labelOwner: "Bin Owner",
    labelRfid: "RFID Tag",
    labelPosition: "Location",
    labelDetails: "Additional Details",
    labelBin: "BIN",
    labelZoneArea: "Zone / Area",

    /* ---------- Placeholders ---------- */
    placeholderRfid: "Scan RFID tag or enter manually",
    placeholderBinId: "Auto-generated bin name",
    placeholderLat: "Latitude",
    placeholderLng: "Longitude",
    placeholderDetails: "Additional details",

    /* ---------- Buttons ---------- */
    btnGetGps: "Get GPS Location",
    btnSave: "Save",
    btnReset: "Reset Form",
    btnCancel: "Cancel",
    btnDelete: "Delete Bin",
    btnOk: "OK",
    btnSaveChanges: "Save Changes",

    /* ---------- Owner Select ---------- */
    ownerSelectLoading: "Loading users...",
    ownerSelectError: "Failed to load users",
    ownerSelectEmpty: "No users found",
    ownerSelectDefault: "Select bin owner",
    ownerLoadError: "Failed to load users:",

    /* ---------- Zone / Area ---------- */
    zoneSelectDefault: "Select zone",
    zoneSelectNoZones: "No zones available",
    zoneSelectAdd: "+ Add zone",

    areaSelectNoAreas: "Select sub-area",
    areaSelectLoading: "Loading areas...",
    areaSelectDefault: "Select sub-area",
    areaSelectAdd: "+ Add area",

    /* ---------- Zone Modal ---------- */
    zoneModalNewPlaceholder: "New zone name",
    areaModalNewPlaceholder: "New area name",

    zoneModalNoZones: "No zones available",
    zoneModalSaveBtn: "Save",
    zoneModalDeleteBtn: "Delete",
    zoneModalEmptyName: "Please enter zone name",
    zoneModalNoChange: "No changes detected",
    zoneModalCannotChange: "Bins exist in this zone. Cannot rename.",
    zoneModalExists: "Zone already exists",
    zoneModalSaveSuccess: "Saved successfully",
    zoneModalSaveError: "Save failed",
    zoneModalDeleteSuccess: "Zone deleted",
    zoneModalAddSuccess: "Zone added successfully",
    zoneModalAddError: "Failed to add zone",

    /* ---------- Area Modal ---------- */
    areaModalNoAreas: "No sub-areas available",
    areaModalSaveBtn: "Save",
    areaModalDeleteBtn: "Delete",
    areaModalEmptyName: "Please enter area name",
    areaModalNoChange: "No changes detected",
    areaModalCannotChange: "Bins exist in this area. Cannot rename.",
    areaModalExists: "Area already exists",
    areaModalSaveSuccess: "Saved successfully",
    areaModalSaveError: "Save failed",
    areaModalDeleteSuccess: "Area deleted",
    areaModalAddSuccess: "Area added successfully",
    areaModalAddError: "Failed to add area",
    areaModalConfirmDelete: "Confirm deletion",

    /* ---------- MAC ---------- */
    labelMacAddress: "Device Board (MAC Address)",
    btnConfirmMac: "Confirm Device",
    macSelectOffline: "No online devices",
    macSelectDefault: "Select device (MAC Address)",
    macLoading: "Loading online MAC addresses...",

    /* ---------- Status ---------- */
    statusSelectZone: "Please select a zone",
    statusSelectArea: "Please select a sub-area",
    statusSelectOwner: "Please select a bin owner",
    statusSaving: "Saving...",
    statusSaveSuccess: "Saved successfully",
    statusSaveError: "Save failed",
    statusNoGps: "GPS not supported",
    statusGettingPos: "Getting location...",
    statusGetPosSuccess: "Location retrieved",
    statusGetPosError: "Failed to get location",

    /* ---------- Errors ---------- */
    errorSelectMac: "Please select a device",
    errorConfirmMac: "Device not confirmed",
    errorMissingRfid: "RFID not scanned or entered",
    errorSelectZone: "Zone not selected",
    errorSelectArea: "Sub-area not selected",
    errorSelectOwner: "Bin owner not selected",
    errorDuplicateRfid: "RFID already in use",
    errorMacInUse: "Device is used by another admin",
    errorBinNotFound: "Bin not found",

    formErrorTitle: "Incomplete information",

    /* ---------- Duplicate ---------- */
    duplicateModalTitle: "Duplicate detected",
    duplicateRfidTitle: "RFID already used",
    duplicateRfidHint: "Please use a new tag or check bin data",
    btnScanNew: "OK and scan again",

    duplicateMacTitle: "Device already used",
    duplicateMacDesc: "This MAC address is linked to another bin",

    /* ---------- Delete ---------- */
    confirmDeleteTitle: "Confirm bin deletion",
    confirmDeleteBin: "Do you want to delete this bin?",
    confirmDeleteHint: "The bin will be hidden (soft delete)",
    deleteSuccess: "Bin deleted successfully",
    deleteError: "Failed to delete bin",

    /* ---------- Table Footer ---------- */
    noData: "No data found",
    loading: "Loading...",
    showing: "Showing",
    items: "items",

    /* ---------- Edit Bin ---------- */
    editModalTitle: "Edit Bin Information",
    editLabelZone: "Zone",
    editLabelArea: "Sub-area",
    editLabelBinId: "Bin Name (BIN)",
    editLabelRfid: "RFID Tag",
    editLabelPosition: "Location",
    editLabelDetails: "Details",
    editSaving: "Saving...",
    editSaveSuccess: "Saved successfully",
    editSaveError: "Save failed",


    // =====================================================
    // Admin
    // Driver Management Page
    // =====================================================

    pageTitle_driver: "Smart Waste - Drivers",
    mainTitle_driver: "Manage Garbage Truck Drivers",
    pageHint_driver: "Create and manage driver accounts by zone.",

    addDriverTitle: "Add New Driver",
    addDriverHint: "Click to register a new driver",
    btnOpenDriverForm: "Add Driver",
    editDriverTitle: "Edit Driver Information",

    labelDriverZone: "Zone (Operation Area)",
    zoneHelp: "Select a zone first. Driver ID will be generated automatically.",
    labelDriverId: "Driver ID",
    labelFullName: "Full Name",
    labelPhone: "Phone Number",
    labelUsername: "Username",
    labelPassword: "Password",

    driverZonePlaceholder: "Select zone...",
    driverIdPlaceholder: "Select zone first",
    fullNamePh: "e.g. John Doe",
    phonePh: "e.g. 0812345678",
    usernamePh: "e.g. drv_john",
    passwordPh: "Set initial password",
    passwordEditHint: "Leave blank to keep current password",

    labelZoneFilter_driver: "Zone",
    labelSearch_driver: "Search Driver ID / Username",

    thDriverZone: "Zone",
    thDriverId: "Driver ID",
    thDriverUsername: "Username",
    thDriverFullName: "Full Name",
    thDriverPhone: "Phone",
    thDriverUpdated: "Updated At",
    thDriverActions: "Actions",

    btnClearDriver: "Clear Form",
    btnSaveDriver: "Save Driver",
    btnUpdateDriver: "Save Changes",

    loadingDrivers: "Loading drivers...",
    noDrivers: "No drivers found",

    statusSelectZoneFirst: "Please select a zone first",
    statusComputingDriverId: "Generating Driver ID...",
    statusDriverIdExists: "Driver ID already exists",
    statusSavingDriver: "Saving driver data...",
    statusSaveDriverOk: "Driver saved successfully",
    statusUpdateDriverOk: "Driver updated successfully",
    statusSaveDriverError: "Failed to save driver",

    statusMissingNamePhone: "Please enter full name and phone number",
    statusMissingUserPass: "Please enter username and password",

    confirmDeleteDriver: "Do you want to delete (hide) this driver?",
    deleteDriverFail: "Delete failed: ",

    // ================================
    // Admin
    // Driver Management (English)
    // ================================
    /* ---------- Page ---------- */
    pageTitle_driver: "Smart Waste - Garbage Truck Driver",
    mainTitle: "Garbage Truck Driver Management",
    pageHint: "Add / manage driver user accounts for each working zone",

    /* ---------- Header ---------- */
    addDriverTitle: "Add New Driver",
    editDriverTitle: "Edit Driver Information",
    addDriverHint: "Click the button to add / register a new driver",
    btnOpenDriverForm: "Add Driver",

    /* ---------- Form ---------- */
    labelZone: "Working Zone",
    zoneHelp: "Select a zone first. The system will generate Driver ID automatically.",
    zonePlaceholder: "Select zone...",

    labelDriverId: "Driver ID",
    driverIdPlaceholder: "Select zone first",

    labelFullName: "Full Name",
    fullNamePh: "e.g. John Smith",

    labelPhone: "Phone Number",
    phonePh: "e.g. 0812345678",

    labelUsername: "Username",
    usernamePh: "e.g. drv_john",

    labelPassword: "Password",
    passwordPh: "Set initial password",
    passwordEditHint: "Leave blank if you do not want to change password",

    btnClear: "Clear Form",
    btnSaveDriver: "Save Driver",
    btnUpdateDriver: "Save Changes",

    /* ---------- Filter ---------- */
    labelZoneFilter: "Zone",
    filterZoneAll: "All Zones",
    labelSearch: "Search Driver ID / Username",
    searchPh: "Search Driver ID / Username",

    /* ---------- Table ---------- */
    thZone: "Zone",
    thDriverId: "Driver ID",
    thUsername: "Username",
    thFullName: "Full Name",
    thPhone: "Phone",
    thUpdated: "Last Updated",
    thActions: "Actions",

    btnEdit: "Edit",
    btnDelete: "Delete",

    countPrefix: "Showing",
    countSuffix: "items",

    loadingText: "Loading driver data...",
    noDrivers: "No drivers found",

    /* ---------- Status / Validation ---------- */
    statusSaving: "Saving...",
    statusSaveOk: "Driver saved successfully",
    statusUpdateOk: "Driver updated successfully",
    statusSaveErrorPrefix: "Failed to save: ",

    statusMissingNamePhone: "Please enter full name and phone number",
    statusMissingUserPass: "Please enter username and password",
    statusNoChange: "No changes detected",
    statusCancelled: "Action cancelled",

    errorSelectZone: "Please select a zone",
    errorNoDriverId: "Driver ID not generated",
    errorInvalidPhone: "Invalid phone number",

    /* ---------- Confirm ---------- */
    confirmTitle: "Confirmation",
    confirmDelete: "Do you want to delete (hide) this driver?",
    confirmDuplicateName:
        "Duplicate name {name} found in this zone. Do you want to continue?",
    confirmPhoneDuplicate:
        "Duplicate phone number detected. Do you want to continue?",
    btnCancel: "Cancel",
    btnConfirm: "Confirm",
    deleteFailPrefix: "Delete failed: ",

    // =====================================================
    // Admin
    // Truck Schedule Page
    // =====================================================
    /* ---------- Page ---------- */
    pageTitle_schedule: "Smart Waste - Truck Schedule",
    mainTitle_schedule: "Garbage Truck Schedule",

    /* ---------- Common ---------- */
    menuBtn: "☰ Menu",

    /* ---------- Header ---------- */
    addScheduleHeaderTitle: "Create Truck Schedule",
    btnOpenSchedule: "Create Schedule",

    /* ---------- Modal / Form ---------- */
    formTitle: "Create Truck Schedule",

    labelPickDate: "Work Date",
    hintPickDate: "Select a date for truck scheduling",

    labelZone: "Zone",
    zonePlaceholder: "Select zone...",

    labelArea: "Areas in Zone",
    areaNoData: "No areas available",

    labelTruck: "Select Truck",
    truckPlaceholder: "Select zone first...",
    truckSelect: "Select truck...",
    truckNoData: "No trucks in this zone",
    truckLoadFail: "Failed to load trucks",

    labelDriver: "Select Driver",
    driverPlaceholder: "Select zone first...",
    driverSelect: "Select driver...",
    driverNoData: "No drivers in this zone",

    btnClear: "Clear Form",
    btnSave: "Save Schedule",

    /* ---------- Table ---------- */
    tableTitle: "Latest Truck Schedules",

    thWorkDate: "Work Date",
    thZoneArea: "Zone / Area",
    thTruck: "Truck",
    thDriver: "Driver",
    thWorkStatus: "Work Status",
    workFinished: "Completed",
    workNotFinished: "Not completed",
    thCreatedBy: "Created By",
    thCreated: "Created At",

    countPrefix: "Showing",
    countSuffix: "items",

    loadingText: "Loading...",
    noData: "No data available",

    /* ---------- Status ---------- */
    statusSaving: "Saving...",
    statusSaveOk: "Schedule saved successfully",
    statusAdvanceLimit: "Scheduling more than 4 weeks in advance is not allowed",
    statusError: "An error occurred",

    /* ---------- Alert ---------- */
    alertFillAll: "Please fill in all required fields",
    alertSelectArea: "Please select at least one area",
    alertLoadZoneFail: "Failed to load zone data",

    /* ---------- Conflict / Duplicate ---------- */
    conflictTitle: "⚠️ Duplicate Schedule",
    conflictSameDay: "A schedule already exists for this date.\nSaving is not allowed.",
    btnCancel: "Cancel",
    btnConfirm: "Confirm",

    workCompletedOnTime: "Completed on time",
    workCompletedLate: "Completed late",

    // =====================================================
    // Admin
    // Truck Tracking Page
    // =====================================================
    /* ---------- Page / Title ---------- */
    pageTitle_truck: "Smart Waste - Truck Tracking",
    mainTitle_truck: "Truck Tracking",

    /* ---------- Sidebar / Common ---------- */
    sidebarTitle: "Smart Waste",
    menuBtn: "☰ Menu",
    ariaChangeLanguage: "Change language",

    /* ---------- Role ---------- */
    adminRole: "Administrator",

    /* ---------- Dashboard Cards ---------- */
    cardTotal: "Total Bins",
    cardMid: "Online Bins",
    cardFull: "Full Bins",
    cardLow: "Normal Bins",

    /* ---------- Zone Filter / Actions ---------- */
    zoneFilterLabel: "Select Zone",
    zoneFilterAll: "All Zones",
    createTruckBtn: "Add Truck",
    focusBtn: "Focus Map",
    noZoneSelected: "No zone selected",

    /* ---------- Truck Info Panel ---------- */
    truckInfoAllNone: "No active trucks",
    truckInfoAllSome: "%count% trucks are active",
    truckInfoZoneNoTruck: "No active trucks in this zone",
    truckInfoText: "Truck %id% | Zone %zone% | Name %name% | Updated %updatedAt%",
    truckActiveLabel: "Active",
    truckInactiveLabel: "Inactive",

    /* ---------- Map / Popup ---------- */
    mapPopupTruckActive: "Truck is active",
    mapPopupTruckInactive: "Truck is inactive",
    mapPopupBin: "Bin",
    statusOnline: "Online",
    statusOffline: "Offline",
    binLevel: "Level",

    /* ---------- Usage / Table ---------- */
    usageTitle: "Realtime Truck Monitering",
    usageHint: "Realtime truck monitering records",
    usageThDate: "Date",
    usageThStart: "Start",
    usageThEnd: "End",
    usageThDuration: "Duration",
    usageThLat: "Latitude",
    usageThLng: "Longitude",
    loading: "Loading...",

    /* ---------- Duration / Placeholder ---------- */
    dashPlaceholder: "—",
    durationFormat: "%h%h %m%m %s%s",

    /* ---------- Create Truck Overlay ---------- */
    createPanelTitle: "Add Garbage Truck",
    zoneSelectLabel: "Select Zone",
    selectZoneDefault: "Select zone",
    truckIdLabel: "Truck ID",
    truckIdPlaceholder: "Auto-generated",
    saveTruckBtn: "Save",
    cancelTruckBtn: "Cancel",
    pleaseSelectZone: "Please select a zone",

    /* ---------- Alerts ---------- */
    noScheduleTitle: "No Schedule",
    noScheduleText: "This truck has no schedule today",

    // =====================================================
    // DRIVER DASHBOARD (Driver.html)
    // =====================================================

    /* ---------- Page / Header ---------- */
    pageTitle_driverDashboard: "Smart Waste - Driver Dashboard",
    pageSub_driverDashboard: "Today's work overview and garbage truck route",

    brandDriver: "Smart Waste - Control Center",
    driverRole: "Garbage Truck Driver",

    /* ---------- Top Right ---------- */
    btnLogout: "Logout",
    logoutConfirm: "Do you want to log out?",

    /* ---------- Summary Cards ---------- */
    cardDriverLabel: "Driver Name",
    cardTodayRouteLabel: "Today's Schedule",
    cardWorkStatusLabel: "Today's Work Status",

    driverCodePrefix: "Driver ID: ",
    truckCodePrefix: "Truck",

    /* ---------- Work Status ---------- */
    workStatusOff: "Not Started",
    workStatusOn: "Working",
    workStatusDone: "Finished",

    statusOptionNotStart: "Not Started",
    statusOptionWorking: "Collecting Waste",
    statusOptionDone: "Finished",

    workTimeLabel: "Working Time Today",

    /* ---------- Map Section ---------- */
    mapSectionTitle: "Route Map",
    mapSectionSub: "Real-time truck location and bins to be collected",

    tabLive: "Start Work",
    tabBreak: "Finish Work",

    truckLocationPopup: "Garbage Truck Location",

    /* ---------- GPS Status ---------- */
    gpsIdle: "GPS Ready",
    gpsSending: "Sending Location",
    gpsStopped: "Location Sending Stopped",
    gpsPermissionRequired: "Location permission required",
    gpsNotSupported: "GPS not supported on this device",
    gpsErrorPrefix: "GPS Error: ",

    /* ---------- Schedule ---------- */
    noScheduleToday: "No schedule for today",
    noScheduleSub: "Please contact the administrator",
    noScheduleForDriver: "No schedule assigned to you",

    errNoZoneAssigned: "No zone assigned to this driver",
    errNoTruckAssigned: "No truck assigned",

    /* ---------- Start / Finish Work ---------- */
    errDriverOrTruckMissing: "Driver or truck information is missing",
    errSystemNotReady: "System is not ready",
    errAlreadyWorkingOtherDevice: "This account is already working on another device",
    errStartWorkFailed: "Failed to start work. Please try again",

    confirmFinishTitle: "Confirm Finish Work",
    confirmFinishDesc: "Do you want to confirm finishing today's work?",
    confirmYes: "Confirm",
    confirmNo: "Cancel",

    /* ---------- RFID Scan Popup ---------- */
    scanTitle: "Waste Collection Recorded",
    scanBinId: "Bin",
    scanDriver: "Driver",
    scanSavedAt: "Time",
    scanFillBefore: "Fill Level",
    scanWeightBefore: "Weight",

    /* ---------- Navigation ---------- */
    btnBackLogin: "Back to Login",
    logoutTitle: "Sign out?",
    logoutText: "Do you want to sign out?",
    btnCancel: "Cancel",

    // =====================================================
    // USER HOME (home.html)
    // =====================================================

    brandTitle: "Smart Waste",

    menuMyBins: "My Bins",
    menuMap: "Map",
    menuLogout: "Logout",

    loadingData: "Loading...",
    pageTitle_userHome: "Smart Waste - My Bins",

    homeTitle: "My Bins",
    homeSubtitle: "Monitor your bins status in real time",

    labelSelectBin: "Select Bin",

    binPlaceholder: "Please select a bin",
    binDescPlaceholder: "Bin details",

    labelGps: "Coordinates",
    labelUpdated: "Last Updated",

    statusLive: "Status:",
    binLive: "Online",
    binOffline: "Offline",
    binNearFull: "Near Full",

    errOffline: "Device is offline",
    errNoDevice: "Device not found",
    errNoFillLevel: "Fill level data not available",
    errNoMac: "Device not linked",
    errNeedIndex: "Firestore index is required",

    noBins: "No bins found",
    offline: "Offline",
    errorLoading: "Failed to load data",
    userRole_user: "User"

};
