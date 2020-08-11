import { AbiFunction } from "./AbiFunction";

test("Constructor", () => {
  let func = new AbiFunction({ type: "function", name: "foo", inputs: [] });
  expect(func.name).toEqual("foo");
  expect(func.inputs).toEqual([]);
  expect(func.payable).toBe(false);
  expect(func.transactable).toBe(true);

  func = new AbiFunction({
    type: "function",
    name: "bar",
    payable: true,
  });
  expect(func.name).toEqual("bar");
  expect(func.inputs).toEqual([]);
  expect(func.payable).toBe(true);
  expect(func.transactable).toBe(true);

  func = new AbiFunction({
    type: "function",
    name: "baz",
    inputs: [{ name: "account", type: "address" }],
    stateMutability: "payable",
  });
  expect(func.name).toEqual("baz");
  expect(func.inputs).toEqual([{ name: "account", type: "address" }]);
  expect(func.payable).toBe(true);
  expect(func.transactable).toBe(true);

  func = new AbiFunction({
    type: "function",
    name: "qux",
    inputs: [],
    stateMutability: "view",
  });
  expect(func.name).toEqual("qux");
  expect(func.inputs).toEqual([]);
  expect(func.payable).toBe(false);
  expect(func.transactable).toBe(false);

  func = new AbiFunction({
    type: "function",
    name: "quux",
    inputs: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
    ],
    stateMutability: "pure",
  });
  expect(func.name).toEqual("quux");
  expect(func.inputs).toEqual([
    { name: "a", type: "uint256" },
    { name: "b", type: "uint256" },
  ]);
  expect(func.payable).toBe(false);
  expect(func.transactable).toBe(false);

  func = new AbiFunction({
    type: "function",
    name: "quuux",
    inputs: [],
    constant: true,
  });
  expect(func.name).toEqual("quuux");
  expect(func.inputs).toEqual([]);
  expect(func.payable).toBe(false);
  expect(func.transactable).toBe(false);
});

test("signature", () => {
  const func = new AbiFunction({
    type: "function",
    name: "foo",
    inputs: [
      { name: "a", type: "uint256" },
      { name: "b", type: "string" },
    ],
    stateMutability: "pure",
  });

  expect(func.signature()).toEqual("foo(uint256,string)");
  expect(func.signature(false)).toEqual("foo(uint256,string)");
  expect(func.signature(true)).toEqual("foo(uint256 a, string b)");
});

test("selector", () => {
  let func = new AbiFunction({
    type: "function",
    name: "transfer",
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    stateMutability: "nonpayable",
  });

  expect(func.selector).toEqual("0xa9059cbb");

  func = new AbiFunction({
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "_owner", type: "address" }],
    stateMutability: "view",
  });

  expect(func.selector).toEqual("0x70a08231");
});
