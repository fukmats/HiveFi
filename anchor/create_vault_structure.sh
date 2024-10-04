#!/bin/bash

# プロジェクトのsrcディレクトリへ移動
cd programs/hivefi/src

# vaultディレクトリを作成
mkdir -p vault

# mod.rsファイルの作成
cat <<EOL > vault/mod.rs
pub mod deposit;
pub mod withdraw;
pub mod mint;
pub mod burn;
EOL

# deposit.rsファイルの作成
cat <<EOL > vault/deposit.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, TokenAccount};

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub mint_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    let cpi_accounts = MintTo {
        mint: ctx.accounts.vault.mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
    token::mint_to(cpi_ctx, amount)?;
    Ok(())
}
EOL

# withdraw.rsファイルの作成
cat <<EOL > vault/withdraw.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, TokenAccount};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub mint_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    let cpi_accounts = Burn {
        mint: ctx.accounts.vault.mint.to_account_info(),
        from: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
    token::burn(cpi_ctx, amount)?;
    Ok(())
}
EOL

# mint.rsファイルの作成
cat <<EOL > vault/mint.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, TokenAccount};

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

pub fn mint(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
    token::mint_to(cpi_ctx, amount)?;
    Ok(())
}
EOL

# burn.rsファイルの作成
cat <<EOL > vault/burn.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, TokenAccount};

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

pub fn burn(ctx: Context<BurnTokens>, amount: u64) -> Result<()> {
    let cpi_accounts = Burn {
        mint: ctx.accounts.mint.to_account_info(),
        from: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
    token::burn(cpi_ctx, amount)?;
    Ok(())
}
EOL

echo "Vaultディレクトリと必要なファイルが作成されました。"
