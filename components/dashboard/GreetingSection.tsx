import Image from "next/image"

export default function GreetingSection () {
    return (
        <div className="relative w-full bg-[#1e1e1e] rounded-2xl pt-4 pb-12 px-4 lg:px-8 overflow-hidden group">
            
            {/* Gradient */}
            <div className='absolute inset-0'>
                <div className='
                    absolute w-[15%] h-[15%] left-[12%] top-[50%] bg-[#29C5EE] rounded-full blur-[50px]
                    group-hover:left-[78%] group-hover:top-[40%]
                    transition-all ease-in-out duration-700
                    '
                />
                <div className='
                    absolute w-[15%] h-[15%] left-[22%] top-[50%] bg-[#CF1A2C] rounded-full blur-[50px]
                    group-hover:left-[68%] group-hover:top-[40%]
                    transition-all ease-in-out duration-700
                '/>
                <div className='
                    absolute w-[15%] h-[15%] right-[12%] bottom-[40%] bg-[#EAB04D] rounded-full blur-[50px]
                    group-hover:right-[70%] group-hover:bottom-[40%]
                    transition-all ease-in-out duration-700
                '/>
                <div className='
                    absolute w-[15%] h-[15%] right-[22%] bottom-[40%] bg-[#19C8A7] rounded-full blur-[50px]
                    group-hover:right-[58%] group-hover:bottom-[40%]
                    transition-all ease-in-out duration-700
                '/>
            </div>

            {/* Card */}
            <div className="relative z-10">

                {/* navbar */}
                <div className="flex justify-between items-center mb-8">

                    <div className="flex items-center">
                        <Image 
                            src="/images/logo.png"
                            alt="logo"
                            width={140}
                            height={24}
                            className="w-[100px] lg:w-[140px]"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 lg:gap-3">
                        <button className="p-1.5 lg:p-2 rounded-full bg-[#0a0a0a] hover:bg-[#151515] transition-colors cursor-pointer">
                            <Image 
                                src="/icons/setting-button.png"
                                alt="setting"
                                width={20}
                                height={20}
                                className="w-4 lg:w-5"
                            />
                        </button>
                        <button className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden cursor-pointer" > 
                                <Image 
                                    src="/icons/profile-picture.png"
                                    alt="profile"
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 lg:gap-0">
                    
                    {/* Left side */}
                    <div className="space-y-4 lg:space-y-6 lg:flex-1/3">
                        <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-[#FFFFFF]">Morning, Maya</h2>
                        <p className="text-[#ffffff] text-base md:text-lg lg:text-xl">Track And Manage Your Recruitment Here! </p>
                    </div>

                    {/* Right side - Stats Cards */}
                    <div className="flex flex-col sm:flex-row lg:items-center lg:justify-end gap-3 lg:gap-4 lg:flex-2/3 lg:pl-12">
                        
                        {/* Job Open */}
                        <div className="bg-[#151515] backdrop-blur-sm rounded-2xl p-4 lg:max-w-[230px] lg:flex-1/3 flex items-center justify-between gap-6 lg:gap-12 ">
                            <div className="flex flex-col items-center gap-2 lg:gap-3">
                                <div className="p-3 lg:p-4 rounded-full bg-[#1f1f1f]">
                                    <Image 
                                        src="/icons/job-close.png"
                                        alt="job open"
                                        width={20}
                                        height={20}
                                        className="w-4 lg:w-5"
                                    />
                                </div>
                                <div className="text-[#8A8A8A] text-xs whitespace-nowrap">
                                    Job Open
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 lg:gap-3">
                                <div className="text-4xl lg:text-5xl font-bold text-[#ffffff] leading-none">1234</div>
                                <div className="text-[#8a8a8a] mt-1 text-xs">Position</div>
                            </div>
                        </div>

                        {/* Job Close */}
                        <div className="bg-[#151515] backdrop-blur-sm rounded-2xl p-4 lg:max-w-[230px] lg:flex-1/3 flex items-center justify-between gap-6 lg:gap-12">
                            <div className="flex flex-col items-center gap-2 lg:gap-3">
                                <div className="p-3 lg:p-4 rounded-full bg-[#1f1f1f]">
                                    <Image 
                                        src="/icons/job-close.png"
                                        alt="job close"
                                        width={20}
                                        height={20}
                                        className="w-4 lg:w-5"
                                    />
                                </div>
                                <div className="text-[#8A8A8A] text-xs whitespace-nowrap">
                                    Job Close
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 lg:gap-3">
                                <div className="text-4xl lg:text-5xl font-bold text-[#ffffff] leading-none">1234</div>
                                <div className="text-[#8a8a8a] mt-1 text-xs">Position</div>
                            </div>
                        </div>

                        {/* Applicant */}
                        <div className="bg-[#151515] backdrop-blur-sm rounded-2xl p-4 lg:max-w-[230px] lg:flex-1/3 flex items-center justify-between gap-6 lg:gap-12">
                            <div className="flex flex-col items-center gap-2 lg:gap-3">
                                <div className="p-3 lg:p-4 rounded-full bg-[#1f1f1f]">
                                    <Image 
                                        src="/icons/applicant.png"
                                        alt="applicant"
                                        width={20}
                                        height={20}
                                        className="w-4 lg:w-5"
                                    />
                                </div>
                                <div className="text-[#8A8A8A] text-xs whitespace-nowrap">
                                    Applicant
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 lg: gap-3">
                                <div className="text-4xl lg:text-5xl font-bold text-[#ffffff] leading-none">12</div>
                                <div className="text-[#8a8a8a] mt-1 text-xs">Position</div>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>
    )
}