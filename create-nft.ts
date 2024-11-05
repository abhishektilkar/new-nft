import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
} from '@solana-developers/helpers';

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
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

// const collectionAddress = new PublicKey('FLHqU9HdmZDgTgHRwzCHDAoY5mybP9t7kJbkfKJ7nRUM');
const collectionAddress = publicKey('FLHqU9HdmZDgTgHRwzCHDAoY5mybP9t7kJbkfKJ7nRUM');

console.log('Creating NFT ...');


const mint = generateSigner(umi);

const transaction = await createNft(umi, {
    mint,
    name: 'MyNft',
    uri: 'https://...',
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAddress,
        verified: false,

    }
});

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi, mint.publicKey);

console.log('Created Nft Address is 🖼️:', getExplorerLink('address', createdNft.mint.publicKey, 'devnet'));

