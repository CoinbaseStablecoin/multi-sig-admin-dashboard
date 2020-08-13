import { AbiItem } from "web3-utils";
import { MarshaledContract } from "../models/Contract";

export const BASIC_TOKEN_ABI: AbiItem[] = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "contribute",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

export const DUMMY_CONTRACT: MarshaledContract = {
  name: "PeteCoin",
  address: "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
  abi: JSON.stringify([
    {
      // selector: d0679d34
      type: "function",
      name: "send",
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      stateMutability: "nonpayable",
    },
    {
      // selector: e3d670d7
      type: "function",
      name: "balance",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
  ]),
};

export const DUMMY_CONTRACT_SELECTOR_1 = "0xd0679d34";
export const DUMMY_CONTRACT_SELECTOR_2 = "0xe3d670d7";

export const DUMMY_CONTRACT_2: MarshaledContract = {
  name: "DuckCoin",
  address: "0xDDdDddDdDdddDDddDDddDDDDdDdDDdDDdDDDDDDd",
  abi: JSON.stringify([
    {
      // selector: a9059cbb
      type: "function",
      name: "transfer",
      inputs: [
        { name: "recipient", type: "address" },
        { name: "value", type: "uint256" },
      ],
      stateMutability: "nonpayable",
    },
    {
      // selector: f8b2cb4f
      type: "function",
      name: "getBalance",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
  ]),
};

export const VALID_ADDRESS = "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa";
export const VALID_ADDRESS_2 = "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB";
