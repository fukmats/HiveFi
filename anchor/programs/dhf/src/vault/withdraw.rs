use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, TokenAccount, Token};
use crate::types::Vault;
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
