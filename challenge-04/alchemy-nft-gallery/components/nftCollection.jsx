import NFTCard from "./nftCard";

export const NFTCollection = ({ nfts }) => {

    return (
        <>
        {
            nfts && nfts.map(nft => {
              return (
                <NFTCard nft={nft} key={nft.id.tokenId}></NFTCard>
              )
            })
        }
        </>
    );
}

export default NFTCollection;