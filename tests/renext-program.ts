import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { RenextProgram } from '../target/types/renext_program';

describe('renext-program', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.RenextProgram as Program<RenextProgram>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
