import dayjs from "dayjs";
import { EMAILER_URL, LICENSE_STATUSES, LICENSE_TYPES } from "./constants";
import axios from "axios";

export const EmailFormatDayMonthYear = (fulldate) => {
  const dateParts = fulldate.split(" ");
  const day = dateParts[0];
  const month = dateParts[1];
  const year = dateParts[2];
  return `${day} ${month} ${year}`;
};

export const sendEmailHelper = async (emailData) => {
  try {
    await axios.post(EMAILER_URL, emailData);
    console.log(`Email sent successfully to ${emailData.to}`);
  } catch (error) {
    console.error(`Error sending email to ${emailData.to}:`, error);
  }
};

export const filterAndSortApps = (allApps, appStates) => {
  const statusOrder = {
    enabled: 0,
    locked: 1,
    disabled: 2,
  };

  return allApps
    .filter((app) => appStates[app.id]) // Ensure apps have a valid state
    .sort((a, b) => {
      const statusA = appStates[a.id] || "disabled";
      const statusB = appStates[b.id] || "disabled";

      // First, sort by status
      if (statusOrder[statusA] !== statusOrder[statusB]) {
        return statusOrder[statusA] - statusOrder[statusB];
      }

      // Then sort alphabetically by appName if statuses are the same
      return a.appName.localeCompare(b.appName);
    });
};

export const sortChips = (allChipsNames, chipsInitState) => {
  const activeLanguages = allChipsNames.filter((lang) => chipsInitState.includes(lang));

  const sortedActiveChips = activeLanguages.sort((a, b) => a.localeCompare(b));

  const inactiveLanguages = allChipsNames.filter((lang) => !chipsInitState.includes(lang));

  const sortedInactiveChips = inactiveLanguages.sort((a, b) => a.localeCompare(b));

  return [...sortedActiveChips, ...sortedInactiveChips];
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  const ordinal =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  return `${day}${ordinal} ${month} ${year}`;
};

export const formatTimestamp = (timestamp) => {
  if (
    timestamp &&
    typeof timestamp === "object" &&
    "seconds" in timestamp &&
    "nanoseconds" in timestamp
  ) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
    const dateString = formatDate(date);
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
    return `${dateString} at ${timeString}`;
  }

  return timestamp;
};

export const formatFirestoreTimestamp = (timestamp) => {
  return dayjs.unix(timestamp.seconds).format("YYYY-MM-DD");
};

export const overviewLicenses = (
  filteredLicenses,
  statuses,
  types,
  appVersions,
  debouncedQuery,
  payments,
  today
) => {
  let preparedLicenses = [...filteredLicenses];

  // Filter by types
  if (types.length > 0) {
    preparedLicenses = preparedLicenses.filter((license) => types.includes(license.type));
  }

  // Filter by app versions
  if (appVersions.length > 0) {
    // Extract the 'value' property from appVersions
    const appVersionValues = appVersions.map((appVersion) => appVersion.value);

    // Filter the licenses based on the extracted version values
    preparedLicenses = preparedLicenses.filter((license) =>
      appVersionValues.includes(license.versionNumber)
    );
  }

  // Filter by statuses
  if (statuses.length > 0) {
    preparedLicenses = preparedLicenses.filter((license) => {
      if (statuses.includes(LICENSE_STATUSES.DISABLED) && license.disabled) {
        return true;
      }
      if (statuses.includes(LICENSE_STATUSES.PAYMENT_REQUIRED)) {
        if (license.type !== LICENSE_TYPES.LIFETIME && license.type !== LICENSE_TYPES.TRIAL) {
          const licensePayments = payments.filter((item) => item.licenseKey === license.licenseKey);

          const latestPaymentDate =
            licensePayments.length > 0
              ? new Date(Math.max(...licensePayments.map((p) => p.payedTill.seconds * 1000)))
              : null;

          const isPaymentRequired = latestPaymentDate ? latestPaymentDate < today : true;

          if (isPaymentRequired) return true;
        }
      }
      if (statuses.includes(LICENSE_STATUSES.VALIDITY_EXPIRED)) {
        const isExpiredChip =
          license.validTill &&
          new Date(license.validTill.seconds * 1000) < today &&
          license.type !== LICENSE_TYPES.LIFETIME;

        if (isExpiredChip) return true;
      }
      if (statuses.includes(LICENSE_STATUSES.VALIDITY_NOT_STARTED)) {
        const isValidityNotStartedChip =
          license.validFrom && new Date(license.validFrom.seconds * 1000) > today;

        if (isValidityNotStartedChip) return true;
      }
      if (statuses.includes(LICENSE_STATUSES.NOT_LINKED)) {
        const isLinkedChip = license.hardwareIds?.length !== 0;
        if (!isLinkedChip) return true;
      }

      // const hasTagOrStatus =
      //     license.disabled ||
      //     (license.type !== LICENSE_TYPES.LIFETIME && payments.some(item => item.licenseKey === license.licenseKey)) ||
      //     (license.validTill && new Date(license.validTill.seconds * 1000) < today) ||
      //     (license.validFrom && new Date(license.validFrom.seconds * 1000) > today);

      // return !!(statuses.includes(LICENSE_STATUSES.NONE) && !hasTagOrStatus);
    });
  }

  // Filter by query
  if (debouncedQuery) {
    preparedLicenses = preparedLicenses.filter(
      (license) =>
        license.licenseName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        license.comment.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        license.adminComment.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        license.licenseKey.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }

  return preparedLicenses;
};

export const alphanumericSort = <T, K extends keyof T>(a: T, b: T, key: K): number => {
  const valueA = a[key];
  const valueB = b[key];

  const strA = (valueA ?? "").toString().toLowerCase();
  const strB = (valueB ?? "").toString().toLowerCase();

  if (strA < strB) return -1;
  if (strA > strB) return 1;
  return 0;
};
export const getLicenseVersionNumbersArray = (licenses) => {
  const result = licenses.map((license) => ({
    label:
      license.versionNumber === undefined || license.versionNumber === null
        ? "N/A"
        : license.versionNumber,
    value: license.versionNumber,
  }));

  // Remove duplicates by using a Set
  return [...new Map(result.map((item) => [item.value, item])).values()];
};
