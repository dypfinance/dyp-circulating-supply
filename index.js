#!/usr/bin/env node
const cors = require('cors')
const express = require('express')
const BigNumber = require('bignumber.js')
const Web3 = require('web3')

const { JSDOM } = require( "jsdom" )
const { window } = new JSDOM( "" )
const $ = require( "jquery" )( window )

const fetch = require("node-fetch")

const infuraWeb3 = new Web3('https://mainnet.infura.io/v3/94608dc6ddba490697ec4f9b723b586e')

// MAKE SURE THIS ADDRESS IS LOWERCASE
const TOKEN_ADDRESS = "0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17"
const TOKEN_ADDRESS_IDYP = "0xbd100d061e120b2c67a24453cf6368e63f1be056"
const PRICE_ADDRESS = "0x4185e6f61549133c34ffaf88c92a943fcde51619"

const config = {
	avax_endpoint: 'https://api.avax.network/ext/bc/C/rpc',
	bsc_endpoint: 'https://bsc-dataseed.binance.org/',
	// address of eth token on bsc!
	claim_as_eth_address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
	reward_token_address: '0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17',
	reward_token_address2: '0xbd100d061e120b2c67a24453cf6368e63f1be056',
	pancakeswap_router_address: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
	pangolin_router_address: '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106',
	uniswap_router_address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
	BUSD_address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
	USDCe_address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
	USDC_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',

	cg_ids: {
		'main': 'binancecoin',
		'platform-token': 'defi-yield-protocol',

		// lowercase token address => coingecko id
		'0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17': 'defi-yield-protocol',
	},

	cg_ids_avax: {
		'main': 'avalanche-2',
		'platform-token': 'defi-yield-protocol',

		// lowercase token address => coingecko id
		'0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17': 'defi-yield-protocol',
	},

	cg_ids_eth: {
		'main': 'ethereum',
		'platform-token': 'defi-yield-protocol',

		// lowercase token address => coingecko id
		'0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17': 'defi-yield-protocol',
	}
}

const bscWeb3 = new Web3(config.bsc_endpoint)
const avaxWeb3 = new Web3(config.avax_endpoint)

const TOKEN_ABI = [
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "remaining",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_extraData",
				"type": "bytes"
			}
		],
		"name": "approveAndCall",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseApproval",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseApproval",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "initialSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "transferAnyERC20Token",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const STAKING_ABI = [
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "swapPath",
				"type": "address[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "EthRewardsDisbursed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "holder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "EthRewardsTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RewardsDisbursed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "holder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RewardsTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "BURN_ADDRESS",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAGIC_NUMBER",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SLIPPAGE_TOLERANCE_X_100",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "SWAP_PATH",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "addContractBalance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "adminCanClaimAfter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "adminClaimableTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "burnOrDisburseTokensPeriod",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "burnRewardTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "cliffTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractDeployTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountToDeposit",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "depositTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "depositedTokens",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "disburseAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "disburseDuration",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "disbursePercentX100",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "disburseRewardTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountToWithdraw",
				"type": "uint256"
			}
		],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "startIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endIndex",
				"type": "uint256"
			}
		],
		"name": "getDepositorsList",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "stakers",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "stakingTimestamps",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "lastClaimedTimeStamps",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "stakedTokens",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMaxSwappableAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getNumberOfHolders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPendingDisbursement",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_holder",
				"type": "address"
			}
		],
		"name": "getPendingDivs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_holder",
				"type": "address"
			}
		],
		"name": "getPendingDivsEth",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastBurnOrTokenDistributeTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastClaimedTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastDisburseTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastDivPoints",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastEthDivPoints",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastSwapExecutionTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapAttemptPeriod",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokensToBeDisbursedOrBurnt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokensToBeSwapped",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalClaimedRewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalClaimedRewardsEth",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalDivPoints",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "totalEarnedEth",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "totalEarnedTokens",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalEthDivPoints",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalTokens",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "transferAnyERC20Token",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "transferAnyOldERC20Token",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "trustedDepositTokenAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "trustedRewardTokenAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "uniswapRouterV2",
		"outputs": [
			{
				"internalType": "contract IUniswapV2Router02",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "uniswapV2Pair",
		"outputs": [
			{
				"internalType": "contract IUniswapV2Pair",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountToWithdraw",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const PRICE_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getThePriceBnb",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getThePriceEth",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const TOKEN_ABI_AVAX = [{"type":"constructor","stateMutability":"nonpayable","inputs":[]},{"type":"event","name":"AddSupportedChainId","inputs":[{"type":"uint256","name":"chainId","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"AddSwapToken","inputs":[{"type":"address","name":"contractAddress","internalType":"address","indexed":false},{"type":"uint256","name":"supplyIncrement","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"Approval","inputs":[{"type":"address","name":"owner","internalType":"address","indexed":true},{"type":"address","name":"spender","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"MigrateBridgeRole","inputs":[{"type":"address","name":"newBridgeRoleAddress","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"Mint","inputs":[{"type":"address","name":"to","internalType":"address","indexed":false},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false},{"type":"address","name":"feeAddress","internalType":"address","indexed":false},{"type":"uint256","name":"feeAmount","internalType":"uint256","indexed":false},{"type":"bytes32","name":"originTxId","internalType":"bytes32","indexed":false}],"anonymous":false},{"type":"event","name":"RemoveSwapToken","inputs":[{"type":"address","name":"contractAddress","internalType":"address","indexed":false},{"type":"uint256","name":"supplyDecrement","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"Swap","inputs":[{"type":"address","name":"token","internalType":"address","indexed":false},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"Unwrap","inputs":[{"type":"uint256","name":"amount","internalType":"uint256","indexed":false},{"type":"uint256","name":"chainId","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"addSupportedChainId","inputs":[{"type":"uint256","name":"chainId","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"addSwapToken","inputs":[{"type":"address","name":"contractAddress","internalType":"address"},{"type":"uint256","name":"supplyIncrement","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"allowance","inputs":[{"type":"address","name":"owner","internalType":"address"},{"type":"address","name":"spender","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"approve","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOf","inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"burn","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"burnFrom","inputs":[{"type":"address","name":"account","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"chainIds","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"uint8"}],"name":"decimals","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"decreaseAllowance","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"subtractedValue","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"increaseAllowance","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"addedValue","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"migrateBridgeRole","inputs":[{"type":"address","name":"newBridgeRoleAddress","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"mint","inputs":[{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"address","name":"feeAddress","internalType":"address"},{"type":"uint256","name":"feeAmount","internalType":"uint256"},{"type":"bytes32","name":"originTxId","internalType":"bytes32"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"name","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"removeSwapToken","inputs":[{"type":"address","name":"contractAddress","internalType":"address"},{"type":"uint256","name":"supplyDecrement","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"swap","inputs":[{"type":"address","name":"token","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"swapSupply","inputs":[{"type":"address","name":"token","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"symbol","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalSupply","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transfer","inputs":[{"type":"address","name":"recipient","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transferFrom","inputs":[{"type":"address","name":"sender","internalType":"address"},{"type":"address","name":"recipient","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"unwrap","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint256","name":"chainId","internalType":"uint256"}]}]

const LP_IDs = {
	"eth": [
		"0xba7872534a6c9097d805d8bee97e030f4e372e54-0xa7d6f5fa9b0be0e98b3b40e6ac884e53f2f9460e",
		"0xba7872534a6c9097d805d8bee97e030f4e372e54-0x0b0a544ae6131801522e3ac1fbac6d311094c94c",
		"0xba7872534a6c9097d805d8bee97e030f4e372e54-0x16caad63bdfc3ec4a2850336b28efe17e802b896",
		"0xba7872534a6c9097d805d8bee97e030f4e372e54-0x512ff8739d39e55d75d80046921e7de20c3e9bff",
	],
	"wbtc": [
		"0x44b77e9ce8a20160290fcbaa44196744f354c1b7-0xef71de5cb40f7985feb92aa49d8e3e84063af3bb",
		"0x44b77e9ce8a20160290fcbaa44196744f354c1b7-0x8b0e324eede360cab670a6ad12940736d74f701e",
		"0x44b77e9ce8a20160290fcbaa44196744f354c1b7-0x78e2da2eda6df49bae46e3b51528baf5c106e654",
		"0x44b77e9ce8a20160290fcbaa44196744f354c1b7-0x350f3fe979bfad4766298713c83b387c2d2d7a7a",
	],
	"usdt": [
		"0x76911e11fddb742d75b83c9e1f611f48f19234e4-0x4a76fc15d3fbf3855127ec5da8aaf02de7ca06b3",
		"0x76911e11fddb742d75b83c9e1f611f48f19234e4-0xf4abc60a08b546fa879508f4261eb4400b55099d",
		"0x76911e11fddb742d75b83c9e1f611f48f19234e4-0x13f421aa823f7d90730812a33f8cac8656e47dfa",
		"0x76911e11fddb742d75b83c9e1f611f48f19234e4-0x86690bbe7a9683a8bad4812c2e816fd17bc9715c",
	],
	"usdc": [
		"0xabd9c284116b2e757e3d4f6e36c5050aead24e0c-0x2b5d7a865a3888836d15d69dccbad682663dcdbb",
		"0xabd9c284116b2e757e3d4f6e36c5050aead24e0c-0xa52250f98293c17c894d58cf4f78c925dc8955d0",
		"0xabd9c284116b2e757e3d4f6e36c5050aead24e0c-0x924becc8f4059987e4bc4b741b7c354ff52c25e4",
		"0xabd9c284116b2e757e3d4f6e36c5050aead24e0c-0xbe528593781988974d83c2655cba4c45fc75c033",
	]
}

const LP_ID_LIST = Object.keys(LP_IDs).map(key => LP_IDs[key]).flat()

const HOLDERS_LIST = LP_ID_LIST.map(a => a.split('-')[1]).concat([
	//Token Lock
	"0x7742565647682abE90A7f7497e05c4403CB50265",
	"0x417538F319AfDDD351f33222592B60f985475A21",
	"0xCfAD7aeb67FC5c19a581496689881AE063541149",
	"0x1d4ba66f9d876ad2e22e3c16361bcf8e34f4d0cc",
	//ETH <-> BSC Bridge
	// "0x81A0d2f173590A23636DB6a475BC7E32aAae946C",
	//ETH <-> AVAX Bridge
	//"0xd374c29d98e9a33fa4d08fca1d72d7319ea4bc58",
	//Constant Staking V1
	// "0x7Fc2174670d672AD7f666aF0704C2D961EF32c73",
	// "0x036e336eA3ac2E255124CF775C4FDab94b2C42e4",
	// "0x0A32749D95217b7Ee50127E24711c97849b70C6a",
	// "0x82df1450eFD6b504EE069F5e4548F2D5Cb229880",
	//Dead
	"0x000000000000000000000000000000000000dead",
	//Buyback V1
	//"0xe5262f38bf13410a79149cb40429f8dc5e830542",
	//Vaults V1
	// "0x01de5bCe5C5Ee4F92e8f4183f6F4E4f12f9a86cd",
	// "0x3e488684c40D63Ff2b9963DFBb805Bbb3Da9b1c6",
	// "0x480c83Be2694BFB91F40d951424330c9123b9066",
	// "0xdC68450BfE4E16d74B20c44DdA83662cF2F5F0c0",
	// "0xe5c5a452A0f7B2d5266010Bf167A7Ee2eDF54533",
	// "0x8Ae8eC53712017EeB3378Ee112082D57da98E792",
	// "0x2D4b96e3C6176E833c013088aEcC7640af977e20",
	// "0xb95Ec2cB2D61d12c86a05e0c995d007Aec8f2850",
	// "0x18d2a323675BbE1f9d03e273a186Aea8ADf7f5c5",
	// "0xfB55dcc985517d111C65004f0EAabC1f6CE23cF1",
	// "0x8CE610eC56cE3ad3678C426f0Dfc965568Db6DdC",
	// "0x7CCFF41652eD12278E02E18de06d40Aaf5F1769B",
	// "0x94226Ae99C786b2830d27aC6e8fCdb4b0c4cc73a",
	// "0xaaC6814a1aCFE8F7Ea1f718148daC614d5323c85",
	// "0xe19328D2A528B765E30f9BC47faBb81e0f510ea9",
	// "0xE728874B81Bd0b7a9c3505949935e67D0e7136aD",
	// "0x8c1d0FD28b5FEac7f5521d05D53d7E1560A7CBCC",
	// "0xF73baaC19eEEB7C4B7Cc211F3eDF88BB9F1d40f9",
	// "0x8Fb2c9F8c07FaCf0aF442a1900cD2Cfe1940971B",
	// "0x8ad8e5FA0f2781dA3327275049B5469275A1042E",
	//Constant Staking + Buyback + Farm V2
	// "0xa4da28B8e42680916b557459D338aF6e2D8d458f",
	// "0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d",
	// "0x471beCc72AD487249efE521bf9b6744b882830DF",
	// "0x7b7132E7BF4e754855191a978F3979e1E3c8617b",
	// "0x0b92E7f074e7Ade0181A29647ea8474522e6A7C2",
	// "0xff32a38016422F51e8C0aF5D333472392822FeEf",
	// "0x62AAE8C0c50038236d075AC595Ae0BE4F201bBdd",
	// "0xb67F464b558e3055C2B6F017546Ed53b2e6333d7",
	// "0x1aB008CbfC99d0CA7e3FD8987ce1ebf832506F53",
	//Constant Staking 3
	// "0x44bed8ea3296bda44870d0da98575520de1735d4"
])

const HOLDERS_LIST_BSC = [
	//Token Lock
	"0xc44c1c7f68cdd84fc77cc9618f8f0b7e03345b20",
	//Buyback V1
	"0x350f3fe979bfad4766298713c83b387c2d2d7a7a",
	//Dead
	"0x000000000000000000000000000000000000dead",
	//ETH <-> BSC Bridge
	"0x229eD0B61bEA41710A79A3634E06B1A619a0EBCb",
	//Constant Staking + Buyback + Farm V2
	"0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90",
	"0xaF411BF994dA1435A3150B874395B86376C5f2d5",
	"0x9af074cE714FE1Eb32448052a38D274E93C5dc28",
	"0xDBfb96e2899d52B469C1a1C35eD71fBBa228d2cC",
	"0xc794cDb8D6aC5eB42d5ABa9c1E641ae17c239c8c",
	"0x23609B1f5274160564e4afC5eB9329A8Bf81c744",
	"0x264922696b9972687522b6e98Bf78A0430E2163C",
	"0x9DF0A645BeB6F7aDFaDC56f3689E79405337EFE2",
	"0xbd574278fEbad04b7A0694C37DeF4f2ecFa9354A",
	//Constant Staking 3
	"0xa9efab22ccbfeabb6dc4583d81421e76342faf8b"
]

const HOLDERS_LIST_AVAX = [
	//Token Lock
	"0x5200718cba9376afa068e1180eabb506e6d13802",
	//Buyback V1
	"0x4c7e0cbb0276a5e963266e6b9f34db73a1cb73f3",
	//Dead
	"0x000000000000000000000000000000000000dead",
	//ETH <-> AVAX Bridge
	"0x229eD0B61bEA41710A79A3634E06B1A619a0EBCb",
	//Constant Staking + Buyback + Farm V2
	"0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B",
	"0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9",
	"0xe6B307CD185f2A541a661eA312E3e7939Ea9d218",
	"0x934819D227B7095595eC9cA6604eF2Dd0C3a9EA2",
	"0x1cA9Fc98f3b997E08bC04691414e33B1835aa7e5",
	"0x6a258Bd17456e057A7c6102177EC2f9d64D5F9e4",
	"0xC2ba0abFc89A5A258e6440D82BB95A5e2B541581",
	"0x4c16093Da4BA7a604A1Fe8CD5d387cC904B3D407",
	"0x9FF3DC1f7042bAF46651029C7284Fc3B93e21a4D",
	//Constant Staking 3
	"0x16429e51A64B7f88D4C018fbf66266A693df64b3"
]

async function get_token_balances({
									  TOKEN_ADDRESS,
									  HOLDERS_LIST
								  }) {
	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}

function get_token_balances_sum(token_balances) {
	return token_balances.reduce((a, b) => new BigNumber(a).plus(b), 0)
}
let token_balance_sum = 0;
let token_balance_sum_bsc = 0;
let token_balance_sum_avax = 0;
let last_update_time = 0;
let circulating_supply = 0;
async function update_token_balance_sum() {
	last_update_time = Date.now()
	token_balance_sum = get_token_balances_sum( await get_token_balances({TOKEN_ADDRESS, HOLDERS_LIST}) ).div(1e18).toString(10)
	token_balance_sum_bsc = get_token_balances_sum( await get_token_balances_BSC({TOKEN_ADDRESS, HOLDERS_LIST: HOLDERS_LIST_BSC}) ).div(1e18).toString(10)
	token_balance_sum_avax = get_token_balances_sum( await get_token_balances_AVAX({TOKEN_ADDRESS, HOLDERS_LIST: HOLDERS_LIST_AVAX}) ).div(1e18).toString(10)
	// let circulating_supply_bsc = new BigNumber(24963431).minus(token_balance_sum_bsc)
	// let circulating_supply_avax = new BigNumber(24963431).minus(token_balance_sum_avax)
	// circulating_supply = new BigNumber(30000000).minus(token_balance_sum).plus(circulating_supply_bsc).plus(circulating_supply_avax)
	circulating_supply = new BigNumber(30000000).minus(token_balance_sum);
	return token_balance_sum
}

let the_graph_result_BSC = {}

// MAKE SURE ALL THESE ADDRESSES ARE LOWERCASE
const TOKENS_DISBURSED_PER_YEAR_BSC = [
	360_000,
	540_000,
	900_000,
	1_200_000,

	360_000,
	540_000,
	900_000,
	1_200_000,

	360_000,
	540_000,
	900_000,
	1_200_000,
]

const LP_IDs_BSC =
	{
		"eth": [
			"0x87c546525cf48f28d73ea218c625d6f748721717-0xb4338fc62b1de93f63bfedb9fd9bac455d50a424",
			"0x87c546525cf48f28d73ea218c625d6f748721717-0x2c1411d4f1647b88a7b46c838a3760f925bac83b",
			"0x87c546525cf48f28d73ea218c625d6f748721717-0x2c51df297a2aa972a45ed52110afd24591c6f302",
			"0x87c546525cf48f28d73ea218c625d6f748721717-0xd7180d6fea393158d42d0d0cd66ab93048f581e3",
		],
		"wbtc": [
			"0x2fcf1b0d83f83135b6e5e2e231e07ae89c235f68-0x8a607e099e835bdbc4a606acb600ef475414f450",
			"0x2fcf1b0d83f83135b6e5e2e231e07ae89c235f68-0x34dd0d25fa2e3b220d1eb67460c45e586c61c2bb",
			"0x2fcf1b0d83f83135b6e5e2e231e07ae89c235f68-0xb07c67b65e6916ba87b6e3fa245aa18f77b4413e",
			"0x2fcf1b0d83f83135b6e5e2e231e07ae89c235f68-0x52adfbb5bc9f9fee825bd56feb11f1fc90e0b47e",
		],
		"usdc": [
			"0xc7a4d04699a9539d33e86ce746e88553149c8528-0x111ae4ca424036d09b4e0fc9f1de5e6dc90d586b",
			"0xc7a4d04699a9539d33e86ce746e88553149c8528-0x7637fa253180556ba486d2fa5d2bb328eb0aa7ca",
			"0xc7a4d04699a9539d33e86ce746e88553149c8528-0x2f3c4a08dad0f8a56ede3961ab654020534b8a8c",
			"0xc7a4d04699a9539d33e86ce746e88553149c8528-0x417538f319afddd351f33222592b60f985475a21",
		]
	}

const LP_ID_LIST_BSC = Object.keys(LP_IDs_BSC).map(key => LP_IDs_BSC[key]).flat()
const TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC = {}
LP_ID_LIST_BSC.forEach((lp_id, i) => TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC[lp_id] = TOKENS_DISBURSED_PER_YEAR_BSC[i])


//AVAX config
let the_graph_result_AVAX = {}

// MAKE SURE ALL THESE ADDRESSES ARE LOWERCASE
const TOKENS_DISBURSED_PER_YEAR_AVAX = [
	360_000,
	540_000,
	900_000,
	1_200_000,
]

const LP_IDs_AVAX =
	{
		"eth": [
			"0x497070e8b6c55fd283d8b259a6971261e2021c01-0x499c588146443235357e9c630a66d6fe0250caa1",
			"0x497070e8b6c55fd283d8b259a6971261e2021c01-0xd8af0591be4fba56e3634c992b7fe4ff0a90b584",
			"0x497070e8b6c55fd283d8b259a6971261e2021c01-0xbebe1fe1444a50ac6ee95ea25ba80adf5ac7322c",
			"0x497070e8b6c55fd283d8b259a6971261e2021c01-0x79be220ab2dfcc2f140b59a97bfe6751ed1579b0",
		]
	}

const LP_ID_LIST_AVAX = Object.keys(LP_IDs_AVAX).map(key => LP_IDs_AVAX[key]).flat()
const TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX = {}
LP_ID_LIST_AVAX.forEach((lp_id, i) => TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX[lp_id] = TOKENS_DISBURSED_PER_YEAR_AVAX[i])

function getPrice_BSC(coingecko_id = 'ethereum', vs_currency = 'usd') {
	return new Promise((resolve, reject) => {
		$.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingecko_id}&vs_currencies=${vs_currency}`)
			.then((result) => {
				resolve(result[coingecko_id][vs_currency])
			})
			.catch((error) => {
				reject(error)
			})
	})
}

function getPrice(coingecko_id = 'ethereum', vs_currency = 'usd') {
	return new Promise((resolve, reject) => {
		$.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingecko_id}&vs_currencies=${vs_currency}`)
			.then((result) => {
				resolve(result[coingecko_id][vs_currency])
			})
			.catch((error) => {
				reject(error)
			})
	})
}

async function fetchAsync (url) {
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

/**
 * Returns the ETH USD Price, Token USD Prices, LP USD Prices, and amount of LP Staked, usd value of LP staked
 *
 * lp_id example: `"pair_address-pool_contract_address"`
 *
 * @param {{token_contract_addresses: object[], lp_ids: object[], tokens_disbursed_per_year: object}} props - MAKE SURE ALL ADDRESSES ARE LOWERCASE!
 */
async function get_usd_values_BSC({
									  token_contract_addresses,
									  lp_ids,
								  }) {
	return new Promise(async (resolve, reject) => {

		let token_contract = new infuraWeb3.eth.Contract(PRICE_ABI, PRICE_ADDRESS, {from: undefined})
		let usd_per_eth = await token_contract.methods.getThePriceBnb().call()
		usd_per_eth = (usd_per_eth / 1e8).toFixed(2)

		//console.log('chainlink', usd_per_eth)
		//let usd_per_eth2 = await getPrice_BSC(config.cg_ids['main'])
		//console.log('coingecko', usd_per_eth)

		let usdPerPlatformToken = await getPrice_BSC(config.cg_ids['platform-token'])


		async function getData(token_contract_addresses, lp_ids) {
			let tokens = []
			let liquidityPositions = []
			for (let id of token_contract_addresses) {
				let token_price_usd = await getPrice_BSC(config.cg_ids[id])
				tokens.push({id, token_price_usd})
			}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				let platformTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, {from: undefined})
				let pairTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, pairAddress, {from: undefined})

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2  / (lpTotalSupply/1e18)
				let usd_value_of_lp_staked = stakingLpBalance/1e18*usd_per_lp
				let lp_staked = stakingLpBalance/1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {data: {
					tokens, liquidityPositions
				}}
		}

		getData(token_contract_addresses.map(a => a.toLowerCase()), lp_ids.map(a => a.toLowerCase()))
			.then(res => handleTheGraphData(res))
			.catch(reject)


		function handleTheGraphData(response) {
			try {
				let data = response.data
				if (!data) return reject(response);

				//console.log({data})

				let token_data = {}, lp_data = {}

				data.tokens.forEach(t => {
					token_data[t.id] = t
				})

				data.liquidityPositions.forEach(lp => {
					lp_data[lp.id] = lp
				})
				resolve({token_data, lp_data, usd_per_eth})
			} catch (e) {
				console.error(e)
				reject(e)
			}
		}
	})
}

/**
 *
 * @param {string[]} staking_pools_list - List of Contract Addresses for Staking Pools
 * @returns {number[]} List of number of stakers for each pool
 */
async function get_number_of_stakers_BSC(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new bscWeb3.eth.Contract(STAKING_ABI, contract_address, {from: undefined})
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_BSC({
										  TOKEN_ADDRESS,
										  HOLDERS_LIST
									  }) {

	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}

function wait_BSC(ms) {
	console.log("Waiting _BSC " + ms + 'ms')
	return new Promise(r => setTimeout(() => {
		r(true)
		console.log("Wait over _BSC!")
	}, ms))
}

/**
 *
 * @param {{token_data, lp_data}} usd_values - assuming only one token is there in token_list
 */
async function get_apy_and_tvl_BSC(usd_values) {
	let {token_data, lp_data, usd_per_eth} = usd_values

	let token_price_usd = token_data[TOKEN_ADDRESS].token_price_usd*1
	let balances_by_address = {}, number_of_holders_by_address = {}
	let lp_ids = Object.keys(lp_data)
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_BSC({TOKEN_ADDRESS, HOLDERS_LIST: addrs})
	addrs.forEach((addr, i) => balances_by_address[addr] = token_balances[i])

	await wait_BSC(3000)

	let number_of_holders = await get_number_of_stakers_BSC(addrs)
	addrs.forEach((addr, i) => number_of_holders_by_address[addr] = number_of_holders[i])

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2)*1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked*1

		apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		lp_data[lp_id].apy = apy
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
	})

	return {token_data, lp_data, usd_per_eth, token_price_usd}
}

async function get_usd_values_with_apy_and_tvl_BSC(...arguments) {
	return (await get_apy_and_tvl_BSC(await get_usd_values_BSC(...arguments)))
}


async function refresh_the_graph_result_BSC() {
	let result = await get_usd_values_with_apy_and_tvl_BSC({token_contract_addresses: [TOKEN_ADDRESS], lp_ids: LP_ID_LIST_BSC})
	the_graph_result_BSC = result
	//window.TVL_FARMING_POOLS = await refreshBalance()
	return result
}

/* AVAX graph */
/**
 * Returns the ETH USD Price, Token USD Prices, LP USD Prices, and amount of LP Staked, usd value of LP staked
 *
 * lp_id example: `"pair_address-pool_contract_address"`
 *
 * @param {{token_contract_addresses: object[], lp_ids: object[], tokens_disbursed_per_year: object}} props - MAKE SURE ALL ADDRESSES ARE LOWERCASE!
 */
async function get_usd_values_AVAX({
									  token_contract_addresses,
									  lp_ids,
								  }) {
	return new Promise(async (resolve, reject) => {

		// let token_contract = new infuraWeb3.eth.Contract(PRICE_ABI, PRICE_ADDRESS, {from: undefined})
		// let usd_per_eth = await token_contract.methods.getThePriceBnb().call()
		// usd_per_eth = (usd_per_eth / 1e8).toFixed(2)

		//console.log('chainlink', usd_per_eth)
		let usd_per_eth = await getPrice_BSC(config.cg_ids_avax['main'])
		//console.log('coingecko', usd_per_eth)

		let usdPerPlatformToken = await getPrice_BSC(config.cg_ids_avax['platform-token'])


		async function getData(token_contract_addresses, lp_ids) {
			let tokens = []
			let liquidityPositions = []
			for (let id of token_contract_addresses) {
				let token_price_usd = await getPrice_BSC(config.cg_ids_avax[id])
				tokens.push({id, token_price_usd})
			}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				let platformTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, {from: undefined})
				let pairTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, pairAddress, {from: undefined})

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2  / (lpTotalSupply/1e18)
				let usd_value_of_lp_staked = stakingLpBalance/1e18*usd_per_lp
				let lp_staked = stakingLpBalance/1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {data: {
					tokens, liquidityPositions
				}}
		}

		getData(token_contract_addresses.map(a => a.toLowerCase()), lp_ids.map(a => a.toLowerCase()))
			.then(res => handleTheGraphData(res))
			.catch(reject)


		function handleTheGraphData(response) {
			try {
				let data = response.data
				if (!data) return reject(response);

				//console.log({data})

				let token_data = {}, lp_data = {}

				data.tokens.forEach(t => {
					token_data[t.id] = t
				})

				data.liquidityPositions.forEach(lp => {
					lp_data[lp.id] = lp
				})
				resolve({token_data, lp_data, usd_per_eth})
			} catch (e) {
				console.error(e)
				reject(e)
			}
		}
	})
}

/**
 *
 * @param {string[]} staking_pools_list - List of Contract Addresses for Staking Pools
 * @returns {number[]} List of number of stakers for each pool
 */
async function get_number_of_stakers_AVAX(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new avaxWeb3.eth.Contract(STAKING_ABI, contract_address, {from: undefined})
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_AVAX({
										  TOKEN_ADDRESS,
										  HOLDERS_LIST
									  }) {

	let token_contract = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}

function wait_AVAX(ms) {
	console.log("Waiting _AVAX " + ms + 'ms')
	return new Promise(r => setTimeout(() => {
		r(true)
		console.log("Wait over _AVAX!")
	}, ms))
}

/**
 *
 * @param {{token_data, lp_data}} usd_values - assuming only one token is there in token_list
 */
async function get_apy_and_tvl_AVAX(usd_values) {
	let {token_data, lp_data, usd_per_eth} = usd_values

	let token_price_usd = token_data[TOKEN_ADDRESS].token_price_usd*1
	let balances_by_address = {}, number_of_holders_by_address = {}
	let lp_ids = Object.keys(lp_data)
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_AVAX({TOKEN_ADDRESS, HOLDERS_LIST: addrs})
	addrs.forEach((addr, i) => balances_by_address[addr] = token_balances[i])

	await wait_AVAX(3500)

	let number_of_holders = await get_number_of_stakers_AVAX(addrs)
	addrs.forEach((addr, i) => number_of_holders_by_address[addr] = number_of_holders[i])

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2)*1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked*1

		apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		lp_data[lp_id].apy = apy
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
	})

	return {token_data, lp_data, usd_per_eth, token_price_usd}
}

async function get_usd_values_with_apy_and_tvl_AVAX(...arguments) {
	return (await get_apy_and_tvl_AVAX(await get_usd_values_AVAX(...arguments)))
}


async function refresh_the_graph_result_AVAX() {
	let result = await get_usd_values_with_apy_and_tvl_AVAX({token_contract_addresses: [TOKEN_ADDRESS], lp_ids: LP_ID_LIST_AVAX})
	the_graph_result_AVAX = result
	//window.TVL_FARMING_POOLS = await refreshBalance()
	return result
}

let COMBINED_TVL_AVAX = 0
let last_update_time2_avax = 0

const getCombinedTvlUsd_AVAX = async () => {
	last_update_time2_avax = Date.now()

	let the_graph_result_avax = await refresh_the_graph_result_AVAX()
	let tvl = 0
	if (!the_graph_result_avax.lp_data) return 0

	let lp_ids = Object.keys(the_graph_result_avax.lp_data)
	for (let id of lp_ids) {
		tvl += the_graph_result_avax.lp_data[id].tvl_usd*1 || 0
	}

	COMBINED_TVL_AVAX = tvl
	return tvl
}

/* this is for BSC only */
let COMBINED_TVL_BSC = 0
let last_update_time2 = 0

const getCombinedTvlUsd_BSC = async () => {
	last_update_time2 = Date.now()

	let the_graph_result_bsc = await refresh_the_graph_result_BSC()
	let tvl = 0
	if (!the_graph_result_bsc.lp_data) return 0

	let lp_ids = Object.keys(the_graph_result_bsc.lp_data)
	for (let id of lp_ids) {
		tvl += the_graph_result_bsc.lp_data[id].tvl_usd*1 || 0
	}

	COMBINED_TVL_BSC = tvl
	return tvl
}

//ETH the_graph
let the_graph_result ={}

const TOKENS_DISBURSED_PER_YEAR = [
	360_000,
	540_000,
	900_000,
	1_200_000,

	360_000,
	540_000,
	900_000,
	1_200_000,

	360_000,
	540_000,
	900_000,
	1_200_000,

	360_000,
	540_000,
	900_000,
	1_200_000,
]

const TOKENS_DISBURSED_PER_YEAR_BY_LP_ID = {}
LP_ID_LIST.forEach((lp_id, i) => TOKENS_DISBURSED_PER_YEAR_BY_LP_ID[lp_id] = TOKENS_DISBURSED_PER_YEAR[i])

/**
 * Returns the ETH USD Price, Token USD Prices, LP USD Prices, and amount of LP Staked, usd value of LP staked
 *
 * lp_id example: `"pair_address-pool_contract_address"`
 *
 * @param {{token_contract_addresses: object[], lp_ids: object[], tokens_disbursed_per_year: object}} props - MAKE SURE ALL ADDRESSES ARE LOWERCASE!
 */
async function get_usd_values({
								  token_contract_addresses,
								  lp_ids,
							  }) {
	return new Promise((resolve, reject) => {
		fetch('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({query:`{
  
	tokens(where:{
  id_in: ${JSON.stringify(token_contract_addresses.map(a => a.toLowerCase()))}}) {
	  id
	  symbol
	  name
	  decimals
	  untrackedVolumeUSD
		derivedETH
	}
	
	bundle(id: 1) {
	  id
	  ethPrice
	}
	
	liquidityPositions(where: 
	  {id_in: 
		  ${JSON.stringify(lp_ids.map(id => id.toLowerCase()))},
	  }) {
	  id
	  pair {
		reserveUSD
		totalSupply
	  }
	  liquidityTokenBalance
	}
  }
  `, variables: null}),
		})
			.then(res => res.json())
			.then(res => handleTheGraphData(res))
			.catch(reject)


		function handleTheGraphData(response) {
			try {
				let data = response.data
				if (!data) return reject(response);

				//console.log(data)

				let usd_per_eth = new BigNumber(data.bundle.ethPrice).toFixed(2)*1

				let token_data = {}, lp_data = {}

				data.tokens.forEach(t => {
					token_data[t.id] = {
						token_volume_usd_all_time: new BigNumber(t.untrackedVolumeUSD).toFixed(2)*1,
						token_price_usd: new BigNumber(t.derivedETH).times(usd_per_eth).toFixed(2)*1
					}
				})

				data.liquidityPositions.forEach(lp => {
					let usd_per_lp = new BigNumber(lp.pair.reserveUSD).div(lp.pair.totalSupply).toFixed(2)*1
					let lp_staked = lp.liquidityTokenBalance
					let usd_value_of_lp_staked = new BigNumber(lp_staked).times(usd_per_lp).toFixed(2)*1
					lp_data[lp.id] = {
						lp_staked,
						usd_per_lp,
						usd_value_of_lp_staked,
					}
				})
				resolve({token_data, lp_data, usd_per_eth})
			} catch (e) {
				console.error(e)
				reject(e)
			}
		}
	})
}

/**
 *
 * @param {string[]} staking_pools_list - List of Contract Addresses for Staking Pools
 * @returns {number[]} List of number of stakers for each pool
 */
async function get_number_of_stakers(staking_pools_list) {
	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new infuraWeb3.eth.Contract(STAKING_ABI, contract_address, {from: undefined})
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances({
									  TOKEN_ADDRESS,
									  HOLDERS_LIST
								  }) {
	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}

async function wait(ms) {
	console.log("Waiting " + ms + 'ms')
	return new Promise(r => setTimeout(() => {
		r(true)
		console.log("Wait over!")
	}, ms))
}

/**
 *
 * @param {{token_data, lp_data}} usd_values - assuming only one token is there in token_list
 */
async function get_apy_and_tvl(usd_values) {
	let {token_data, lp_data, usd_per_eth_uniswap} = usd_values

	let token_contract = new infuraWeb3.eth.Contract(PRICE_ABI, PRICE_ADDRESS, {from: undefined})
	let usd_per_eth = await token_contract.methods.getThePriceEth().call()
	usd_per_eth = (usd_per_eth / 1e8).toFixed(2)

	let token_price_usd = token_data[TOKEN_ADDRESS].token_price_usd*1
	let balances_by_address = {}, number_of_holders_by_address = {}
	let lp_ids = Object.keys(lp_data)
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances({TOKEN_ADDRESS, HOLDERS_LIST: addrs})
	addrs.forEach((addr, i) => balances_by_address[addr] = token_balances[i])

	await wait(2000)

	let number_of_holders = await get_number_of_stakers(addrs)
	addrs.forEach((addr, i) => number_of_holders_by_address[addr] = number_of_holders[i])

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2)*1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked*1

		apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		lp_data[lp_id].apy = apy
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
	})

	return {token_data, lp_data, usd_per_eth, token_price_usd}
}

async function get_usd_values_with_apy_and_tvl(...arguments) {
	return (await get_apy_and_tvl(await get_usd_values(...arguments)))
}

let last_update_time3 = 0

async function refresh_the_graph_result() {
	last_update_time3 = Date.now()
	let result = await get_usd_values_with_apy_and_tvl({token_contract_addresses: [TOKEN_ADDRESS], lp_ids: LP_ID_LIST})
	the_graph_result = result
	//await refresh_the_graph_result_BSC()
	return result
}

let highestAPY = 0
let highestAPY_ETH = 0
let highestAPY_BSC = 0
let highestAPY_AVAX = 0
let highestAPY_BSC_V2 = 0
let highestAPY_AVAX_V2 = 0
let highestAPY_ETH_V2 = 0
let last_update_time4 = 0

const GetHighestAPY = async () => {
	last_update_time4 = Date.now()
	highestAPY = 0
	let highApyArray = []
	let highApyArrayEth = []
	let highApyArrayAvax = []
	let highApyArrayBscV2 = []
	let highApyArrayAvaxV2 = []
	let highApyArrayEthV2 = []

	let highApyEth = 0
	let highApyAvax = 0
	let highApy = 0
	let highApyBscV2 = 0
	let highApyAvaxV2 = 0
	let highApyEthV2 = 0
	// Get the Link of the highest APY
	let highApyContractBSC = []
	let highApyContractEth = []
	let highApyContractAVAX = []
	let highApyContractBSCV2 = []
	let highApyContractAVAXV2 = []
	let highApyContractETHV2 = []

	// if (highestAPY == 0){
	// 	let the_graph_result_BSC = await refresh_the_graph_result_BSC()
	// 	if (!the_graph_result_BSC.lp_data) return 0
	//
	// 	let the_graph_result = await refresh_the_graph_result()
	// 	if (!the_graph_result.lp_data) return 0
	//
	// 	let the_graph_result_AVAX = await refresh_the_graph_result_AVAX()
	// 	if (!the_graph_result_AVAX.lp_data) return 0
	// }

	let lp_ids = Object.keys(the_graph_result_BSC.lp_data)
	for (let id of lp_ids) {
		highApy = the_graph_result_BSC.lp_data[id].apy
		highApyArray.push(highApy)
		//console.log('highhh', highApy)
		let contractAddress = id.split('-')[1]
		highApyContractBSC[highApy] = contractAddress
	}

	let lp_ids_eth = Object.keys(the_graph_result.lp_data)
	for (let id of lp_ids_eth) {
		highApyEth = the_graph_result.lp_data[id].apy
		highApyArrayEth.push(highApyEth)
		//console.log('highhh', highApy)
		let contractAddress2 = id.split('-')[1]
		highApyContractEth[highApyEth] = contractAddress2
		//console.log(IDs_eth[contractAddress2].link_pair)
	}

	let lp_ids_avax = Object.keys(the_graph_result_AVAX.lp_data)
	for (let id of lp_ids_avax) {
		highApyAvax = the_graph_result_AVAX.lp_data[id].apy
		highApyArrayAvax.push(highApyAvax)
		//console.log('highhh', highApy)
		let contractAddress3 = id.split('-')[1]
		highApyContractAVAX[highApyAvax] = contractAddress3
	}

	let lp_ids_bsc_v2 = Object.keys(the_graph_result_BSC_V2.lp_data)
	for (let id of lp_ids_bsc_v2) {
		highApyBscV2 = the_graph_result_BSC_V2.lp_data[id].apy
		highApyArrayBscV2.push(highApyBscV2)
		//console.log('highhh', highApy)
		let contractAddress4 = id.split('-')[1]
		highApyContractBSCV2[highApyBscV2] = contractAddress4
	}

	let lp_ids_avax_v2 = Object.keys(the_graph_result_AVAX_V2.lp_data)
	for (let id of lp_ids_avax_v2) {
		highApyAvaxV2 = the_graph_result_AVAX_V2.lp_data[id].apy
		highApyArrayAvaxV2.push(highApyAvaxV2)
		//console.log('highhh', highApy)
		let contractAddress5 = id.split('-')[1]
		highApyContractAVAXV2[highApyAvaxV2] = contractAddress5
	}

	let lp_ids_eth_v2 = Object.keys(the_graph_result_ETH_V2.lp_data)
	for (let id of lp_ids_eth_v2) {
		highApyEthV2 = the_graph_result_ETH_V2.lp_data[id].apy
		highApyArrayEthV2.push(highApyEthV2)
		//console.log('highhh', highApy)
		let contractAddress6 = id.split('-')[1]
		highApyContractETHV2[highApyEthV2] = contractAddress6
	}

	// let id_highApyEth = Object.keys(highApyContractEth)
	// for (let id of id_highApyEth) {
	// 	console.log(id)
	// }

	highApyArrayEth.sort(function(a, b) {
		return a - b
	})

	highApyArray.sort(function(a, b) {
		return a - b
	})

	highApyArrayAvax.sort(function(a, b) {
		return a - b
	})

	highApyArrayBscV2.sort(function(a, b) {
		return a - b
	})

	highApyArrayAvaxV2.sort(function(a, b) {
		return a - b
	})

	highApyArrayEthV2.sort(function(a, b) {
		return a - b
	})

	highestAPY_ETH = highApyArrayEth[highApyArrayEth.length - 1]
	highestAPY_BSC = highApyArray[highApyArray.length - 1]
	highestAPY_AVAX = highApyArrayAvax[highApyArrayAvax.length - 1]
	highestAPY_BSC_V2 = highApyArrayBscV2[highApyArrayBscV2.length - 1]
	highestAPY_AVAX_V2 = highApyArrayAvaxV2[highApyArrayAvaxV2.length - 1]
	highestAPY_ETH_V2 = highApyArrayEthV2[highApyArrayEthV2.length - 1]

	//console.log('bbbbb', highApyArray)
	highApyEth = highApyArrayEth[highApyArrayEth.length - 1]
	highApy = highApyArray[highApyArray.length - 1]
	highApyAvax = highApyArrayAvax[highApyArrayAvax.length - 1]
	highApyBscV2 = highApyArrayBscV2[highApyArrayBscV2.length - 1]
	highApyAvaxV2 = highApyArrayAvaxV2[highApyArrayAvaxV2.length - 1]
	highApyEthV2 = highApyArrayEthV2[highApyArrayEthV2.length - 1]

	//Excluding the BSC APY because pool's has expired
	// highestAPY = highApy > highApyEth ? highApy : highApyEth
	// highestAPY = highApy > highApyEth ? highApyEth : highApyEth
	// highestAPY = highestAPY > highApyAvax ? highestAPY : highApyAvax
	highestAPY = highestAPY > highApyBscV2 ? highestAPY : highApyBscV2
	highestAPY = highestAPY > highApyAvaxV2 ? highestAPY : highApyAvaxV2
	highestAPY = highestAPY > highApyEthV2 ? highestAPY : highApyEthV2
	return highApy
}

let last_update_time5 = 0
let tvltotal = 0

let [farmingTvl30, farmingTvl60, farmingTvl90, farmingTvl120] = [0, 0, 0, 0]

async function refreshBalanceFarming() {

	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})
	//console.log('coinbase' + token_contract)

	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])

	let _tvl30 = await token_contract.methods.balanceOf('0x7fc2174670d672ad7f666af0704c2d961ef32c73').call()
	_tvl30 = _tvl30 / 1e18 * usdPerToken
	farmingTvl30 = _tvl30

	let _tvl60 = await token_contract.methods.balanceOf('0x036e336ea3ac2e255124cf775c4fdab94b2c42e4').call()
	_tvl60 = _tvl60 / 1e18 * usdPerToken
	farmingTvl60 = _tvl60

	let _tvl90 = await token_contract.methods.balanceOf('0x0a32749d95217b7ee50127e24711c97849b70c6a').call()
	_tvl90 = _tvl90 / 1e18 * usdPerToken
	farmingTvl90 = _tvl90

	let _tvl120 = await token_contract.methods.balanceOf('0x82df1450efd6b504ee069f5e4548f2d5cb229880').call()
	_tvl120 = (_tvl120 / 1e18 + 0.1) * usdPerToken
	farmingTvl120 = _tvl120

	let valueee = (_tvl30 + _tvl60 + _tvl90 + _tvl120)
	return valueee

}

/* Get buyback DYP balance from all chains */

async function getTokenHolderBalance(holder, network) {
	if (network == 1) {
		let tokenContract = new infuraWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, {from: undefined})
		return await tokenContract.methods.balanceOf(holder).call()
	}
	if (network == 2){
		let tokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, {from: undefined})
		return await tokenContract.methods.balanceOf(holder).call()
	}
	if(network == 3){
		let tokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, {from: undefined})
		return await tokenContract.methods.balanceOf(holder).call()
	}
	return 0
}

/* TVL DYPS ETH + BSC + AVAX */

const allContracts = [
	"0xdCBB5B2148f0cf1Abd7757Ba04A5821fEaD80587",
	"0xDC65C4277d626d6A29C9Dc42Eb396d354fa5E85b",
	"0x28eabA060E5EF0d41eeB20d41aafaE8f685739d9",
	"0x2F2cff66fEB7320FC9Adf91b7B74bFb5a80C7C35",
	"0xA987aEE0189Af45d5FA95a9FBBCB4374228f375E",
	"0x251B9ee6cEd97565A821C5608014a107ddc9C98F",
	"0x54F30bFfeb925F47225e148f0bAe17a452d6b8c0",
	"0xa68BBe793ad52d0E62bBf34A67F02235bA69E737",
	"0xCFd970494a0b3C52a81dcE1EcBFF2245e6b0B0E7",
	"0x49D02CF81Cc352517350F25E200365360426aF94",
	"0xf51965c570419F2576ec9AeAD6A3C5F674424A99",
	"0x997A7254E5567d0A70329DEFCc1E4d29d71Ba224",
	"0xa4da28B8e42680916b557459D338aF6e2D8d458f",
	"0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d",
	"0x9ea966b4023049bff858bb5e698ecff24ea54c4a",
	"0x3fab09acaeddaf579d7a72c24ef3e9eb1d2975c4",
	"0x94B1A7B57C441890b7a0f64291B39ad6f7E14804",
	"0x4eF782E66244A0CF002016AA1Db3019448c670aE",
	"0x537DC4fee298Ea79A7F65676735415f1E2882F92",
	"0x219717BF0bC33b2764A6c1A772F75305458BDA3d",
	"0xD1151a2434931f34bcFA6c27639b67C1A23D93Af",
	"0xed869Ba773c3F1A1adCC87930Ca36eE2dC73435d",
	"0x415B1624710296717FA96cAD84F53454E8F02D18",
	"0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90",
	"0xaF411BF994dA1435A3150B874395B86376C5f2d5",
	"0x58366902082b90fca01be07d929478bd48acfb19",
	"0x160ff3c4a6e9aa8e4271aa71226cc811bfef7ed9",
	"0xC905D5DD9A4f26eD059F76929D11476B2844A7c3",
	"0x267434f01ac323C6A5BCf41Fa111701eE0165a37",
	"0x035d65babF595758D7A439D5870BAdc44218D028",
	"0x6c325DfEA0d18387D423C869E328Ef005cBA024F",
	"0x85C4f0CEA0994dE365dC47ba22dD0FD9899F93Ab",
	"0x6f5dC6777b2B4667Bf183D093111867239518af5",
	"0x10E105676CAC55b74cb6500a8Fb5d2f84804393D",
	"0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B",
	"0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9",
	"0x8f28110325a727f70b64bffebf2b9dc94b932452",
	"0x5536e02336771cfa0317d4b6a042f3c38749535e"
]

const TOKEN_ADDRESS_DYPS_ETH = '0xd4f11Bf85D751F426EF59b705E42b3da3357250f'
const TOKEN_ADDRESS_DYPS_BSC = '0x4B2dfB131B0AE1D6d5D0c9a3a09c028a5cD10554'
const TOKEN_ADDRESS_DYPS_AVAX = '0x4689545A1389E7778Fd4e66F854C91Bf8aBacBA9'
let price_DYPS = 0

async function getPriceDYPS () {

	let amount = new BigNumber(1000000000000000000).toFixed(0)
	let router = await getPancakeswapRouterContract()
	let WETH = await router.methods.WETH().call()
	let platformTokenAddress = config.BUSD_address
	let rewardTokenAddress = TOKEN_ADDRESS_DYPS_BSC
	let path = [...new Set([rewardTokenAddress, WETH, platformTokenAddress].map(a => a.toLowerCase()))]
	let _amountOutMin = await router.methods.getAmountsOut(amount, path).call()
	_amountOutMin = _amountOutMin[_amountOutMin.length - 1]
	_amountOutMin = new BigNumber(_amountOutMin).div(1e18).toFixed(2)

	price_DYPS = parseFloat(_amountOutMin)

	return price_DYPS
}

async function totalTvlDYPS () {
	let tvlDYPS = 0

	if (price_DYPS == 0)
		await getPriceDYPS()

	let token_balances_eth = await get_token_balances({TOKEN_ADDRESS: TOKEN_ADDRESS_DYPS_ETH, HOLDERS_LIST: allContracts})

	// await wait(2000)

	let token_balances_bsc = await get_token_balances_BSC({TOKEN_ADDRESS: TOKEN_ADDRESS_DYPS_BSC, HOLDERS_LIST: allContracts})

	// await wait(2000)

	let token_balances_avax = await get_token_balances_AVAX({TOKEN_ADDRESS: TOKEN_ADDRESS_DYPS_AVAX, HOLDERS_LIST: allContracts})

	// await wait(2000)

	for (let id of token_balances_eth){
		tvlDYPS = new BigNumber(tvlDYPS).plus(id)
	}

	for (let id of token_balances_bsc){
		tvlDYPS = new BigNumber(tvlDYPS).plus(id)
	}

	for (let id of token_balances_avax){
		tvlDYPS = new BigNumber(tvlDYPS).plus(id)
	}

	tvlDYPS = new BigNumber(tvlDYPS).div(1e18).times(price_DYPS).toFixed(0)

	tvlDYPS = parseInt(tvlDYPS)
	// console.log(tvlDYPS)
	// console.log(price_DYPS)

	return tvlDYPS
}

//TVL Vaults

const VAULT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CompoundRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ADMIN_CAN_CLAIM_AFTER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BURN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_TO_BUYBACK_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOCKUP_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_ETH_FEE_IN_WEI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ONE_HUNDRED_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POINT_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_RETURN_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_CTOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_DEPOSIT_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_PLATFORM_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"addPlatformTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"cTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAnyToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimCompoundDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimEthDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"claimExtraTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claimPlatformTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contractStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ethDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"ethDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cTokenBalance","type":"uint256"}],"name":"getConvertedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"startIndex","type":"uint256"},{"internalType":"uint256","name":"endIndex","type":"uint256"}],"name":"getDepositorsList","outputs":[{"internalType":"address[]","name":"stakers","type":"address[]"},{"internalType":"uint256[]","name":"stakingTimestamps","type":"uint256[]"},{"internalType":"uint256[]","name":"lastClaimedTimeStamps","type":"uint256[]"},{"internalType":"uint256[]","name":"stakedTokens","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getEstimatedCompoundDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getExchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumberOfHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastClaimedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"platformTokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"platformTokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"tokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDepositedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedCompoundDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedEthDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedPlatformTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensDepositedByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensWithdrawnByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapRouterV2","outputs":[{"internalType":"contract IUniswapV2Router","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_tokenFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]

const totalDepositedTokens = async (contractAddress) => {
	let contract = new infuraWeb3.eth.Contract(VAULT_ABI, contractAddress, {from: undefined})
	let totalDepositedTokens = await contract.methods.totalDepositedTokens().call()

	let contractiDYP = new infuraWeb3.eth.Contract(TOKEN_ABI, '0xBD100d061E120b2c67A24453CF6368E63f1Be056', {from: undefined})
	let balanceOfiDYP = await contractiDYP.methods.balanceOf(contractAddress).call()

	totalDepositedTokens = new BigNumber(totalDepositedTokens)

	return [totalDepositedTokens, balanceOfiDYP]
}

const getTotalTvlVaults = async () => {

	let [_usdEth, _usdBtc, _usdiDYP] =
		await Promise.all([
			getPrice('weth'),
			getPrice('bitcoin'),
			getPrice('idefiyieldprotocol')
		])

	let [_ethDeposit, iDYP1] = await totalDepositedTokens('0x28eabA060E5EF0d41eeB20d41aafaE8f685739d9')
	let [_btcDeposit, iDYP2] = await totalDepositedTokens('0x2F2cff66fEB7320FC9Adf91b7B74bFb5a80C7C35')
	let [_usdtDeposit, iDYP3] = await totalDepositedTokens('0xA987aEE0189Af45d5FA95a9FBBCB4374228f375E')
	let [_usdcDeposit, iDYP4] = await totalDepositedTokens('0x251B9ee6cEd97565A821C5608014a107ddc9C98F')
	let [_daiDeposit, iDYP5] = await totalDepositedTokens('0x54F30bFfeb925F47225e148f0bAe17a452d6b8c0')

	let usdEth = new BigNumber(_ethDeposit).div(1e18).times(_usdEth).toFixed(2)
	let usdBtc = new BigNumber(_btcDeposit).div(1e8).times(_usdBtc).toFixed(2)
	let usdUsdt = new BigNumber(_usdtDeposit).div(1e6).toFixed(2)
	let usdUsdc = new BigNumber(_usdcDeposit).div(1e6).toFixed(2)
	let usdDai = new BigNumber(_daiDeposit).div(1e18).toFixed(2)

	let totaliDYPDeposited = new BigNumber(iDYP1).plus(iDYP2).plus(iDYP3).plus(iDYP4).plus(iDYP5)
	totaliDYPDeposited = new BigNumber(totaliDYPDeposited).div(1e18).toFixed(2)

	let usdiDYP = new BigNumber(totaliDYPDeposited).times(_usdiDYP).toFixed(2)

	let tvlTotal = parseInt(usdEth) + parseInt(usdBtc) + parseInt(usdUsdt) + parseInt(usdUsdc) + parseInt(usdDai) + parseInt(usdiDYP)

	return tvlTotal
}

const getTotalTvl = async () => {
	last_update_time5 = Date.now()
	let tvliDYP = await totalTvliDYP()
	tvliDYP = parseInt(tvliDYP)
	let tvlFarmDyp = await totalTvlFarmingStakingV2()
	tvlFarmDyp = parseInt(tvlFarmDyp)

	let tvliDYPAvax = await totalTvliDYPAvax()
	tvliDYPAvax = parseInt(tvliDYPAvax)
	let tvlFarmDypAvax = await totalTvlFarmingStakingAvaxV2()
	tvlFarmDypAvax = parseInt(tvlFarmDypAvax)

	let tvliDYPEth = await totalTvliDYPEth()
	tvliDYPEth = parseInt(tvliDYPEth)
	let tvlFarmDypEth = await totalTvlFarmingStakingEthV2()
	tvlFarmDypEth = parseInt(tvlFarmDypEth)

	let tvl = 0
	let farmingTvl = await refreshBalanceFarming()
	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])

	let ethBuybackTvl = await getTokenHolderBalance('0xe5262f38bf13410a79149cb40429f8dc5e830542', 1)
	let bscBuybackTvl = await getTokenHolderBalance('0x350f3fe979bfad4766298713c83b387c2d2d7a7a', 2)
	let avaxBuybackTvl = await getTokenHolderBalance('0x4c7e0cbb0276a5e963266e6b9f34db73a1cb73f3', 3)

	ethBuybackTvl = (ethBuybackTvl/1e18) * usdPerToken
	bscBuybackTvl = (bscBuybackTvl/1e18) * usdPerToken
	avaxBuybackTvl = (avaxBuybackTvl/1e18) * usdPerToken

	let lp_ids = Object.keys(the_graph_result.lp_data)
	for (let id of lp_ids) {
		tvl += the_graph_result.lp_data[id].tvl_usd * 1 || 0
	}

	//Get Total value locked of Vaults on Ethereum from DeFiLLama
	let tvlVaults = await fetchAsync('https://api.llama.fi/tvl/defi-yield-protocol')

	//Get Total Vaule Locked New Vaults
	let tvlVaults2 = await getTotalTvlVaults()

	//Get TVL DYPS
	let tvlDYPS = await totalTvlDYPS()

	tvltotal = tvl + farmingTvl + COMBINED_TVL_BSC + COMBINED_TVL_AVAX + ethBuybackTvl + bscBuybackTvl + avaxBuybackTvl + tvlVaults + tvliDYP + tvlFarmDyp + tvliDYPAvax + tvlFarmDypAvax + tvliDYPEth + tvlFarmDypEth + tvlVaults2 + tvlDYPS
	return tvltotal
}

// Calculate WETH + USD Paid

let wethPaiOutTotals = 0
let wbnbPaidOutTotals = 0
let avaxPaidOutTotals = 0
let paidInUsd = 0
let paidBnbInUsd = 0
let paidAvaxInUsd = 0
let paidAllInUsd = 0
let last_update_time6 = 0

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

const getWethBalance = async (contractAddress) => {
	let contract = new infuraWeb3.eth.Contract(TOKEN_ABI, WETH_ADDRESS, {from: undefined})
	return (await contract.methods.balanceOf(contractAddress).call())
}

const getWethPaidOut = async (contractAddress) => {
	let contract = new infuraWeb3.eth.Contract(STAKING_ABI, contractAddress, {from: undefined})
	let wethPaidOut = await contract.methods.totalClaimedRewardsEth().call()
	let wethBalance = await getWethBalance(contractAddress)
	return new BigNumber(wethBalance).plus(wethPaidOut).toString(10)
}

const PaidOutETH = async () => {
	last_update_time6 = Date.now()
	let wethPaiOutTotal = 0
	let wethPaiOutTotal_v2 = 0
	let lp_ids = LP_ID_LIST
	for (let id of lp_ids) {
		let contractAddress = id.split('-')[1]
		let wethPaidOut = await Promise.all([getWethPaidOut(contractAddress)])
		wethPaiOutTotal += parseInt(wethPaidOut, 10)
	}

	/* Calculate Paid in BNB for Farming BSC V2 iDYP */
	let lp_ids_v2 = LP_ID_LIST_ETH_V2
	for (let id of lp_ids_v2) {
		let contractAddress = id.split('-')[1]
		let wethPaidOut = await Promise.all([getWethPaidOut(contractAddress)])
		wethPaiOutTotal_v2 += parseInt(wethPaidOut, 10)
	}

	wethPaiOutTotals = wethPaiOutTotal / 1e18 + wethPaiOutTotal_v2 / 1e18
	return wethPaiOutTotal / 1e18
}

/* BSC Paid */

const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

const getWbnbBalance = async (contractAddress) => {
	let contract = new bscWeb3.eth.Contract(TOKEN_ABI, WBNB_ADDRESS, {from: undefined})
	return (await contract.methods.balanceOf(contractAddress).call())
}

const getWbnbPaidOut = async (contractAddress) => {
	let contract = new bscWeb3.eth.Contract(STAKING_ABI, contractAddress, {from: undefined})
	let wbnbPaidOut = await contract.methods.totalClaimedRewardsEth().call()
	let wbnbBalance = await getWbnbBalance(contractAddress)
	return new BigNumber(wbnbBalance).plus(wbnbPaidOut).toString(10)
}

const PaidOutBNB = async () => {
	last_update_time6 = Date.now()
	let wbnbPaiOutTotal = 0
	let wbnbPaiOutTotal_v2 = 0
	let lp_ids = LP_ID_LIST_BSC
	for (let id of lp_ids) {
		let contractAddress = id.split('-')[1]
		let wbnbPaidOut = await Promise.all([getWbnbPaidOut(contractAddress)])
		wbnbPaiOutTotal += parseInt(wbnbPaidOut, 10)
	}
	wbnbPaidOutTotals = wbnbPaiOutTotal / 1e18

	/* Calculate Paid in BNB for Farming BSC V2 iDYP */
	let lp_ids_v2 = LP_ID_LIST_BSC_V2
	for (let id of lp_ids_v2) {
		let contractAddress = id.split('-')[1]
		let wbnbPaidOut = await Promise.all([getWbnbPaidOut(contractAddress)])
		wbnbPaiOutTotal_v2 += parseInt(wbnbPaidOut, 10)
	}
	//wbnbPaidOutTotals = wbnbPaiOutTotal / 1e18
	wbnbPaidOutTotals = wbnbPaiOutTotal / 1e18 + wbnbPaiOutTotal_v2 / 1e18

	return wbnbPaiOutTotal / 1e18 + wbnbPaiOutTotal_v2 / 1e18
}

/* AVAX Paid */

const AVAX_ADDRESS = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'

const getAvaxBalance = async (contractAddress) => {
	let contract = new avaxWeb3.eth.Contract(TOKEN_ABI, AVAX_ADDRESS, {from: undefined})
	return (await contract.methods.balanceOf(contractAddress).call())
}

const getAvaxPaidOut = async (contractAddress) => {
	let contract = new avaxWeb3.eth.Contract(STAKING_ABI, contractAddress, {from: undefined})
	let avaxPaidOut = await contract.methods.totalClaimedRewardsEth().call()
	let avaxBalance = await getAvaxBalance(contractAddress)
	return new BigNumber(avaxBalance).plus(avaxPaidOut).toString(10)
}

const PaidOutAVAX = async () => {
	last_update_time6 = Date.now()
	let avaxPaiOutTotal = 0
	let lp_ids = LP_ID_LIST_AVAX
	for (let id of lp_ids) {
		let contractAddress = id.split('-')[1]
		let avaxPaidOut = await Promise.all([getAvaxPaidOut(contractAddress)])
		avaxPaiOutTotal += parseInt(avaxPaidOut, 10)
	}
	lp_ids = LP_ID_LIST_AVAX_V2
	for (let id of lp_ids) {
		let contractAddress = id.split('-')[1]
		let avaxPaidOut = await Promise.all([getAvaxPaidOut(contractAddress)])
		avaxPaiOutTotal += parseInt(avaxPaidOut, 10)
	}
	avaxPaidOutTotals = avaxPaiOutTotal / 1e18
	return avaxPaiOutTotal / 1e18
}

const PaidAllInUsd = async () => {
	last_update_time6 = Date.now()
	//let [usdPerToken] = await Promise.all([getPrice('ethereum')])
	//let [usdPerTokenBnb] = await Promise.all([getPrice('binancecoin')])

	// Get Price Feed from Coingecko AVAX
	let [usdPerTokenAvax] = await Promise.all([getPrice('avalanche-2')])

	// Get Price feed from Chainlink for ETH and BNB
	let token_contract = new infuraWeb3.eth.Contract(PRICE_ABI, PRICE_ADDRESS, {from: undefined})

	let usdPerToken = await token_contract.methods.getThePriceEth().call()
	usdPerToken = (usdPerToken / 1e8).toFixed(2)

	let usdPerTokenBnb = await token_contract.methods.getThePriceBnb().call()
	usdPerTokenBnb = (usdPerTokenBnb / 1e8).toFixed(2)

	let wethPaidOutTotal = await PaidOutETH()
	let wbnbPaidOutTotal = await PaidOutBNB()
	let avaxPaidOutTotal = await PaidOutAVAX()

	paidInUsd = wethPaidOutTotal * usdPerToken
	paidBnbInUsd = wbnbPaidOutTotal * usdPerTokenBnb
	paidAvaxInUsd = avaxPaidOutTotal * usdPerTokenAvax
	paidAllInUsd = paidInUsd + paidBnbInUsd + paidAvaxInUsd
	return wethPaidOutTotal * usdPerToken
}

/* Return if an address is in staking */

const CheckEthStaking = async (addressToCheck) => {
	let amountStaked = 0
	let result = 0
	let lp_ids = LP_ID_LIST

	for (let lp_id of lp_ids) {
		let pool_address = lp_id.split('-')[1]
		let contract = new infuraWeb3.eth.Contract(STAKING_ABI, pool_address, {from: undefined})
		amountStaked = await contract.methods.depositedTokens(addressToCheck).call()
		result = parseInt(amountStaked) > 0 ? true : false

		if (parseInt(amountStaked)>0) break
	}

	return result
}

const CheckBscStaking = async (addressToCheck) => {
	let amountStaked = 0
	let result = 0
	let lp_ids = LP_ID_LIST_BSC

	for (let lp_id of lp_ids) {
		let pool_address = lp_id.split('-')[1]
		let contract = new bscWeb3.eth.Contract(STAKING_ABI, pool_address, {from: undefined})
		amountStaked = await contract.methods.depositedTokens(addressToCheck).call()
		result = parseInt(amountStaked) > 0 ? true : false

		if (parseInt(amountStaked)>0) break
	}

	return result
}

let farmInfo = []

const IDs_eth = {
	"0xa7d6f5fa9b0be0e98b3b40e6ac884e53f2f9460e":
		{
			pool_name: "DYP/ETH LP Pool Ethereum",
			pair_name: "DYP-ETH",
			link_pair: "https://app.dyp.finance/staking-eth-3",
			return_types: "WETH"
		},
	"0x0b0a544ae6131801522e3ac1fbac6d311094c94c":
		{
			pool_name: "DYP/ETH LP Pool Ethereum",
			pair_name: "DYP-ETH",
			link_pair: "https://app.dyp.finance/staking-eth-30",
			return_types: "WETH"
		},
	"0x16caad63bdfc3ec4a2850336b28efe17e802b896":
		{
			pool_name: "DYP/ETH LP Pool Ethereum",
			pair_name: "DYP-ETH",
			link_pair: "https://app.dyp.finance/staking-eth-60",
			return_types: "WETH"
		},
	"0x512ff8739d39e55d75d80046921e7de20c3e9bff":
		{
			pool_name: "DYP/ETH LP Pool Ethereum",
			pair_name: "DYP-ETH",
			link_pair: "https://app.dyp.finance/staking-eth-90",
			return_types: "WETH"
		},
	"0xef71de5cb40f7985feb92aa49d8e3e84063af3bb":
		{
			pool_name: "DYP/WBTC LP Pool Ethereum",
			pair_name: "DYP-WBTC",
			link_pair: "https://app.dyp.finance/staking-wbtc-3",
			return_types: "WETH"
		},
	"0x8b0e324eede360cab670a6ad12940736d74f701e":
		{
			pool_name: "DYP/WBTC LP Pool Ethereum",
			pair_name: "DYP-WBTC",
			link_pair: "https://app.dyp.finance/staking-wbtc-30",
			return_types: "WETH"
		},
	"0x78e2da2eda6df49bae46e3b51528baf5c106e654":
		{
			pool_name: "DYP/WBTC LP Pool Ethereum",
			pair_name: "DYP-WBTC",
			link_pair: "https://app.dyp.finance/staking-wbtc-60",
			return_types: "WETH"
		},
	"0x350f3fe979bfad4766298713c83b387c2d2d7a7a":
		{
			pool_name: "DYP/WBTC LP Pool Ethereum",
			pair_name: "DYP-WBTC",
			link_pair: "https://app.dyp.finance/staking-wbtc-90",
			return_types: "WETH"
		},
	"0x4a76fc15d3fbf3855127ec5da8aaf02de7ca06b3":
		{
			pool_name: "DYP/USDT LP Pool Ethereum",
			pair_name: "DYP-USDT",
			link_pair: "https://app.dyp.finance/staking-usdt-3",
			return_types: "WETH"
		},
	"0xf4abc60a08b546fa879508f4261eb4400b55099d":
		{
			pool_name: "DYP/USDT LP Pool Ethereum",
			pair_name: "DYP-USDT",
			link_pair: "https://app.dyp.finance/staking-usdt-30",
			return_types: "WETH"
		},
	"0x13f421aa823f7d90730812a33f8cac8656e47dfa":
		{
			pool_name: "DYP/USDT LP Pool Ethereum",
			pair_name: "DYP-USDT",
			link_pair: "https://app.dyp.finance/staking-usdt-60",
			return_types: "WETH"
		},
	"0x86690bbe7a9683a8bad4812c2e816fd17bc9715c":
		{
			pool_name: "DYP/USDT LP Pool Ethereum",
			pair_name: "DYP-USDT",
			link_pair: "https://app.dyp.finance/staking-usdt-90",
			return_types: "WETH"
		},
	"0x2b5d7a865a3888836d15d69dccbad682663dcdbb":
		{
			pool_name: "DYP/USDC LP Pool Ethereum",
			pair_name: "DYP-USDC",
			link_pair: "https://app.dyp.finance/staking-usdc-3",
			return_types: "WETH"
		},
	"0xa52250f98293c17c894d58cf4f78c925dc8955d0":
		{
			pool_name: "DYP/USDC LP Pool Ethereum",
			pair_name: "DYP-USDC",
			link_pair: "https://app.dyp.finance/staking-usdc-30",
			return_types: "WETH"
		},
	"0x924becc8f4059987e4bc4b741b7c354ff52c25e4":
		{
			pool_name: "DYP/USDC LP Pool Ethereum",
			pair_name: "DYP-USDC",
			link_pair: "https://app.dyp.finance/staking-usdc-60",
			return_types: "WETH"
		},
	"0xbe528593781988974d83c2655cba4c45fc75c033":
		{
			pool_name: "DYP/USDC LP Pool Ethereum",
			pair_name: "DYP-USDC",
			link_pair: "https://app.dyp.finance/staking-usdc-90",
			return_types: "WETH"
		}
}

const IDs_bsc = {
	"0xb4338fc62b1de93f63bfedb9fd9bac455d50a424":
		{
			pool_name: "DYP/ETH LP Pool BSC",
			pair_name: "DYP-ETH",
			link_pair: "https://app-bsc.dyp.finance/staking-eth-3",
			return_types: "WBNB WETH DYP"
		},
	"0x2c1411d4f1647b88a7b46c838a3760f925bac83b":
		{
			pool_name: "DYP/ETH LP Pool BSC",
			pair_name: "DYP-ETH",
			link_pair: "https://app-bsc.dyp.finance/staking-eth-30",
			return_types: "WBNB WETH DYP"
		},
	"0x2c51df297a2aa972a45ed52110afd24591c6f302":
		{
			pool_name: "DYP/ETH LP Pool BSC",
			pair_name: "DYP-ETH",
			link_pair: "https://app-bsc.dyp.finance/staking-eth-60",
			return_types: "WBNB WETH DYP"
		},
	"0xd7180d6fea393158d42d0d0cd66ab93048f581e3":
		{
			pool_name: "DYP/ETH LP Pool BSC",
			pair_name: "DYP-ETH",
			link_pair: "https://app-bsc.dyp.finance/staking-eth-90",
			return_types: "WBNB WETH DYP"
		},
	"0x8a607e099e835bdbc4a606acb600ef475414f450":
		{
			pool_name: "DYP/WBNB LP Pool BSC",
			pair_name: "DYP-WBNB",
			link_pair: "https://app-bsc.dyp.finance/staking-bnb-3",
			return_types: "WBNB WETH DYP"
		},
	"0x34dd0d25fa2e3b220d1eb67460c45e586c61c2bb":
		{
			pool_name: "DYP/WBNB LP Pool BSC",
			pair_name: "DYP-WBNB",
			link_pair: "https://app-bsc.dyp.finance/staking-bnb-30",
			return_types: "WBNB WETH DYP"
		},
	"0xb07c67b65e6916ba87b6e3fa245aa18f77b4413e":
		{
			pool_name: "DYP/WBNB LP Pool BSC",
			pair_name: "DYP-WBNB",
			link_pair: "https://app-bsc.dyp.finance/staking-bnb-60",
			return_types: "WBNB WETH DYP"
		},
	"0x52adfbb5bc9f9fee825bd56feb11f1fc90e0b47e":
		{
			pool_name: "DYP/WBNB LP Pool BSC",
			pair_name: "DYP-WBNB",
			link_pair: "https://app-bsc.dyp.finance/staking-bnb-90",
			return_types: "WBNB WETH DYP"
		},
	"0x111ae4ca424036d09b4e0fc9f1de5e6dc90d586b":
		{
			pool_name: "DYP/BUSD LP Pool BSC",
			pair_name: "DYP-BUSD",
			link_pair: "https://app-bsc.dyp.finance/staking-busd-3",
			return_types: "WBNB WETH DYP"
		},
	"0x7637fa253180556ba486d2fa5d2bb328eb0aa7ca":
		{
			pool_name: "DYP/BUSD LP Pool BSC",
			pair_name: "DYP-BUSD",
			link_pair: "https://app-bsc.dyp.finance/staking-busd-30",
			return_types: "WBNB WETH DYP"
		},
	"0x2f3c4a08dad0f8a56ede3961ab654020534b8a8c":
		{
			pool_name: "DYP/BUSD LP Pool BSC",
			pair_name: "DYP-BUSD",
			link_pair: "https://app-bsc.dyp.finance/staking-busd-60",
			return_types: "WBNB WETH DYP"
		},
	"0x417538f319afddd351f33222592b60f985475a21":
		{
			pool_name: "DYP/BUSD LP Pool BSC",
			pair_name: "DYP-BUSD",
			link_pair: "https://app-bsc.dyp.finance/staking-busd-90",
			return_types: "WBNB WETH DYP"
		}
}

const IDs_avax = {
	"0x499c588146443235357e9c630a66d6fe0250caa1":
		{
			pool_name: "DYP/AVAX LP Pool AVAX",
			pair_name: "DYP-AVAX",
			link_pair: "https://app-avax.dyp.finance/staking-avax-3",
			return_types: "WAVAX WETH DYP"
		},
	"0xd8af0591be4fba56e3634c992b7fe4ff0a90b584":
		{
			pool_name: "DYP/AVAX LP Pool AVAX",
			pair_name: "DYP-AVAX",
			link_pair: "https://app-avax.dyp.finance/staking-avax-30",
			return_types: "WAVAX WETH DYP"
		},
	"0xbebe1fe1444a50ac6ee95ea25ba80adf5ac7322c":
		{
			pool_name: "DYP/AVAX LP Pool AVAX",
			pair_name: "DYP-AVAX",
			link_pair: "https://app-avax.dyp.finance/staking-avax-60",
			return_types: "WAVAX WETH DYP"
		},
	"0x79be220ab2dfcc2f140b59a97bfe6751ed1579b0":
		{
			pool_name: "DYP/AVAX LP Pool AVAX",
			pair_name: "DYP-AVAX",
			link_pair: "https://app-avax.dyp.finance/staking-avax-90",
			return_types: "WAVAX WETH DYP"
		}
}

const IDs_constant = {
	"0x7fc2174670d672ad7f666af0704c2d961ef32c73":
		{
			pool_name: "DYP Constant Staking",
			pair_name: "DYP",
			link_pair: "https://app.dyp.finance/constant-staking-30",
			return_types: "DYP",
			apy: 20
		},
	"0x036e336ea3ac2e255124cf775c4fdab94b2c42e4":
		{
			pool_name: "DYP Constant Staking",
			pair_name: "DYP",
			link_pair: "https://app.dyp.finance/constant-staking-60",
			return_types: "DYP",
			apy: 25
		},
	"0x0a32749d95217b7ee50127e24711c97849b70c6a":
		{
			pool_name: "DYP Constant Staking",
			pair_name: "DYP",
			link_pair: "https://app.dyp.finance/constant-staking-90",
			return_types: "DYP",
			apy: 30
		},
	"0x82df1450efd6b504ee069f5e4548f2d5cb229880":
		{
			pool_name: "DYP Constant Staking",
			pair_name: "DYP",
			link_pair: "https://app.dyp.finance/constant-staking-120",
			return_types: "DYP",
			apy: 35
		}
}

//Generate FarmInfo for Tools
const getFarmInfo = () => {

	farmInfo = []
	let count = 0
	let apy_percent = 0,
		tvl_usd = 0,
		apy_percent_url = "",
		tvl_usd_url = "",
		_id = "6099a8c6efc4dfef87fd2ce0",
		link_logo = "https://app.dyp.finance/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		return_types = "",
		__v = 0

	//ETH
	let lp_ids = Object.keys(the_graph_result.lp_data)
	for (let id of lp_ids) {

		apy_percent = the_graph_result.lp_data[id].apy
		tvl_usd = the_graph_result.lp_data[id].tvl_usd

		let pool_address = id.split('-')[1]

		pool_name = IDs_eth[pool_address].pool_name
		pair_name = IDs_eth[pool_address].pair_name
		link_pair = IDs_eth[pool_address].link_pair
		return_types = IDs_eth[pool_address].return_types

		farmInfo[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}

	//BSC
	let lp_ids_bsc = Object.keys(the_graph_result_BSC.lp_data)
	for (let id of lp_ids_bsc) {

		apy_percent = the_graph_result_BSC.lp_data[id].apy
		tvl_usd = the_graph_result_BSC.lp_data[id].tvl_usd

		let pool_address = id.split('-')[1]

		pool_name = IDs_bsc[pool_address].pool_name
		pair_name = IDs_bsc[pool_address].pair_name
		link_pair = IDs_bsc[pool_address].link_pair
		return_types = IDs_bsc[pool_address].return_types

		farmInfo[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}

	//AVAX
	let lp_ids_avax = Object.keys(the_graph_result_AVAX.lp_data)
	for (let id of lp_ids_avax) {

		apy_percent = the_graph_result_AVAX.lp_data[id].apy
		tvl_usd = the_graph_result_AVAX.lp_data[id].tvl_usd

		let pool_address = id.split('-')[1]

		pool_name = IDs_avax[pool_address].pool_name
		pair_name = IDs_avax[pool_address].pair_name
		link_pair = IDs_avax[pool_address].link_pair
		return_types = IDs_avax[pool_address].return_types

		farmInfo[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}

	//Constant-staking
	let ids_constant = Object.keys(IDs_constant)
	for (let id of ids_constant) {

		apy_percent = IDs_constant[id].apy

		if ( id == "0x7fc2174670d672ad7f666af0704c2d961ef32c73" )
			tvl_usd = farmingTvl30
		if ( id == "0x036e336ea3ac2e255124cf775c4fdab94b2c42e4" )
			tvl_usd = farmingTvl60
		if ( id == "0x0a32749d95217b7ee50127e24711c97849b70c6a" )
			tvl_usd = farmingTvl90
		if ( id == "0x82df1450efd6b504ee069f5e4548f2d5cb229880" )
			tvl_usd = farmingTvl120

		pool_name = IDs_constant[id].pool_name
		pair_name = IDs_constant[id].pair_name
		link_pair = IDs_constant[id].link_pair
		return_types = IDs_constant[id].return_types

		farmInfo[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}
}

let apyInfoEth = new Map()
let apyInfoBsc = new Map()
let apyInfoAvax = new Map()

let strMapEth = {}
let strMapBsc = {}
let strMapAvax = {}

const getHashMaps = () => {

	//clearing the HashMap before adding new values
	apyInfoEth.clear()
	apyInfoBsc.clear()
	apyInfoAvax.clear()

	//HashMaps containing all APY's for all the contracts
	for (let pools of farmInfo) {

		//HashMap for ETH network
		if( (pools.pool_name).search('Ethereum') > 0 ) {

			let lock_pair = pools.link_pair.split('/')[3].split('-')[1]
			let staking_pair = pools.link_pair.split('/')[3].split('-')[2]
			staking_pair = lock_pair + '_' + staking_pair

			if( (pools.pair_name).search('ETH') > 0 ){
				apyInfoEth.set(staking_pair, pools.apy_percent)
			}

			if( (pools.pair_name).search('BTC') > 0 ) {
				apyInfoEth.set(staking_pair, pools.apy_percent)
			}

			if( (pools.pair_name).search('USDC') > 0 ){
				apyInfoEth.set(staking_pair, pools.apy_percent)
			}

			if( (pools.pair_name).search('USDT') > 0 ){
				apyInfoEth.set(staking_pair, pools.apy_percent)
			}
		}

		//HashMap for BSC network
		if( (pools.pool_name).search('BSC') > 0 ) {

			let lock_pair = pools.link_pair.split('/')[3].split('-')[1]
			let staking_pair = pools.link_pair.split('/')[3].split('-')[2]
			staking_pair = lock_pair + '_' + staking_pair

			if( (pools.pair_name).search('WBNB') > 0 ){
				apyInfoBsc.set(staking_pair, pools.apy_percent)
			}

			if( (pools.pair_name).search('ETH') > 0 ) {
				apyInfoBsc.set(staking_pair, pools.apy_percent)
			}

			if( (pools.pair_name).search('BUSD') > 0 ){
				apyInfoBsc.set(staking_pair, pools.apy_percent)
			}
		}

		//HashMap for AVAX network
		if( (pools.pool_name).search('AVAX') > 0 ) {

			let lock_pair = pools.link_pair.split('/')[3].split('-')[1]
			let staking_pair = pools.link_pair.split('/')[3].split('-')[2]
			staking_pair = lock_pair + '_' + staking_pair

			if( (pools.pair_name).search('AVAX') > 0 ){
				apyInfoAvax.set(staking_pair, pools.apy_percent)
			}
		}
	}

	strMapEth = JSON.stringify(Array.from(apyInfoEth.entries()));
	strMapBsc = JSON.stringify(Array.from(apyInfoBsc.entries()));
	strMapAvax = JSON.stringify(Array.from(apyInfoAvax.entries()));

	// console.log(apyInfoEth)
	// console.log(apyInfoBsc)
	// console.log(apyInfoAvax)
}

/* Avalanche Bridged USD */

const contractList = {
	"avalanche": [
		"0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab_ethereum",
		"0x50b7545627a5162f82a992c33b87adc75187b218_bitcoin",
		"0xd586e7f844cea2f87f50152665bcbc2c279d8d70_dai",
		"0xc7198437980c041c805a1edcba50c1ce5db95118_tether",
		"0x5947bb275c521040051d82396192181b413227a3_chainlink",
		"0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664_usd-coin",
		"0x37b608519f91f70f2eeb0e5ed9af4061722e4f76_sushi",
		"0x63a72806098bd3d9520cc43356dd78afe5d386d9_aave",
		"0x8ebaf22b6f053dffeaf46f4dd9efa95d89ba8580_uniswap",
		"0x19860ccb0a68fd4213ab9d8266f7bbf05a8dde98_binance-usd",
		"0x9eaac1b23d935365bd7b542fe22ceee2922f52dc_yearn-finance",
		"0xc7b5d72c836e718cda8888eaf03707faef675079_trustswap",
		"0xd501281565bf7789224523144fe5d98e8b28f267_1inch",
		"0x8a0cac13c7da965a312f08ea4229c37869e85cb9_the-graph",
		"0xc3048e19e76cb9a3aa9d77d8c03c29fc906e2437_compound-governance-token",
		"0x88128fd4b259552a9a1d457f435a6527aab72d42_maker",
		"0x98443b96ea4b0858fdf3219cd13e98c7a4690588_basic-attention-token",
		"0xbec243c995409e6520d7c41e404da5deba4b209b_havven",
		"0x596fa47043f99a4e0f122243b841e55375cde0d2_0x",
		"0x3bd2b1c7ed8d396dbb98ded3aebb41350a5b2339_uma"
	]
}

const contractListId = Object.keys(contractList).map(key => contractList[key]).flat()

let totalBridgedOnAvalanche = 0
let last_update_time_avalanche = 0

const bridgedOnAvalanche = async () => {
	last_update_time_avalanche = Date.now()
	totalBridgedOnAvalanche = 0
	let contractListIds = contractListId
	for (let id of contractListIds) {
		let contractAddress = id.split('_')[0]
		let contractBridge = new avaxWeb3.eth.Contract(TOKEN_ABI_AVAX, contractAddress, {from: undefined})
		let totalSupply = await Promise.all([contractBridge.methods.totalSupply().call()])
		let decimals = await Promise.all([contractBridge.methods.decimals().call()])
		let tokens = totalSupply/eval('1e'+decimals)

		let pricePerToken = await getPrice(id.split('_')[1])

		totalBridgedOnAvalanche = totalBridgedOnAvalanche + tokens * pricePerToken
	}
	return totalBridgedOnAvalanche
}

/* Generate Farms Avalanche */

const IDs_constant_avalanche = {
	"0x4c7e0cbb0276a5e963266e6b9f34db73a1cb73f3":
		{
			pool_name: "DYP Buyback",
			pair_name: "DYP",
			link_pair: "https://app-avax.dyp.finance/staking-buyback",
			return_types: "DYP",
			apy: 100
		}
}

let buybackTvl = 0
let farmInfoAvalanche = []

const getFarmInfoAvalanche = async () => {

	farmInfoAvalanche = []
	let count = 0
	let apy_percent = 0,
		tvl_usd = 0,
		apy_percent_url = "",
		tvl_usd_url = "",
		_id = "6099a8c6efc4dfef87fd2ce0",
		link_logo = "https://app.dyp.finance/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		return_types = "",
		__v = 0

	//AVAX
	let lp_ids_avax = Object.keys(the_graph_result_AVAX.lp_data)
	for (let id of lp_ids_avax) {

		apy_percent = the_graph_result_AVAX.lp_data[id].apy
		tvl_usd = the_graph_result_AVAX.lp_data[id].tvl_usd

		let pool_address = id.split('-')[1]

		pool_name = IDs_avax[pool_address].pool_name
		pair_name = IDs_avax[pool_address].pair_name
		link_pair = IDs_avax[pool_address].link_pair
		return_types = IDs_avax[pool_address].return_types

		farmInfoAvalanche[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}

	//Staking-buyback
	let ids_constant = Object.keys(IDs_constant_avalanche)
	let address_constant = ids_constant[0]

	//Calculate TVL Buyback
	let token_contract = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})
	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])
	let _tvlBuyback = await token_contract.methods.balanceOf(address_constant).call()
	_tvlBuyback = _tvlBuyback / 1e18 * usdPerToken
	buybackTvl = _tvlBuyback

	for (let id of ids_constant) {

		apy_percent = IDs_constant_avalanche[id].apy

		if ( id == "0x4c7e0cbb0276a5e963266e6b9f34db73a1cb73f3" )
			tvl_usd = buybackTvl

		pool_name = IDs_constant_avalanche[id].pool_name
		pair_name = IDs_constant_avalanche[id].pair_name
		link_pair = IDs_constant_avalanche[id].link_pair
		return_types = IDs_constant_avalanche[id].return_types

		farmInfoAvalanche[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}
}

/* Generate Farms Binance */

const IDs_constant_binance = {
	"0x350f3fe979bfad4766298713c83b387c2d2d7a7a":
		{
			pool_name: "DYP Buyback",
			pair_name: "DYP",
			link_pair: "https://app-bsc.dyp.finance/staking-buyback",
			return_types: "DYP",
			apy: 100
		}
}

let buybackTvlBinance = 0
let farmInfoBinance = []

const getFarmInfoBinance = async () => {

	farmInfoBinance = []
	let count = 0
	let apy_percent = 0,
		tvl_usd = 0,
		apy_percent_url = "",
		tvl_usd_url = "",
		_id = "6099a8c6efc4dfef87fd2ce0",
		link_logo = "https://app.dyp.finance/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		return_types = "",
		__v = 0

	//BSC
	let lp_ids_bsc = Object.keys(the_graph_result_BSC.lp_data)
	for (let id of lp_ids_bsc) {

		apy_percent = the_graph_result_BSC.lp_data[id].apy
		tvl_usd = the_graph_result_BSC.lp_data[id].tvl_usd

		let pool_address = id.split('-')[1]

		pool_name = IDs_bsc[pool_address].pool_name
		pair_name = IDs_bsc[pool_address].pair_name
		link_pair = IDs_bsc[pool_address].link_pair
		return_types = IDs_bsc[pool_address].return_types

		farmInfoBinance[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}

	//Staking-buyback Binance
	let ids_constant = Object.keys(IDs_constant_binance)
	let address_constant = ids_constant[0]

	//Calculate TVL Buyback Binance
	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})
	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])
	let _tvlBuyback = await token_contract.methods.balanceOf(address_constant).call()
	_tvlBuyback = _tvlBuyback / 1e18 * usdPerToken
	buybackTvlBinance = _tvlBuyback

	for (let id of ids_constant) {

		apy_percent = IDs_constant_binance[id].apy

		if ( id == "0x350f3fe979bfad4766298713c83b387c2d2d7a7a" )
			tvl_usd = buybackTvlBinance

		pool_name = IDs_constant_binance[id].pool_name
		pair_name = IDs_constant_binance[id].pair_name
		link_pair = IDs_constant_binance[id].link_pair
		return_types = IDs_constant_binance[id].return_types

		farmInfoBinance[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}
}

/* Generate Farms Ethereum */

const IDs_constant_ethereum = {
	"0xe5262f38bf13410a79149cb40429f8dc5e830542":
		{
			pool_name: "DYP Buyback",
			pair_name: "DYP",
			link_pair: "https://app.dyp.finance/staking-buyback",
			return_types: "DYP",
			apy: 100
		}
}

let buybackTvlEthereum = 0
let farmInfoEthereum = []

const getFarmInfoEthereum = async () => {

	farmInfoEthereum = []
	let count = 0
	let apy_percent = 0,
		tvl_usd = 0,
		apy_percent_url = "",
		tvl_usd_url = "",
		_id = "6099a8c6efc4dfef87fd2ce0",
		link_logo = "https://app.dyp.finance/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		return_types = "",
		__v = 0

	//ETH
	let lp_ids = Object.keys(the_graph_result.lp_data)
	for (let id of lp_ids) {

		apy_percent = the_graph_result.lp_data[id].apy
		tvl_usd = the_graph_result.lp_data[id].tvl_usd

		let pool_address = id.split('-')[1]

		pool_name = IDs_eth[pool_address].pool_name
		pair_name = IDs_eth[pool_address].pair_name
		link_pair = IDs_eth[pool_address].link_pair
		return_types = IDs_eth[pool_address].return_types

		farmInfoEthereum[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}

	//Constant-staking
	let ids_constant_staking = Object.keys(IDs_constant)
	for (let id of ids_constant_staking) {

		apy_percent = IDs_constant[id].apy

		if ( id == "0x7fc2174670d672ad7f666af0704c2d961ef32c73" )
			tvl_usd = farmingTvl30
		if ( id == "0x036e336ea3ac2e255124cf775c4fdab94b2c42e4" )
			tvl_usd = farmingTvl60
		if ( id == "0x0a32749d95217b7ee50127e24711c97849b70c6a" )
			tvl_usd = farmingTvl90
		if ( id == "0x82df1450efd6b504ee069f5e4548f2d5cb229880" )
			tvl_usd = farmingTvl120

		pool_name = IDs_constant[id].pool_name
		pair_name = IDs_constant[id].pair_name
		link_pair = IDs_constant[id].link_pair
		return_types = IDs_constant[id].return_types

		farmInfoEthereum[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}

	//Staking-buyback Ethereum
	let ids_constant = Object.keys(IDs_constant_ethereum)
	let address_constant = ids_constant[0]

	//Calculate TVL Buyback Binance
	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})
	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])
	let _tvlBuyback = await token_contract.methods.balanceOf(address_constant).call()
	_tvlBuyback = _tvlBuyback / 1e18 * usdPerToken
	buybackTvlEthereum = _tvlBuyback

	for (let id of ids_constant) {

		apy_percent = IDs_constant_ethereum[id].apy

		if ( id == "0xe5262f38bf13410a79149cb40429f8dc5e830542" )
			tvl_usd = buybackTvlEthereum

		pool_name = IDs_constant_ethereum[id].pool_name
		pair_name = IDs_constant_ethereum[id].pair_name
		link_pair = IDs_constant_ethereum[id].link_pair
		return_types = IDs_constant_ethereum[id].return_types

		farmInfoEthereum[count] = {
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			apy_percent_url: apy_percent_url,
			tvl_usd_url: tvl_usd_url,
			_id: _id,
			link_logo: link_logo,
			pool_name: pool_name,
			pair_name: pair_name,
			link_pair: link_pair,
			return_types: return_types,
			__v: __v
		}

		count++
	}
}

/* Get Holders from all chains */

const urlMetadata = require('url-metadata')

let totalHolders = 0
let last_update_time_holders = 0

const getHolders = async () => {
	last_update_time_holders = Date.now()

	//let holdersAvax = await fetchAsync('https://cchain.explorer.avax.network/token-counters?id=0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17')
	let holdersEth = await fetchAsync('https://api.ethplorer.io/getTokenInfo/0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17?apiKey=freekey')

	//totalHolders = holdersAvax.token_holder_count + holdersEth.holdersCount
	totalHolders = 10513 + holdersEth.holdersCount

	let meta = {}
	let holdersBsc = 0

	await urlMetadata('https://bscscan.com/token/0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17').then(
		function (metadata) { // success handler
			meta = metadata
			let stringx = JSON.stringify(meta.description)
			let stringBetweenCharacters = stringx.match(/holders (.*?) and/i)[1].replace(',', '')
			holdersBsc = parseInt(stringBetweenCharacters)
			return holdersBsc
		},
		function (error) { // failure handler
			console.log(error)
		})
	// totalHolders = totalHolders + holdersBsc
	totalHolders = totalHolders + 9118

	return totalHolders
}


/* The Graph BSC New Smart Contracts */

let the_graph_result_BSC_V2 = {}

let price_iDYP = 0

// MAKE SURE ALL THESE ADDRESSES ARE LOWERCASE
const TOKENS_DISBURSED_PER_YEAR_BSC_V2 = [
	660_000,
	996_000,
	1_680_000,
	2_220_000,
	2_760_000,
]

const LP_IDs_BSC_V2 =
	{
		"wbnb": [
			"0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0x537dc4fee298ea79a7f65676735415f1e2882f92",
			"0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0x219717bf0bc33b2764a6c1a772f75305458bda3d",
			"0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0xd1151a2434931f34bcfa6c27639b67c1a23d93af",
			"0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0xed869ba773c3f1a1adcc87930ca36ee2dc73435d",
			"0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0x415b1624710296717fa96cad84f53454e8f02d18",
		]
	}

const LP_ID_LIST_BSC_V2 = Object.keys(LP_IDs_BSC_V2).map(key => LP_IDs_BSC_V2[key]).flat()
const TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC_V2 = {}
LP_ID_LIST_BSC_V2.forEach((lp_id, i) => TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC_V2[lp_id] = TOKENS_DISBURSED_PER_YEAR_BSC_V2[i])
const VAULT_ADDRESSES_LIST = LP_ID_LIST_BSC_V2.map(id => id.split('-')[1])

PANCAKESWAP_ROUTER_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
async function getPancakeswapRouterContract(address=config.pancakeswap_router_address) {
	return (new bscWeb3.eth.Contract(PANCAKESWAP_ROUTER_ABI, address, {from: undefined}))
}

function get_usd_values_BSC_V2({
							token_contract_addresses,
							lp_ids,
						}) {
	return new Promise(async (resolve, reject) => {

		let usd_per_eth = await getPrice(config.cg_ids['main'])
		let usdPerPlatformToken = await getPrice(config.cg_ids['platform-token'])

		let aux_Price = usdPerPlatformToken

		let amount = new BigNumber(1000000000000000000).toFixed(0)
		let router = await getPancakeswapRouterContract()
		let WETH = await router.methods.WETH().call()
		let platformTokenAddress = config.BUSD_address
		let rewardTokenAddress = config.reward_token_address2
		let path = [...new Set([rewardTokenAddress, WETH, platformTokenAddress].map(a => a.toLowerCase()))]
		let _amountOutMin = await router.methods.getAmountsOut(amount, path).call()
		_amountOutMin = _amountOutMin[_amountOutMin.length - 1]
		_amountOutMin = new BigNumber(_amountOutMin).div(1e18).toFixed(18)
		price_iDYP = _amountOutMin

		async function getData(token_contract_addresses, lp_ids) {
			let tokens = []
			let liquidityPositions = []
			let token_price_usd = 0
			for (let id of token_contract_addresses) {
				//Add the price from iDYP
				if(id==TOKEN_ADDRESS)
					token_price_usd = await getPrice(config.cg_ids[id])
				else
					token_price_usd = parseFloat(_amountOutMin)
				tokens.push({id, token_price_usd})
			}

			let platformTokenContract = {}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				if (pairAddress == '0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb'){
					platformTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address2, {from: undefined})
					usdPerPlatformToken = _amountOutMin
				}
				else {
					platformTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, {from: undefined})
					usdPerPlatformToken = aux_Price
				}

				let pairTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, pairAddress, {from: undefined})

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2  / (lpTotalSupply/1e18)
				let usd_value_of_lp_staked = stakingLpBalance/1e18*usd_per_lp
				let lp_staked = stakingLpBalance/1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {data: {
					tokens, liquidityPositions
				}}
		}

		getData(token_contract_addresses.map(a => a.toLowerCase()), lp_ids.map(a => a.toLowerCase()))
			.then(res => handleTheGraphData(res))
			.catch(reject)


		function handleTheGraphData(response) {
			try {
				let data = response.data
				if (!data) return reject(response);

				//console.log({data})

				let token_data = {}, lp_data = {}

				data.tokens.forEach(t => {
					token_data[t.id] = t
				})

				data.liquidityPositions.forEach(lp => {
					lp_data[lp.id] = lp
				})
				resolve({token_data, lp_data, usd_per_eth})
			} catch (e) {
				console.error(e)
				reject(e)
			}
		}
	})
}

/**
 *
 * @param {string[]} staking_pools_list - List of Contract Addresses for Staking Pools
 * @returns {number[]} List of number of stakers for each pool
 */
async function get_number_of_stakers_BSC_V2(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new bscWeb3.eth.Contract(STAKING_ABI, contract_address, {from: undefined})
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_BSC_V2({
									  TOKEN_ADDRESS,
									  HOLDERS_LIST
								  }) {

	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}


async function get_token_balances_idyp_BSC_V2({TOKEN_ADDRESS, HOLDERS_LIST}) {

	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})
	return token_contract.methods.balanceOf(HOLDERS_LIST).call()
}

async function get_to_be_burnt_bsc(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new bscWeb3.eth.Contract(STAKING_ABI, contract_address, {from: undefined})
		return contract.methods.tokensToBeDisbursedOrBurnt().call()
	}))).map(h => Number(h))
}

async function get_apy_and_tvl_BSC_V2(usd_values) {
	let {token_data, lp_data, usd_per_eth} = usd_values

	let magic_number = [
		"2004008016031955", // 0.2%
		"3009027081243731", // 0.3%
		"5025125628140614", // 0.5%
		"6745192791704380", // 0.67%
		"8369466572552220", // 0.83%
	]

	let apr_staking = [
		"20",
		"25",
		"35",
		"40",
		"50"
	]

	let token_price_usd = token_data[TOKEN_ADDRESS_IDYP].token_price_usd*1
	let dyp_price = token_data[TOKEN_ADDRESS].token_price_usd*1
	let balances_by_address = {},
		number_of_holders_by_address = {},
		magic_number_of_pools = {},
		tokens_to_be_burnt_by_pool = {},
		apr_for_each_pool = {}

	let lp_ids = Object.keys(lp_data)
	let pair_addrs = lp_ids.map(a => a.split('-')[0])
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_BSC_V2({TOKEN_ADDRESS, HOLDERS_LIST: addrs})
	addrs.forEach((addr, i) => balances_by_address[addr] = token_balances[i])
	addrs.forEach((addr, i) => apr_for_each_pool[addr] = apr_staking[i])

	//Get the magic_number of each pool
	addrs.forEach((addr, i) => magic_number_of_pools[addr] = magic_number[i])
	// console.log(magic_number_of_pools)

	await wait(2000)

	let number_of_holders = await get_number_of_stakers_BSC_V2(addrs)
	addrs.forEach((addr, i) => number_of_holders_by_address[addr] = number_of_holders[i])


	let to_be_burnt = await get_to_be_burnt_bsc(addrs)
	addrs.forEach((addr, i) => tokens_to_be_burnt_by_pool[addr] = to_be_burnt[i])
	//console.log(tokens_to_be_burnt_by_pool)

	//Get Balance of IDYP for each Pool in order to calculate the maxSwappableAmount.
	let number_of_idyp_on_pair = await get_token_balances_idyp_BSC_V2({TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: pair_addrs[0]})

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0, apyFarming = 0, TOKENS_DISBURSED = 0, apyStaking = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2)*1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked*1

		//apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC_V2[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		let maxSwappableAmount = new BigNumber(number_of_idyp_on_pair).div(1e18).multipliedBy(magic_number_of_pools[pool_address]).div(1e18).toFixed(0)

		let to_be_distributed = TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC_V2[lp_id] / 365
		let sum = new BigNumber(tokens_to_be_burnt_by_pool[pool_address]).div(1e18).plus(to_be_distributed).toFixed(0)

		if(parseInt(sum) >= parseInt(maxSwappableAmount)){
			TOKENS_DISBURSED = new BigNumber(maxSwappableAmount).multipliedBy(365).toFixed(0)
		} else if(parseInt(sum) < parseInt(maxSwappableAmount)) {
			TOKENS_DISBURSED = new BigNumber(sum).multipliedBy(365).toFixed(0)
		}

		apyFarming = (TOKENS_DISBURSED * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1
		//console.log({sum, maxSwappableAmount, TOKENS_DISBURSED, apyFarming})

		apyStaking = new BigNumber(0.25).div(dyp_price).times(apr_for_each_pool[pool_address]).div(1e2).times(token_price_usd).times(1e2).toFixed(2)*1

		apy = new BigNumber(apyFarming).multipliedBy(0.75).plus(apyStaking*0.25).toFixed(2)*1

		lp_data[lp_id].apy = apy
		lp_data[lp_id].apyFarming = apyFarming
		lp_data[lp_id].apyStaking = apyStaking
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
	})

	return {token_data, lp_data, usd_per_eth, token_price_usd, price_DYPS}
}

async function get_usd_values_with_apy_and_tvl_BSC_V2(...arguments) {
	return (await get_apy_and_tvl_BSC_V2(await get_usd_values_BSC_V2(...arguments)))
}

let last_update_time_v2 = 0

async function refresh_the_graph_result_BSC_V2() {
	last_update_time_v2 = Date.now()
	let result = await get_usd_values_with_apy_and_tvl_BSC_V2({token_contract_addresses: [TOKEN_ADDRESS, TOKEN_ADDRESS_IDYP], lp_ids: LP_ID_LIST_BSC_V2})
	the_graph_result_BSC_V2 = result
	//window.TVL_FARMING_POOLS = await refreshBalance()
	return result
}

/**
 *
 * TODO TVL Staking
 * DYP - iDYP
 * TODO TVL Farming
 * LP - iDYP
 * TODO TVL Buyback
 * iDYP
 * */

/* TVL Buyback & Farming & Staking -> iDYP BSC */

const newContracts = [
	"0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90",
	"0xaF411BF994dA1435A3150B874395B86376C5f2d5",
	"0x94B1A7B57C441890b7a0f64291B39ad6f7E14804",
	"0x9af074cE714FE1Eb32448052a38D274E93C5dc28",
	"0x4eF782E66244A0CF002016AA1Db3019448c670aE",
	"0xDBfb96e2899d52B469C1a1C35eD71fBBa228d2cC",
	"0x537DC4fee298Ea79A7F65676735415f1E2882F92",
	"0xc794cDb8D6aC5eB42d5ABa9c1E641ae17c239c8c",
	"0x219717BF0bC33b2764A6c1A772F75305458BDA3d",
	"0x23609B1f5274160564e4afC5eB9329A8Bf81c744",
	"0xD1151a2434931f34bcFA6c27639b67C1A23D93Af",
	"0x264922696b9972687522b6e98Bf78A0430E2163C",
	"0xed869Ba773c3F1A1adCC87930Ca36eE2dC73435d",
	"0x9DF0A645BeB6F7aDFaDC56f3689E79405337EFE2",
	"0x415B1624710296717FA96cAD84F53454E8F02D18",
	"0xbd574278fEbad04b7A0694C37DeF4f2ecFa9354A"
]

async function totalTvliDYP () {
	let tvliDYP = 0

	let token_balances = await get_token_balances_BSC({TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: newContracts})

	await wait(2000)

	for (let id of token_balances){
		tvliDYP = new BigNumber(tvliDYP).plus(id)
	}

	tvliDYP = new BigNumber(tvliDYP).div(1e18).times(price_iDYP).toFixed(0)


	return tvliDYP
}

/* TVL Staking + Farming -> DYP + LP BSC */

async function totalTvlFarmingStakingV2 () {
	let tvlTotal = 0
	let tvlStaking = 0

	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])

	let token_balances = await get_token_balances_BSC({TOKEN_ADDRESS: TOKEN_ADDRESS, HOLDERS_LIST: newContracts})

	tvlTotal = tvlTotal + the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[0]].tvl_usd +
		the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[1]].tvl_usd +
		the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[2]].tvl_usd +
		the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[3]].tvl_usd +
		the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[4]].tvl_usd

	for (let id of token_balances){
		tvlStaking = new BigNumber(tvlStaking).plus(id)
	}

	tvlStaking = new BigNumber(tvlStaking).div(1e18).times(usdPerToken).toFixed(0)

	tvlTotal = new BigNumber(tvlTotal).plus(tvlStaking).toFixed(0)

	//console.log({tvlTotal})

	return tvlTotal
}

/* TVL Buyback & Farming & Staking -> iDYP AVAX */

const newContractsAvax = [
	"0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B",
	"0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9",
	"0xC905D5DD9A4f26eD059F76929D11476B2844A7c3",
	"0xe6B307CD185f2A541a661eA312E3e7939Ea9d218",
	"0x267434f01ac323C6A5BCf41Fa111701eE0165a37",
	"0x934819D227B7095595eC9cA6604eF2Dd0C3a9EA2",
	"0x035d65babF595758D7A439D5870BAdc44218D028",
	"0x1cA9Fc98f3b997E08bC04691414e33B1835aa7e5",
	"0x6c325DfEA0d18387D423C869E328Ef005cBA024F",
	"0x6a258Bd17456e057A7c6102177EC2f9d64D5F9e4",
	"0x85C4f0CEA0994dE365dC47ba22dD0FD9899F93Ab",
	"0xC2ba0abFc89A5A258e6440D82BB95A5e2B541581",
	"0x6f5dC6777b2B4667Bf183D093111867239518af5",
	"0x4c16093Da4BA7a604A1Fe8CD5d387cC904B3D407",
	"0x10E105676CAC55b74cb6500a8Fb5d2f84804393D",
	"0x9FF3DC1f7042bAF46651029C7284Fc3B93e21a4D"
]

async function totalTvliDYPAvax () {
	let tvliDYP = 0

	let token_balances = await get_token_balances_AVAX_V2({TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: newContractsAvax})

	await wait(2000)

	for (let id of token_balances){
		tvliDYP = new BigNumber(tvliDYP).plus(id)
	}

	tvliDYP = new BigNumber(tvliDYP).div(1e18).times(price_iDYP_avax).toFixed(0)


	return tvliDYP
}

/* TVL Staking + Farming -> DYP + LP AVAX */

async function totalTvlFarmingStakingAvaxV2 () {
	let tvlTotal = 0
	let tvlStaking = 0

	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])

	let token_balances = await get_token_balances_AVAX_V2({TOKEN_ADDRESS: TOKEN_ADDRESS, HOLDERS_LIST: newContractsAvax})

	tvlTotal = tvlTotal + the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[0]].tvl_usd +
		the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[1]].tvl_usd +
		the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[2]].tvl_usd +
		the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[3]].tvl_usd +
		the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[4]].tvl_usd

	for (let id of token_balances){
		tvlStaking = new BigNumber(tvlStaking).plus(id)
	}

	tvlStaking = new BigNumber(tvlStaking).div(1e18).times(usdPerToken).toFixed(0)

	tvlTotal = new BigNumber(tvlTotal).plus(tvlStaking).toFixed(0)

	//console.log({tvlTotal})

	return tvlTotal
}


/* TVL Buyback & Farming & Staking -> iDYP ETH V2 */

const newContractsEth = [
	"0xa4da28B8e42680916b557459D338aF6e2D8d458f",
	"0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d",
	"0xdCBB5B2148f0cf1Abd7757Ba04A5821fEaD80587",
	"0x471beCc72AD487249efE521bf9b6744b882830DF",
	"0xDC65C4277d626d6A29C9Dc42Eb396d354fa5E85b",
	"0x7b7132E7BF4e754855191a978F3979e1E3c8617b",
	"0xa68BBe793ad52d0E62bBf34A67F02235bA69E737",
	"0x0b92E7f074e7Ade0181A29647ea8474522e6A7C2",
	"0xCFd970494a0b3C52a81dcE1EcBFF2245e6b0B0E7",
	"0xff32a38016422F51e8C0aF5D333472392822FeEf",
	"0x49D02CF81Cc352517350F25E200365360426aF94",
	"0x62AAE8C0c50038236d075AC595Ae0BE4F201bBdd",
	"0xf51965c570419F2576ec9AeAD6A3C5F674424A99",
	"0xb67F464b558e3055C2B6F017546Ed53b2e6333d7",
	"0x997A7254E5567d0A70329DEFCc1E4d29d71Ba224",
	"0x1aB008CbfC99d0CA7e3FD8987ce1ebf832506F53"
]

async function totalTvliDYPEth () {
	let tvliDYP = 0

	let token_balances = await get_token_balances_ETH_V2({TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: newContractsEth})

	await wait(2000)

	for (let id of token_balances){
		tvliDYP = new BigNumber(tvliDYP).plus(id)
	}

	tvliDYP = new BigNumber(tvliDYP).div(1e18).times(price_iDYP_eth).toFixed(0)


	return tvliDYP
}

/* TVL Staking + Farming -> DYP + LP ETH V2 */

async function totalTvlFarmingStakingEthV2 () {
	let tvlTotal = 0
	let tvlStaking = 0

	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])

	let token_balances = await get_token_balances_AVAX_V2({TOKEN_ADDRESS: TOKEN_ADDRESS, HOLDERS_LIST: newContractsEth})

	tvlTotal = tvlTotal + the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[0]].tvl_usd +
		the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[1]].tvl_usd +
		the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[2]].tvl_usd +
		the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[3]].tvl_usd +
		the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[4]].tvl_usd

	for (let id of token_balances){
		tvlStaking = new BigNumber(tvlStaking).plus(id)
	}

	tvlStaking = new BigNumber(tvlStaking).div(1e18).times(usdPerToken).toFixed(0)

	tvlTotal = new BigNumber(tvlTotal).plus(tvlStaking).toFixed(0)

	//console.log({tvlTotal})

	return tvlTotal
}

/* Calculate Circulating Supply iDYP */
const HOLDERS_LIST_IDYP = LP_ID_LIST_BSC_V2.map(a => a.split('-')[1]).concat([
	"0xd54cd2d573dffbc768ab871c0eed458b05a9b89b", /* Token Lock */
	"0x71438f8609e85dedb49d3536aaded136a76eac93", /* Vesting 10 years */
	"0x06e69d8147bc9236E76b456Df990236c6F79Affd",
	"0x9fF543C60d963b3b0e1456de53AE854Aa732633A",
	"0x055cd97920d9380facdc833991cc93b3be177974",
	"0xf01B48F894cf68E9D238138D6E281eFA8ea511A2",
	"0xfa5f5EB2398A41DC63c0Eb671993497ff843E7f7",
	"0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90",
	"0xaF411BF994dA1435A3150B874395B86376C5f2d5",
	"0x94B1A7B57C441890b7a0f64291B39ad6f7E14804",
	"0x9af074cE714FE1Eb32448052a38D274E93C5dc28",
	"0x4eF782E66244A0CF002016AA1Db3019448c670aE",
	"0xDBfb96e2899d52B469C1a1C35eD71fBBa228d2cC",
	"0xc794cDb8D6aC5eB42d5ABa9c1E641ae17c239c8c",
	"0x23609B1f5274160564e4afC5eB9329A8Bf81c744",
	"0x264922696b9972687522b6e98Bf78A0430E2163C",
	"0x9DF0A645BeB6F7aDFaDC56f3689E79405337EFE2",
	"0xbd574278fEbad04b7A0694C37DeF4f2ecFa9354A",
	"0x000000000000000000000000000000000000dead",
	"0x58366902082b90fca01be07d929478bd48acfb19",
	"0x160ff3c4a6e9aa8e4271aa71226cc811bfef7ed9"
])

const HOLDERS_LIST_IDYP_AVAX = [
	"0x20ea329ed901bdf48b9198591ccffb558a3b0323", //Token Lock
	"0x6e08239150D8E76920Cf5ffaa2293e89bE345CA9", //Bridge
	"0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B",
	"0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9",
	"0xC905D5DD9A4f26eD059F76929D11476B2844A7c3",
	"0xe6B307CD185f2A541a661eA312E3e7939Ea9d218",
	"0x267434f01ac323C6A5BCf41Fa111701eE0165a37",
	"0x934819D227B7095595eC9cA6604eF2Dd0C3a9EA2",
	"0x035d65babF595758D7A439D5870BAdc44218D028",
	"0x1cA9Fc98f3b997E08bC04691414e33B1835aa7e5",
	"0x6c325DfEA0d18387D423C869E328Ef005cBA024F",
	"0x6a258Bd17456e057A7c6102177EC2f9d64D5F9e4",
	"0x85C4f0CEA0994dE365dC47ba22dD0FD9899F93Ab",
	"0xC2ba0abFc89A5A258e6440D82BB95A5e2B541581",
	"0x6f5dC6777b2B4667Bf183D093111867239518af5",
	"0x4c16093Da4BA7a604A1Fe8CD5d387cC904B3D407",
	"0x10E105676CAC55b74cb6500a8Fb5d2f84804393D",
	"0x9FF3DC1f7042bAF46651029C7284Fc3B93e21a4D",
	// "0x035d65babF595758D7A439D5870BAdc44218D028",
	// "0x6c325DfEA0d18387D423C869E328Ef005cBA024F",
	// "0x85C4f0CEA0994dE365dC47ba22dD0FD9899F93Ab",
	// "0x6f5dC6777b2B4667Bf183D093111867239518af5",
	// "0x10E105676CAC55b74cb6500a8Fb5d2f84804393D",
	"0x8f28110325a727f70b64bffebf2b9dc94b932452",
	"0x5536e02336771cfa0317d4b6a042f3c38749535e"
]

const HOLDERS_LIST_IDYP_ETH = [
	"0x217f2284388925ef825079a7d80fd2de72834aee", //Token Lock
	"0x70c89bd30d8543a594f83c57ed92240a1b4925fe", //Bridge
	"0xa4da28B8e42680916b557459D338aF6e2D8d458f",
	"0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d",
	"0xdCBB5B2148f0cf1Abd7757Ba04A5821fEaD80587",
	"0x471beCc72AD487249efE521bf9b6744b882830DF",
	"0xDC65C4277d626d6A29C9Dc42Eb396d354fa5E85b",
	"0x7b7132E7BF4e754855191a978F3979e1E3c8617b",
	"0xa68BBe793ad52d0E62bBf34A67F02235bA69E737",
	"0x0b92E7f074e7Ade0181A29647ea8474522e6A7C2",
	"0xCFd970494a0b3C52a81dcE1EcBFF2245e6b0B0E7",
	"0xff32a38016422F51e8C0aF5D333472392822FeEf",
	"0x49D02CF81Cc352517350F25E200365360426aF94",
	"0x62AAE8C0c50038236d075AC595Ae0BE4F201bBdd",
	"0xf51965c570419F2576ec9AeAD6A3C5F674424A99",
	"0xb67F464b558e3055C2B6F017546Ed53b2e6333d7",
	"0x997A7254E5567d0A70329DEFCc1E4d29d71Ba224",
	"0x1aB008CbfC99d0CA7e3FD8987ce1ebf832506F53",
	// "0xa68BBe793ad52d0E62bBf34A67F02235bA69E737",
	// "0xCFd970494a0b3C52a81dcE1EcBFF2245e6b0B0E7",
	// "0x49D02CF81Cc352517350F25E200365360426aF94",
	// "0xf51965c570419F2576ec9AeAD6A3C5F674424A99",
	// "0x997A7254E5567d0A70329DEFCc1E4d29d71Ba224",
	"0x9ea966b4023049bff858bb5e698ecff24ea54c4a",
	"0x3fab09acaeddaf579d7a72c24ef3e9eb1d2975c4"
]

async function get_token_balances_bsc({
										  TOKEN_ADDRESS,
										  HOLDERS_LIST
									  }) {
	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}

let token_balance_sum_idyp = 0;
let token_balance_sum_idyp_eth = 0;
let token_balance_sum_idyp_avax = 0;
let last_update_time_idyp = 0;
let circulating_supply_idyp = 0;
async function update_token_balance_sum_bsc() {
	last_update_time_idyp = Date.now()
	token_balance_sum_idyp = get_token_balances_sum( await get_token_balances_bsc({TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: HOLDERS_LIST_IDYP}) ).div(1e18).toString(10)

	token_balance_sum_idyp_eth = get_token_balances_sum( await get_token_balances({TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: HOLDERS_LIST_IDYP_ETH}) ).div(1e18).toString(10)
	token_balance_sum_idyp_avax = get_token_balances_sum( await get_token_balances_AVAX({TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: HOLDERS_LIST_IDYP_AVAX}) ).div(1e18).toString(10)
	let circulating_supply_eth = new BigNumber(300000000).minus(token_balance_sum_idyp_eth)
	let circulating_supply_avax = new BigNumber(300000000).minus(token_balance_sum_idyp_avax)
	// circulating_supply = new BigNumber(30000000).minus(token_balance_sum).plus(circulating_supply_bsc).plus(circulating_supply_avax)

	console.log({token_balance_sum_idyp,token_balance_sum_idyp_eth, token_balance_sum_idyp_avax })
	// console.log({token_balance_sum_idyp_eth, token_balance_sum_idyp, token_balance_sum_idyp_avax})
	circulating_supply_idyp = new BigNumber(300000000).minus(26424547).minus(token_balance_sum_idyp).plus(circulating_supply_eth).plus(circulating_supply_avax);
	return token_balance_sum_idyp
}


/* The Graph AVAX New Smart Contracts */

let the_graph_result_AVAX_V2 = {}

let price_iDYP_avax = 0

// MAKE SURE ALL THESE ADDRESSES ARE LOWERCASE
const TOKENS_DISBURSED_PER_YEAR_AVAX_V2 = [
	660_000,
	996_000,
	1_680_000,
	2_220_000,
	2_760_000,
]

const LP_IDs_AVAX_V2 =
	{
		"wavax": [
			"0x66eecc97203704d9e2db4a431cb0e9ce92539d5a-0x035d65babf595758d7a439d5870badc44218d028",
			"0x66eecc97203704d9e2db4a431cb0e9ce92539d5a-0x6c325dfea0d18387d423c869e328ef005cba024f",
			"0x66eecc97203704d9e2db4a431cb0e9ce92539d5a-0x85c4f0cea0994de365dc47ba22dd0fd9899f93ab",
			"0x66eecc97203704d9e2db4a431cb0e9ce92539d5a-0x6f5dc6777b2b4667bf183d093111867239518af5",
			"0x66eecc97203704d9e2db4a431cb0e9ce92539d5a-0x10e105676cac55b74cb6500a8fb5d2f84804393d",
		]
	}

const LP_ID_LIST_AVAX_V2 = Object.keys(LP_IDs_AVAX_V2).map(key => LP_IDs_AVAX_V2[key]).flat()
const TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX_V2 = {}
LP_ID_LIST_AVAX_V2.forEach((lp_id, i) => TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX_V2[lp_id] = TOKENS_DISBURSED_PER_YEAR_AVAX_V2[i])

PANGOLIN_ROUTER_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WAVAX","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WAVAX","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityAVAX","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountAVAX","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityAVAX","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountAVAX","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityAVAXSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountAVAX","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityAVAXWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountAVAX","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountAVAXMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityAVAXWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountAVAX","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapAVAXForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactAVAXForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactAVAXForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForAVAX","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForAVAXSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactAVAX","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
async function getPangolinRouterContract(address=config.pangolin_router_address) {
	return (new avaxWeb3.eth.Contract(PANGOLIN_ROUTER_ABI, address, {from: undefined}))
}

function get_usd_values_AVAX_V2({
								   token_contract_addresses,
								   lp_ids,
							   }) {
	return new Promise(async (resolve, reject) => {

		let usd_per_eth = await getPrice(config.cg_ids_avax['main'])
		let usdPerPlatformToken = await getPrice(config.cg_ids_avax['platform-token'])

		let aux_Price = usdPerPlatformToken

		let amount = new BigNumber(1000000000000000000).toFixed(0)
		let router = await getPangolinRouterContract()
		let WETH = await router.methods.WAVAX().call()
		let platformTokenAddress = config.USDCe_address
		let rewardTokenAddress = config.reward_token_address2
		let path = [...new Set([rewardTokenAddress, WETH, platformTokenAddress].map(a => a.toLowerCase()))]
		let _amountOutMin = await router.methods.getAmountsOut(amount, path).call()
		_amountOutMin = _amountOutMin[_amountOutMin.length - 1]
		_amountOutMin = new BigNumber(_amountOutMin).div(1e6).toFixed(18)
		price_iDYP_avax = _amountOutMin
		//console.log({price_iDYP_avax})

		async function getData(token_contract_addresses, lp_ids) {
			let tokens = []
			let liquidityPositions = []
			let token_price_usd = 0
			for (let id of token_contract_addresses) {
				//Add the price from iDYP
				if(id==TOKEN_ADDRESS)
					token_price_usd = await getPrice(config.cg_ids_avax[id])
				else
					token_price_usd = parseFloat(_amountOutMin)
				tokens.push({id, token_price_usd})
			}

			let platformTokenContract = {}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				if (pairAddress == '0x66eecc97203704d9e2db4a431cb0e9ce92539d5a'){
					platformTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address2, {from: undefined})
					usdPerPlatformToken = _amountOutMin
				}
				else {
					platformTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, {from: undefined})
					usdPerPlatformToken = aux_Price
				}

				let pairTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, pairAddress, {from: undefined})

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2  / (lpTotalSupply/1e18)
				let usd_value_of_lp_staked = stakingLpBalance/1e18*usd_per_lp
				let lp_staked = stakingLpBalance/1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {data: {
					tokens, liquidityPositions
				}}
		}

		getData(token_contract_addresses.map(a => a.toLowerCase()), lp_ids.map(a => a.toLowerCase()))
			.then(res => handleTheGraphData(res))
			.catch(reject)


		function handleTheGraphData(response) {
			try {
				let data = response.data
				if (!data) return reject(response);

				//console.log({data})

				let token_data = {}, lp_data = {}

				data.tokens.forEach(t => {
					token_data[t.id] = t
				})

				data.liquidityPositions.forEach(lp => {
					lp_data[lp.id] = lp
				})
				resolve({token_data, lp_data, usd_per_eth})
			} catch (e) {
				console.error(e)
				reject(e)
			}
		}
	})
}

/**
 *
 * @param {string[]} staking_pools_list - List of Contract Addresses for Staking Pools
 * @returns {number[]} List of number of stakers for each pool
 */
async function get_number_of_stakers_AVAX_V2(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new avaxWeb3.eth.Contract(STAKING_ABI, contract_address, {from: undefined})
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_AVAX_V2({
											 TOKEN_ADDRESS,
											 HOLDERS_LIST
										 }) {

	let token_contract = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}

async function get_token_balances_idyp_AVAX_V2({TOKEN_ADDRESS, HOLDERS_LIST}) {

	let token_contract = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})
	return token_contract.methods.balanceOf(HOLDERS_LIST).call()
}

async function get_to_be_burnt_avax(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new avaxWeb3.eth.Contract(STAKING_ABI, contract_address, {from: undefined})
		return contract.methods.tokensToBeDisbursedOrBurnt().call()
	}))).map(h => Number(h))
}

async function get_apy_and_tvl_AVAX_V2(usd_values) {
	let {token_data, lp_data, usd_per_eth} = usd_values

	let magic_number = [
		"2004008016031955", // 0.2%
		"3009027081243731", // 0.3%
		"5025125628140614", // 0.5%
		"6745192791704380", // 0.67%
		"8369466572552220", // 0.83%
	]

	let apr_staking = [
		"20",
		"25",
		"35",
		"40",
		"50"
	]

	let token_price_usd = token_data[TOKEN_ADDRESS_IDYP].token_price_usd*1
	let dyp_price = token_data[TOKEN_ADDRESS].token_price_usd*1
	let balances_by_address = {},
		number_of_holders_by_address = {},
		magic_number_of_pools = {},
		tokens_to_be_burnt_by_pool = {},
		apr_for_each_pool = {}

	let lp_ids = Object.keys(lp_data)
	let pair_addrs = lp_ids.map(a => a.split('-')[0])
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_AVAX_V2({TOKEN_ADDRESS, HOLDERS_LIST: addrs})
	addrs.forEach((addr, i) => balances_by_address[addr] = token_balances[i])
	addrs.forEach((addr, i) => apr_for_each_pool[addr] = apr_staking[i])

	//Get the magic_number of each pool
	addrs.forEach((addr, i) => magic_number_of_pools[addr] = magic_number[i])
	// console.log(magic_number_of_pools)

	await wait(2000)

	let number_of_holders = await get_number_of_stakers_AVAX_V2(addrs)
	addrs.forEach((addr, i) => number_of_holders_by_address[addr] = number_of_holders[i])

	let to_be_burnt = await get_to_be_burnt_avax(addrs)
	addrs.forEach((addr, i) => tokens_to_be_burnt_by_pool[addr] = to_be_burnt[i])
	//console.log(tokens_to_be_burnt_by_pool)

	//Get Balance of IDYP for each Pool in order to calculate the maxSwappableAmount.
	let number_of_idyp_on_pair = await get_token_balances_idyp_AVAX_V2({TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: pair_addrs[0]})

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0, apyFarming = 0, apyStaking = 0, TOKENS_DISBURSED = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2)*1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked*1

		//apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX_V2[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		let maxSwappableAmount = new BigNumber(number_of_idyp_on_pair).div(1e18).multipliedBy(magic_number_of_pools[pool_address]).div(1e18).toFixed(0)

		let to_be_distributed = TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX_V2[lp_id] / 365
		let sum = new BigNumber(tokens_to_be_burnt_by_pool[pool_address]).div(1e18).plus(to_be_distributed).toFixed(0)

		if(parseInt(sum) >= parseInt(maxSwappableAmount)){
			TOKENS_DISBURSED = new BigNumber(maxSwappableAmount).multipliedBy(365).toFixed(0)
		} else if(parseInt(sum) < parseInt(maxSwappableAmount)) {
			TOKENS_DISBURSED = new BigNumber(sum).multipliedBy(365).toFixed(0)
		}

		apyFarming = (TOKENS_DISBURSED * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		apyStaking = new BigNumber(0.25).div(dyp_price).times(apr_for_each_pool[pool_address]).div(1e2).times(token_price_usd).times(1e2).toFixed(2)*1

		apy = new BigNumber(apyFarming).multipliedBy(0.75).plus(apyStaking*0.25).toFixed(2)*1

		//console.log({sum, maxSwappableAmount, TOKENS_DISBURSED, apyFarming})

		lp_data[lp_id].apy = apy
		lp_data[lp_id].apyFarming = apyFarming
		lp_data[lp_id].apyStaking = apyStaking
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
	})

	return {token_data, lp_data, usd_per_eth, token_price_usd, price_DYPS}
}

async function get_usd_values_with_apy_and_tvl_AVAX_V2(...arguments) {
	return (await get_apy_and_tvl_AVAX_V2(await get_usd_values_AVAX_V2(...arguments)))
}

let last_update_time_avax_v2 = 0

async function refresh_the_graph_result_AVAX_V2() {
	last_update_time_avax_v2 = Date.now()
	let result = await get_usd_values_with_apy_and_tvl_AVAX_V2({token_contract_addresses: [TOKEN_ADDRESS, TOKEN_ADDRESS_IDYP], lp_ids: LP_ID_LIST_AVAX_V2})
	the_graph_result_AVAX_V2 = result
	//window.TVL_FARMING_POOLS = await refreshBalance()
	return result
}


/* The Graph ETH New Smart Contracts */

let the_graph_result_ETH_V2 = {}

let price_iDYP_eth = 0

// MAKE SURE ALL THESE ADDRESSES ARE LOWERCASE
const TOKENS_DISBURSED_PER_YEAR_ETH_V2 = [
	660_000,
	996_000,
	1_680_000,
	2_220_000,
	2_760_000,
]

const LP_IDs_ETH_V2 =
	{
		"weth": [
			"0x7463286a379f6f128058bb92b355e3d6e8bdb219-0xa68bbe793ad52d0e62bbf34a67f02235ba69e737",
			"0x7463286a379f6f128058bb92b355e3d6e8bdb219-0xcfd970494a0b3c52a81dce1ecbff2245e6b0b0e7",
			"0x7463286a379f6f128058bb92b355e3d6e8bdb219-0x49d02cf81cc352517350f25e200365360426af94",
			"0x7463286a379f6f128058bb92b355e3d6e8bdb219-0xf51965c570419f2576ec9aead6a3c5f674424a99",
			"0x7463286a379f6f128058bb92b355e3d6e8bdb219-0x997a7254e5567d0a70329defcc1e4d29d71ba224",
		]
	}

const LP_ID_LIST_ETH_V2 = Object.keys(LP_IDs_ETH_V2).map(key => LP_IDs_ETH_V2[key]).flat()
const TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_ETH_V2 = {}
LP_ID_LIST_ETH_V2.forEach((lp_id, i) => TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_ETH_V2[lp_id] = TOKENS_DISBURSED_PER_YEAR_ETH_V2[i])

UNISWAP_ROUTER_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
async function getUniswapRouterContract(address=config.uniswap_router_address) {
	return (new infuraWeb3.eth.Contract(UNISWAP_ROUTER_ABI, address, {from: undefined}))
}

function get_usd_values_ETH_V2({
									token_contract_addresses,
									lp_ids,
								}) {
	return new Promise(async (resolve, reject) => {

		let usd_per_eth = await getPrice(config.cg_ids_eth['main'])
		let usdPerPlatformToken = await getPrice(config.cg_ids_eth['platform-token'])

		let aux_Price = usdPerPlatformToken

		let amount = new BigNumber(1000000000000000000).toFixed(0)
		let router = await getUniswapRouterContract()
		let WETH = await router.methods.WETH().call()
		let platformTokenAddress = config.USDC_address
		let rewardTokenAddress = config.reward_token_address2
		let path = [...new Set([rewardTokenAddress, WETH, platformTokenAddress].map(a => a.toLowerCase()))]
		let _amountOutMin = await router.methods.getAmountsOut(amount, path).call()
		_amountOutMin = _amountOutMin[_amountOutMin.length - 1]
		_amountOutMin = new BigNumber(_amountOutMin).div(1e6).toFixed(18)
		price_iDYP_eth = _amountOutMin
		//console.log({price_iDYP_eth})

		async function getData(token_contract_addresses, lp_ids) {
			let tokens = []
			let liquidityPositions = []
			let token_price_usd = 0
			for (let id of token_contract_addresses) {
				//Add the price from iDYP
				if(id==TOKEN_ADDRESS)
					token_price_usd = await getPrice(config.cg_ids_eth[id])
				else
					token_price_usd = parseFloat(_amountOutMin)
				tokens.push({id, token_price_usd})
			}

			let platformTokenContract = {}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				if (pairAddress == '0x7463286a379f6f128058bb92b355e3d6e8bdb219'){
					platformTokenContract = new infuraWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address2, {from: undefined})
					usdPerPlatformToken = _amountOutMin
				}
				else {
					platformTokenContract = new infuraWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, {from: undefined})
					usdPerPlatformToken = aux_Price
				}

				let pairTokenContract = new infuraWeb3.eth.Contract(TOKEN_ABI, pairAddress, {from: undefined})

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2  / (lpTotalSupply/1e18)
				let usd_value_of_lp_staked = stakingLpBalance/1e18*usd_per_lp
				let lp_staked = stakingLpBalance/1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {data: {
					tokens, liquidityPositions
				}}
		}

		getData(token_contract_addresses.map(a => a.toLowerCase()), lp_ids.map(a => a.toLowerCase()))
			.then(res => handleTheGraphData(res))
			.catch(reject)


		function handleTheGraphData(response) {
			try {
				let data = response.data
				if (!data) return reject(response);

				//console.log({data})

				let token_data = {}, lp_data = {}

				data.tokens.forEach(t => {
					token_data[t.id] = t
				})

				data.liquidityPositions.forEach(lp => {
					lp_data[lp.id] = lp
				})
				resolve({token_data, lp_data, usd_per_eth})
			} catch (e) {
				console.error(e)
				reject(e)
			}
		}
	})
}

/**
 *
 * @param {string[]} staking_pools_list - List of Contract Addresses for Staking Pools
 * @returns {number[]} List of number of stakers for each pool
 */
async function get_number_of_stakers_ETH_V2(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new infuraWeb3.eth.Contract(STAKING_ABI, contract_address, {from: undefined})
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_ETH_V2({
											  TOKEN_ADDRESS,
											  HOLDERS_LIST
										  }) {

	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}

async function get_token_balances_idyp_ETH_V2({TOKEN_ADDRESS, HOLDERS_LIST}) {

	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})
	return token_contract.methods.balanceOf(HOLDERS_LIST).call()
}

async function get_to_be_burnt(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new infuraWeb3.eth.Contract(STAKING_ABI, contract_address, {from: undefined})
		return contract.methods.tokensToBeDisbursedOrBurnt().call()
	}))).map(h => Number(h))
}

async function get_apy_and_tvl_ETH_V2(usd_values) {
	let {token_data, lp_data, usd_per_eth} = usd_values

	// let magic_number = [
	// 	"2004008016031955", // 0.2%
	// 	"3009027081243731", // 0.3%
	// 	"5025125628140614", // 0.5%
	// 	"6745192791704380", // 0.67%
	// 	"8369466572552220", // 0.83%
	// ]

	let magic_number = [
		"1001001001001089", // 0.1%
		"1502253380070151", // 0.15%
		"2506265664160345", // 0.25%
		"3310926055984708", // 0.33%
		"4116879204739465", // 0.41%
	]

	let apr_staking = [
		"20",
		"25",
		"35",
		"40",
		"50"
	]

	let token_price_usd = token_data[TOKEN_ADDRESS_IDYP].token_price_usd*1
	let dyp_price = token_data[TOKEN_ADDRESS].token_price_usd*1
	let balances_by_address = {},
		number_of_holders_by_address = {},
		magic_number_of_pools = {},
		tokens_to_be_burnt_by_pool = {},
		apr_for_each_pool = {}

	let lp_ids = Object.keys(lp_data)
	let pair_addrs = lp_ids.map(a => a.split('-')[0])
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_ETH_V2({TOKEN_ADDRESS, HOLDERS_LIST: addrs})
	addrs.forEach((addr, i) => balances_by_address[addr] = token_balances[i])
	addrs.forEach((addr, i) => apr_for_each_pool[addr] = apr_staking[i])

	//Get the magic_number of each pool
	addrs.forEach((addr, i) => magic_number_of_pools[addr] = magic_number[i])
	// console.log(magic_number_of_pools)

	await wait(2000)

	let number_of_holders = await get_number_of_stakers_ETH_V2(addrs)
	addrs.forEach((addr, i) => number_of_holders_by_address[addr] = number_of_holders[i])

	let to_be_burnt = await get_to_be_burnt(addrs)
	addrs.forEach((addr, i) => tokens_to_be_burnt_by_pool[addr] = to_be_burnt[i])
	//console.log(tokens_to_be_burnt_by_pool)

	//Get Balance of IDYP for each Pool in order to calculate the maxSwappableAmount.
	let number_of_idyp_on_pair = await get_token_balances_idyp_ETH_V2({TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: pair_addrs[0]})

	lp_ids.forEach(lp_id => {
		let apy = 0, apyFarming = 0, tvl_usd = 0, TOKENS_DISBURSED = 0, apyStaking = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2)*1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked*1

		/**
		 * TODO
		 * 1. Calculez maximul pe care contractul il poate schimba (Ex: Max 2.5%):
		 * 		Verific maximul daca poate fi schimbat:
		 * 			Caz I: are 2000/zi si poate schimba doar 1000 (se calculeaza x365 zile).
		 * 			Caz II: are 2000/zi si poate schimba 4000 (verific daca are in To Be Burnt):
		 * 				(2000 + to be burnt <= maxSwappable) => (2000 + TBB) x 365 se foloseste pentru APY
		 * 2. Inmultesc rezultatul cu 365 zile si calculez APY
		 *
		 * 3. De calculat APY-ul pentru staking al fiecarui pool si adaugat in rezultatul final.
		 *
		 * 	75% din apyFarming
		 * 	25% din apyStaking
		 * 	apy = 75% + 25%
		 */

		// apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_ETH_V2[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		let maxSwappableAmount = new BigNumber(number_of_idyp_on_pair).div(1e18).multipliedBy(magic_number_of_pools[pool_address]).div(1e18).toFixed(0)

		let to_be_distributed = TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_ETH_V2[lp_id] / 365
		let sum = new BigNumber(tokens_to_be_burnt_by_pool[pool_address]).div(1e18).plus(to_be_distributed).toFixed(0)

		if(parseInt(sum) >= parseInt(maxSwappableAmount)){
			TOKENS_DISBURSED = new BigNumber(maxSwappableAmount).multipliedBy(365).toFixed(0)
		} else if(parseInt(sum) < parseInt(maxSwappableAmount)) {
			TOKENS_DISBURSED = new BigNumber(sum).multipliedBy(365).toFixed(0)
		}

		apyFarming = (TOKENS_DISBURSED * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		apyStaking = new BigNumber(0.25).div(dyp_price).times(apr_for_each_pool[pool_address]).div(1e2).times(token_price_usd).times(1e2).toFixed(2)*1

		apy = new BigNumber(apyFarming).multipliedBy(0.75).plus(apyStaking*0.25).toFixed(2)*1

		//console.log({sum, maxSwappableAmount, TOKENS_DISBURSED, apyFarming})

		lp_data[lp_id].apy = apy
		lp_data[lp_id].apyFarming = apyFarming
		lp_data[lp_id].apyStaking = apyStaking
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
	})

	return {token_data, lp_data, usd_per_eth, token_price_usd, price_DYPS}
}

async function get_usd_values_with_apy_and_tvl_ETH_V2(...arguments) {
	return (await get_apy_and_tvl_ETH_V2(await get_usd_values_ETH_V2(...arguments)))
}

let last_update_time_eth_v2 = 0

async function refresh_the_graph_result_ETH_V2() {
	last_update_time_eth_v2 = Date.now()
	let result = await get_usd_values_with_apy_and_tvl_ETH_V2({token_contract_addresses: [TOKEN_ADDRESS, TOKEN_ADDRESS_IDYP], lp_ids: LP_ID_LIST_ETH_V2})
	the_graph_result_ETH_V2 = result
	return result
}

async function firstRun() {
	/* Get the Graph V1 */
	await refresh_the_graph_result()
	await getCombinedTvlUsd_BSC()
	await getCombinedTvlUsd_AVAX()

	/* Get Price of DYPS */
	await getPriceDYPS()

	/* Get the Graph V2 */
	await refresh_the_graph_result_BSC_V2()
	await refresh_the_graph_result_AVAX_V2()
	await refresh_the_graph_result_ETH_V2()

	/* Get Highest Apy & Total Tvl */
	await GetHighestAPY()
	await getTotalTvl()

	/* Get Total Paid */
	await PaidOutETH()
	await PaidAllInUsd()
}

firstRun()

const app = express()
app.use(cors())
app.get('/api/circulating-supply', async (req, res) => {
	//5 minutes
	if (Date.now() - last_update_time > 300e3) {
		await update_token_balance_sum()
	}
	res.type('text/plain')
	res.send(String(circulating_supply))
})

app.get('/api/circulating-supply-idyp', async (req, res) => {
	//5 minutes
	if (Date.now() - last_update_time_idyp > 300e3) {
		await update_token_balance_sum_bsc()
	}
	res.type('text/plain')
	res.send(String(circulating_supply_idyp))
})

app.get('/api/the_graph_bsc_v2', async (req, res) => {
	//9 minutes
	if (Date.now() - last_update_time_v2 > 1000e3) {
		await refresh_the_graph_result_BSC_V2()
	}
	res.type('application/json')
	res.json({ the_graph_bsc_v2: the_graph_result_BSC_V2 })
})

app.get('/api/the_graph_avax_v2', async (req, res) => {
	//9 minutes
	if (Date.now() - last_update_time_avax_v2 > 1000e3) {
		await refresh_the_graph_result_AVAX_V2()
	}
	res.type('application/json')
	res.json({ the_graph_avax_v2: the_graph_result_AVAX_V2 })
})

app.get('/api/the_graph_eth_v2', async (req, res) => {
	//9 minutes
	if (Date.now() - last_update_time_eth_v2 > 1000e3) {
		await refresh_the_graph_result_ETH_V2()
	}
	res.type('application/json')
	res.json({ the_graph_eth_v2: the_graph_result_ETH_V2 })
})

app.get('/api/the_graph_eth', async (req, res) => {
	//9 minutes
	if (Date.now() - last_update_time3 > 560e3) {
		await refresh_the_graph_result()
	}
	res.type('application/json')
	res.json({ the_graph_eth: the_graph_result })
})

app.get('/api/the_graph_bsc', async (req, res) => {
	//10 minutes
	if (Date.now() - last_update_time2 > 600e3) {
		await getCombinedTvlUsd_BSC()
	}
	res.type('application/json')
	res.json({ the_graph_bsc: the_graph_result_BSC })
})

app.get('/api/the_graph_avax', async (req, res) => {
	//11 minutes
	if (Date.now() - last_update_time2_avax > 660e3) {
		await getCombinedTvlUsd_AVAX()
	}
	res.type('application/json')
	res.json({ the_graph_avax: the_graph_result_AVAX })
})

app.get('/tvl-bsc', async (req, res) => {
	res.type('text/plain')
	res.send(String(COMBINED_TVL_BSC))
})

app.get('/api/highest-apy', async (req, res) => {
	//11 minutes
	if (Date.now() - last_update_time4 > 660e3) {
		await GetHighestAPY()
	}
	// res.type('text/plain')
	// res.send(String(highestAPY))

	res.type('application/json')
	res.json({
		highestAPY: {
			highestAPY_TOTAL: highestAPY,
			highestAPY_ETH: highestAPY_ETH,
			highestAPY_BSC: highestAPY_BSC,
			highestAPY_AVAX: highestAPY_AVAX,
			highestAPY_BSC_V2: highestAPY_BSC_V2,
			highestAPY_AVAX_V2: highestAPY_AVAX_V2,
			highestAPY_ETH_V2: highestAPY_ETH_V2
		}
	})
})

app.get('/api/totaltvl', async (req, res) => {
	//12 minutes
	if (Date.now() - last_update_time5 > 720e3) {
		await getTotalTvl()
	}
	res.type('text/plain')
	res.send(String(tvltotal))
})

app.get('/api/tvlStakingEth', async (req, res) => {

	res.type('application/json')
	res.json({
		ethTotalStaking: {
			tvl30: farmingTvl30,
			tvl60: farmingTvl60,
			tvl90: farmingTvl90,
			tvl120: farmingTvl120
		}
	})
})

app.get('/api/totalpaid', async (req, res) => {
	//60 minutes
	if (Date.now() - last_update_time6 > 3600e3) {
		await PaidOutETH()
		await PaidAllInUsd()
	}
	res.type('application/json')
	res.json({
		ethTotal: {
			wethPaiOutTotals: wethPaiOutTotals,
			paidInUsd: paidInUsd
		},
		bnbTotal: {
			wbnbPaidOutTotals: wbnbPaidOutTotals,
			paidBnbInUsd: paidBnbInUsd
		},
		avaxTotal: {
			avaxPaidOutTotals: avaxPaidOutTotals,
			paidAvaxInUsd: paidAvaxInUsd
		},
		totalPaidInUsd: paidAllInUsd
	})
})

app.get('/api/check-eth', async (req, res) => {
	let results = 0

	results = await CheckEthStaking(req.query.address)

	res.type('application/json')
	res.json({
		result: results
	})
})

app.get('/api/check-bsc', async (req, res) => {
	let results = 0

	results = await CheckBscStaking(req.query.address)

	res.type('application/json')
	res.json({
		result: results
	})
})

app.get('/api/get_farm_info', async (req, res) => {

	getFarmInfo()

	res.type('application/json')
	res.json({ farmInfo: farmInfo })
})

app.get('/api/get_farm_info_avalanche', async (req, res) => {

	await getFarmInfoAvalanche()

	res.type('application/json')
	res.json({ farmInfoAvalanche: farmInfoAvalanche })
})

app.get('/api/get_farm_info_ethereum', async (req, res) => {

	await getFarmInfoEthereum()

	res.type('application/json')
	res.json({ farmInfoEthereum: farmInfoEthereum })
})

app.get('/api/get_farm_info_binance', async (req, res) => {

	await getFarmInfoBinance()

	res.type('application/json')
	res.json({ farmInfoBinance: farmInfoBinance })
})

app.get('/api/getHashMapApy', async (req, res) => {

	getFarmInfo()
	getHashMaps()

	res.type('application/json')
	res.json({
		Ethereum: strMapEth,
		Bsc: strMapBsc,
		AVAX: strMapAvax
	})
})

app.get('/api/bridged_on_avalanche', async (req, res) => {

	if (Date.now() - last_update_time_avalanche > 900e3) {
		await bridgedOnAvalanche()
	}

	res.type('text/plain')
	res.send(String(totalBridgedOnAvalanche))
})

app.get('/api/getHolders', async (req, res) => {

	if (Date.now() - last_update_time_holders > 3600e3) {
		await getHolders()
	}

	res.type('text/plain')
	res.send(String(totalHolders))
})

app.listen(8080, () => console.log("Running on :80"))

