import * as address from "./address";

test("shortenAddress", () => {
  expect(
    address.shortenAddress("0x0000000000000000000000000000000000000000")
  ).toEqual("0x0000⋯0000");

  expect(
    address.shortenAddress("0x33907bB48AD33aC84C2dC904715FF36faCfe81a3")
  ).toEqual("0x3390⋯81a3");
});

test("etherscanAddress", () => {
  expect(
    address.etherscanAddress(
      "0x0000000000000000000000000000000000000000",
      "mainnet"
    )
  ).toEqual(
    "https://mainnet.etherscan.io/address/0x0000000000000000000000000000000000000000"
  );

  expect(
    address.etherscanAddress(
      "0x33907bB48AD33aC84C2dC904715FF36faCfe81a3",
      "ropsten"
    )
  ).toEqual(
    "https://ropsten.etherscan.io/address/0x33907bB48AD33aC84C2dC904715FF36faCfe81a3"
  );
});

test("isValidAddress", () => {
  expect(
    address.isValidAddress("0x0000000000000000000000000000000000000000")
  ).toBe(true);
  expect(
    address.isValidAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  ).toBe(true);
  expect(
    address.isValidAddress("0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
  ).toBe(true);
  expect(
    address.isValidAddress("0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa")
  ).toBe(true);
  expect(
    address.isValidAddress("0xAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaa")
  ).toBe(false);

  expect(address.isValidAddress("")).toBe(false);
  expect(address.isValidAddress("0x")).toBe(false);
  expect(
    address.isValidAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabb")
  ).toBe(false);
});

test("toChecksumAddress", () => {
  expect(
    address.toChecksumAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  ).toEqual("0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa");
  expect(
    address.toChecksumAddress("0xAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaa")
  ).toEqual("0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa");
  expect(
    address.toChecksumAddress("0x33907bb48ad33ac84c2dc904715ff36facfe81a3")
  ).toEqual("0x33907bB48AD33aC84C2dC904715FF36faCfe81a3");

  expect(() => address.toChecksumAddress("")).toThrow(Error);
  expect(() => address.toChecksumAddress("0x")).toThrow(Error);
});
