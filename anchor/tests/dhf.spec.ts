import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Hivefi } from '../target/types/hivefi';

describe('hivefi', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Hivefi as Program<Hivefi>;

  const hivefiKeypair = Keypair.generate();

  it('Initialize Hivefi', async () => {
    await program.methods
      .initialize()
      .accounts({
        hivefi: hivefiKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([hivefiKeypair])
      .rpc();

    const currentCount = await program.account.hivefi.fetch(hivefiKeypair.publicKey);

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Hivefi', async () => {
    await program.methods
      .increment()
      .accounts({ hivefi: hivefiKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.hivefi.fetch(hivefiKeypair.publicKey);

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Hivefi Again', async () => {
    await program.methods
      .increment()
      .accounts({ hivefi: hivefiKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.hivefi.fetch(hivefiKeypair.publicKey);

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Hivefi', async () => {
    await program.methods
      .decrement()
      .accounts({ hivefi: hivefiKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.hivefi.fetch(hivefiKeypair.publicKey);

    expect(currentCount.count).toEqual(1);
  });

  it('Set hivefi value', async () => {
    await program.methods.set(42).accounts({ hivefi: hivefiKeypair.publicKey }).rpc();

    const currentCount = await program.account.hivefi.fetch(hivefiKeypair.publicKey);

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the hivefi account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        hivefi: hivefiKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.hivefi.fetchNullable(
      hivefiKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
