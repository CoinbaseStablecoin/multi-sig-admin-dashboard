import { AbiItem } from "web3-utils";
import { ContractData } from "../components/stores/ContractStore";

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

export const DUMMY_CONTRACT: ContractData = {
  name: "PeteCoin",
  address: "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
  abi: JSON.stringify([
    {
      type: "function",
      name: "send",
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
    },
    {
      type: "function",
      name: "balance",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
    },
  ]),
};

export const DUMMY_CONTRACT_2: ContractData = {
  name: "DuckCoin",
  address: "0xDDdDddDdDdddDDddDDddDDDDdDdDDdDDdDDDDDDd",
  abi: JSON.stringify([
    {
      type: "function",
      name: "transfer",
      inputs: [
        { name: "recipient", type: "address" },
        { name: "value", type: "uint256" },
      ],
    },
    {
      type: "function",
      name: "getBalance",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
    },
  ]),
};
