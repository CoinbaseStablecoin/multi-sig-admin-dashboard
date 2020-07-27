import { networks } from "./networks";

const {
  REACT_APP_INFURA_KEY,
  REACT_APP_CONTRACT_ADDRESS,
  REACT_APP_NETWORK,
} = process.env;

if (!REACT_APP_INFURA_KEY) {
  console.error("REACT_APP_INFURA_KEY is required (INFURA Project ID)");
}
if (!REACT_APP_CONTRACT_ADDRESS) {
  console.error(
    "REACT_APP_CONTRACT_ADDRESS is required (MultiSigAdmin contract address)"
  );
}

const network = networks[REACT_APP_NETWORK || ""];
if (!network) {
  console.error("REACT_APP_NETWORK is required (Network name)");
}

export const INFURA_KEY = REACT_APP_INFURA_KEY || "";
export const CONTRACT_ADDRESS = REACT_APP_CONTRACT_ADDRESS || "";
export const NETWORK = network;
