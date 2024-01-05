// npm packages
import { check, request, RESULTS } from "react-native-permissions";

// interface and types
import { Permission, Rationale } from "react-native-permissions/src/types";

/** Start Functions **/
export const askForPermission = async (
  permission: Permission,
  permissionAlert?: Rationale | undefined
) => {
  // 1) Get the status of the permission
  const permissionStatus = await check(permission);

  // 2) If the Result is UNAVAILABLE log in console and return true
  if (permissionStatus === RESULTS.UNAVAILABLE) {
    console.warn(`This feature is not available on this device .`);
    return true;
  }

  // 3) If the Permission is granted return true if blocked return false
  if (
    permissionStatus === RESULTS.GRANTED ||
    permissionStatus === RESULTS.BLOCKED
  ) {
    return permissionStatus === RESULTS.GRANTED;
  }

  // 4) The last possibility is DENIED, So request Permission and return the result
  else {
    const result = await request(permission, permissionAlert);
    return result === RESULTS.GRANTED;
  }
};
/** End Functions **/
