'use client';

import { getHivefiProgram, getHivefiProgramId } from '@hivefi/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useHivefiProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getHivefiProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getHivefiProgram(provider);

  const accounts = useQuery({
    queryKey: ['hivefi', 'all', { cluster }],
    queryFn: () => program.account.hivefi.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['hivefi', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ hivefi: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useHivefiProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useHivefiProgram();

  const accountQuery = useQuery({
    queryKey: ['hivefi', 'fetch', { cluster, account }],
    queryFn: () => program.account.hivefi.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['hivefi', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ hivefi: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['hivefi', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ hivefi: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['hivefi', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ hivefi: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['hivefi', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ hivefi: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
