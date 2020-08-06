import { BASIC_TOKEN_ABI } from "../test/fixtures";
import * as abi from "./abi";

test("isValidAbi", () => {
  expect(abi.isValidAbi([])).toBe(true);
  expect(abi.isValidAbi([{ type: "function", name: "foo", inputs: [] }])).toBe(
    true
  );
  expect(
    abi.isValidAbi([
      { type: "function", name: "foo", inputs: [] },
      {
        type: "function",
        name: "bar",
        inputs: [{ name: "account", type: "address" }],
      },
    ])
  ).toBe(true);
  expect(
    abi.isValidAbi([
      { type: "function", name: "foo", inputs: [] },
      {
        type: "function",
        name: "bar",
        inputs: [{ name: "account", type: "address" }],
        payable: true,
      },
      {
        type: "function",
        name: "baz",
        inputs: [
          { name: "accounts", type: "address[]" },
          {
            name: "tuple",
            type: "tuple",
            components: [
              { name: "car", type: "string" },
              { name: "cdr", type: "string" },
            ],
          },
        ],
      },
      {
        type: "constructor",
        inputs: [{ name: "implementation", type: "address" }],
        stateMutability: "nonpayable",
      },
    ])
  ).toBe(true);

  expect(abi.isValidAbi([{ name: "foo", inputs: [] }])).toBe(false);
  expect(abi.isValidAbi([{ type: "function", inputs: [] }])).toBe(false);
  expect(abi.isValidAbi([{ type: "function", name: "foo" }])).toBe(false);
  expect(
    abi.isValidAbi([
      { type: "function", name: "foo", inputs: [], payable: "foo" },
    ])
  ).toBe(false);
  expect(abi.isValidAbi(null)).toBe(false);
  expect(abi.isValidAbi(false)).toBe(false);
  expect(abi.isValidAbi({})).toBe(false);
});

test("parseAbiJson", () => {
  expect(abi.parseAbiJson("[]")).toEqual([]);
  expect(
    abi.parseAbiJson(`[{"type":"function","name":"foo","inputs":[]}]`)
  ).toEqual([{ type: "function", name: "foo", inputs: [] }]);

  expect(() => abi.parseAbiJson("")).toThrow(SyntaxError);
  expect(() => abi.parseAbiJson(`[{"type":"function","inputs":[]}]`)).toThrow(
    Error
  );
});

test("isValidAbiJson", () => {
  expect(abi.isValidAbiJson("[]")).toBe(true);
  expect(
    abi.isValidAbiJson(`[{"type":"function","name":"foo","inputs":[]}]`)
  ).toBe(true);

  expect(abi.isValidAbiJson("")).toBe(false);
  expect(abi.isValidAbiJson(`[{"type":"function","inputs":[]}]`)).toBe(false);
});

test("getFunctions", () => {
  expect(abi.getFunctions(BASIC_TOKEN_ABI)).toEqual([
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
  ]);
});
