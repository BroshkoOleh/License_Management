// Authentiction Statuses
export const USER_AUTH_STATES = {
  UNKNOWN: "UNKNOWN",
  SIGNED_IN_STARTED: "SIGNED_IN_STARTED",
  SIGNED_IN_FINISHED: "SIGNED_IN_FINISHED",
  SIGNED_OUT: "SIGNED_OUT",
};

// License Types
export const LICENSE_TYPES_ARRAY = ["Lifetime", "Subscription", "Trial"];
export const LICENSE_TYPES = {
  LIFETIME: "Lifetime",
  SUBSCRIPTION: "Subscription",
  TRIAL: "Trial",
};

// License Statuses
export const LICENSE_STATUSES_ARRAY = [
  "Disabled",
  "Payment Required",
  "Validity Expired",
  "Validity Not Started",
  "Not Linked",
];
export const LICENSE_STATUSES = {
  DISABLED: "Disabled",
  PAYMENT_REQUIRED: "Payment Required",
  VALIDITY_EXPIRED: "Validity Expired",
  VALIDITY_NOT_STARTED: "Validity Not Started",
  NOT_LINKED: "Not Linked",
};

// License Sort By Options
export const LICENSE_SORT_BY_ARRAY = [
  "Name",
  "Created at",
  "Updated at",
  "Valid From",
  "Valid Till",
  "Last Seen",
];
export const LICENSE_SORT_BY = {
  NAME: "Name",
  CREATION_DATE: "Creation Date",
  UPDATE_DATE: "Update Date",
  VALID_FROM: "Valid From",
  VALID_TILL: "Valid Till",
  LAST_SEEN: "Last Seen",
};

export const LICENSE_APP_VERSION_ARRAY = ["1.5.5", "1.0.0"];

//Payments Type
export const PAYMENT_TYPE_LIFETIME_ARR = ["Lifetime", "Lifetime Upgrade"];
export const PAYMENT_TYPE_SUBSCRIPTION_ARR = [
  "Subscription",
  "Subscription Upgrade",
  "Subscription Extension",
];

export const PAYMENT_TYPES = {
  LIFETIME: "Lifetime",
  LIFETIME_UPGRADE: "Lifetime Upgrade",
  SUBSCRIPTION: "Subscription",
  SUBSCRIPTION_UPGRADE: "Subscription Upgrade",
  SUBSCRIPTION_EXTENSION: "Subscription Extension",
};

//Platforms Type
export const CONFIGURATION_PLATFORMS_TYPE = ["Windows", "Android"];

export const CONFIGURATION_SCREEN_SIZE = [
  { label: "24-inches", value: "24" },
  { label: "43-inches", value: "43" },
  { label: "55-inches", value: "55" },
];

export const CONFIGURATION_LANGUAGE = ["English (United Kingdom)", "German"];

export const CONFIGURATION_FEATURE = ["Search", "Screensaver", "Custom Logo", "25% Scale"];

export const PLATFORMS_TYPE = [
  { value: "Windows", label: "Windows" },
  { value: "Android", label: "Android" },
];

//Emailer URL
export const EMAILER_URL = "https://europe-west1-brainssistance.cloudfunctions.net/sendEmail";

//Changelog types
export const CHANGELOG_TYPES = {
  UPDATE: "update",
  CREATE: "create",
  DELETE: "delete",
};

//User Roles
export const USER_ROLE = {
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

//Main Color
export const COLOR_PURPLE = "#403C8C";
