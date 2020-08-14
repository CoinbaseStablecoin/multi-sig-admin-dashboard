import { abiCoder } from "../util/abi";
import { makeTimestamp } from "../util/timestamp";
import { uid } from "../util/uid";
import { MarshaledTx, Transaction, TxParams } from "./Transaction";

interface MarshaledConfigureTx extends MarshaledTx {
  type: typeof ConfigureTx.type;
  targetContract: string;
  selector: string;
  minApprovals: number;
  maxOpenProposals: number;
  approvers: string[];
}

export function isMarshaledConfigureTx(
  data: MarshaledTx
): data is MarshaledConfigureTx {
  return data.type === ConfigureTx.type;
}

export class ConfigureTx extends Transaction {
  public static readonly type = "Configure";

  public constructor(
    public readonly targetContract: string,
    public readonly selector: string,
    public readonly minApprovals: number,
    public readonly maxOpenProposals: number,
    public readonly approvers: string[],
    public readonly id = uid(),
    public readonly timestamp = makeTimestamp()
  ) {
    super();
  }

  public static unmarshal(data: MarshaledConfigureTx): ConfigureTx {
    return new ConfigureTx(
      data.targetContract,
      data.selector,
      data.minApprovals,
      data.maxOpenProposals,
      data.approvers,
      data.id,
      data.timestamp
    );
  }

  public marshal(): MarshaledConfigureTx {
    return {
      type: ConfigureTx.type,
      id: this.id,
      targetContract: this.targetContract,
      selector: this.selector,
      minApprovals: this.minApprovals,
      maxOpenProposals: this.maxOpenProposals,
      approvers: this.approvers,
      timestamp: this.timestamp,
    };
  }

  public params(): TxParams {
    return {
      ...super.params(),
      data: abiCoder.encodeParameters(
        [
          "address", // targetContract
          "bytes4", // selector
          "uint256", // minApprovals
          "uint256", // maxOpenProposals
          "address[]", // approvers
        ],
        [
          this.targetContract,
          this.selector,
          this.minApprovals,
          this.maxOpenProposals,
          this.approvers,
        ]
      ),
    };
  }
}
