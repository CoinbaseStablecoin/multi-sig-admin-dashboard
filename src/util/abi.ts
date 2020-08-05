import { AbiInput, AbiItem } from "web3-utils";

/**
 * Check whether a given object is an array of valid AbiItem objects
 * @param abi Object to validate
 * @returns True if valid
 */
export function isValidAbi(abi: any): abi is AbiItem[] {
  if (!Array.isArray(abi)) {
    return false;
  }

  for (const item of abi) {
    if (!isValidAbiItem(item)) {
      return false;
    }
  }

  return true;
}

/**
 * Parse Ethereum ABI JSON
 * @param json ABI JSON
 * @throws {Error} Invalid ABI
 * @throws {SyntaxError} Invalid JSON
 * @returns An array of AbiItem
 */
export function parseAbiJson(json: string): AbiItem[] {
  const abi = JSON.parse(json);
  if (!isValidAbi(abi)) {
    throw new Error("Invalid ABI");
  }
  return abi;
}

/**
 * Validate Ethereum ABI JSON
 * @param json ABI JSON
 * @returns True if valid
 */
export function isValidAbiJson(json: string): boolean {
  try {
    parseAbiJson(json);
  } catch {
    return false;
  }
  return true;
}

/**
 * Get functions from an array of AbiItem
 * @param abi An array of AbiItem
 * @returns An array of AbiItem of the type "function"
 */
export function getFunctions(abi: AbiItem[]): AbiItem[] {
  return abi.filter((item) => item.type === "function");
}

/**
 * Check whether a given object is a valid AbiItem
 * @param abi Object to validate
 * @returns True if valid
 */
function isValidAbiItem(item: any): item is AbiItem {
  if (
    !item ||
    typeof item.name !== "string" ||
    typeof item.type !== "string" ||
    (item.payable != null && typeof item.payable !== "boolean")
  ) {
    return false;
  }

  if (item.type === "function") {
    if (!Array.isArray(item.inputs)) {
      return false;
    }

    for (const input of item.inputs) {
      if (!isValidAbiInput(input)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check whether a given object is a valid AbiInput
 * @param abi Object to validate
 * @returns True if valid
 */
function isValidAbiInput(input: any): input is AbiInput {
  if (
    !input ||
    typeof input.name !== "string" ||
    typeof input.type !== "string"
  ) {
    return false;
  }

  if (Array.isArray(input.components)) {
    for (const component of input.components) {
      if (!isValidAbiInput(component)) {
        return false;
      }
    }
  }

  return true;
}
