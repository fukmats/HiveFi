// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import HivefiIDL from '../target/idl/hivefi.json';
import type { Hivefi } from '../target/types/hivefi';

// Re-export the generated IDL and type
export { Hivefi, HivefiIDL };

// The programId is imported from the program IDL.
export const DHF_PROGRAM_ID = new PublicKey(HivefiIDL.address);

// This is a helper function to get the Hivefi Anchor program.
export function getHivefiProgram(provider: AnchorProvider) {
  return new Program(HivefiIDL as Hivefi, provider);
}

// This is a helper function to get the program ID for the Hivefi program depending on the cluster.
export function getHivefiProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return DHF_PROGRAM_ID;
  }
}
