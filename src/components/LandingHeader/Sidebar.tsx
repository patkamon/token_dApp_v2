import Link from 'next/link';
import React from 'react';
import ConnectButton from './ConnectWeb3Button';
import Image from 'next/image';
import { useData } from "@/contexts/showSideBarContext";

export default function Sidebar() {
    const { showSideBar, setShowSideBar } = useData();

    return (
        <div className='flex flex-col w-full  items-start px-8 py-6 gap-6 bg-secondary-200'>
            <div className='flex flex-col items-start text-sm text-white'>
                <Link href='/create-token' className='py-2'>
                    Create Token
                </Link>
                <Link href='/' className='py-2'>
                    Hot Tokens
                </Link>
                <Link href='/faq' className='py-2'>
                    FAQ
                </Link>
                <Link href='/#contact' className='py-2'>
                    Contact
                </Link>
            </div>
            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-4'>
                    
                </div>
                <Image
                    src='/icons/UK.svg'
                    alt='uk'
                    width={24}
                    height={24}
                    className='rounded-full'
                    onClick={() => setShowSideBar(!showSideBar)}
                />
            </div>
            <ConnectButton/>
        </div>
    )
}
