import { bip32 } from 'bitcoinjs-lib';
import { IHDWallet, HDWallet, HDMWallet } from './wallet';
import { HDWalletMatcher } from './matcher';

export class HDWalletGenerator {
  private cosigners: bip32.BIP32Interface[];
  private coMembers: number;

  constructor(strCosigner: string[] = null, coMembers: number = 2) {
    if (strCosigner) {
      this.cosigners = strCosigner.map(m => bip32.fromBase58(m));
      this.coMembers = coMembers;
    }
  }

  async generate(matcher: HDWalletMatcher): Promise<IHDWallet> {
    let wallet: IHDWallet;
    do {
      wallet = await HDWallet.make();

      if (this.cosigners) {
        wallet = new HDMWallet(wallet, this.cosigners, this.coMembers);
        if (matcher.matchHDM(wallet)) break;
      } else {
        if (matcher.matchHD(wallet)) break;
      }
    } while (true);

    return wallet;
  }
}
