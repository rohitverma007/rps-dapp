// A simple Rock-Paper-Scissors contract that uses a PRNG to generate the contract's choice
// and stores the stats in the contract's storage. Rock is represented by 1, Paper by 2 and
// Scissors by 3.
#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

const P_WINS: Symbol = symbol_short!("p_wins");
const C_WINS: Symbol = symbol_short!("c_wins");

#[contract]
pub struct RPSContract;

// 1 - Rock
// 2 - Paper
// 3 - Scissors

#[contractimpl]
impl RPSContract {
    pub fn play(env: Env, player_choice: u64) -> u64 {
        // We use a PRNG to generate the contract's choice
        let contract_choice = env.prng().gen_range(1..=3);
        let result = RPSContract::determine_winner(player_choice, contract_choice);

        // We update the stats
        let mut p_wins: u64 = env.storage().instance().get(&P_WINS).unwrap_or(0);
        let mut c_wins: u64 = env.storage().instance().get(&C_WINS).unwrap_or(0);
        match result {
            1 => {
                p_wins += 1;
                env.storage().instance().set(&P_WINS, &p_wins);
            },
            2 => {
                c_wins += 1;
                env.storage().instance().set(&C_WINS, &c_wins);
            },
            _ => (),
        }
        result
    }

    pub fn determine_winner(player: u64, contract: u64) -> u64 {
        // Depending on the choices, we determine the winner
        match (player, contract) {
            (1, 3) | (2, 1) | (3, 2) => 1, // Player wins
            (1, 2) | (2, 3) | (3, 1) => 2, // Contract wins
            _ => 0, // Tie
        }
    }
}
