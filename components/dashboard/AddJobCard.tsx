import Image from "next/image"

interface AddJobCardProps {
    onClick: () => void 
}

export default function AddJobCard({onClick} : AddJobCardProps) {
    return (
        <button
            onClick={onClick} 
            className="relative bg-[#1e1e1e] rounded-2xl p-5 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
        >
            
            <div className="absolute inset-0">
                <div className='absolute w-[25%] h-[25%] -left-[10%] -top-[5%] bg-[#29C5EE] rounded-full blur-[75px]'/>
                <div className='absolute w-[25%] h-[25%] -right-[20%] -top-[20%] bg-[#CF1A2C] rounded-full blur-[75px]'/>
                <div className='absolute w-[25%] h-[25%] -left-[10%] -bottom-[5%] bg-[#EAB04D] rounded-full blur-[75px]'/>
                <div className='absolute w-[25%] h-[25%] -right-[20%] -bottom-[20%] bg-[#19C8A7] rounded-full blur-[75px]'/>
            </div>

            <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ffffff]/10 hover:bg-[#2a2a2a] transition-colors flex items-center justify-center cursor-pointer">
                    <Image 
                        src="/icons/add.png"
                        alt="add"
                        height={45}
                        width={45}
                    />
                </div>
                <p className="text-white font-bold text-lg">Add New Job</p>
            </div>
        </button>
    )
}