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

const config = {
	bsc_endpoint: 'https://bsc-dataseed.binance.org/',
	// address of eth token on bsc!
	claim_as_eth_address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
	reward_token_address: '0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17',

	cg_ids: {
		'main': 'binancecoin',
		'platform-token': 'defi-yield-protocol',

		// lowercase token address => coingecko id
		'0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17': 'defi-yield-protocol',
	}
}

const bscWeb3 = new Web3(config.bsc_endpoint)

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
    "0x7742565647682abE90A7f7497e05c4403CB50265",
    "0x417538F319AfDDD351f33222592B60f985475A21",
    "0xCfAD7aeb67FC5c19a581496689881AE063541149",
    "0x7Fc2174670d672AD7f666aF0704C2D961EF32c73",
    "0x036e336eA3ac2E255124CF775C4FDab94b2C42e4",
    "0x0A32749D95217b7Ee50127E24711c97849b70C6a",
    "0x82df1450eFD6b504EE069F5e4548F2D5Cb229880",
    "0x000000000000000000000000000000000000dead"
])

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
let last_update_time = 0;
let circulating_supply = 0;
async function update_token_balance_sum() {
    last_update_time = Date.now()
    token_balance_sum = get_token_balances_sum( await get_token_balances({TOKEN_ADDRESS, HOLDERS_LIST}) ).div(1e18).toString(10)
    circulating_supply = new BigNumber(25651531).minus(token_balance_sum).plus(4348469);
    return token_balance_sum
}

let the_graph_result_BSC = {}

// MAKE SURE ALL THESE ADDRESSES ARE LOWERCASE
const TOKENS_DISBURSED_PER_YEAR_BSC = [
	180_000,
	270_000,
	450_000,
	600_000,

	180_000,
	270_000,
	450_000,
	600_000,

	180_000,
	270_000,
	450_000,
	600_000,
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

		let usd_per_eth = await getPrice_BSC(config.cg_ids['main'])
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
	let {token_data, lp_data, usd_per_eth} = usd_values

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
let last_update_time4 = 0

const GetHighestAPY = async () => {
	last_update_time4 = Date.now()
	let highApyArray = []
	let highApyArrayEth = []
	let highApyEth = 0
	let highApy = 0

	if (highestAPY == 0){
		let the_graph_result_BSC = await refresh_the_graph_result_BSC()
		if (!the_graph_result_BSC.lp_data) return 0

		let the_graph_result = await refresh_the_graph_result()
		if (!the_graph_result.lp_data) return 0
	}

	let lp_ids = Object.keys(the_graph_result_BSC.lp_data)
	for (let id of lp_ids) {
		highApy = the_graph_result_BSC.lp_data[id].apy
		highApyArray.push(highApy)
		//console.log('highhh', highApy)
	}

	let lp_ids_eth = Object.keys(the_graph_result.lp_data)
	for (let id of lp_ids_eth) {
		highApyEth = the_graph_result.lp_data[id].apy
		highApyArrayEth.push(highApyEth)
		//console.log('highhh', highApy)
	}

	highApyArrayEth.sort(function(a, b) {
		return a - b
	})

	highApyArray.sort(function(a, b) {
		return a - b
	})
	//console.log('bbbbb', highApyArray)
	highApyEth = highApyArrayEth[highApyArrayEth.length - 1]
	highApy = highApyArray[highApyArray.length - 1]

	highestAPY = highApy > highApyEth ? highApy : highApyEth
	return highApy
}

let last_update_time5 = 0
let tvltotal = 0

async function refreshBalanceFarming() {

	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, {from: undefined})
	//console.log('coinbase' + token_contract)

	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])

	let _tvl30 = await token_contract.methods.balanceOf('0x7fc2174670d672ad7f666af0704c2d961ef32c73').call()
	_tvl30 = _tvl30 / 1e18 * usdPerToken

	let _tvl60 = await token_contract.methods.balanceOf('0x036e336ea3ac2e255124cf775c4fdab94b2c42e4').call()
	_tvl60 = _tvl60 / 1e18 * usdPerToken

	let _tvl90 = await token_contract.methods.balanceOf('0x0a32749d95217b7ee50127e24711c97849b70c6a').call()
	_tvl90 = _tvl90 / 1e18 * usdPerToken

	let _tvl120 = await token_contract.methods.balanceOf('0x82df1450efd6b504ee069f5e4548f2d5cb229880').call()
	_tvl120 = (_tvl120 / 1e18 + 0.1) * usdPerToken

	let valueee = (_tvl30 + _tvl60 + _tvl90 + _tvl120)
	return valueee

}

const getTotalTvl = async () => {
	last_update_time5 = Date.now()
	let tvl = 0
	let farmingTvl = await refreshBalanceFarming()

	let lp_ids = Object.keys(the_graph_result.lp_data)
	for (let id of lp_ids) {
		tvl += the_graph_result.lp_data[id].tvl_usd*1 || 0
	}

	tvltotal = COMBINED_TVL_BSC + tvl + farmingTvl
	return tvltotal
}

// Calculate WETH + USD Paid
const getWethBalance = async (contractAddress) => {
	let contract = new infuraWeb3.eth.Contract(TOKEN_ABI, WETH_ADDRESS, {from: undefined})
	return (await contract.methods.balanceOf(contractAddress).call())
}

const getWethPaidOut = async (contractAddress) => {
	let contract = new infuraWeb3.eth.Contract(STAKING_ABI, contractAddress, {from: undefined})
	let wethPaidOut = await contract.methods.totalClaimedRewardsEth().call()
	let wethBalance = await getWethBalance(contractAddress)
	return new window.BigNumber(wethBalance).plus(wethPaidOut).toString(10)
}

const PaidOutETH = async () => {
	let wethPaiOutTotal = 0
	let lp_ids = LP_ID_LIST
	for (let id of lp_ids) {
		let contractAddress = id.split('-')[1]
		let wethPaidOut = await Promise.all([getWethPaidOut(contractAddress)])
		wethPaiOutTotal += parseInt(wethPaidOut, 10)
	}
	return wethPaiOutTotal / 1e18
}

const PaidEthInUsd = async () => {
	let [usdPerToken] = await Promise.all([getPrice('ethereum')])
	let wethPaidOutTotal = await PaidOutETH()
	return wethPaidOutTotal * usdPerToken
}

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

app.get('/tvl-bsc', async (req, res) => {
	res.type('text/plain')
	res.send(String(COMBINED_TVL_BSC))
})

app.get('/api/highest-apy', async (req, res) => {
	//11 minutes
	if (Date.now() - last_update_time4 > 660e3) {
		await GetHighestAPY()
	}
	res.type('text/plain')
	res.send(String(highestAPY))
})

app.get('/api/totaltvl', async (req, res) => {
	//12 minutes
	if (Date.now() - last_update_time5 > 720e3) {
		await getTotalTvl()
	}
	res.type('text/plain')
	res.send(String(tvltotal))
})

app.listen(8080, () => console.log("Running on :80"))

