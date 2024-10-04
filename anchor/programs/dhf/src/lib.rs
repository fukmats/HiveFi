use crate::types::Vault;  // types.rsからVaultをインポート

#[program]
pub mod strategy_vault {
    use super::*;

    pub fn create_vault(ctx: Context<CreateVault>, bump: u8) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.mint = ctx.accounts.mint.key();
        vault.authority = ctx.accounts.authority.key();
        vault.bump = bump;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateVault<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 32 + 1, seeds = [b"vault", mint.key().as_ref()], bump)]
    pub vault: Account<'info, Vault>,  // Vault型を使用
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}
