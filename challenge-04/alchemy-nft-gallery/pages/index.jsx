import { useState } from 'react'
import NFTCollection from '../components/nftCollection';

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [nextPage, setNextPage] = useState(null)

  const fetchNFTs = async(pageToFetch) => {
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTs/`;
    const requestOptions = { method: 'GET' };

    let fetchURL = `${baseURL}?owner=${wallet}`;
    if (collection?.length) {
      fetchURL = `${fetchURL}&contractAddresses%5B%5D=${collection}`;

      if (pageToFetch) {
        fetchURL = `${fetchURL}&pageKey=${pageToFetch}`;
      }
    }

    const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

    setNextPage(nfts.pageKey);

    if (nfts) {
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection?.length) {
      setNextPage(null);  //Reset the paging system

      var requestOptions = {
        method: 'GET'
      };
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        setNFTs(nfts.nfts)
      }
    }
  }

  return (
    
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button disabled={!collection || (!wallet && !fetchForCollection)} className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else {
              fetchNFTs();
            }
          }
        }>Fetch NFTs </button>
      </div>
      <div className='flex justify-center w-full'>
        <button 
          disabled={!NFTs?.length || fetchForCollection} 
          className='disabled:bg-slate-400 text-white bg-green-500 px-4 py-2 mt-3 rounded-sm w-1/5 ml-1' 
          onClick={() => fetchNFTs(nextPage)}>Next page </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        <NFTCollection nfts={NFTs}></NFTCollection>
      </div>      
    </div>
  )
}

export default Home