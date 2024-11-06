import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
} from '@solana-developers/helpers';

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl('devnet'));

const user = await getKeypairFromFile();

await airdropIfRequired(
    connection,
    user.publicKey,
    1*LAMPORTS_PER_SOL,
    0.5*LAMPORTS_PER_SOL
);

console.log('loaded User', user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

umi.use(keypairIdentity(umiUser));

console.log('Set up an umi instance with for user');

const collectionMint = generateSigner(umi);

const transaction = createNft( umi, {
    mint: collectionMint,
    name: 'MyCollection',
    symbol: 'SB',
    uri: 'https://...',
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
    }

)
// new Transaction().add(collectionMint,);

await transaction.sendAndConfirm(umi);

const createdCollectionNft = await fetchDigitalAsset(
    umi,
    collectionMint.publicKey,
);

console.log('Created Collection', getExplorerLink('address', createdCollectionNft.mint.publicKey, 'devnet'));



