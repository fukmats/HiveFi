use anchor_lang::prelude::*;

// Vaultアカウントの定義
#[account]
pub struct Vault {
    pub mint: Pubkey,          // 資産トークンのMintアカウント
    pub authority: Pubkey,     // Vaultの管理者
    pub bump: u8,              // PDAのバンプシード
}
