import { createNft, fetchDigitalAsset, findMetadataPda, mplTokenMetadata, verifyCollection, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";

import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
} from '@solana-developers/helpers';

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";

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

const collectionAddress = publicKey('FLHqU9HdmZDgTgHRwzCHDAoY5mybP9t7kJbkfKJ7nRUM');

const nftAddress = publicKey('CCFTnwYESp2V7DLrod52hXAxUzaX2c4YajCGNb9AkXVs');

const transaction = await verifyCollectionV1(umi, {
    metadata: findMetadataPda(umi, { mint: nftAddress }),
    collectionMint: collectionAddress,
    authority: umi.identity,
});

await transaction.sendAndConfirm(umi);

console.log('✅ Nft Verified: ', nftAddress, 'verified as member of collection: ', collectionAddress);


