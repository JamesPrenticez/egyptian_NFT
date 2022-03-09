const data = ["Maat", "Ra", "Tutankhamun", "Osiris"]

function LandingPage() {
    return (
        <>
            <h1 className="text-6xl font-bold">
              Welcome to
            </h1>
            <p className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 text-transparent bg-clip-text leading-relaxed">
              {" "}
              Ancient Egyptian NFT's!
            </p>
            <div className="p-4 font-bold text-xl">
                <p>⚔️ Pick a Hero to help slay Ammit - The Devourer of Souls ⚔️</p>
            </div>
            <div className="mt-20 grid grid-cols-5 justify-items-center ">
                <div onClick={() => selectWhichNFT(`${data[0]}`)} className="transform -scale-x-1 h-full w-full grid justify-items-center items-end hover:cursor-pointer">
                    <img  className="h-auto w-2/6 filter hover:drop-shadow-red" src={`${data[0]}.png`} />
                </div>
                <div onClick={() => selectWhichNFT(`${data[1]}`)} className="transform -scale-x-1 h-full w-full grid justify-items-center items-end hover:cursor-pointer">
                    <img className="h-auto w-2/6 filter hover:drop-shadow-yellow" src={`${data[1]}.png`} />
                </div>
                <img 
                    className="h-84 transform hover:-scale-x-1 filter drop-shadow-pink" 
                    src="Ammit1.png"
                    alt=""
                />
                <div onClick={() => selectWhichNFT(`${data[3]}`)} className="h-full w-full grid justify-items-center items-end hover:cursor-pointer">
                    <img className="h-auto w-2/6 filter hover:drop-shadow-green" src={`${data[2]}.png`} />
                </div>
                <div onClick={() => selectWhichNFT(`${data[4]}`)} className="h-full w-full grid justify-items-center items-end hover:cursor-pointer">
                    <img className="h-auto w-2/6 filter hover:drop-shadow-white" src={`${data[3]}.png`} />
                </div>
            </div>
        </>
    )

}

export default LandingPage