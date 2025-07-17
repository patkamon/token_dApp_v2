'use client';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ExitIcon, WhiteWalletIcon } from "./SvgIcon";
import { toast } from 'react-toastify';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export default function ConnectWallet() {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [balanceInterval, setBalanceInterval] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            // Check if wallet is already connected
            checkIfWalletIsConnected();

            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnectWallet(); // No accounts = user disconnected
                } else {
                    setAccount(accounts[0]);
                    fetchBalance(web3Instance, accounts[0]);
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            toast.error('Please install MetaMask!');
            return;
        }

        try {
            const accounts: string[] = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            const selected = accounts[0];
            setAccount(selected);
            toast.success('Wallet connected!');
            if (web3) fetchBalance(web3, selected);

            // pull balance every 5 seconds for real-time updates
            const intervalId = setInterval(() => {
                if (web3 && selected) fetchBalance(web3, selected);
            }, 5000);
            setBalanceInterval(intervalId);
        } catch (err) {
            console.error('Wallet connection error:', err);
            toast.error('Failed to connect wallet.');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance(null);
        if (balanceInterval) {
            clearInterval(balanceInterval);
            setBalanceInterval(null);
        }
        toast.info('To fully disconnect, please remove this site from MetaMask\'s connected sites.');
    };

    const checkIfWalletIsConnected = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const connectedAccount = accounts[0];
                setAccount(connectedAccount);
                if (web3) fetchBalance(web3, connectedAccount);
            }
        }
    };

    const fetchBalance = async (web3Instance: Web3, address: string) => {
        try {
            const balanceWei = await web3Instance.eth.getBalance(address);
            const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
            setBalance(parseFloat(balanceEth).toFixed(2));
        } catch (err) {
            console.error('Error fetching balance:', err);
        }
    };

    return (
        <div>
            {account ? (
                <button
                    onClick={disconnectWallet}
                    className="flex gap-2 items-center bg-primary-200 group relative text-white px-4 py-2 rounded hover:bg-[#89C7B5]"
                >
                    <span className='hidden group-hover:block'>
                        <ExitIcon />
                    </span>
                    <p>{balance} ETH | {account.slice(0, 4)}...{account.slice(-4)}</p>
                </button>
            ) : (
                <button
                    onClick={connectWallet}
                    className="flex gap-2 items-center bg-primary-200 text-white px-4 py-2 rounded hover:bg-[#89C7B5]"
                >
                    <WhiteWalletIcon />
                    Connect Wallet
                </button>
            )}
        </div>
    );
}
