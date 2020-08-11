import { BASIC_TOKEN_ABI } from "../test/fixtures";
import * as abi from "./abi";
import { AbiFunction } from "./AbiFunction";

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

test("getTransactableFunctions", () => {
  const functions = abi.getTransactableFunctions(BASIC_TOKEN_ABI);
  expect(functions).toHaveLength(2);
  expect(functions[0]).toBeInstanceOf(AbiFunction);
  expect(functions[0]?.name).toEqual("transfer");
  expect(functions[0]?.payable).toBe(false);
  expect(functions[0]?.inputs).toEqual([
    {
      name: "_to",
      type: "address",
    },
    {
      name: "_value",
      type: "uint256",
    },
  ]);

  expect(functions[1]).toBeInstanceOf(AbiFunction);
  expect(functions[1]?.name).toEqual("contribute");
  expect(functions[1]?.payable).toBe(true);
  expect(functions[1]?.inputs).toEqual([]);
});
