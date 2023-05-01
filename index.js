#!/usr/bin/env node

const cors = require('cors')
const express = require('express')
const BigNumber = require('bignumber.js')
const Web3 = require('web3')
const moment = require('moment');
const { JSDOM } = require("jsdom")
const { window } = new JSDOM("")
const $ = require("jquery")(window)

const fetch = require("node-fetch")
const infuraWeb3 = new Web3('https://mainnet.infura.io/v3/94608dc6ddba490697ec4f9b723b586e')

// MAKE SURE THIS ADDRESS IS LOWERCASE
const GOV_ADDRESS_ETH = '0x1766d076ae227443b98aa836bd43895add6b0ab4'
const GOV_ADDRESS_BSC = "0x2cf8b55a6a492c2f8e750ad1fa4e4a858044deea"
const GOV_ADDRESS_AVAX = "0x4d3deb73df067d6466facad196b22411422909ab"
const GOV_ADDRESS_BSC2 = "0x0b49488729bb20423c1eb6559bb0c4d7608152b4"
const GOV_ADDRESS_AVAX2 = "0xc1cb471dbbe2fb3cab80143c00f00cadaf72338c"
const GOV_ADDRESS_ETH2 = "0xdec13a1d8a1eccaa0e8264fb412bd2ec58f207c1"
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

const GOV_ABI_BSC = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "admin",
				"type": "address"
			}
		],
		"name": "EmergencyDeclared",
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
				"internalType": "contract StakingPool",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "PoolCallReverted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "contract StakingPool",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "PoolCallReverted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "contract StakingPool",
				"name": "",
				"type": "address"
			}
		],
		"name": "PoolCallSucceeded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "ADMIN_CAN_CLAIM_AFTER",
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
		"name": "ADMIN_FEATURES_EXPIRE_AFTER",
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
		"name": "EMERGENCY_WAIT_TIME",
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
		"name": "MIN_BALANCE_TO_INIT_PROPOSAL",
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
		"name": "QUORUM",
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
		"name": "RESULT_EXECUTION_ALLOWANCE_PERIOD",
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
		"name": "TRUSTED_TOKEN_ADDRESS",
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
		"name": "VOTE_DURATION",
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
		"name": "actions",
		"outputs": [
			{
				"internalType": "enum Governance.Action",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "enum Governance.Option",
				"name": "option",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "addVotes",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newMinBalanceToInitProposal",
				"type": "uint256"
			}
		],
		"name": "changeMinBalanceToInitProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newQuorum",
				"type": "uint256"
			}
		],
		"name": "changeQuorum",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "trustedFarmContractAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "claimAnyTokenFromContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractStartTime",
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
		"name": "declareEmergency",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "trustedFarmContractAddress",
				"type": "address"
			}
		],
		"name": "declareEmergencyForContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "trustedFarmContractAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "emergencyTransferContractOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "executeProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "getProposal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			},
			{
				"internalType": "enum Governance.Action",
				"name": "_proposalAction",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_optionOneVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_optionTwoVotes",
				"type": "uint256"
			},
			{
				"internalType": "contract StakingPool[]",
				"name": "_stakingPool",
				"type": "address[]"
			},
			{
				"internalType": "address",
				"name": "_newGovernance",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_proposalStartTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_isProposalExecuted",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_newQuorum",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_proposalText",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_newMinBalance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum Governance.PoolGroupName",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "hardcodedStakingPools",
		"outputs": [
			{
				"internalType": "contract StakingPool",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isEmergency",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
		"name": "isProposalExecuted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "isProposalExecutible",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "isProposalOpen",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastIndex",
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
		"name": "lastVotedProposalStartTime",
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
		"name": "newGovernances",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "newMinBalances",
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
		"name": "newQuorums",
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
		"name": "optionOneVotes",
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
		"name": "optionTwoVotes",
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
		"name": "pendingOwner",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposalStartTime",
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
		"name": "proposalTexts",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum Governance.PoolGroupName",
				"name": "poolGroupName",
				"type": "uint8"
			}
		],
		"name": "proposeDisburseOrBurn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newMinBalance",
				"type": "uint256"
			}
		],
		"name": "proposeNewMinBalanceToInitProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newQuorum",
				"type": "uint256"
			}
		],
		"name": "proposeNewQuorum",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "trustedFarmContractAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "newMagicNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newLockupTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newStakingFeeRateX100",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newUnstakingFeeRateX100",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "newRouterAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "newFeeRecipientAddress",
				"type": "address"
			}
		],
		"name": "proposeSetContractVariables",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			}
		],
		"name": "proposeText",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum Governance.PoolGroupName",
				"name": "poolGroupName",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "newGovernance",
				"type": "address"
			}
		],
		"name": "proposeUpgradeGovernance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "removeVotes",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "setContractVariables_farmContractAddress",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "setContractVariables_newFeeRecipientAddress",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "setContractVariables_newLockupTime",
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
		"name": "setContractVariables_newMagicNumber",
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
		"name": "setContractVariables_newRouterAddress",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "setContractVariables_newStakingFeeRateX100",
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
		"name": "setContractVariables_newUnstakingFeeRateX100",
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stakingPools",
		"outputs": [
			{
				"internalType": "contract StakingPool",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "totalDepositedTokens",
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
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
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
				"name": "pool",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferAnyERC20TokenFromPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferAnyLegacyERC20Token",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "pool",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferAnyLegacyERC20TokenFromPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votedForOption",
		"outputs": [
			{
				"internalType": "enum Governance.Option",
				"name": "",
				"type": "uint8"
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votesForProposalByAddress",
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
		"name": "withdrawAllTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const GOV_ABI_ETH2 = [
	{
		"inputs": [],
		"name": "MIN_BALANCE_TO_INIT_PROPOSAL",
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
		"name": "QUORUM",
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
		"name": "RESULT_EXECUTION_ALLOWANCE_PERIOD",
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
		"name": "TRUSTED_TOKEN_ADDRESS",
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
		"name": "VOTE_DURATION",
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
		"name": "actions",
		"outputs": [
			{
				"internalType": "enum Governance.Action",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "enum Governance.Option",
				"name": "option",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "addVotes",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "executeProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "getProposal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			},
			{
				"internalType": "enum Governance.Action",
				"name": "_proposalAction",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_optionOneVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_optionTwoVotes",
				"type": "uint256"
			},
			{
				"internalType": "contract StakingPool",
				"name": "_stakingPool",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_newGovernance",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_proposalStartTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_isProposalExecuted",
				"type": "bool"
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
		"name": "isProposalExecuted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "isProposalExecutible",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "isProposalOpen",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastIndex",
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
		"name": "lastVotedProposalStartTime",
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
		"name": "newGovernances",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "optionOneVotes",
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
		"name": "optionTwoVotes",
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
		"name": "proposalStartTime",
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
				"internalType": "contract StakingPool",
				"name": "pool",
				"type": "address"
			}
		],
		"name": "proposeDisburseOrBurn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract StakingPool",
				"name": "pool",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "newGovernance",
				"type": "address"
			}
		],
		"name": "proposeUpgradeGovernance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "removeVotes",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "stakingPools",
		"outputs": [
			{
				"internalType": "contract StakingPool",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "totalDepositedTokens",
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votedForOption",
		"outputs": [
			{
				"internalType": "enum Governance.Option",
				"name": "",
				"type": "uint8"
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votesForProposalByAddress",
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
		"name": "withdrawAllTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const GOV_ABI_ETH = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
				"internalType": "contract StakingPool",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "PoolCallReverted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "contract StakingPool",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "PoolCallReverted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "contract StakingPool",
				"name": "",
				"type": "address"
			}
		],
		"name": "PoolCallSucceeded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "ADMIN_CAN_CLAIM_AFTER",
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
		"name": "ADMIN_FEATURES_EXPIRE_AFTER",
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
		"name": "MIN_BALANCE_TO_INIT_PROPOSAL",
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
		"name": "QUORUM",
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
		"name": "RESULT_EXECUTION_ALLOWANCE_PERIOD",
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
		"name": "TRUSTED_TOKEN_ADDRESS",
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
		"name": "VOTE_DURATION",
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
		"name": "actions",
		"outputs": [
			{
				"internalType": "enum Governance.Action",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "enum Governance.Option",
				"name": "option",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "addVotes",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newMinBalanceToInitProposal",
				"type": "uint256"
			}
		],
		"name": "changeMinBalanceToInitProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newQuorum",
				"type": "uint256"
			}
		],
		"name": "changeQuorum",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractStartTime",
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
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "executeProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "getProposal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			},
			{
				"internalType": "enum Governance.Action",
				"name": "_proposalAction",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_optionOneVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_optionTwoVotes",
				"type": "uint256"
			},
			{
				"internalType": "contract StakingPool[]",
				"name": "_stakingPool",
				"type": "address[]"
			},
			{
				"internalType": "address",
				"name": "_newGovernance",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_proposalStartTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_isProposalExecuted",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_newQuorum",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_proposalText",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_newMinBalance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum Governance.PoolGroupName",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "hardcodedStakingPools",
		"outputs": [
			{
				"internalType": "contract StakingPool",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
		"name": "isProposalExecuted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "isProposalExecutible",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "isProposalOpen",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastIndex",
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
		"name": "lastVotedProposalStartTime",
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
		"name": "newGovernances",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "newMinBalances",
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
		"name": "newQuorums",
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
		"name": "optionOneVotes",
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
		"name": "optionTwoVotes",
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
		"name": "pendingOwner",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposalStartTime",
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
		"name": "proposalTexts",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum Governance.PoolGroupName",
				"name": "poolGroupName",
				"type": "uint8"
			}
		],
		"name": "proposeDisburseOrBurn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newMinBalance",
				"type": "uint256"
			}
		],
		"name": "proposeNewMinBalanceToInitProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newQuorum",
				"type": "uint256"
			}
		],
		"name": "proposeNewQuorum",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			}
		],
		"name": "proposeText",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum Governance.PoolGroupName",
				"name": "poolGroupName",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "newGovernance",
				"type": "address"
			}
		],
		"name": "proposeUpgradeGovernance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "removeVotes",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stakingPools",
		"outputs": [
			{
				"internalType": "contract StakingPool",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "totalDepositedTokens",
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
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
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
				"name": "pool",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferAnyERC20TokenFromPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferAnyLegacyERC20Token",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "pool",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferAnyLegacyERC20TokenFromPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votedForOption",
		"outputs": [
			{
				"internalType": "enum Governance.Option",
				"name": "",
				"type": "uint8"
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votesForProposalByAddress",
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
		"name": "withdrawAllTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const genesis_nft_contract_abi = [{"inputs":[{"internalType":"address","name":"_stakingDestinationAddress","type":"address"},{"internalType":"address","name":"_WoDcontractaddress","type":"address"},{"internalType":"uint256","name":"_rate","type":"uint256"},{"internalType":"uint256","name":"_expiration","type":"uint256"},{"internalType":"address","name":"_erc20Address","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newExpiration","type":"uint256"}],"name":"ExpirationChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newLockTime","type":"uint256"}],"name":"LockTimeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"RateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"LOCKUP_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WoDcontractaddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"_depositBlocks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"calculateReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"calculateRewards","outputs":[{"internalType":"uint256[]","name":"rewards","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"internalType":"uint256[]","name":"tokenIdsWoD","type":"uint256[]"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"depositsOf","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"depositsOfWoD","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"internalType":"uint256[]","name":"tokenIdsWoD","type":"uint256[]"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"erc20Address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"expiration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_expiration","type":"uint256"}],"name":"setExpiration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lockTime","type":"uint256"}],"name":"setLockTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rate","type":"uint256"}],"name":"setRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakingDestinationAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakingTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"internalType":"uint256[]","name":"tokenIdsWoD","type":"uint256[]"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const caws_nft_contract_abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "maxNftSupply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "saleStart",
				"type": "uint256"
			}
		],
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
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
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
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
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
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "CAWS_PROVENANCE",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_CAWS",
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
		"name": "REVEAL_TIMESTAMP",
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
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
		"name": "baseURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "cawsPrice",
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
		"name": "emergencySetStartingIndexBlock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "flipSaleState",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
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
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxCawsPurchase",
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
				"name": "numberOfTokens",
				"type": "uint256"
			}
		],
		"name": "mintCaws",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextOwnerToExplicitlySet",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
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
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reserveCaws",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "saleIsActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tokenURI",
				"type": "string"
			}
		],
		"name": "setBaseURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "provenanceHash",
				"type": "string"
			}
		],
		"name": "setProvenanceHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "revealTimeStamp",
				"type": "uint256"
			}
		],
		"name": "setRevealTimestamp",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "setStartingIndex",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "startingIndex",
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
		"name": "startingIndexBlock",
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
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
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
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
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
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
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
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]


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

const TOKEN_ABI_AVAX = [{ "type": "constructor", "stateMutability": "nonpayable", "inputs": [] }, { "type": "event", "name": "AddSupportedChainId", "inputs": [{ "type": "uint256", "name": "chainId", "internalType": "uint256", "indexed": false }], "anonymous": false }, { "type": "event", "name": "AddSwapToken", "inputs": [{ "type": "address", "name": "contractAddress", "internalType": "address", "indexed": false }, { "type": "uint256", "name": "supplyIncrement", "internalType": "uint256", "indexed": false }], "anonymous": false }, { "type": "event", "name": "Approval", "inputs": [{ "type": "address", "name": "owner", "internalType": "address", "indexed": true }, { "type": "address", "name": "spender", "internalType": "address", "indexed": true }, { "type": "uint256", "name": "value", "internalType": "uint256", "indexed": false }], "anonymous": false }, { "type": "event", "name": "MigrateBridgeRole", "inputs": [{ "type": "address", "name": "newBridgeRoleAddress", "internalType": "address", "indexed": false }], "anonymous": false }, { "type": "event", "name": "Mint", "inputs": [{ "type": "address", "name": "to", "internalType": "address", "indexed": false }, { "type": "uint256", "name": "amount", "internalType": "uint256", "indexed": false }, { "type": "address", "name": "feeAddress", "internalType": "address", "indexed": false }, { "type": "uint256", "name": "feeAmount", "internalType": "uint256", "indexed": false }, { "type": "bytes32", "name": "originTxId", "internalType": "bytes32", "indexed": false }], "anonymous": false }, { "type": "event", "name": "RemoveSwapToken", "inputs": [{ "type": "address", "name": "contractAddress", "internalType": "address", "indexed": false }, { "type": "uint256", "name": "supplyDecrement", "internalType": "uint256", "indexed": false }], "anonymous": false }, { "type": "event", "name": "Swap", "inputs": [{ "type": "address", "name": "token", "internalType": "address", "indexed": false }, { "type": "uint256", "name": "amount", "internalType": "uint256", "indexed": false }], "anonymous": false }, { "type": "event", "name": "Transfer", "inputs": [{ "type": "address", "name": "from", "internalType": "address", "indexed": true }, { "type": "address", "name": "to", "internalType": "address", "indexed": true }, { "type": "uint256", "name": "value", "internalType": "uint256", "indexed": false }], "anonymous": false }, { "type": "event", "name": "Unwrap", "inputs": [{ "type": "uint256", "name": "amount", "internalType": "uint256", "indexed": false }, { "type": "uint256", "name": "chainId", "internalType": "uint256", "indexed": false }], "anonymous": false }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "addSupportedChainId", "inputs": [{ "type": "uint256", "name": "chainId", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "addSwapToken", "inputs": [{ "type": "address", "name": "contractAddress", "internalType": "address" }, { "type": "uint256", "name": "supplyIncrement", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "allowance", "inputs": [{ "type": "address", "name": "owner", "internalType": "address" }, { "type": "address", "name": "spender", "internalType": "address" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }], "name": "approve", "inputs": [{ "type": "address", "name": "spender", "internalType": "address" }, { "type": "uint256", "name": "amount", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "balanceOf", "inputs": [{ "type": "address", "name": "account", "internalType": "address" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "burn", "inputs": [{ "type": "uint256", "name": "amount", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "burnFrom", "inputs": [{ "type": "address", "name": "account", "internalType": "address" }, { "type": "uint256", "name": "amount", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }], "name": "chainIds", "inputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint8", "name": "", "internalType": "uint8" }], "name": "decimals", "inputs": [] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }], "name": "decreaseAllowance", "inputs": [{ "type": "address", "name": "spender", "internalType": "address" }, { "type": "uint256", "name": "subtractedValue", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }], "name": "increaseAllowance", "inputs": [{ "type": "address", "name": "spender", "internalType": "address" }, { "type": "uint256", "name": "addedValue", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "migrateBridgeRole", "inputs": [{ "type": "address", "name": "newBridgeRoleAddress", "internalType": "address" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "mint", "inputs": [{ "type": "address", "name": "to", "internalType": "address" }, { "type": "uint256", "name": "amount", "internalType": "uint256" }, { "type": "address", "name": "feeAddress", "internalType": "address" }, { "type": "uint256", "name": "feeAmount", "internalType": "uint256" }, { "type": "bytes32", "name": "originTxId", "internalType": "bytes32" }] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "string", "name": "", "internalType": "string" }], "name": "name", "inputs": [] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "removeSwapToken", "inputs": [{ "type": "address", "name": "contractAddress", "internalType": "address" }, { "type": "uint256", "name": "supplyDecrement", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "swap", "inputs": [{ "type": "address", "name": "token", "internalType": "address" }, { "type": "uint256", "name": "amount", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "swapSupply", "inputs": [{ "type": "address", "name": "token", "internalType": "address" }] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "string", "name": "", "internalType": "string" }], "name": "symbol", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "totalSupply", "inputs": [] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }], "name": "transfer", "inputs": [{ "type": "address", "name": "recipient", "internalType": "address" }, { "type": "uint256", "name": "amount", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }], "name": "transferFrom", "inputs": [{ "type": "address", "name": "sender", "internalType": "address" }, { "type": "address", "name": "recipient", "internalType": "address" }, { "type": "uint256", "name": "amount", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "unwrap", "inputs": [{ "type": "uint256", "name": "amount", "internalType": "uint256" }, { "type": "uint256", "name": "chainId", "internalType": "uint256" }] }]

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
	"0xb4657bd14ffc573528feb29d357a750d7543dd22",
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
	"0xc4986e4473893c67d5b6326c1699b3749d6cef1c",
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
	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })

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
	token_balance_sum = get_token_balances_sum(await get_token_balances({ TOKEN_ADDRESS, HOLDERS_LIST })).div(1e18).toString(10)
	token_balance_sum_bsc = get_token_balances_sum(await get_token_balances_BSC({ TOKEN_ADDRESS, HOLDERS_LIST: HOLDERS_LIST_BSC })).div(1e18).toString(10)
	token_balance_sum_avax = get_token_balances_sum(await get_token_balances_AVAX({ TOKEN_ADDRESS, HOLDERS_LIST: HOLDERS_LIST_AVAX })).div(1e18).toString(10)
	// let circulating_supply_bsc = new BigNumber(24963431).minus(token_balance_sum_bsc)
	// let circulating_supply_avax = new BigNumber(24963431).minus(token_balance_sum_avax)
	// circulating_supply = new BigNumber(30000000).minus(token_balance_sum).plus(circulating_supply_bsc).plus(circulating_supply_avax)
	circulating_supply = new BigNumber(30000000).minus(token_balance_sum);
	return token_balance_sum
}

//Token Lock/Unlock AVAX + BSC

const HOLDERS_AVAX_CONTRACTS = [
	//Reserves
	"0x5200718cba9376afa068e1180eabb506e6d13802",
	"0x910090ea889b64b4e722ea4b8ff6d5e734dfb38f",
	"0xc4986e4473893c67d5b6326c1699b3749d6cef1c",
	//Vesting
	"0xc4986E4473893c67D5B6326C1699B3749D6CeF1C",
	//Bridge
	"0x4D960CDC46E8728eEb26af8105c277Ee5c3CC252",
	//Staking
	"0xf035ec2562fbc4963e8c1c63f5c473d9696c59e3",
	"0x9ff3dc1f7042baf46651029c7284fc3b93e21a4d",
	"0x6a258bd17456e057a7c6102177ec2f9d64d5f9e4",
	"0xc2ba0abfc89a5a258e6440d82bb95a5e2b541581",
	"0x4c16093da4ba7a604a1fe8cd5d387cc904b3d407",
	"0x1ca9fc98f3b997e08bc04691414e33b1835aa7e5",
	"0x5566b51a1b7d5e6cac57a68182c63cb615caf3f9",
	"0x1a4fd0e9046aed92b6344f17b0a53969f4d5309b",
	"0xb1875eebbcf4456188968f439896053809698a8b",
	"0x16429e51a64b7f88d4c018fbf66266a693df64b3",
	"0x6eb643813f0b4351b993f98bdeaef6e0f79573e9",
	//Kyber
	"0xf530a090ef6481cfb33f98c63532e7745abab58a",
	//Avax
	"0x7261cf908be7bfad871c75040ef0264c014412e5",
	"0x083d808F4272C52c9D3a7c58939610C8dDF952C0",
	//dEaD
	"0x000000000000000000000000000000000000dead"
]

const HOLDERS_BSC_CONTRACTS = [
	//Reserves
	"0xc44c1c7f68cdd84fc77cc9618f8f0b7e03345b20",
	"0x910090ea889b64b4e722ea4b8ff6d5e734dfb38f",
	"0xb4657bd14ffc573528feb29d357a750d7543dd22",
	//Vesting
	"0x291b6d632f9a67017e6dc4942bb6d658a8a6cba4",
	"0xb4657bD14ffC573528fEb29D357A750d7543Dd22",
	//Bridges
	"0xF237EA816b52572c4118c9D275b5807369E38d9F",
	//Staking
	"0xaf411bf994da1435a3150b874395b86376c5f2d5",
	"0xa9efab22ccbfeabb6dc4583d81421e76342faf8b",
	"0xfc4493e85fd5424456f22135db6864dd4e4ed662",
	"0xbd574278febad04b7a0694c37def4f2ecfa9354a",
	"0x23609B1f5274160564e4afC5eB9329A8Bf81c744",
	"0x9df0a645beb6f7adfadc56f3689e79405337efe2",
	"0xf13adbeb27ea9d9469d95e925e56a1cf79c06e90",
	"0xc794cdb8d6ac5eb42d5aba9c1e641ae17c239c8c",
	"0x264922696b9972687522b6e98bf78a0430e2163c",
	"0xef9e50a19358ccc8816d9bc2c2355aea596efd06",
	"0x7c82513b69c1b42c23760cfc34234558119a3399",
	//Bsc
	"0x083d808F4272C52c9D3a7c58939610C8dDF952C0",
	//dEaD
	"0x000000000000000000000000000000000000dead"
]

let lockedBsc = 0;
let unlockedBsc = 0;
let lockedAvax = 0
let unlockedAvax = 0;
let last_update_time_tokenomics = 0;
async function update_tokenomics() {
	last_update_time_tokenomics = Date.now()
	let token_balance_sum_bsc_2 = get_token_balances_sum(await get_token_balances_BSC({ TOKEN_ADDRESS, HOLDERS_LIST: HOLDERS_BSC_CONTRACTS })).div(1e18).toString(10)
	let token_balance_sum_avax_2 = get_token_balances_sum(await get_token_balances_AVAX({ TOKEN_ADDRESS, HOLDERS_LIST: HOLDERS_AVAX_CONTRACTS })).div(1e18).toString(10)
	// let circulating_supply_bsc = new BigNumber(24963431).minus(token_balance_sum_bsc)
	// let circulating_supply_avax = new BigNumber(24963431).minus(token_balance_sum_avax)
	// circulating_supply = new BigNumber(30000000).minus(token_balance_sum).plus(circulating_supply_bsc).plus(circulating_supply_avax)
	lockedBsc = token_balance_sum_bsc_2
	lockedAvax = token_balance_sum_avax_2
	unlockedBsc = new BigNumber(24963431).minus(token_balance_sum_bsc_2);
	unlockedAvax = new BigNumber(24963431).minus(token_balance_sum_avax_2);
	return { lockedBsc, lockedAvax, unlockedAvax, unlockedBsc }
}

let bscProposals = 0;
let ethProposals = 0;
let avaxProposals = 0;
let bscProposals2 = 0;
let ethProposals2 = 0;
let avaxProposals2 = 0;
let bscVotes = 0;
let ethVotes = 0;
let avaxVotes = 0;
let bscVotes2 = 0;
let ethVotes2 = 0;
let avaxVotes2 = 0;
let totalVotes = 0;
let last_update_time_gov = 0;

async function update_proposals() {
	last_update_time_gov = Date.now()

	bscProposals = 0;
	ethProposals = 0;
	avaxProposals = 0;
	bscProposals2 = 0;
	ethProposals2 = 0;
	avaxProposals2 = 0;
	bscVotes = 0;
	ethVotes = 0;
	avaxVotes = 0;
	bscVotes2 = 0;
	ethVotes2 = 0;
	avaxVotes2 = 0;
	totalVotes = 0;

	let gov_contract_bsc = new bscWeb3.eth.Contract(GOV_ABI_BSC, GOV_ADDRESS_BSC, { from: undefined })
	let gov_contract_eth = new infuraWeb3.eth.Contract(GOV_ABI_ETH, GOV_ADDRESS_ETH, { from: undefined })
	let gov_contract_avax = new avaxWeb3.eth.Contract(GOV_ABI_BSC, GOV_ADDRESS_AVAX, { from: undefined })
	let gov_contract_bsc2 = new bscWeb3.eth.Contract(GOV_ABI_BSC, GOV_ADDRESS_BSC2, { from: undefined })
	let gov_contract_eth2 = new infuraWeb3.eth.Contract(GOV_ABI_ETH2, GOV_ADDRESS_ETH2, { from: undefined })
	let gov_contract_avax2 = new avaxWeb3.eth.Contract(GOV_ABI_BSC, GOV_ADDRESS_AVAX2, { from: undefined })
	bscProposals = await gov_contract_bsc.methods.lastIndex().call()
	ethProposals = await gov_contract_eth.methods.lastIndex().call()
	avaxProposals = await gov_contract_avax.methods.lastIndex().call()
	bscProposals2 = await gov_contract_bsc2.methods.lastIndex().call()
	ethProposals2 = await gov_contract_eth2.methods.lastIndex().call()
	avaxProposals2 = await gov_contract_avax2.methods.lastIndex().call()

	bscProposals = parseInt(bscProposals) + parseInt(bscProposals2)
	ethProposals = parseInt(ethProposals) + parseInt(ethProposals2)
	avaxProposals = parseInt(avaxProposals) + parseInt(avaxProposals2)

	//make for loops to get all votes from bsc proposals (new contracts)
	for (let i = 1; i <= bscProposals; i++) {
		let vote = await gov_contract_eth.methods.getProposal(i).call()
		bscVotes = bscVotes + ((vote._optionOneVotes) / 1e18) + ((vote._optionTwoVotes) / 1e18)
	}

	for (let i = 1; i <= ethProposals; i++) {
		let vote = await gov_contract_eth.methods.getProposal(i).call()
		ethVotes = ethVotes + ((vote._optionOneVotes) / 1e18) + ((vote._optionTwoVotes) / 1e18)
	}

	for (let i = 1; i <= avaxProposals; i++) {
		let vote = await gov_contract_avax.methods.getProposal(i).call()
		avaxVotes = avaxVotes + ((vote._optionOneVotes) / 1e18) + ((vote._optionTwoVotes) / 1e18)
	}
	// make for loops to get all votes from bsc proposals (old contracts)
	for (let i = 1; i <= bscProposals2; i++) {
		let vote = await gov_contract_bsc2.methods.getProposal(i).call()
		bscVotes2 = bscVotes2 + ((vote._optionOneVotes) / 1e18) + ((vote._optionTwoVotes) / 1e18)
	}

	for (let i = 1; i <= ethProposals2; i++) {
		let vote = await gov_contract_eth2.methods.getProposal(i).call()
		ethVotes2 = ethVotes2 + (((vote._optionOneVotes) / 1e18)) + (((vote._optionTwoVotes) / 1e18))
	}


	for (let i = 1; i <= avaxProposals2; i++) {
		let vote = await gov_contract_avax2.methods.getProposal(i).call()
		avaxVotes2 = avaxVotes2 + ((vote._optionOneVotes) / 1e18) + ((vote._optionTwoVotes) / 1e18)
	}

	bscVotes = Math.trunc(bscVotes) + Math.trunc(bscVotes2)
	ethVotes = Math.trunc(ethVotes) + Math.trunc(ethVotes2)
	avaxVotes = Math.trunc(avaxVotes) + Math.trunc(avaxVotes2)

	totalVotes = bscVotes + ethVotes + avaxVotes;

	return ethProposals, bscProposals, avaxProposals, bscVotes, ethVotes, avaxVotes, totalVotes
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
		$.get(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${coingecko_id}&vs_currencies=${vs_currency}&x_cg_pro_api_key=CG-4cvtCNDCA4oLfmxagFJ84qev`)
		// https://api.coingecko.com/api/v3/simple/price?ids=${coingecko_id}&vs_currencies=${vs_currency}`)
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
		$.get(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${coingecko_id}&vs_currencies=${vs_currency}&x_cg_pro_api_key=CG-4cvtCNDCA4oLfmxagFJ84qev`)
		// $.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingecko_id}&vs_currencies=${vs_currency}`)
			.then((result) => {
				resolve(result[coingecko_id][vs_currency])
			})
			.catch((error) => {
				reject(error)
			})
	})
}

async function fetchAsync(url) {
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

		let token_contract = new infuraWeb3.eth.Contract(PRICE_ABI, PRICE_ADDRESS, { from: undefined })
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
				tokens.push({ id, token_price_usd })
			}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				let platformTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, { from: undefined })
				let pairTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, pairAddress, { from: undefined })

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2 / (lpTotalSupply / 1e18)
				let usd_value_of_lp_staked = stakingLpBalance / 1e18 * usd_per_lp
				let lp_staked = stakingLpBalance / 1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {
				data: {
					tokens, liquidityPositions
				}
			}
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
				resolve({ token_data, lp_data, usd_per_eth })
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
		let contract = new bscWeb3.eth.Contract(STAKING_ABI, contract_address, { from: undefined })
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_BSC({
	TOKEN_ADDRESS,
	HOLDERS_LIST
}) {

	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })

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
	let { token_data, lp_data, usd_per_eth } = usd_values

	let token_price_usd = token_data[TOKEN_ADDRESS].token_price_usd * 1
	let balances_by_address = {}, number_of_holders_by_address = {}
	let lp_ids = Object.keys(lp_data)
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_BSC({ TOKEN_ADDRESS, HOLDERS_LIST: addrs })
	addrs.forEach((addr, i) => balances_by_address[addr] = token_balances[i])

	await wait_BSC(3000)

	let number_of_holders = await get_number_of_stakers_BSC(addrs)
	addrs.forEach((addr, i) => number_of_holders_by_address[addr] = number_of_holders[i])

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2) * 1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked * 1

		apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2) * 1

		lp_data[lp_id].apy = apy
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
		lp_data[lp_id].expired = "Yes"
	})

	return { token_data, lp_data, usd_per_eth, token_price_usd }
}

async function get_usd_values_with_apy_and_tvl_BSC(...arguments) {
	return (await get_apy_and_tvl_BSC(await get_usd_values_BSC(...arguments)))
}


async function refresh_the_graph_result_BSC() {
	let result = await get_usd_values_with_apy_and_tvl_BSC({ token_contract_addresses: [TOKEN_ADDRESS], lp_ids: LP_ID_LIST_BSC })
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
				tokens.push({ id, token_price_usd })
			}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				let platformTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, { from: undefined })
				let pairTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, pairAddress, { from: undefined })

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2 / (lpTotalSupply / 1e18)
				let usd_value_of_lp_staked = stakingLpBalance / 1e18 * usd_per_lp
				let lp_staked = stakingLpBalance / 1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {
				data: {
					tokens, liquidityPositions
				}
			}
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
				resolve({ token_data, lp_data, usd_per_eth })
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
		let contract = new avaxWeb3.eth.Contract(STAKING_ABI, contract_address, { from: undefined })
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_AVAX({
	TOKEN_ADDRESS,
	HOLDERS_LIST
}) {

	let token_contract = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })

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

let totaltvlfarmingavax = 0;
async function get_apy_and_tvl_AVAX(usd_values) {
	totaltvlfarmingavax = 0;
	let { token_data, lp_data, usd_per_eth } = usd_values

	let token_price_usd = token_data[TOKEN_ADDRESS].token_price_usd * 1
	let balances_by_address = {}, number_of_holders_by_address = {}
	let lp_ids = Object.keys(lp_data)
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_AVAX({ TOKEN_ADDRESS, HOLDERS_LIST: addrs })
	addrs.forEach((addr, i) => balances_by_address[addr] = token_balances[i])

	await wait_AVAX(3500)

	let number_of_holders = await get_number_of_stakers_AVAX(addrs)
	addrs.forEach((addr, i) => number_of_holders_by_address[addr] = number_of_holders[i])

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2) * 1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked * 1
		totaltvlfarmingavax = totaltvlfarmingavax + tvl_usd;

		apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2) * 1

		lp_data[lp_id].apy = apy
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
		lp_data[lp_id].expired = "Yes"
	})
	return { token_data, lp_data, usd_per_eth, token_price_usd }
}

async function get_usd_values_with_apy_and_tvl_AVAX(...arguments) {
	return (await get_apy_and_tvl_AVAX(await get_usd_values_AVAX(...arguments)))
}


async function refresh_the_graph_result_AVAX() {
	let result = await get_usd_values_with_apy_and_tvl_AVAX({ token_contract_addresses: [TOKEN_ADDRESS], lp_ids: LP_ID_LIST_AVAX })
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
		tvl += the_graph_result_avax.lp_data[id].tvl_usd * 1 || 0
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
		tvl += the_graph_result_bsc.lp_data[id].tvl_usd * 1 || 0
	}

	COMBINED_TVL_BSC = tvl
	return tvl
}

//ETH the_graph
let the_graph_result = {}

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
			body: JSON.stringify({
				query: `{
  
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
  `, variables: null
			}),
		})
			.then(res => res.json())
			.then(res => handleTheGraphData(res))
			.catch(reject)


		function handleTheGraphData(response) {
			try {
				let data = response.data
				if (!data) return reject(response);

				//console.log(data)

				let usd_per_eth = new BigNumber(data.bundle.ethPrice).toFixed(2) * 1

				let token_data = {}, lp_data = {}

				data.tokens.forEach(t => {
					token_data[t.id] = {
						token_volume_usd_all_time: new BigNumber(t.untrackedVolumeUSD).toFixed(2) * 1,
						token_price_usd: new BigNumber(t.derivedETH).times(usd_per_eth).toFixed(2) * 1
					}
				})

				data.liquidityPositions.forEach(lp => {
					let usd_per_lp = new BigNumber(lp.pair.reserveUSD).div(lp.pair.totalSupply).toFixed(2) * 1
					let lp_staked = lp.liquidityTokenBalance
					let usd_value_of_lp_staked = new BigNumber(lp_staked).times(usd_per_lp).toFixed(2) * 1
					lp_data[lp.id] = {
						lp_staked,
						usd_per_lp,
						usd_value_of_lp_staked,
					}
				})
				resolve({ token_data, lp_data, usd_per_eth })
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
		let contract = new infuraWeb3.eth.Contract(STAKING_ABI, contract_address, { from: undefined })
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances({
	TOKEN_ADDRESS,
	HOLDERS_LIST
}) {
	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })

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
	let { token_data, lp_data, usd_per_eth_uniswap } = usd_values

	let token_contract = new infuraWeb3.eth.Contract(PRICE_ABI, PRICE_ADDRESS, { from: undefined })
	let usd_per_eth = await token_contract.methods.getThePriceEth().call()
	usd_per_eth = (usd_per_eth / 1e8).toFixed(2)

	let token_price_usd = token_data[TOKEN_ADDRESS].token_price_usd * 1
	let balances_by_address = {}, number_of_holders_by_address = {}
	let lp_ids = Object.keys(lp_data)
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances({ TOKEN_ADDRESS, HOLDERS_LIST: addrs })
	addrs.forEach((addr, i) => balances_by_address[addr] = token_balances[i])

	await wait(2000)

	let number_of_holders = await get_number_of_stakers(addrs)
	addrs.forEach((addr, i) => number_of_holders_by_address[addr] = number_of_holders[i])

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2) * 1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked * 1

		apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2) * 1

		lp_data[lp_id].apy = apy
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
		lp_data[lp_id].expired = "Yes"
	})

	return { token_data, lp_data, usd_per_eth, token_price_usd }
}

async function get_usd_values_with_apy_and_tvl(...arguments) {
	return (await get_apy_and_tvl(await get_usd_values(...arguments)))
}

let last_update_time3 = 0

async function refresh_the_graph_result() {
	last_update_time3 = Date.now()
	let result = await get_usd_values_with_apy_and_tvl({ token_contract_addresses: [TOKEN_ADDRESS], lp_ids: LP_ID_LIST })
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

	highApyArrayEth.sort(function (a, b) {
		return a - b
	})

	highApyArray.sort(function (a, b) {
		return a - b
	})

	highApyArrayAvax.sort(function (a, b) {
		return a - b
	})

	highApyArrayBscV2.sort(function (a, b) {
		return a - b
	})

	highApyArrayAvaxV2.sort(function (a, b) {
		return a - b
	})

	highApyArrayEthV2.sort(function (a, b) {
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

	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })
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
		let tokenContract = new infuraWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, { from: undefined })
		return await tokenContract.methods.balanceOf(holder).call()
	}
	if (network == 2) {
		let tokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, { from: undefined })
		return await tokenContract.methods.balanceOf(holder).call()
	}
	if (network == 3) {
		let tokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, { from: undefined })
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

async function getPriceDYPS() {

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

async function totalTvlDYPS() {
	let tvlDYPS = 0

	if (price_DYPS == 0)
		await getPriceDYPS()

	let token_balances_eth = await get_token_balances({ TOKEN_ADDRESS: TOKEN_ADDRESS_DYPS_ETH, HOLDERS_LIST: allContracts })

	// await wait(2000)

	let token_balances_bsc = await get_token_balances_BSC({ TOKEN_ADDRESS: TOKEN_ADDRESS_DYPS_BSC, HOLDERS_LIST: allContracts })

	// await wait(2000)

	let token_balances_avax = await get_token_balances_AVAX({ TOKEN_ADDRESS: TOKEN_ADDRESS_DYPS_AVAX, HOLDERS_LIST: allContracts })

	// await wait(2000)

	for (let id of token_balances_eth) {
		tvlDYPS = new BigNumber(tvlDYPS).plus(id)
	}

	for (let id of token_balances_bsc) {
		tvlDYPS = new BigNumber(tvlDYPS).plus(id)
	}

	for (let id of token_balances_avax) {
		tvlDYPS = new BigNumber(tvlDYPS).plus(id)
	}

	tvlDYPS = new BigNumber(tvlDYPS).div(1e18).times(price_DYPS).toFixed(0)

	tvlDYPS = parseInt(tvlDYPS)
	// console.log(tvlDYPS)
	// console.log(price_DYPS)

	return tvlDYPS
}

//TVL Vaults

const VAULT_ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "CompoundRewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EtherRewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EtherRewardDisbursed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "PlatformTokenAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "PlatformTokenRewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokenRewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokenRewardDisbursed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdraw", "type": "event" }, { "inputs": [], "name": "ADMIN_CAN_CLAIM_AFTER", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "BURN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "FEE_PERCENT_TO_BUYBACK_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "FEE_PERCENT_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "LOCKUP_DURATION", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MIN_ETH_FEE_IN_WEI", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ONE_HUNDRED_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "POINT_MULTIPLIER", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_INTERVAL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_RETURN_PERCENT_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_CTOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_DEPOSIT_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_PLATFORM_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "addPlatformTokenBalance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "cTokenBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin_platformTokens", "type": "uint256" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "claimAnyToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimCompoundDivs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimEthDivs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "claimExtraTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin_platformTokens", "type": "uint256" }], "name": "claimPlatformTokenDivs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimTokenDivs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contractStartTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_ethFeeBuyBack", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositTokenBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "emergencyWithdraw", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "ethDivsBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "ethDivsOwing", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_cTokenBalance", "type": "uint256" }], "name": "getConvertedBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "endIndex", "type": "uint256" }], "name": "getDepositorsList", "outputs": [{ "internalType": "address[]", "name": "stakers", "type": "address[]" }, { "internalType": "uint256[]", "name": "stakingTimestamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "lastClaimedTimeStamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "stakedTokens", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getEstimatedCompoundDivsOwing", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getExchangeRateCurrent", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getExchangeRateStored", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNumberOfHolders", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastClaimedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastEthDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastTokenDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "platformTokenDivsBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "platformTokenDivsOwing", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "tokenBalances", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "tokenDivsBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "tokenDivsOwing", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalCTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalDepositedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedCompoundDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedEthDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedPlatformTokenDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedTokenDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalEthDisbursed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalEthDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalTokenDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalTokensDepositedByUser", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalTokensDisbursed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalTokensWithdrawnByUser", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "uniswapRouterV2", "outputs": [{ "internalType": "contract IUniswapV2Router", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_ethFeeBuyBack", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_tokenFeeBuyBack", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "payable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]

const totalDepositedTokens = async (contractAddress) => {
	let contract = new infuraWeb3.eth.Contract(VAULT_ABI, contractAddress, { from: undefined })
	let totalDepositedTokens = await contract.methods.totalDepositedTokens().call()

	let contractiDYP = new infuraWeb3.eth.Contract(TOKEN_ABI, '0xBD100d061E120b2c67A24453CF6368E63f1Be056', { from: undefined })
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

	ethBuybackTvl = (ethBuybackTvl / 1e18) * usdPerToken
	bscBuybackTvl = (bscBuybackTvl / 1e18) * usdPerToken
	avaxBuybackTvl = (avaxBuybackTvl / 1e18) * usdPerToken

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
	let contract = new infuraWeb3.eth.Contract(TOKEN_ABI, WETH_ADDRESS, { from: undefined })
	return (await contract.methods.balanceOf(contractAddress).call())
}

const getWethPaidOut = async (contractAddress) => {
	let contract = new infuraWeb3.eth.Contract(STAKING_ABI, contractAddress, { from: undefined })
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
	let contract = new bscWeb3.eth.Contract(TOKEN_ABI, WBNB_ADDRESS, { from: undefined })
	return (await contract.methods.balanceOf(contractAddress).call())
}

const getWbnbPaidOut = async (contractAddress) => {
	let contract = new bscWeb3.eth.Contract(STAKING_ABI, contractAddress, { from: undefined })
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
	let contract = new avaxWeb3.eth.Contract(TOKEN_ABI, AVAX_ADDRESS, { from: undefined })
	return (await contract.methods.balanceOf(contractAddress).call())
}

const getAvaxPaidOut = async (contractAddress) => {
	let contract = new avaxWeb3.eth.Contract(STAKING_ABI, contractAddress, { from: undefined })
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
	let token_contract = new infuraWeb3.eth.Contract(PRICE_ABI, PRICE_ADDRESS, { from: undefined })

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
		let contract = new infuraWeb3.eth.Contract(STAKING_ABI, pool_address, { from: undefined })
		amountStaked = await contract.methods.depositedTokens(addressToCheck).call()
		result = parseInt(amountStaked) > 0 ? true : false

		if (parseInt(amountStaked) > 0) break
	}

	return result
}

const CheckBscStaking = async (addressToCheck) => {
	let amountStaked = 0
	let result = 0
	let lp_ids = LP_ID_LIST_BSC

	for (let lp_id of lp_ids) {
		let pool_address = lp_id.split('-')[1]
		let contract = new bscWeb3.eth.Contract(STAKING_ABI, pool_address, { from: undefined })
		amountStaked = await contract.methods.depositedTokens(addressToCheck).call()
		result = parseInt(amountStaked) > 0 ? true : false

		if (parseInt(amountStaked) > 0) break
	}

	return result
}
let floorprice = 0;
let owners = 0;
let totalsales = 0;
let totalsupply = 0;
let thirthydaysales = 0;
let totalvolume = 0;
function fecthNftFloorPrice() {

	fetch('https://api.opensea.io/api/v1/collection/catsandwatchessocietycaws/stats?format=json')
		.then(response => {
			if (!response.ok) {
				throw Error('X');
			}
			return response.json();
		})
		.then(data => {
			floorprice = data.stats.floor_price
			owners = data.stats.num_owners
			totalsales = data.stats.total_sales
			totalsupply = data.stats.total_supply
			thirthydaysales = data.stats.thirty_day_sales
			totalvolume = data.stats.total_volume
		});
}


let floorpriceland = 0;
let ownersland = 0;
let totalsalesland = 0;
let totalsupplyland = 0;
let thirthydaysalesland = 0;
let totalvolumeland = 0;
function fecthLandFloorPrice() {

	fetch('https://api.opensea.io/api/v1/collection/worldofdypians/stats?format=json')
		.then(response => {
			if (!response.ok) {
				throw Error('X');
			}
			return response.json();
		})
		.then(data => {
			floorpriceland = data.stats.floor_price
			ownersland = data.stats.num_owners
			totalsalesland = data.stats.total_sales
			totalsupplyland = data.stats.total_supply
			thirthydaysalesland = data.stats.thirty_day_sales
			totalvolumeland = data.stats.total_volume
		});
}

let id = 0;
// function RandomNFT () {

// 	fetch ("https://api.opensea.io/api/v1/asset/0xd06cF9e1189FEAb09c844C597abc3767BC12608c/1/?format=json")
// 	.then(response => {
// 		if (!response.ok) {
// 			throw Error('X');
// 		}
// 		return response.json();
// 	})
// 	.then(data => {
// 		id = data.image_url
// 	});
// 	}

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
	},
	"0x82df1450efd6b504ee069f5e4548f2d5cb229880":
	{
		pool_name: "DYP Constant Staking",
		pair_name: "DYP",
		link_pair: "https://app.dyp.finance/constant-staking-120",
		return_types: "DYP",
		apy: 35
	},

}

const IDs_constant_staking_idyp_eth = {
	"0x50014432772b4123D04181727C6EdEAB34F5F988":
	{
		pool_name: "iDYP Constant Staking ETH",
		pair_name: "iDYP",
		link_pair: "https://app.dyp.finance/staking-idyp-3",
		return_types: "iDYP",
		lock_time: "No lock",
		expired: "No",
		new_pool: "No",
		apy: 15,
		apy_performancefee: 14,
		performancefee: 1
	},
	"0x9eA966B4023049BFF858BB5E698ECfF24EA54c4A":
	{
		pool_name: "iDYP Constant Staking ETH",
		pair_name: "iDYP",
		link_pair: "https://app.dyp.finance/staking-idyp-1",
		return_types: "iDYP",
		lock_time: "No lock",
		expired: "Yes",
		new_pool: "No",
		apy: 20,
		apy_performancefee: 20,
		performancefee: 0
	},
	"0xD4bE7a106ed193BEe39D6389a481ec76027B2660":
	{
		pool_name: "iDYP Constant Staking ETH",
		pair_name: "iDYP",
		link_pair: "https://app.dyp.finance/staking-idyp-4",
		return_types: "iDYP",
		lock_time: "90 days",
		expired: "No",
		new_pool: "No",
		apy: 30,
		apy_performancefee: 26.5,
		performancefee: 3.5
	},
	"0x3fAb09ACAeDDAF579d7a72c24Ef3e9EB1D2975c4":
	{
		pool_name: "iDYP Constant Staking ETH",
		pair_name: "iDYP",
		link_pair: "https://app.dyp.finance/staking-idyp-2",
		return_types: "iDYP",
		lock_time: "90 days",
		expired: "Yes",
		new_pool: "No",
		apy: 45,
		apy_performancefee: 45,
		performancefee: 0
	},

}

const IDs_constant_staking_dyp_eth = {
	"0xa4da28B8e42680916b557459D338aF6e2D8d458f":
	{
		pool_name: "DYP Constant Staking ETH",
		pair_name: "DYP",
		link_pair: "https://app.dyp.finance/constant-staking-1",
		return_types: "iDYP",
		lock_time: "No lock",
		expired: "Yes",
		new_pool: "No",
		apy: "",
		apy_performancefee: "",
		performancefee: 0.25
	},
	"0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d":
	{
		pool_name: "DYP Constant Staking ETH",
		pair_name: "DYP",
		link_pair: "https://app.dyp.finance/constant-staking-2",
		return_types: "iDYP",
		lock_time: "90 days",
		expired: "Yes",
		new_pool: "No",
		apy: "",
		apy_performancefee: "",
		performancefee: 0.5
	},
	"0x44bEd8ea3296bda44870d0Da98575520De1735d4":
	{
		pool_name: "DYP Constant Staking ETH",
		pair_name: "DYP",
		link_pair: "https://app.dyp.finance/constant-staking-3",
		return_types: "DYP",
		lock_time: "90 days",
		expired: "Yes", 
		new_pool: "No",
		apy: 25,
		apy_performancefee: 25,
		performancefee: 0

	},
	"0xeb7dd6b50db34f7ff14898d0be57a99a9f158c4d":
	{
		pool_name: "DYP Constant Staking ETH",
		pair_name:"DYP",
		link_pair: "https://app.dyp.finance/constant-staking-3",
		return_types: "DYP",
		lock_time: "90 days",
		expired: "No",
		new_pool: "Yes",
		apy: 7.35,
		apy_performancefee: 7.35,
		performancefee: 0,
	}
}

const IDs_nft_stake_eth = {
	"0xee425bbbec5e9bf4a59a1c19efff522ad8b7a47a":
	{
		pool_name: "NFT Staking ETH",
		pair_name: "CAWS",
		link_pair: "https://dyp.finance/stake-caws",
		return_types: "ETH",
		floor_price: "",
		total_nfts_locked: "",
		tvl: "",
		lock_time: "30 days",
		expired: "Yes",
		apy: 50,

	}

}

const IDs_land_stake_eth = {
	"0x6821710B0D6E9e10ACfd8433aD023f874ed782F1":
	{
		pool_name: "Genesis Land Staking ETH",
		pair_name: "WoD",
		link_pair: "https://dyp.finance/stake-land",
		return_types: "ETH",
		floor_price: "",
		total_nfts_locked: "",
		tvl: "",
		lock_time: "No lock",
		expired: "No",
		apy: 25,

	}

}

const IDs_genesis_land_stake_eth = {
	"0xD324A03BF17Eee8D34A8843D094a76FF8f561e38":
	{
		pool_name: "Genesis Land & CAWS Staking ETH",
		pair_name: "WoD + CAWS",
		link_pair: "https://dyp.finance/stake-land-caws",
		return_types: "ETH",
		floor_price: "",
		total_nfts_locked: "",
		tvl: "",
		lock_time: "No lock",
		expired: "No",
		apy: 50,

	}
}

const IDs_constant_staking_idyp_bnb = {
	"0x7e766F7005C7a9e74123b156697B582eeCB8d2D7":
	{
		pool_name: "iDYP Constant Staking BNB",
		pair_name: "iDYP",
		link_pair: "https://app-bsc.dyp.finance/staking-idyp-3",
		return_types: "iDYP",
		lock_time: "No lock",
		expired: "No",
		new_pool: "No",
		apy: 15,
		apy_performancefee: 14,
		performancefee: 1
	},
	"0x58366902082B90Fca01bE07D929478bD48AcFB19":
	{
		pool_name: "iDYP Constant Staking BNB",
		pair_name: "iDYP",
		link_pair: "https://app-bsc.dyp.finance/staking-idyp-1",
		return_types: "iDYP",
		lock_time: "No lock",
		expired: "Yes",
		new_pool: "No",
		apy: 20,
		apy_performancefee: 20,
		performancefee: 0
	},
	"0x4C04E53f9aAa17fc2C914694B4Aae57a9d1bE445":
	{
		pool_name: "iDYP Constant Staking BNB",
		pair_name: "iDYP",
		link_pair: "https://app-bsc.dyp.finance/staking-idyp-4",
		return_types: "iDYP",
		lock_time: "90 days",
		expired: "No",
		new_pool: "No",
		apy: 30,
		apy_performancefee: 26.5,
		performancefee: 3.5
	},
	"0x160fF3c4A6E9Aa8E4271aa71226Cc811BFEf7ED9":
	{
		pool_name: "iDYP Constant Staking BNB",
		pair_name: "iDYP",
		link_pair: "https://app-bsc.dyp.finance/staking-idyp-2",
		return_types: "iDYP",
		lock_time: "90 days",
		expired: "Yes",
		new_pool: "No",
		apy: 45,
		apy_performancefee: 45,
		performancefee: 0
	},

}

const IDs_constant_staking_dyp_bnb = {
	"0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90":
	{
		pool_name: "DYP Constant Staking BNB",
		pair_name: "DYP",
		link_pair: "https://app-bsc.dyp.finance/constant-staking-1",
		return_types: "iDYP",
		lock_time: "No lock",
		expired: "Yes",
		new_pool: "No",
		apy: "",
		apy_performancefee: "",
		performancefee: 0.25
	},
	"0xaF411BF994dA1435A3150B874395B86376C5f2d5":
	{
		pool_name: "DYP Constant Staking BNB",
		pair_name: "DYP",
		link_pair: "https://app-bsc.dyp.finance/constant-staking-2",
		return_types: "iDYP",
		lock_time: "90 days",
		expired: "Yes",
		new_pool: "No",
		apy: "",
		apy_performancefee: "",
		performancefee: 0.5
	},
	"0xfc4493E85fD5424456f22135DB6864Dd4E4ED662":
	{
		pool_name: "DYP Constant Staking BNB",
		pair_name: "DYP",
		link_pair: "https://app-bsc.dyp.finance/constant-staking-30",
		return_types: "DYP",
		lock_time: "30 days",
		expired: "No",
		new_pool: "No",
		apy: 10,
		apy_performancefee: 9,
		performancefee: 1
	},
	"0xa9efab22cCbfeAbB6dc4583d81421e76342faf8b":
	{
		pool_name: "DYP Constant Staking BNB",
		pair_name: "DYP",
		link_pair: "https://app-bsc.dyp.finance/constant-staking-3",
		return_types: "DYP",
		lock_time: "90 days",
		expired: "Yes",
		new_pool: "No",
		apy: 25,
		apy_performancefee: 25,
		performancefee: 0
	},
	"0xef9e50A19358CCC8816d9BC2c2355aea596efd06":
	{
		pool_name: "DYP Constant Staking BNB",
		pair_name: "DYP",
		link_pair: "https://app-bsc.dyp.finance/constant-staking-180",
		return_types: "DYP",
		lock_time: "180 days",
		expired: "Yes",
		new_pool: "No",
		apy: 30,
		apy_performancefee: 26.5,
		performancefee: 3.5
	},
	"0x7c82513b69c1b42c23760cfc34234558119a3399":
	{
		pool_name: "DYP Constant Staking BNB",
		pair_name: "DYP",
		link_pair: "https://app-bsc.dyp.finance/constant-staking-90",
		return_types: "DYP",
		lock_time: "No lock",
		expired: "No",
		new_pool: "Yes",
		apy: 50,
		apy_performancefee: 50,
		performancefee: 0
	}
}

const IDs_constant_staking_idyp_avax = {
	"0xaF411BF994dA1435A3150B874395B86376C5f2d5":
	{
		pool_name: "iDYP Constant Staking AVAX",
		pair_name: "iDYP",
		link_pair: "https://app-avax.dyp.finance/staking-idyp-3",
		return_types: "iDYP",
		lock_time: "No lock",
		expired: "No",
		new_pool: "No",
		apy: 15,
		apy_performancefee: 14,
		performancefee: 1
	},
	"0x8f28110325a727f70B64bffEbf2B9dc94B932452":
	{
		pool_name: "iDYP Constant Staking AVAX",
		pair_name: "iDYP",
		link_pair: "https://app-avax.dyp.finance/staking-idyp-1",
		return_types: "iDYP",
		lock_time: "No lock",
		expired: "Yes",
		new_pool: "No",
		apy: 20,
		apy_performancefee: 20,
		performancefee: 0
	},
	"0xd13bdC0c9a9931cF959739631B1290b6BEE0c018":
	{
		pool_name: "iDYP Constant Staking AVAX",
		pair_name: "iDYP",
		link_pair: "https://app-avax.dyp.finance/staking-idyp-4",
		return_types: "iDYP",
		lock_time: "90 days",
		expired: "No",
		new_pool: "No",
		apy: 30,
		apy_performancefee: 26.5,
		performancefee: 3.5
	},
	"0x5536E02336771CFa0317D4B6a042f3c38749535e":
	{
		pool_name: "iDYP Constant Staking AVAX",
		pair_name: "iDYP",
		link_pair: "https://app-avax.dyp.finance/staking-idyp-2",
		return_types: "iDYP",
		lock_time: "90 days",
		expired: "Yes",
		new_pool: "No",
		apy: 45,
		apy_performancefee: 45,
		performancefee: 0
	}
}

const IDs_constant_staking_dyp_avax = {
	"0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B":
	{
		pool_name: "DYP Constant Staking AVAX",
		pair_name: "DYP",
		link_pair: "https://app-avax.dyp.finance/constant-staking-1",
		return_types: "iDYP",
		lock_time: "No lock",
		expired: "Yes",
		new_pool: "No",
		apy: "",
		apy_performancefee: "",
		performancefee: 0.25
	},
	"0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9":
	{
		pool_name: "DYP Constant Staking AVAX",
		pair_name: "DYP",
		link_pair: "https://app-avax.dyp.finance/constant-staking-2",
		return_types: "iDYP",
		lock_time: "90 days",
		expired: "Yes",
		new_pool: "No",
		apy: "",
		apy_performancefee: "",
		performancefee: 0.5
	},
	"0xb1875eeBbcF4456188968f439896053809698a8B":
	{
		pool_name: "DYP Constant Staking AVAX",
		pair_name: "DYP",
		link_pair: "https://app-avax.dyp.finance/constant-staking-30",
		return_types: "DYP",
		lock_time: "30 days",
		expired: "No",
		new_pool: "No",
		apy: 10,
		apy_performancefee: 9,
		performancefee: 1
	},
	"0x16429e51A64B7f88D4C018fbf66266A693df64b3":
	{
		pool_name: "DYP Constant Staking AVAX",
		pair_name: "DYP",
		link_pair: "https://app-avax.dyp.finance/constant-staking-3",
		return_types: "DYP",
		lock_time: "90 days",
		expired: "Yes",
		new_pool: "No",
		apy: 25,
		apy_performancefee: 25,
		performancefee: 0
	},
	"0xF035ec2562fbc4963e8c1c63f5c473D9696c59E3":
	{
		pool_name: "DYP Constant Staking AVAX",
		pair_name: "DYP",
		link_pair: "https://app-avax.dyp.finance/constant-staking-180",
		return_types: "DYP",
		lock_time: "180 days",
		expired: "Yes",
		new_pool: "No",
		apy: 30,
		apy_performancefee: 26.5,
		performancefee: 3.5
	},
	"0x6eb643813f0b4351b993f98bdeaef6e0f79573e9":
	{
		pool_name: "DYP Constant Staking AVAX",
		pair_name: "DYP",
		link_pair: "https://app-avax.dyp.finance/constant-staking-90",
		return_types: "DYP",
		lock_time: "No lock",
		expired: "No",
		new_pool: "Yes",
		apy: 50,
		apy_performancefee: 50,
		performancefee: 0
	}
}

const IDs_buyback_eth = {
	"0xdCBB5B2148f0cf1Abd7757Ba04A5821fEaD80587":
	{
		pool_name: "DYP Buyback ETH",
		pair_name: "WETH/WBTC/USDC/USDT",
		link_pair: "https://app.dyp.finance/staking-buyback-1",
		return_types: "DYP",
		lock_time: "No lock",
		expired: "No",
		new_pool: "No",
		apy: ""
	},
	"0xDC65C4277d626d6A29C9Dc42Eb396d354fa5E85b":
	{
		pool_name: "DYP Buyback ETH",
		pair_name: "WETH/WBTC/USDC/USDT",
		link_pair: "https://app.dyp.finance/staking-buyback-2",
		return_types: "DYP",
		lock_time: "90 days",
		expired: "No",
		new_pool: "No",
		apy: ""
	},
}

const IDs_buyback_bsc = {
	"0x94b1a7b57c441890b7a0f64291b39ad6f7e14804":
	{
		pool_name: "DYP Buyback BNB",
		pair_name: "WETH/WBTC/USDC/USDT/DAI/LINK",
		link_pair: "https://app-bsc.dyp.finance/staking-buyback-1",
		return_types: "DYP",
		lock_time: "No lock",
		expired: "Yes",
		apy: ""
	},
	"0x4ef782e66244a0cf002016aa1db3019448c670ae":
	{
		pool_name: "DYP Buyback BNB",
		pair_name: "WETH/WBTC/USDC/USDT/DAI/LINK",
		link_pair: "https://app-bsc.dyp.finance/staking-buyback-2",
		return_types: "DYP",
		lock_time: "90 days",
		expired: "Yes",
		apy: ""
	},
}

const IDs_buyback_avax = {
	"0xC905D5DD9A4f26eD059F76929D11476B2844A7c3":
	{
		pool_name: "DYP Buyback AVAX",
		pair_name: "WETH/WBTC/USDC/USDT/DAI/LINK",
		link_pair: "https://app-avax.dyp.finance/staking-buyback-1",
		return_types: "DYP",
		lock_time: "No lock",
		expired: "Yes",
		apy: ""
	},
	"0x267434f01ac323C6A5BCf41Fa111701eE0165a37":
	{
		pool_name: "DYP Buyback BNB",
		pair_name: "WETH/WBTC/USDC/USDT/DAI/LINK",
		link_pair: "https://app-avax.dyp.finance/staking-buyback-2",
		return_types: "DYP",
		lock_time: "90 days",
		expired: "Yes",
		apy: ""
	},
}

const TOKEN_ADDRESS_CAWS = "0xd06cF9e1189FEAb09c844C597abc3767BC12608c"
const TOKEN_ADDRESS_CAWS_STAKE = "0xee425bbbec5e9bf4a59a1c19efff522ad8b7a47a"
const TOKEN_ADDRESS_LAND = "0xcd60d912655281908EE557CE1Add61e983385a03"
const TOKEN_ADDRESS_LAND_STAKE = "0x6821710B0D6E9e10ACfd8433aD023f874ed782F1"
const TOKEN_ADDRESS_GENESIS_STAKE = "0xd324a03bf17eee8d34a8843d094a76ff8f561e38"
const TOKEN_ADDRESS_IDYP_ETH = "0xBD100d061E120b2c67A24453CF6368E63f1Be056"
const TOKEN_ADDRESS_DYP_ETH = "0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17"
const TOKEN_ADDRESS_IDYP_BNB = "0xBD100d061E120b2c67A24453CF6368E63f1Be056"
const TOKEN_ADDRESS_DYP_BNB = "0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17"
const TOKEN_ADDRESS_IDYP_AVAX = "0xbd100d061e120b2c67a24453cf6368e63f1be056"
const TOKEN_ADDRESS_DYP_AVAX = "0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17"

const land_contract_abi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"maxNftSupply","type":"uint256"},{"internalType":"uint256","name":"saleStart","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"LandPriceDiscount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_MINT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_WOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REVEAL_TIMESTAMP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WOD_PROVENANCE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cawsContract","outputs":[{"internalType":"contract CawsContract","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"cawsUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"emergencySetStartingIndexBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipSaleState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"landPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxLandPurchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"mintWodGenesis","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextOwnerToExplicitlySet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"reserveWod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleIsActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tokenURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"provenanceHash","type":"string"}],"name":"setProvenanceHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"revealTimeStamp","type":"uint256"}],"name":"setRevealTimestamp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setStartingIndex","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakeContract","outputs":[{"internalType":"contract StakeContract","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startingIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startingIndexBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

let [CAWS_TOTAL_LOCKED, cawsnfttvl] = [0, 0]

let [LAND_TOTAL_LOCKED, landnfttvl] = [0, 0]

let [LAND_CAWS_TOTAL_LOCKED, CAWS_LAND_TOTAL_LOCKED, landcawstvl, totalcawslandlocked] = [0, 0, 0, 0]

let [stakingiDYPEthTvl15, stakingiDYPEthTvl20, stakingiDYPEthTvl30, stakingiDYPEthTvl45] = [0, 0, 0, 0]

let [stakingDYPEthTvl1, stakingDYPEthTvl2, stakingDYPEthTvl25, stakingDYPEthTvl7] = [0, 0, 0, 0]

let [stakingiDYPBnbTvl15, stakingiDYPBnbTvl20, stakingiDYPBnbTvl30, stakingiDYPBnbTvl45] = [0, 0, 0, 0]

let [stakingDYPBnbTvl1, stakingDYPBnbTvl2, stakingDYPBnbTvl10, stakingDYPBnbTvl25, stakingDYPBnbTvl30, stakingDYPBnbTvl50] = [0, 0, 0, 0, 0, 0]

let [stakingiDYPAvaxTvl15, stakingiDYPAvaxTvl20, stakingiDYPAvaxTvl30, stakingiDYPAvaxTvl45] = [0, 0, 0, 0]

let [stakingDYPAvaxTvl1, stakingDYPAvaxTvl2, stakingDYPAvaxTvl10, stakingDYPAvaxTvl25, stakingDYPAvaxTvl30, stakingDYPAvaxTvl50] = [0, 0, 0, 0, 0, 0]

let [buybackEthTvl1, buybackEthTvl2] = [0, 0]

let [buybackBnbTvl1, buybackBnbTvl2] = [0, 0]

let [buybackAvaxTvl1, buybackAvaxTvl2] = [0, 0]


let [usdPerToken] = [0]

const updateNFTStaking = async () => {
	await fecthNftFloorPrice()
	let caws_nft_contract = new infuraWeb3.eth.Contract(caws_nft_contract_abi, TOKEN_ADDRESS_CAWS, { from: undefined })
	CAWS_TOTAL_LOCKED = await caws_nft_contract.methods.balanceOf(TOKEN_ADDRESS_CAWS_STAKE).call()
	cawsnfttvl = parseInt(CAWS_TOTAL_LOCKED) * 0.08 * parseInt(the_graph_result_ETH_V2.usd_per_eth)
}

const updateGENESISStaking = async () => {
	await fecthLandFloorPrice()
	let land_nft_contract = new infuraWeb3.eth.Contract(land_contract_abi, TOKEN_ADDRESS_LAND, { from: undefined })
	LAND_TOTAL_LOCKED = await land_nft_contract.methods.balanceOf(TOKEN_ADDRESS_LAND_STAKE).call()
	landnfttvl = parseInt(LAND_TOTAL_LOCKED) * floorpriceland * parseInt(the_graph_result_ETH_V2.usd_per_eth)
}

const updateGENESISCAWSStaking = async () => {
	await fecthLandFloorPrice()
	await fecthNftFloorPrice()
	let genesis_land_contract = new infuraWeb3.eth.Contract(genesis_nft_contract_abi, TOKEN_ADDRESS_GENESIS_STAKE, { from: undefined })
	let land_nft_contract = new infuraWeb3.eth.Contract(land_contract_abi, TOKEN_ADDRESS_LAND, { from: undefined })
	let caws_nft_contract = new infuraWeb3.eth.Contract(caws_nft_contract_abi, TOKEN_ADDRESS_CAWS, { from: undefined })
	CAWS_LAND_TOTAL_LOCKED = await land_nft_contract.methods.balanceOf(TOKEN_ADDRESS_GENESIS_STAKE).call()
	LAND_CAWS_TOTAL_LOCKED = await caws_nft_contract.methods.balanceOf(TOKEN_ADDRESS_GENESIS_STAKE).call()
	totalcawslandlocked = parseInt(CAWS_LAND_TOTAL_LOCKED) + parseInt(LAND_CAWS_TOTAL_LOCKED)
	landcawstvl = parseInt(CAWS_LAND_TOTAL_LOCKED) * floorprice + parseInt(LAND_CAWS_TOTAL_LOCKED) * floorpriceland * parseInt(the_graph_result_ETH_V2.usd_per_eth)
}	

const IDs_User_Pools_ETH_VAULTS1 = {
	"0x28eabA060E5EF0d41eeB20d41aafaE8f685739d9":
	{
		contract_address: "0x28eabA060E5EF0d41eeB20d41aafaE8f685739d9",
		tvl:""
	},
	"0x2F2cff66fEB7320FC9Adf91b7B74bFb5a80C7C35":
	{
		contract_address: "0x2F2cff66fEB7320FC9Adf91b7B74bFb5a80C7C35",
		tvl:""
	},
	"0xA987aEE0189Af45d5FA95a9FBBCB4374228f375E":
	{
		contract_address: "0xA987aEE0189Af45d5FA95a9FBBCB4374228f375E",
		tvl:""
	},
	"0x251B9ee6cEd97565A821C5608014a107ddc9C98F":
	{
		contract_address: "0x251B9ee6cEd97565A821C5608014a107ddc9C98F",
		tvl:""
	},
	"0x54F30bFfeb925F47225e148f0bAe17a452d6b8c0":
	{
		contract_address: "0x54F30bFfeb925F47225e148f0bAe17a452d6b8c0",
		tvl:""
	},
}

let TOKEN_ADDRESS_CETH = "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5"

let token_abi_ceth = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"mint","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"reserveFactorMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"borrowBalanceCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRateStored","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOfUnderlying","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCash","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newComptroller","type":"address"}],"name":"_setComptroller","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalBorrows","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"repayBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"comptroller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"reduceAmount","type":"uint256"}],"name":"_reduceReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"initialExchangeRateMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"accrualBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"totalBorrowsCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"borrowBalanceStored","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"accrueInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"borrowIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrower","type":"address"},{"name":"cTokenCollateral","type":"address"}],"name":"liquidateBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"supplyRatePerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"liquidator","type":"address"},{"name":"borrower","type":"address"},{"name":"seizeTokens","type":"uint256"}],"name":"seize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"exchangeRateCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getAccountSnapshot","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrowAmount","type":"uint256"}],"name":"borrow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"redeemTokens","type":"uint256"}],"name":"redeem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrower","type":"address"}],"name":"repayBorrowBehalf","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"_acceptAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newInterestRateModel","type":"address"}],"name":"_setInterestRateModel","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"interestRateModel","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowRatePerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newReserveFactorMantissa","type":"uint256"}],"name":"_setReserveFactor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isCToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"comptroller_","type":"address"},{"name":"interestRateModel_","type":"address"},{"name":"initialExchangeRateMantissa_","type":"uint256"},{"name":"name_","type":"string"},{"name":"symbol_","type":"string"},{"name":"decimals_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"interestAccumulated","type":"uint256"},{"indexed":false,"name":"borrowIndex","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"AccrueInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"minter","type":"address"},{"indexed":false,"name":"mintAmount","type":"uint256"},{"indexed":false,"name":"mintTokens","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"redeemer","type":"address"},{"indexed":false,"name":"redeemAmount","type":"uint256"},{"indexed":false,"name":"redeemTokens","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"borrowAmount","type":"uint256"},{"indexed":false,"name":"accountBorrows","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payer","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"repayAmount","type":"uint256"},{"indexed":false,"name":"accountBorrows","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"RepayBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"liquidator","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"repayAmount","type":"uint256"},{"indexed":false,"name":"cTokenCollateral","type":"address"},{"indexed":false,"name":"seizeTokens","type":"uint256"}],"name":"LiquidateBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldPendingAdmin","type":"address"},{"indexed":false,"name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldAdmin","type":"address"},{"indexed":false,"name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldComptroller","type":"address"},{"indexed":false,"name":"newComptroller","type":"address"}],"name":"NewComptroller","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldInterestRateModel","type":"address"},{"indexed":false,"name":"newInterestRateModel","type":"address"}],"name":"NewMarketInterestRateModel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldReserveFactorMantissa","type":"uint256"},{"indexed":false,"name":"newReserveFactorMantissa","type":"uint256"}],"name":"NewReserveFactor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"admin","type":"address"},{"indexed":false,"name":"reduceAmount","type":"uint256"},{"indexed":false,"name":"newTotalReserves","type":"uint256"}],"name":"ReservesReduced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"error","type":"uint256"},{"indexed":false,"name":"info","type":"uint256"},{"indexed":false,"name":"detail","type":"uint256"}],"name":"Failure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Approval","type":"event"}]

let TOKEN_ADDRESS_WETH = "0x28eabA060E5EF0d41eeB20d41aafaE8f685739d9"
let TOKEN_ADDRESS_WBTC = "0x2F2cff66fEB7320FC9Adf91b7B74bFb5a80C7C35"
let TOKEN_ADDRESS_USDT = "0xA987aEE0189Af45d5FA95a9FBBCB4374228f375E"
let TOKEN_ADDRESS_USDC = "0x251B9ee6cEd97565A821C5608014a107ddc9C98F"
let TOKEN_ADDRESS_DAI = "0x54F30bFfeb925F47225e148f0bAe17a452d6b8c0"

let token_abi_weth = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CompoundRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ADMIN_CAN_CLAIM_AFTER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BURN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_TO_BUYBACK_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOCKUP_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_ETH_FEE_IN_WEI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ONE_HUNDRED_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POINT_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_RETURN_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_CTOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_DEPOSIT_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_PLATFORM_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"addPlatformTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"cTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAnyToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimCompoundDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimEthDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"claimExtraTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claimPlatformTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contractStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ethDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"ethDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cTokenBalance","type":"uint256"}],"name":"getConvertedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"startIndex","type":"uint256"},{"internalType":"uint256","name":"endIndex","type":"uint256"}],"name":"getDepositorsList","outputs":[{"internalType":"address[]","name":"stakers","type":"address[]"},{"internalType":"uint256[]","name":"stakingTimestamps","type":"uint256[]"},{"internalType":"uint256[]","name":"lastClaimedTimeStamps","type":"uint256[]"},{"internalType":"uint256[]","name":"stakedTokens","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getEstimatedCompoundDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getExchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumberOfHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastClaimedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"platformTokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"platformTokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"tokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDepositedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedCompoundDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedEthDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedPlatformTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensDepositedByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensWithdrawnByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapRouterV2","outputs":[{"internalType":"contract IUniswapV2Router","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_tokenFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
let token_abi_wbtc = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CompoundRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ADMIN_CAN_CLAIM_AFTER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BURN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_TO_BUYBACK_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOCKUP_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_ETH_FEE_IN_WEI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ONE_HUNDRED_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POINT_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_RETURN_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_CTOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_DEPOSIT_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_PLATFORM_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"addPlatformTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"cTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAnyToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimCompoundDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimEthDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"claimExtraTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claimPlatformTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contractStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ethDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"ethDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cTokenBalance","type":"uint256"}],"name":"getConvertedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"startIndex","type":"uint256"},{"internalType":"uint256","name":"endIndex","type":"uint256"}],"name":"getDepositorsList","outputs":[{"internalType":"address[]","name":"stakers","type":"address[]"},{"internalType":"uint256[]","name":"stakingTimestamps","type":"uint256[]"},{"internalType":"uint256[]","name":"lastClaimedTimeStamps","type":"uint256[]"},{"internalType":"uint256[]","name":"stakedTokens","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getEstimatedCompoundDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getExchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumberOfHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastClaimedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"platformTokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"platformTokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"tokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDepositedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedCompoundDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedEthDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedPlatformTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensDepositedByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensWithdrawnByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapRouterV2","outputs":[{"internalType":"contract IUniswapV2Router","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_tokenFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
let token_abi_usdt = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CompoundRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ADMIN_CAN_CLAIM_AFTER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BURN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_TO_BUYBACK_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOCKUP_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_ETH_FEE_IN_WEI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ONE_HUNDRED_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POINT_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_RETURN_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_CTOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_DEPOSIT_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_PLATFORM_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"addPlatformTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"cTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAnyToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimCompoundDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimEthDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"claimExtraTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claimPlatformTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contractStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ethDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"ethDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cTokenBalance","type":"uint256"}],"name":"getConvertedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"startIndex","type":"uint256"},{"internalType":"uint256","name":"endIndex","type":"uint256"}],"name":"getDepositorsList","outputs":[{"internalType":"address[]","name":"stakers","type":"address[]"},{"internalType":"uint256[]","name":"stakingTimestamps","type":"uint256[]"},{"internalType":"uint256[]","name":"lastClaimedTimeStamps","type":"uint256[]"},{"internalType":"uint256[]","name":"stakedTokens","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getEstimatedCompoundDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getExchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumberOfHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastClaimedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"platformTokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"platformTokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"tokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDepositedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedCompoundDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedEthDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedPlatformTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensDepositedByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensWithdrawnByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapRouterV2","outputs":[{"internalType":"contract IUniswapV2Router","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_tokenFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
let token_abi_usdc = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CompoundRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ADMIN_CAN_CLAIM_AFTER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BURN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_TO_BUYBACK_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOCKUP_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_ETH_FEE_IN_WEI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ONE_HUNDRED_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POINT_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_RETURN_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_CTOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_DEPOSIT_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_PLATFORM_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"addPlatformTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"cTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAnyToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimCompoundDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimEthDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"claimExtraTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claimPlatformTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contractStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ethDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"ethDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cTokenBalance","type":"uint256"}],"name":"getConvertedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"startIndex","type":"uint256"},{"internalType":"uint256","name":"endIndex","type":"uint256"}],"name":"getDepositorsList","outputs":[{"internalType":"address[]","name":"stakers","type":"address[]"},{"internalType":"uint256[]","name":"stakingTimestamps","type":"uint256[]"},{"internalType":"uint256[]","name":"lastClaimedTimeStamps","type":"uint256[]"},{"internalType":"uint256[]","name":"stakedTokens","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getEstimatedCompoundDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getExchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumberOfHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastClaimedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"platformTokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"platformTokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"tokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDepositedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedCompoundDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedEthDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedPlatformTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensDepositedByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensWithdrawnByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapRouterV2","outputs":[{"internalType":"contract IUniswapV2Router","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_tokenFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
let token_abi_dai = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CompoundRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlatformTokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenRewardDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ADMIN_CAN_CLAIM_AFTER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BURN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_TO_BUYBACK_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FEE_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOCKUP_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_ETH_FEE_IN_WEI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ONE_HUNDRED_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POINT_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_RETURN_PERCENT_X_100","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_CTOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_DEPOSIT_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_PLATFORM_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"addPlatformTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"cTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAnyToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimCompoundDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimEthDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"claimExtraTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountOutMin_platformTokens","type":"uint256"}],"name":"claimPlatformTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimTokenDivs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contractStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ethDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"ethDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cTokenBalance","type":"uint256"}],"name":"getConvertedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"startIndex","type":"uint256"},{"internalType":"uint256","name":"endIndex","type":"uint256"}],"name":"getDepositorsList","outputs":[{"internalType":"address[]","name":"stakers","type":"address[]"},{"internalType":"uint256[]","name":"stakingTimestamps","type":"uint256[]"},{"internalType":"uint256[]","name":"lastClaimedTimeStamps","type":"uint256[]"},{"internalType":"uint256[]","name":"stakedTokens","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getEstimatedCompoundDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getExchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumberOfHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastClaimedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"platformTokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"platformTokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenDivsBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"tokenDivsOwing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDepositedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedCompoundDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedEthDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedPlatformTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalEarnedTokenDivs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEthDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokenDivPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensDepositedByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensDisbursed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalTokensWithdrawnByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapRouterV2","outputs":[{"internalType":"contract IUniswapV2Router","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_ethFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"_amountOutMin_tokenFeeBuyBack","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]


let totaltvlvault = 0
let _tvlvaultDAI = 0
let _tvlvaultUSDC = 0
let _tvlvaultUSDT = 0
let _tvlvaultWBTC = 0
let _tvlvaultWETH = 0
let tvlvault1 = 0
let tvlvault2 = 0
let tvlvault3 = 0
let tvlvault4 = 0
let tvlvault5 = 0
let tvlvault6 = 0
let tvlvault7 = 0
let tvlvault8 = 0
let tvlvault9 = 0
let tvlvault10 = 0



const updateVaultTVL = async () => {
totaltvlvault = 0
_tvlvaultDAI = 0
_tvlvaultUSDC = 0
_tvlvaultUSDT = 0
_tvlvaultWBTC = 0
_tvlvaultWETH = 0
tvlvault1 = 0
tvlvault2 = 0
tvlvault3 = 0
tvlvault4 = 0
tvlvault5 = 0
tvlvault6 = 0
tvlvault7 = 0
tvlvault8 = 0
tvlvault9 = 0
tvlvault10 = 0


let ethPrice = await Promise.all([getPrice('ethereum')])
let wbtcPrice = await Promise.all([getPrice('wrapped-bitcoin')])
let price_iDYP = await Promise.all([getPrice('idefiyieldprotocol')])

let token_contract_idyp = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS_IDYP_ETH, { from: undefined })
let token_contract_weth = new infuraWeb3.eth.Contract(token_abi_weth, TOKEN_ADDRESS_WETH, { from: undefined })
let token_contract_wbtc = new infuraWeb3.eth.Contract(token_abi_wbtc, TOKEN_ADDRESS_WBTC, { from: undefined })
let token_contract_usdt = new infuraWeb3.eth.Contract(token_abi_usdt, TOKEN_ADDRESS_USDT, { from: undefined })
let token_contract_usdc = new infuraWeb3.eth.Contract(token_abi_usdc, TOKEN_ADDRESS_USDC, { from: undefined })
let token_contract_dai = new infuraWeb3.eth.Contract(token_abi_dai, TOKEN_ADDRESS_DAI, { from: undefined })

tvlvault1 = await token_contract_weth.methods.totalDepositedTokens().call()
tvlvault1 = tvlvault1 / 1e18 * ethPrice
tvlvault2 = await token_contract_idyp.methods.balanceOf(TOKEN_ADDRESS_WETH).call()
tvlvault2 = tvlvault2 / 1e18 * price_iDYP

_tvlvaultWETH = tvlvault1 + tvlvault2

tvlvault3 = await token_contract_wbtc.methods.totalDepositedTokens().call()
tvlvault3 = tvlvault3 / 1e8 * wbtcPrice
tvlvault4 = await token_contract_idyp.methods.balanceOf(TOKEN_ADDRESS_WBTC).call()
tvlvault4 = tvlvault4 / 1e18 * price_iDYP

_tvlvaultWBTC = tvlvault3 + tvlvault4

tvlvault5 = await token_contract_usdt.methods.totalDepositedTokens().call()
tvlvault5 = tvlvault5 / 1e6
tvlvault6 = await token_contract_idyp.methods.balanceOf(TOKEN_ADDRESS_USDT).call()
tvlvault6 = tvlvault6 / 1e18 * price_iDYP
_tvlvaultUSDT = tvlvault5 + tvlvault6


tvlvault7 = await token_contract_usdc.methods.totalDepositedTokens().call()
tvlvault7 = tvlvault7 / 1e6
tvlvault8 = await token_contract_idyp.methods.balanceOf(TOKEN_ADDRESS_USDC).call()
tvlvault8 = tvlvault8 / 1e18 * price_iDYP
_tvlvaultUSDC = tvlvault7 + tvlvault8

tvlvault9 = await token_contract_dai.methods.totalDepositedTokens().call()
tvlvault9 = tvlvault9 / 1e18
tvlvault10 = await token_contract_idyp.methods.balanceOf(TOKEN_ADDRESS_DAI).call()
tvlvault10 = tvlvault10 / 1e18 * price_iDYP
_tvlvaultDAI = tvlvault9 + tvlvault10

totaltvlvault = _tvlvaultWETH + _tvlvaultWBTC + _tvlvaultUSDC + _tvlvaultUSDT + _tvlvaultDAI

}


let last_update_time_vault = 0;
let VaultTVLInfo = [];
let VaultTVLTotal =[];
const get_iDYP_Vault_TVL_Info = async () => {
	last_update_time_vault = Date.now();
	//1 ora
	VaultTVLInfo = [];
	total_eth_tvl = [];
	VaultTVLTotal = [];

	let 
		contract_address = "",
		tvl_usd = 0;

	let ids_constant_staking_eth = Object.keys(IDs_User_Pools_ETH_VAULTS1)
	for (let id of ids_constant_staking_eth) {

		if (id == "0x28eabA060E5EF0d41eeB20d41aafaE8f685739d9")
			tvl_usd = _tvlvaultWETH

		if (id == "0x2F2cff66fEB7320FC9Adf91b7B74bFb5a80C7C35")
			tvl_usd = _tvlvaultWBTC

		if (id == "0xA987aEE0189Af45d5FA95a9FBBCB4374228f375E")
			tvl_usd = _tvlvaultUSDT

		if (id == "0x251B9ee6cEd97565A821C5608014a107ddc9C98F")
			tvl_usd = _tvlvaultUSDC
			if (id == "0x54F30bFfeb925F47225e148f0bAe17a452d6b8c0")
			tvl_usd = _tvlvaultDAI


			contract_address = IDs_User_Pools_ETH_VAULTS1[id].contract_address

		VaultTVLInfo.push({
			contract_address: contract_address,
			tvl: tvl_usd
		})
	}
	VaultTVLTotal.push({
		tvl: totaltvlvault
	})

}
let NftStakingInfo = [];

const get_NFT_Staking_Info = async () => {
	await fecthNftFloorPrice()
	await updateNFTStaking();
	NftStakingInfo = [];

	let tvl = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		floor_price = "",
		total_nfts_locked = "",
		expired = "",
		return_types = "",
		lock_time = ""
	let ids_constant_staking_eth = Object.keys(IDs_nft_stake_eth)
	for (let id of ids_constant_staking_eth) {

		tvl = cawsnfttvl
		floor_price = floorprice
		total_nfts_locked = CAWS_TOTAL_LOCKED
		apy_percent = IDs_nft_stake_eth[id].apy
		pool_name = IDs_nft_stake_eth[id].pool_name
		pair_name = IDs_nft_stake_eth[id].pair_name
		link_pair = IDs_nft_stake_eth[id].link_pair
		return_types = IDs_nft_stake_eth[id].return_types
		expired = IDs_nft_stake_eth[id].expired
		lock_time = IDs_nft_stake_eth[id].lock_time

		NftStakingInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl,
			floor_price: floor_price,
			total_nfts_locked: total_nfts_locked,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired
		})
	}

}

let landStakingInfo = [];

const get_Land_Staking_Info = async () => {
	// await updateLandStaking();
	await fecthLandFloorPrice()
	await updateGENESISStaking();
	landStakingInfo = [];

	let tvl = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		floor_price = "",
		total_nfts_locked = "",
		expired = "",
		return_types = "",
		lock_time = ""
	let ids_constant_staking_eth = Object.keys(IDs_land_stake_eth)
	for (let id of ids_constant_staking_eth) {
		
		tvl = landnfttvl
		floor_price = floorpriceland
		total_nfts_locked = LAND_TOTAL_LOCKED
		apy_percent = IDs_land_stake_eth[id].apy
		pool_name = IDs_land_stake_eth[id].pool_name
		pair_name = IDs_land_stake_eth[id].pair_name
		link_pair = IDs_land_stake_eth[id].link_pair
		return_types = IDs_land_stake_eth[id].return_types
		expired = IDs_land_stake_eth[id].expired
		lock_time = IDs_land_stake_eth[id].lock_time

		landStakingInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl,
			floor_price: floor_price,
			total_nfts_locked: total_nfts_locked,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired
		})
	}
}

let landCawsStakingInfo = [];

const get_Land_Caws_Staking_info = async () => {
	// await updateLandStaking();
	await fecthLandFloorPrice()
	await updateGENESISCAWSStaking();
	landCawsStakingInfo = [];

	let tvl = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		floor_price = "",
		total_nfts_locked = "",
		expired = "",
		return_types = "",
		lock_time = ""
	let ids_constant_staking_eth = Object.keys(IDs_genesis_land_stake_eth)
	for (let id of ids_constant_staking_eth) {
		
		tvl = landcawstvl
		floor_price = floorpriceland
		total_nfts_locked = totalcawslandlocked
		apy_percent = IDs_genesis_land_stake_eth[id].apy
		pool_name = IDs_genesis_land_stake_eth[id].pool_name
		pair_name = IDs_genesis_land_stake_eth[id].pair_name
		link_pair = IDs_genesis_land_stake_eth[id].link_pair
		return_types = IDs_genesis_land_stake_eth[id].return_types
		expired = IDs_genesis_land_stake_eth[id].expired
		lock_time = IDs_genesis_land_stake_eth[id].lock_time

		landCawsStakingInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl,
			floor_price: floor_price,
			total_nfts_locked: total_nfts_locked,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired
		})
	}
}


let totaltvl = 0;
let totaltvlbsc = 0;
let totaltvlavax = 0;
let totaltvlbuybackbsc = 0;
let totaltvlbuybackavax = 0;
let totaltvlbuybacketh = 0;

const updateStakingTVLAVAX = async () => {

	totaltvlavax = 0;

	let token_contract_avax_1 = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS_DYP_AVAX, { from: undefined })
	let token_contract_avax_2 = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS_IDYP_AVAX, { from: undefined })

	usdPerToken = await Promise.all([getPrice('defi-yield-protocol')])

	
	//idyp avax starts here

	let _tvliDYPAvax15 = await token_contract_avax_1.methods.balanceOf('0xaF411BF994dA1435A3150B874395B86376C5f2d5').call()
	let _tvliDYPAvax15_2 = await token_contract_avax_2.methods.balanceOf('0xaF411BF994dA1435A3150B874395B86376C5f2d5').call()
	_tvliDYPAvax15 = _tvliDYPAvax15 / 1e18 * usdPerToken
	_tvliDYPAvax15 = _tvliDYPAvax15 + _tvliDYPAvax15_2 / 1e18 * price_iDYP_eth
	stakingiDYPAvaxTvl15 = _tvliDYPAvax15;

	let _tvliDYPAvax20 = await token_contract_avax_1.methods.balanceOf('0x8f28110325a727f70B64bffEbf2B9dc94B932452').call()
	let _tvliDYPAvax20_2 = await token_contract_avax_2.methods.balanceOf('0x8f28110325a727f70B64bffEbf2B9dc94B932452').call()
	_tvliDYPAvax20 = _tvliDYPAvax20 / 1e18 * usdPerToken
	_tvliDYPAvax20 = _tvliDYPAvax20 + _tvliDYPAvax20_2 / 1e18 * price_iDYP_eth
	stakingiDYPAvaxTvl20 = _tvliDYPAvax20;

	let _tvliDYPAvax30 = await token_contract_avax_1.methods.balanceOf('0xd13bdC0c9a9931cF959739631B1290b6BEE0c018').call()
	let _tvliDYPAvax30_2 = await token_contract_avax_2.methods.balanceOf('0xd13bdC0c9a9931cF959739631B1290b6BEE0c018').call()
	_tvliDYPAvax30 = _tvliDYPAvax30 / 1e18 * usdPerToken
	_tvliDYPAvax30 = _tvliDYPAvax30 + _tvliDYPAvax30_2 / 1e18 * price_iDYP_eth
	stakingiDYPAvaxTvl30 = _tvliDYPAvax30;

	let _tvliDYPAvax45 = await token_contract_avax_1.methods.balanceOf('0x5536E02336771CFa0317D4B6a042f3c38749535e').call()
	let _tvliDYPAvax45_2 = await token_contract_avax_2.methods.balanceOf('0x5536E02336771CFa0317D4B6a042f3c38749535e').call()
	_tvliDYPAvax45 = _tvliDYPAvax45 / 1e18 * usdPerToken
	_tvliDYPAvax45 = _tvliDYPAvax45 + _tvliDYPAvax45_2 / 1e18 * price_iDYP_eth
	stakingiDYPAvaxTvl45 = _tvliDYPAvax45;

	//dyp avax starts here

	let _tvlDYPAvax1 = await token_contract_avax_1.methods.balanceOf('0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B').call()
	let _tvlDYPAvax1_2 = await token_contract_avax_2.methods.balanceOf('0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B').call()
	_tvlDYPAvax1 = _tvlDYPAvax1 / 1e18 * usdPerToken
	_tvlDYPAvax1 = _tvlDYPAvax1 + _tvlDYPAvax1_2 / 1e18 * price_iDYP_eth
	stakingDYPAvaxTvl1 = _tvlDYPAvax1;

	let _tvlDYPAvax2 = await token_contract_avax_1.methods.balanceOf('0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9').call()
	let _tvlDYPAvax2_2 = await token_contract_avax_2.methods.balanceOf('0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9').call()
	_tvlDYPAvax2 = _tvlDYPAvax2 / 1e18 * usdPerToken
	_tvlDYPAvax2 = _tvlDYPAvax2 + _tvlDYPAvax2_2 / 1e18 * price_iDYP_eth
	stakingDYPAvaxTvl2 = _tvlDYPAvax2;

	let _tvlDYPAvax10 = await token_contract_avax_1.methods.balanceOf('0xb1875eeBbcF4456188968f439896053809698a8B').call()
	let _tvlDYPAvax10_2 = await token_contract_avax_2.methods.balanceOf('0xb1875eeBbcF4456188968f439896053809698a8B').call()
	_tvlDYPAvax10 = _tvlDYPAvax10 / 1e18 * usdPerToken
	_tvlDYPAvax10 = _tvlDYPAvax10 + _tvlDYPAvax10_2 / 1e18 * price_iDYP_eth
	stakingDYPAvaxTvl10 = _tvlDYPAvax10;

	let _tvlDYPAvax25 = await token_contract_avax_1.methods.balanceOf('0x16429e51A64B7f88D4C018fbf66266A693df64b3').call()
	let _tvlDYPAvax25_2 = await token_contract_avax_2.methods.balanceOf('0x16429e51A64B7f88D4C018fbf66266A693df64b3').call()
	_tvlDYPAvax25 = _tvlDYPAvax25 / 1e18 * usdPerToken
	_tvlDYPAvax25 = _tvlDYPAvax25 + _tvlDYPAvax25_2 / 1e18 * price_iDYP_eth
	stakingDYPAvaxTvl25 = _tvlDYPAvax25;

	let _tvlDYPAvax30 = await token_contract_avax_1.methods.balanceOf('0xF035ec2562fbc4963e8c1c63f5c473D9696c59E3').call()
	let _tvlDYPAvax30_2 = await token_contract_avax_2.methods.balanceOf('0xF035ec2562fbc4963e8c1c63f5c473D9696c59E3').call()
	_tvlDYPAvax30 = _tvlDYPAvax30 / 1e18 * usdPerToken
	_tvlDYPAvax30 = _tvlDYPAvax30 + _tvlDYPAvax30_2 / 1e18 * price_iDYP_eth
	stakingDYPAvaxTvl30 = _tvlDYPAvax30;

	let _tvlDYPAvax50 = await token_contract_avax_1.methods.balanceOf('0x6eb643813f0b4351b993f98bdeaef6e0f79573e9').call()
	let _tvlDYPAvax50_2 = await token_contract_avax_2.methods.balanceOf('0x6eb643813f0b4351b993f98bdeaef6e0f79573e9').call()
	_tvlDYPAvax50 = _tvlDYPAvax50 / 1e18 * usdPerToken
	_tvlDYPAvax50 = _tvlDYPAvax50 + _tvlDYPAvax50_2 / 1e18 * price_iDYP_eth
	stakingDYPAvaxTvl50 = _tvlDYPAvax50;

	totaltvlavax = stakingiDYPAvaxTvl15 + stakingiDYPAvaxTvl20 + stakingiDYPAvaxTvl30 + stakingiDYPAvaxTvl45 + stakingDYPAvaxTvl1 + stakingDYPAvaxTvl2 + stakingDYPAvaxTvl10 + stakingDYPAvaxTvl25 + stakingDYPAvaxTvl30 + stakingDYPAvaxTvl50

	return usdPerToken,
	
	stakingiDYPAvaxTvl15, stakingiDYPAvaxTvl20, stakingiDYPAvaxTvl30, stakingiDYPAvaxTvl45,

	stakingDYPAvaxTvl1, stakingDYPAvaxTvl2, stakingDYPAvaxTvl10, stakingDYPAvaxTvl25, stakingDYPAvaxTvl30, stakingDYPAvaxTvl50;
}


const updateStakingTVLBNB = async () => {
	totaltvlbsc = 0;
	let token_contract_bnb_1 = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS_DYP_BNB, { from: undefined })
	let token_contract_bnb_2 = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS_IDYP_BNB, { from: undefined })

	usdPerToken = await Promise.all([getPrice('defi-yield-protocol')])

	let _tvliDYPBnb15 = await token_contract_bnb_1.methods.balanceOf('0x7e766F7005C7a9e74123b156697B582eeCB8d2D7').call()
	let _tvliDYPBnb15_2 = await token_contract_bnb_2.methods.balanceOf('0x7e766F7005C7a9e74123b156697B582eeCB8d2D7').call()
	_tvliDYPBnb15 = _tvliDYPBnb15 / 1e18 * usdPerToken
	_tvliDYPBnb15 = _tvliDYPBnb15 + _tvliDYPBnb15_2 / 1e18 * price_iDYP_eth
	stakingiDYPBnbTvl15 = _tvliDYPBnb15;

	let _tvliDYPBnb20 = await token_contract_bnb_1.methods.balanceOf('0x58366902082B90Fca01bE07D929478bD48AcFB19').call()
	let _tvliDYPBnb20_2 = await token_contract_bnb_2.methods.balanceOf('0x58366902082B90Fca01bE07D929478bD48AcFB19').call()
	_tvliDYPBnb20 = _tvliDYPBnb20 / 1e18 * usdPerToken
	_tvliDYPBnb20 = _tvliDYPBnb20 + _tvliDYPBnb20_2 / 1e18 * price_iDYP_eth
	stakingiDYPBnbTvl20 = _tvliDYPBnb20;

	let _tvliDYPBnb30 = await token_contract_bnb_1.methods.balanceOf('0x4C04E53f9aAa17fc2C914694B4Aae57a9d1bE445').call()
	let _tvliDYPBnb30_2 = await token_contract_bnb_2.methods.balanceOf('0x4C04E53f9aAa17fc2C914694B4Aae57a9d1bE445').call()
	_tvliDYPBnb30 = _tvliDYPBnb30 / 1e18 * usdPerToken
	_tvliDYPBnb30 = _tvliDYPBnb30 + _tvliDYPBnb30_2 / 1e18 * price_iDYP_eth
	stakingiDYPBnbTvl30 = _tvliDYPBnb30;

	let _tvliDYPBnb45 = await token_contract_bnb_1.methods.balanceOf('0x160fF3c4A6E9Aa8E4271aa71226Cc811BFEf7ED9').call()
	let _tvliDYPBnb45_2 = await token_contract_bnb_2.methods.balanceOf('0x160fF3c4A6E9Aa8E4271aa71226Cc811BFEf7ED9').call()
	_tvliDYPBnb45 = _tvliDYPBnb45 / 1e18 * usdPerToken
	_tvliDYPBnb45 = _tvliDYPBnb45 + _tvliDYPBnb45_2 / 1e18 * price_iDYP_eth
	stakingiDYPBnbTvl45 = _tvliDYPBnb45;

	//dyp bnb starts here

	let _tvlDYPBnb1 = await token_contract_bnb_1.methods.balanceOf('0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90').call()
	let _tvlDYPBnb1_2 = await token_contract_bnb_2.methods.balanceOf('0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90').call()
	_tvlDYPBnb1 = _tvlDYPBnb1 / 1e18 * usdPerToken
	_tvlDYPBnb1 = _tvlDYPBnb1 + _tvlDYPBnb1_2 / 1e18 * price_iDYP_eth
	stakingDYPBnbTvl1 = _tvlDYPBnb1;

	let _tvlDYPBnb2 = await token_contract_bnb_1.methods.balanceOf('0xaF411BF994dA1435A3150B874395B86376C5f2d5').call()
	let _tvlDYPBnb2_2 = await token_contract_bnb_2.methods.balanceOf('0xaF411BF994dA1435A3150B874395B86376C5f2d5').call()
	_tvlDYPBnb2 = _tvlDYPBnb2 / 1e18 * usdPerToken
	_tvlDYPBnb2 = _tvlDYPBnb2 + _tvlDYPBnb2_2 / 1e18 * price_iDYP_eth
	stakingDYPBnbTvl2 = _tvlDYPBnb2;

	let _tvlDYPBnb10 = await token_contract_bnb_1.methods.balanceOf('0xfc4493E85fD5424456f22135DB6864Dd4E4ED662').call()
	let _tvlDYPBnb10_2 = await token_contract_bnb_2.methods.balanceOf('0xfc4493E85fD5424456f22135DB6864Dd4E4ED662').call()
	_tvlDYPBnb10 = _tvlDYPBnb10 / 1e18 * usdPerToken
	_tvlDYPBnb10 = _tvlDYPBnb10 + _tvlDYPBnb10_2 / 1e18 * price_iDYP_eth
	stakingDYPBnbTvl10 = _tvlDYPBnb10;

	let _tvlDYPBnb25 = await token_contract_bnb_1.methods.balanceOf('0xa9efab22cCbfeAbB6dc4583d81421e76342faf8b').call()
	let _tvlDYPBnb25_2 = await token_contract_bnb_2.methods.balanceOf('0xa9efab22cCbfeAbB6dc4583d81421e76342faf8b').call()
	_tvlDYPBnb25 = _tvlDYPBnb25 / 1e18 * usdPerToken
	_tvlDYPBnb25 = _tvlDYPBnb25 + _tvlDYPBnb25_2 / 1e18 * price_iDYP_eth
	stakingDYPBnbTvl25 = _tvlDYPBnb25;

	let _tvlDYPBnb30 = await token_contract_bnb_1.methods.balanceOf('0xef9e50A19358CCC8816d9BC2c2355aea596efd06').call()
	let _tvlDYPBnb30_2 = await token_contract_bnb_2.methods.balanceOf('0xef9e50A19358CCC8816d9BC2c2355aea596efd06').call()
	_tvlDYPBnb30 = _tvlDYPBnb30 / 1e18 * usdPerToken
	_tvlDYPBnb30 = _tvlDYPBnb30 + _tvlDYPBnb30_2 / 1e18 * price_iDYP_eth
	stakingDYPBnbTvl30 = _tvlDYPBnb30;

	let _tvlDYPBnb50 = await token_contract_bnb_1.methods.balanceOf('0x7c82513b69c1b42c23760cfc34234558119a3399').call()
	let _tvlDYPBnb50_2 = await token_contract_bnb_2.methods.balanceOf('0x7c82513b69c1b42c23760cfc34234558119a3399').call()
	_tvlDYPBnb50 = _tvlDYPBnb50 / 1e18 * usdPerToken
	_tvlDYPBnb50 = _tvlDYPBnb50 + _tvlDYPBnb50_2 / 1e18 * price_iDYP_eth;
	stakingDYPBnbTvl50 = _tvlDYPBnb50;

	totaltvlbsc = stakingiDYPBnbTvl15 + stakingiDYPBnbTvl20 + stakingiDYPBnbTvl30 + stakingiDYPBnbTvl45 + stakingDYPBnbTvl1 + stakingDYPBnbTvl2 + stakingDYPBnbTvl10 + stakingDYPBnbTvl25 + stakingDYPBnbTvl30 + stakingDYPBnbTvl50;

	return usdPerToken,
	stakingiDYPBnbTvl15, stakingiDYPBnbTvl20, stakingiDYPBnbTvl30, stakingiDYPBnbTvl45,

	stakingDYPBnbTvl1, stakingDYPBnbTvl2, stakingDYPBnbTvl10, stakingDYPBnbTvl25, stakingDYPBnbTvl30, stakingDYPBnbTvl50;
}

const updateStakingTVLETH = async () => {
	fecthNftFloorPrice();
	fecthLandFloorPrice();
	await updateGENESISStaking();
	await updateGENESISCAWSStaking();
	await updateNFTStaking();
	totaltvl = 0;
	totaltvlbuybackbsc = 0;
	totaltvlbuybackavax = 0;
	totaltvlbuybacketh = 0;

	let token_contract_eth_1 = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS_DYP_ETH, { from: undefined })
	let token_contract_eth_2 = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS_IDYP_ETH, { from: undefined })

	usdPerToken = await Promise.all([getPrice('defi-yield-protocol')])

	//idyp eth starts here

	let _tvliDYPEth15 = await token_contract_eth_1.methods.balanceOf('0x50014432772b4123D04181727C6EdEAB34F5F988').call()
	let _tvliDYPEth15_2 = await token_contract_eth_2.methods.balanceOf('0x50014432772b4123D04181727C6EdEAB34F5F988').call()
	_tvliDYPEth15 = _tvliDYPEth15 / 1e18 * usdPerToken
	_tvliDYPEth15 = _tvliDYPEth15 + _tvliDYPEth15_2 / 1e18 * price_iDYP_eth
	stakingiDYPEthTvl15 = _tvliDYPEth15;

	let _tvliDYPEth20 = await token_contract_eth_1.methods.balanceOf('0x9eA966B4023049BFF858BB5E698ECfF24EA54c4A').call()
	let _tvliDYPEth20_2 = await token_contract_eth_2.methods.balanceOf('0x9eA966B4023049BFF858BB5E698ECfF24EA54c4A').call()
	_tvliDYPEth20 = _tvliDYPEth20 / 1e18 * usdPerToken
	_tvliDYPEth20 = _tvliDYPEth20 + _tvliDYPEth20_2 / 1e18 * price_iDYP_eth
	stakingiDYPEthTvl20 = _tvliDYPEth20;

	let _tvliDYPEth30 = await token_contract_eth_1.methods.balanceOf('0xD4bE7a106ed193BEe39D6389a481ec76027B2660').call()
	let _tvliDYPEth30_2 = await token_contract_eth_2.methods.balanceOf('0xD4bE7a106ed193BEe39D6389a481ec76027B2660').call()
	_tvliDYPEth30 = _tvliDYPEth30 / 1e18 * usdPerToken
	_tvliDYPEth30 = _tvliDYPEth30 + _tvliDYPEth30_2 / 1e18 * price_iDYP_eth
	stakingiDYPEthTvl30 = _tvliDYPEth30;

	let _tvliDYPEth45 = await token_contract_eth_1.methods.balanceOf('0x3fAb09ACAeDDAF579d7a72c24Ef3e9EB1D2975c4').call()
	let _tvliDYPEth45_2 = await token_contract_eth_2.methods.balanceOf('0x3fAb09ACAeDDAF579d7a72c24Ef3e9EB1D2975c4').call()
	_tvliDYPEth45 = _tvliDYPEth45 / 1e18 * usdPerToken
	_tvliDYPEth45 = _tvliDYPEth45 + _tvliDYPEth45_2 / 1e18 * price_iDYP_eth
	stakingiDYPEthTvl45 = _tvliDYPEth45;

	//dyp eth starts here

	let _tvlDYPEth1 = await token_contract_eth_1.methods.balanceOf('0xa4da28B8e42680916b557459D338aF6e2D8d458f').call()
	let _tvlDYPEth1_2 = await token_contract_eth_2.methods.balanceOf('0xa4da28B8e42680916b557459D338aF6e2D8d458f').call()
	_tvlDYPEth1 = _tvlDYPEth1 / 1e18 * usdPerToken
	_tvlDYPEth1 = _tvlDYPEth1 + _tvlDYPEth1_2 / 1e18 * price_iDYP_eth
	stakingDYPEthTvl1 = _tvlDYPEth1;

	let _tvlDYPEth2 = await token_contract_eth_1.methods.balanceOf('0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d').call()
	let _tvlDYPEth2_2 = await token_contract_eth_2.methods.balanceOf('0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d').call()
	_tvlDYPEth2 = _tvlDYPEth2 / 1e18 * usdPerToken
	_tvlDYPEth2 = _tvlDYPEth2 + _tvlDYPEth2_2 / 1e18 * price_iDYP_eth
	stakingDYPEthTvl2 = _tvlDYPEth2;

	let _tvlDYPEth25 = await token_contract_eth_1.methods.balanceOf('0x44bEd8ea3296bda44870d0Da98575520De1735d4').call()
	let _tvlDYPEth25_2 = await token_contract_eth_2.methods.balanceOf('0x44bEd8ea3296bda44870d0Da98575520De1735d4').call()
	


	_tvlDYPEth25 = _tvlDYPEth25 / 1e18 * usdPerToken
	_tvlDYPEth25 = _tvlDYPEth25 + _tvlDYPEth25_2 / 1e18 * price_iDYP_eth
	stakingDYPEthTvl25 = _tvlDYPEth25;

	let _tvlDYPEth7 = await token_contract_eth_1.methods.balanceOf('0xeb7dd6b50db34f7ff14898d0be57a99a9f158c4d').call()
	let _tvlDYPEth7_2 = await token_contract_eth_2.methods.balanceOf('0xeb7dd6b50db34f7ff14898d0be57a99a9f158c4d').call()

	_tvlDYPEth7 = _tvlDYPEth7 / 1e18 * usdPerToken
	_tvlDYPEth7 = _tvlDYPEth7 + _tvlDYPEth7_2 / 1e18 * price_iDYP_eth
	stakingDYPEthTvl7 = _tvlDYPEth7;

	totaltvl = stakingiDYPEthTvl15 + stakingiDYPEthTvl20 + stakingiDYPEthTvl30 + stakingiDYPEthTvl45 + stakingDYPEthTvl1 + stakingDYPEthTvl2 + stakingDYPEthTvl25 + stakingDYPEthTvl7 + cawsnfttvl + landnfttvl + landcawstvl
	return totaltvl,

		stakingiDYPEthTvl15, stakingiDYPEthTvl20, stakingiDYPEthTvl30, stakingiDYPEthTvl45,

		stakingDYPEthTvl1, stakingDYPEthTvl2, stakingDYPEthTvl25, stakingDYPEthTvl7;
}


let iDYPEthStakingInfo = [];
let all_eth_apys = [];
let total_eth_tvl = [];
let ethcounter = 0;
let highestethapy = [];
let last_update_time_ethstake = 0;
const get_iDYP_ETH_Staking_Info = async () => {
	last_update_time_ethstake = Date.now();
	ethcounter = 0;
	highestethapy = [];
	//1 ora
	iDYPEthStakingInfo = [];
	total_eth_tvl = [];
	let apy_percent = 0,
		tvl_usd = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		expired = "",
		return_types = "",
		lock_time = "",
		new_pool = "",
		apy_performancefee = 0,
		performancefee = 0

	let ids_constant_staking_eth = Object.keys(IDs_constant_staking_idyp_eth)
	for (let id of ids_constant_staking_eth) {

		apy_percent = IDs_constant_staking_idyp_eth[id].apy

		if (id == "0x50014432772b4123D04181727C6EdEAB34F5F988")
			tvl_usd = stakingiDYPEthTvl15

		if (id == "0x9eA966B4023049BFF858BB5E698ECfF24EA54c4A")
			tvl_usd = stakingiDYPEthTvl20

		if (id == "0xD4bE7a106ed193BEe39D6389a481ec76027B2660")
			tvl_usd = stakingiDYPEthTvl30

		if (id == "0x3fAb09ACAeDDAF579d7a72c24Ef3e9EB1D2975c4")
			tvl_usd = stakingiDYPEthTvl45

		pool_name = IDs_constant_staking_idyp_eth[id].pool_name
		pair_name = IDs_constant_staking_idyp_eth[id].pair_name
		link_pair = IDs_constant_staking_idyp_eth[id].link_pair
		return_types = IDs_constant_staking_idyp_eth[id].return_types
		expired = IDs_constant_staking_idyp_eth[id].expired
		lock_time = IDs_constant_staking_idyp_eth[id].lock_time
		apy_performancefee = IDs_constant_staking_idyp_eth[id].apy_performancefee,
		performancefee = IDs_constant_staking_idyp_eth[id].performancefee
		new_pool = IDs_constant_staking_idyp_eth[id].new_pool

		iDYPEthStakingInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired,
			new_pool: new_pool,
			apy_performancefee: apy_performancefee,
			performancefee: performancefee
		})
		if (expired == "No") {
			highestethapy[ethcounter] = parseFloat(apy_percent);
			ethcounter++;
		}
	}


}


let DYPEthStakingInfo = [];

const get_DYP_ETH_Staking_Info =  async () => {
	all_eth_apys = [];
	DYPEthStakingInfo = [];

	let apy_percent = 0,
		tvl_usd = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		expired = "",
		return_types = "",
		lock_time = "",
		new_pool = "",
		apy_performancefee = 0,
		performancefee = 0
	let ids_constant_staking_eth = Object.keys(IDs_constant_staking_dyp_eth)
	for (let id of ids_constant_staking_eth) {

		let apr1 = 25;
		let apr2 = 50;
		apy_percent = new BigNumber(apr1)
			.div(1e2)
			.times(price_iDYP_eth)
			.div(usdPerToken)
			.times(1e2)
			.toFixed(2);

		if (id == "0xa4da28B8e42680916b557459D338aF6e2D8d458f") {
			tvl_usd = stakingDYPEthTvl1
			apy_percent = new BigNumber(apr1)
				.div(1e2)
				.times(price_iDYP_eth)
				.div(usdPerToken)
				.times(1e2)
				.toFixed(2);
			apy_performancefee = apy_percent
		}

		if (id == "0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d") {
			tvl_usd = stakingDYPEthTvl2
			apy_percent = new BigNumber(apr2)
				.div(1e2)
				.times(price_iDYP_eth)
				.div(usdPerToken)
				.times(1e2)
				.toFixed(2);
			apy_performancefee = apy_percent
		}

		if (id == "0x44bEd8ea3296bda44870d0Da98575520De1735d4") {
			tvl_usd = stakingDYPEthTvl25
			apy_percent = IDs_constant_staking_dyp_eth[id].apy
			apy_performancefee = IDs_constant_staking_dyp_eth[id].apy_performancefee

		}

		if(id == "0xeb7dd6b50db34f7ff14898d0be57a99a9f158c4d"){
			tvl_usd = stakingDYPEthTvl7
			apy_percent = IDs_constant_staking_dyp_eth[id].apy
			apy_performancefee = IDs_constant_staking_dyp_eth[id].apy_performancefee
		}

		pool_name = IDs_constant_staking_dyp_eth[id].pool_name
		pair_name = IDs_constant_staking_dyp_eth[id].pair_name
		link_pair = IDs_constant_staking_dyp_eth[id].link_pair
		return_types = IDs_constant_staking_dyp_eth[id].return_types
		expired = IDs_constant_staking_dyp_eth[id].expired
		lock_time = IDs_constant_staking_dyp_eth[id].lock_time
		performancefee = IDs_constant_staking_dyp_eth[id].performancefee
		new_pool = IDs_constant_staking_dyp_eth[id].new_pool
		DYPEthStakingInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired,
			new_pool: new_pool,
			apy_performancefee: apy_performancefee,
			performancefee: performancefee
		})
		
	}

}

// idyp bnb staking info
let last_update_time_bnbstake = 0;
let iDYPBNBStakingInfo = [];
let all_bsc_apys = [];
let bsccounter = 0;
let highestbnbapy = [];

const get_iDYP_BNB_Staking_Info = async () => {
	iDYPBNBStakingInfo = [];
	last_update_time_bnbstake = Date.now();
	let apy_percent = 0,
		tvl_usd = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		expired = "",
		return_types = "",
		lock_time = "",
		new_pool = "",
		apy_performancefee = 0,
		performancefee = 0
	let ids_constant_staking_eth = Object.keys(IDs_constant_staking_idyp_bnb)
	for (let id of ids_constant_staking_eth) {

		apy_percent = IDs_constant_staking_idyp_bnb[id].apy
		if (id == "0x7e766F7005C7a9e74123b156697B582eeCB8d2D7")
			tvl_usd = stakingiDYPBnbTvl15

		if (id == "0x58366902082B90Fca01bE07D929478bD48AcFB19")
			tvl_usd = stakingiDYPBnbTvl20

		if (id == "0x4C04E53f9aAa17fc2C914694B4Aae57a9d1bE445")
			tvl_usd = stakingiDYPBnbTvl30

		if (id == "0x160fF3c4A6E9Aa8E4271aa71226Cc811BFEf7ED9")
			tvl_usd = stakingiDYPBnbTvl45


		pool_name = IDs_constant_staking_idyp_bnb[id].pool_name
		pair_name = IDs_constant_staking_idyp_bnb[id].pair_name
		link_pair = IDs_constant_staking_idyp_bnb[id].link_pair
		return_types = IDs_constant_staking_idyp_bnb[id].return_types
		expired = IDs_constant_staking_idyp_bnb[id].expired
		lock_time = IDs_constant_staking_idyp_bnb[id].lock_time
		apy_performancefee = IDs_constant_staking_idyp_bnb[id].apy_performancefee
		performancefee = IDs_constant_staking_idyp_bnb[id].performancefee
		new_pool = IDs_constant_staking_idyp_bnb[id].new_pool
		iDYPBNBStakingInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired,
			new_pool: new_pool,
			apy_performancefee: apy_performancefee,
			performancefee: performancefee
		})
	}
}

const get_ETH_STAKING_HIGHEST_APY = async () => {

	let aaa = 0;
	for (i = 1; i <= ethcounter; i++)
		if (highestethapy[i] > aaa)
			aaa = highestethapy[i];

	all_eth_apys.push({
		highest_apy: aaa,
	})
}
const get_ETH_STAKING_TOTALTVL = () => {
	total_eth_tvl.push({
		Total_TVL_ETH: tvltotal,
	})
}
let DYPBnbStakingInfo = [];
let proposals_info_eth = [];
let proposals_info_bsc = [];
let proposals_info_avax = [];
let last_update_time_proposals_info = 0;
let state = "";
const get_proposals_info =  async () => {
	last_update_time_proposals_info = Date.now();
	proposals_info_eth = [];
	proposals_info_bsc = [];
	proposals_info_avax = [];
	state = "Inactive";
	let gov_contract_bsc = new bscWeb3.eth.Contract(GOV_ABI_BSC, GOV_ADDRESS_BSC, { from: undefined })
	let gov_contract_eth = new infuraWeb3.eth.Contract(GOV_ABI_ETH, GOV_ADDRESS_ETH, { from: undefined })
	let gov_contract_avax = new avaxWeb3.eth.Contract(GOV_ABI_BSC, GOV_ADDRESS_AVAX, { from: undefined })
	let proposal_index_eth = await gov_contract_eth.methods.lastIndex().call()
	let proposal_index_bsc = await gov_contract_bsc.methods.lastIndex().call()
	let proposal_index_avax = await gov_contract_avax.methods.lastIndex().call()
	for (let i = proposal_index_eth - 2; i <= proposal_index_eth; i++) {
		let time = await gov_contract_eth.methods.getProposal(i).call()
		let id = await gov_contract_eth.methods.getProposal(i).call()
		time = time._proposalStartTime
		time = new Date(time * 1000)
		let humanize = moment.duration(time - Date.now(), "milliseconds").humanize();
		id = id._proposalAction 
		if(id == 0){
			id = "Disburse / Burn"
		}
		if(id == 1){
			id = "Upgrade Governance"
		}
		if(id == 2){
			id = "Change Quorum"
		}
		if(id == 3){
			id = "Other / Free Text"
		}
		if(id == 4){
			id = "Change Min Balance"
		}
		if(humanize == "a day")
		state = "Active"
		if(humanize == "two days")
		state = "Active"
		if(humanize == "three days")
		state = "Active"
		
		proposals_info_eth.push({
			title: "DYP Proposal",
			date: humanize + " ago",
			type: id,
			status: state
		})
	}
	state = "Inactive";
	for (let i = proposal_index_bsc - 2; i <= proposal_index_bsc; i++) {
		let time = await gov_contract_bsc.methods.getProposal(i).call()
		let id = await gov_contract_bsc.methods.getProposal(i).call()
		time = time._proposalStartTime
		time = new Date(time * 1000)
		let humanize = moment.duration(time - Date.now(), "milliseconds").humanize();
		id = id._proposalAction 
		if(id == 0){
			id = "Disburse / Burn"
		}
		if(id == 1){
			id = "Upgrade Governance"
		}
		if(id == 2){
			id = "Change Quorum"
		}
		if(id == 3 || id == 5){
			id = "Other / Free Text"
		}
		if(id == 4){
			id = "Change Min Balance"
		}

		if(humanize == "a day")
		state = "Active"
		if(humanize == "two days")
		state = "Active"
		if(humanize == "three days")
		state = "Active"

		proposals_info_bsc.push({
			title: "DYP Proposal",
			date: humanize + " ago",
			type: id,
			status: state
		})
	}
	state = "Inactive";
	for (let i = proposal_index_avax - 2; i <= proposal_index_avax; i++) {
		let time = await gov_contract_avax.methods.getProposal(i).call()
		let id = await gov_contract_avax.methods.getProposal(i).call()
		time = time._proposalStartTime
		time = new Date(time * 1000)
		let humanize = moment.duration(time - Date.now(), "milliseconds").humanize();
		id = id._proposalAction 
		if(id == 0){
			id = "Disburse / Burn"
		}
		if(id == 1){
			id = "Upgrade Governance"
		}
		if(id == 2){
			id = "Change Quorum"
		}
		if(id == 3 || id == 5){
			id = "Other / Free Text"
		}
		if(id == 4){
			id = "Change Min Balance"
		}

		if(humanize == "a day")
		state = "Active"
		if(humanize == "two days")
		state = "Active"
		if(humanize == "three days")
		state = "Active"

		proposals_info_avax.push({
			title: "DYP Proposal",
			date: humanize + " ago",
			type: id,
			status: state
		})
	}
	}


		const IDs_rarest_nfts = {
			"1":
			{
				img: "https://mint.dyp.finance/images/5386.png",
				img_thumb: "https://mint.dyp.finance/thumbs/5386.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/5386",
			},
			"2":
			{
				img: "https://mint.dyp.finance/images/3.png",
				img_thumb: "https://mint.dyp.finance/thumbs/3.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/3",
			},
			"3":
			{
				img: "https://mint.dyp.finance/images/10.png",
				img_thumb: "https://mint.dyp.finance/thumbs/10.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/10",
			},
			"4":
			{
				img: "https://mint.dyp.finance/images/5.png",
				img_thumb: "https://mint.dyp.finance/thumbs/5.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/5",
			},
			"5":
			{
				img: "https://mint.dyp.finance/images/9.png",
				img_thumb: "https://mint.dyp.finance/thumbs/9.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/9",
			},
			"6":
			{
				img: "https://mint.dyp.finance/images/2.png",
				img_thumb: "https://mint.dyp.finance/thumbs/2.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/2",
			},
			"7":
			{
				img: "https://mint.dyp.finance/images/1.png",
				img_thumb: "https://mint.dyp.finance/thumbs/1.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/1",
			},
			"8":
			{
				img: "https://mint.dyp.finance/images/8.png",
				img_thumb: "https://mint.dyp.finance/thumbs/8.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/8",
			},
			"9":
			{
				img: "https://mint.dyp.finance/images/15.png",
				img_thumb: "https://mint.dyp.finance/thumbs/15.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/15",
		
			},
			"10":
			{
				img: "https://mint.dyp.finance/images/18.png",
				img_thumb: "https://mint.dyp.finance/thumbs/18.png",
				opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/18",
			},
		}
let randomnfts = [];
let rarestnfts = [];
let openseastats = [];
let randomnft = 0;
let last_update_time_random_nfts = 0;
const get_random_nfts = async () => {
	await fecthNftFloorPrice();
	last_update_time_random_nfts = Date.now();
	randomnfts = [];
	rarestnfts = [];
	openseastats = [];
	randomnft = 0;
	for(let i = 0; i < 20; i++){
	randomnft = Math.floor(Math.random() * (10000 - 1 + 1) + 1)
	randomnft = randomnft.toString()
	randomnfts.push({
		img_normal: 	"https://mint.dyp.finance/images/" + randomnft + ".png",
		img_thumb: 	"https://mint.dyp.finance/thumbs/" + randomnft + ".png",
		opensea_link: "https://opensea.io/assets/ethereum/0xd06cf9e1189feab09c844c597abc3767bc12608c/" + randomnft,
	})
}

let ids_rarest_nfts = Object.keys(IDs_rarest_nfts)
for (let id of ids_rarest_nfts) {
	rarestnfts.push({
		img_normal: IDs_rarest_nfts[id].img,
		img_thumb: IDs_rarest_nfts[id].img_thumb,
		opensea_link: IDs_rarest_nfts[id].opensea_link,
	})

}
			openseastats.push({
				floorprice: floorprice,
				owners: owners,
			totalsales: totalsales,
			totalsupply: totalsupply,
			thirthydaysales: thirthydaysales,
			totalvolume: totalvolume,
			})
}

let last_update_time_wod = 0;
let registered_users = 6435;
let registered_users2 = 0;
const get_wod_info = async () => {
	last_update_time_wod = Date.now();
		fetch('https://api3.dyp.finance/api/beta_tester_application/count')
			.then(response => {
				if (!response.ok) {
					throw Error('X');
				}
				return response.json();
				
			})
			.then(data => {
				registered_users2 = data.count + registered_users;
			});
	}



const get_DYP_BNB_Staking_Info = async () => {
	DYPBnbStakingInfo = [];
	bsccounter = 0;
	all_bsc_apys = [];
	highestbnbapy = [];

	let apy_percent = 0,
		tvl_usd = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		expired = "",
		return_types = "",
		lock_time = "",
		new_pool = "",
		apy_performancefee = 0,
		apy_stakingfee = 0
	let ids_constant_staking_eth = Object.keys(IDs_constant_staking_dyp_bnb)
	for (let id of ids_constant_staking_eth) {

		let apr1 = 25;
		let apr2 = 50;


		if (id == "0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90") {
			tvl_usd = stakingDYPBnbTvl1
			apy_percent = new BigNumber(apr1)
				.div(1e2)
				.times(price_iDYP_eth)
				.div(usdPerToken)
				.times(1e2)
				.toFixed(2);
				apy_performancefee = apy_percent
		}

		if (id == "0xaF411BF994dA1435A3150B874395B86376C5f2d5") {
			tvl_usd = stakingDYPBnbTvl2
			apy_percent = new BigNumber(apr2)
				.div(1e2)
				.times(price_iDYP_eth)
				.div(usdPerToken)
				.times(1e2)
				.toFixed(2);
				apy_performancefee = apy_percent
		}

		if (id == "0xfc4493E85fD5424456f22135DB6864Dd4E4ED662") {
			tvl_usd = stakingDYPBnbTvl10
			apy_percent = IDs_constant_staking_dyp_bnb[id].apy
			apy_performancefee = IDs_constant_staking_dyp_bnb[id].apy_performancefee

		}
		if (id == "0xa9efab22cCbfeAbB6dc4583d81421e76342faf8b") {
			tvl_usd = stakingDYPBnbTvl25
			apy_percent = IDs_constant_staking_dyp_bnb[id].apy
			apy_performancefee = IDs_constant_staking_dyp_bnb[id].apy_performancefee
		}

		if (id == "0xef9e50A19358CCC8816d9BC2c2355aea596efd06") {
			tvl_usd = stakingDYPBnbTvl30
			apy_percent = IDs_constant_staking_dyp_bnb[id].apy
			apy_performancefee = IDs_constant_staking_dyp_bnb[id].apy_performancefee

		}

		if(id == "0x7c82513b69c1b42c23760cfc34234558119a3399") {
			tvl_usd = stakingDYPBnbTvl50
			apy_percent = IDs_constant_staking_dyp_bnb[id].apy
			apy_performancefee = IDs_constant_staking_dyp_bnb[id].apy_performancefee
		}



		pool_name = IDs_constant_staking_dyp_bnb[id].pool_name
		pair_name = IDs_constant_staking_dyp_bnb[id].pair_name
		link_pair = IDs_constant_staking_dyp_bnb[id].link_pair
		return_types = IDs_constant_staking_dyp_bnb[id].return_types
		expired = IDs_constant_staking_dyp_bnb[id].expired
		lock_time = IDs_constant_staking_dyp_bnb[id].lock_time
		performancefee = IDs_constant_staking_dyp_bnb[id].performancefee
		new_pool = IDs_constant_staking_dyp_bnb[id].new_pool
		DYPBnbStakingInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired,
			new_pool: new_pool,
			apy_performancefee: apy_performancefee,
			performancefee: performancefee
		})
		if (expired == "No") {
			highestbnbapy[bsccounter] = parseFloat(apy_percent);
			bsccounter++;
		}

	}

}
const get_BNB_STAKING_HIGHEST_APY = async () => {

	let aaa = 0;
	for (i = 0; i < bsccounter; i++)
		if (highestbnbapy[i] > aaa)
			aaa = highestbnbapy[i];

	all_bsc_apys.push({
		highest_apy: aaa,
	})
}

//idyp avax staking info

let iDYPAvaxStakingInfo = [];
let all_avax_apys = [];
let avaxcounter = 0;
let highestavaxapy = [];
let last_update_time_avaxstake = 0;
const get_iDYP_AVAX_Staking_Info = async () => {
	last_update_time_avaxstake = Date.now();
	iDYPAvaxStakingInfo = [];

	let apy_percent = 0,
		tvl_usd = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		expired = "",
		return_types = "",
		lock_time = "",
		new_pool = "",
		apy_performancefee = 0,
		performancefee = 0
	let ids_constant_staking_eth = Object.keys(IDs_constant_staking_idyp_avax)
	for (let id of ids_constant_staking_eth) {

		apy_percent = IDs_constant_staking_idyp_avax[id].apy

		if (id == "0xaF411BF994dA1435A3150B874395B86376C5f2d5")
			tvl_usd = stakingiDYPAvaxTvl15

		if (id == "0x8f28110325a727f70B64bffEbf2B9dc94B932452")
			tvl_usd = stakingiDYPAvaxTvl20

		if (id == "0xd13bdC0c9a9931cF959739631B1290b6BEE0c018")
			tvl_usd = stakingiDYPAvaxTvl30

		if (id == "0x5536E02336771CFa0317D4B6a042f3c38749535e")
			tvl_usd = stakingiDYPAvaxTvl45


		pool_name = IDs_constant_staking_idyp_avax[id].pool_name
		pair_name = IDs_constant_staking_idyp_avax[id].pair_name
		link_pair = IDs_constant_staking_idyp_avax[id].link_pair
		return_types = IDs_constant_staking_idyp_avax[id].return_types
		expired = IDs_constant_staking_idyp_avax[id].expired
		lock_time = IDs_constant_staking_idyp_avax[id].lock_time
		apy_performancefee = IDs_constant_staking_idyp_avax[id].apy_performancefee
		performancefee = IDs_constant_staking_idyp_avax[id].performancefee
		new_pool = IDs_constant_staking_idyp_avax[id].new_pool

		iDYPAvaxStakingInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired,
			new_pool: new_pool,
			apy_performancefee: apy_performancefee,
			performancefee: performancefee
		})

	}

}
let DYPAvaxStakingInfo = [];

const get_DYP_AVAX_Staking_Info = async () => {

	DYPAvaxStakingInfo = [];
	avaxcounter = 0;
	all_avax_apys = [];
	highestavaxapy = [];
	let apy_percent = 0,
		tvl_usd = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		expired = "",
		return_types = "",
		lock_time = "",
		new_pool = "",
		apy_performancefee = 0,
		performancefee = 0
	let ids_constant_staking_eth = Object.keys(IDs_constant_staking_dyp_avax)
	for (let id of ids_constant_staking_eth) {

		let apr1 = 25;
		let apr2 = 50;


		if (id == "0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B") {
			tvl_usd = stakingDYPAvaxTvl1
			apy_percent = new BigNumber(apr1)
				.div(1e2)
				.times(price_iDYP_eth)
				.div(usdPerToken)
				.times(1e2)
				.toFixed(2);
				apy_performancefee = apy_percent
		}

		if (id == "0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9") {
			tvl_usd = stakingDYPAvaxTvl2
			apy_percent = new BigNumber(apr2)
				.div(1e2)
				.times(price_iDYP_eth)
				.div(usdPerToken)
				.times(1e2)
				.toFixed(2);
			apy_performancefee = apy_percent
		}

		if (id == "0xb1875eeBbcF4456188968f439896053809698a8B") {
			tvl_usd = stakingDYPAvaxTvl10
			apy_percent = IDs_constant_staking_dyp_avax[id].apy
			apy_performancefee = IDs_constant_staking_dyp_avax[id].apy_performancefee
		}
		if (id == "0x16429e51A64B7f88D4C018fbf66266A693df64b3") {
			tvl_usd = stakingDYPAvaxTvl25
			apy_percent = IDs_constant_staking_dyp_avax[id].apy
			apy_performancefee = IDs_constant_staking_dyp_avax[id].apy_performancefee

		}

		if (id == "0xF035ec2562fbc4963e8c1c63f5c473D9696c59E3") {
			tvl_usd = stakingDYPAvaxTvl30
			apy_percent = IDs_constant_staking_dyp_avax[id].apy
			apy_performancefee = IDs_constant_staking_dyp_avax[id].apy_performancefee

		}

		if(id == "0x6eb643813f0b4351b993f98bdeaef6e0f79573e9")
		{
			tvl_usd = stakingDYPAvaxTvl50
			apy_percent = IDs_constant_staking_dyp_avax[id].apy
			apy_performancefee = IDs_constant_staking_dyp_avax[id].apy_performancefee
		}



		pool_name = IDs_constant_staking_dyp_avax[id].pool_name
		pair_name = IDs_constant_staking_dyp_avax[id].pair_name
		link_pair = IDs_constant_staking_dyp_avax[id].link_pair
		return_types = IDs_constant_staking_dyp_avax[id].return_types
		expired = IDs_constant_staking_dyp_avax[id].expired
		lock_time = IDs_constant_staking_dyp_avax[id].lock_time
		performancefee = IDs_constant_staking_dyp_avax[id].performancefee
		new_pool = IDs_constant_staking_dyp_avax[id].new_pool

		DYPAvaxStakingInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired,
			new_pool: new_pool,
			apy_performancefee: apy_performancefee,
			performancefee: performancefee
		})

		if (expired == "No") {
			highestavaxapy[avaxcounter] = parseFloat(apy_percent);
			avaxcounter++;
		}
	}

}

const get_AVAX_STAKING_HIGHEST_APY = async () => {

	let aaa = 0;
	for (i = 0; i < avaxcounter; i++)
		if (highestavaxapy[i] > aaa)
			aaa = highestavaxapy[i];

	all_avax_apys.push({
		highest_apy: aaa,
	})
}
//buyback eth info

let BuybackETHInfo = [];
let BuybackETHhighestapy = [];
let a1 = 0;
let a2 = 0;
let last_update_time_ethbuyback = 0;
const get_ETH_Buyback_Info = async () => {
	last_update_time_ethbuyback = Date.now()
	BuybackETHInfo = [];
	BuybackETHhighestapy = [];
	a1 = 0;
	a2 = 0;
	let apy_percent = 0,
		tvl_usd = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		expired = "",
		return_types = "",
		lock_time = ""
	let ids_constant_staking_eth = Object.keys(IDs_buyback_eth)
	for (let id of ids_constant_staking_eth) {
		let apy1_buyback2 = new BigNumber(0.75);
		let apy1_buyback1 = new BigNumber(0.225);
		let apy2_buyback1 = new BigNumber(0.25)
			.div(usdPerToken)
			.times(30)
			.div(1e2)
			.times(price_iDYP_eth);

		let apy2_buyback2 = new BigNumber(0.25)
			.div(usdPerToken)
			.times(price_iDYP_eth);
		if (id == "0xdCBB5B2148f0cf1Abd7757Ba04A5821fEaD80587") {
			tvl_usd = buybackEthTvl1
			apy_percent = new BigNumber(apy1_buyback1)
				.plus(apy2_buyback1)
				.times(1e2)
				.toFixed(0);
			a1 = apy_percent
		}

		if (id == "0xDC65C4277d626d6A29C9Dc42Eb396d354fa5E85b") {
			tvl_usd = buybackEthTvl2
			apy_percent = new BigNumber(apy1_buyback2)
				.plus(apy2_buyback2)
				.times(1e2)
				.toFixed(0);
			a2 = apy_percent
		}

		pool_name = IDs_buyback_eth[id].pool_name
		pair_name = IDs_buyback_eth[id].pair_name
		link_pair = IDs_buyback_eth[id].link_pair
		return_types = IDs_buyback_eth[id].return_types
		expired = IDs_buyback_eth[id].expired
		lock_time = IDs_buyback_eth[id].lock_time

		BuybackETHInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired
		})


	}
	if (a1 > a2) {
		BuybackETHhighestapy.push({
			highest_apy: a1
		})
	}
	else {
		BuybackETHhighestapy.push({
			highest_apy: a2
		})
	}
}

let BuybackBNBInfo = [];
let BuybackBNBhighestapy = [];
let b1 = 0;
let b2 = 0;
let last_update_time_bnbbuyback = 0;
const get_BNB_Buyback_Info = async () => {
	last_update_time_bnbbuyback = Date.now()
	BuybackBNBInfo = [];
	b1 = 0;
	b2 = 0;
	let apy_percent = 0,
		tvl_usd = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		expired = "",
		return_types = "",
		lock_time = ""
	let ids_constant_staking_eth = Object.keys(IDs_buyback_bsc)
	for (let id of ids_constant_staking_eth) {
		let apy1_buyback2 = new BigNumber(0.75);
		let apy1_buyback1 = new BigNumber(0.225);
		let apy2_buyback1 = new BigNumber(0.25)
			.div(usdPerToken)
			.times(30)
			.div(1e2)
			.times(price_iDYP_eth);

		let apy2_buyback2 = new BigNumber(0.25)
			.div(usdPerToken)
			.times(price_iDYP_eth);
		if (id == "0x94b1a7b57c441890b7a0f64291b39ad6f7e14804") {
			tvl_usd = buybackBnbTvl1
			apy_percent = new BigNumber(apy1_buyback1)
				.plus(apy2_buyback1)
				.times(1e2)
				.toFixed(0);
			b1 = apy_percent

		}

		if (id == "0x4ef782e66244a0cf002016aa1db3019448c670ae") {
			tvl_usd = buybackBnbTvl2
			apy_percent = new BigNumber(apy1_buyback2)
				.plus(apy2_buyback2)
				.times(1e2)
				.toFixed(0);
			b2 = apy_percent
		}

		pool_name = IDs_buyback_bsc[id].pool_name
		pair_name = IDs_buyback_bsc[id].pair_name
		link_pair = IDs_buyback_bsc[id].link_pair
		return_types = IDs_buyback_bsc[id].return_types
		expired = IDs_buyback_bsc[id].expired
		lock_time = IDs_buyback_bsc[id].lock_time

		BuybackBNBInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired
		})

	}
	if (b1 > b2) {
		BuybackBNBhighestapy.push({
			highest_apy: b1
		})
	}
	else {
		BuybackBNBhighestapy.push({
			highest_apy: b2
		})
	}

}

let BuybackAVAXInfo = [];
let BuybackAVAXhighestapy = [];
let c1 = 0;
let c2 = 0;
let last_update_time_avaxbuyback = 0;
const get_AVAX_Buyback_Info = async () => {
	last_update_time_avaxbuyback = Date.now()
	BuybackAVAXInfo = [];
	BuybackAVAXhighestapy = [];
	c1 = 0;
	c2 = 0;
	let apy_percent = 0,
		tvl_usd = 0,
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		expired = "",
		return_types = "",
		lock_time = ""
	let ids_constant_staking_eth = Object.keys(IDs_buyback_avax)
	for (let id of ids_constant_staking_eth) {
		let apy1_buyback2 = new BigNumber(0.75);
		let apy1_buyback1 = new BigNumber(0.225);
		let apy2_buyback1 = new BigNumber(0.25)
			.div(usdPerToken)
			.times(30)
			.div(1e2)
			.times(price_iDYP_eth);

		let apy2_buyback2 = new BigNumber(0.25)
			.div(usdPerToken)
			.times(price_iDYP_eth);
		if (id == "0xC905D5DD9A4f26eD059F76929D11476B2844A7c3") {
			tvl_usd = buybackAvaxTvl1
			apy_percent = new BigNumber(apy1_buyback1)
				.plus(apy2_buyback1)
				.times(1e2)
				.toFixed(0);
			c1 = parseFloat(apy_percent)
		}

		if (id == "0x267434f01ac323C6A5BCf41Fa111701eE0165a37") {
			tvl_usd = buybackAvaxTvl2
			apy_percent = new BigNumber(apy1_buyback2)
				.plus(apy2_buyback2)
				.times(1e2)
				.toFixed(0);
			c2 = parseFloat(apy_percent)
		}

		pool_name = IDs_buyback_avax[id].pool_name
		pair_name = IDs_buyback_avax[id].pair_name
		link_pair = IDs_buyback_avax[id].link_pair
		return_types = IDs_buyback_avax[id].return_types
		expired = IDs_buyback_avax[id].expired
		lock_time = IDs_buyback_avax[id].lock_time

		BuybackAVAXInfo.push({
			id: id,
			apy_percent: apy_percent,
			tvl_usd: tvl_usd,
			link_logo: link_logo,
			link_pair: link_pair,
			pool_name: pool_name,
			pair_name: pair_name,
			return_types: return_types,
			lock_time: lock_time,
			expired: expired
		})


	}
	if (c1 > c2) {
		BuybackAVAXhighestapy.push({
			highest_apy: c1
		})
	}
	else {
		BuybackAVAXhighestapy.push({
			highest_apy: c2
		})
	}
}

//contract abis start here
const ABI_IDYP = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "owner", "type": "address" }], "name": "EmergencyDeclared", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "referrer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "ReferralFeeTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Reinvest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "rewardRate", "type": "uint256" }], "name": "RewardRateChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }], "name": "StakingFeeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }], "name": "UnstakingFeeChanged", "type": "event" }, { "inputs": [], "name": "ADMIN_CAN_CLAIM_AFTER", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "EMERGENCY_WAIT_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "LOCKUP_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REFERRAL_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_INTERVAL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "STAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "UNSTAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "adminClaimableTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contractStartTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "declareEmergency", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToWithdraw", "type": "uint256" }], "name": "emergencyUnstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "i", "type": "uint256" }], "name": "getActiveReferredStaker", "outputs": [{ "internalType": "address", "name": "_staker", "type": "address" }, { "internalType": "uint256", "name": "_totalEarned", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNumberOfHolders", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "referrer", "type": "address" }], "name": "getNumberOfReferredStakers", "outputs": [{ "internalType": "uint256", "name": "_activeStakers", "type": "uint256" }, { "internalType": "uint256", "name": "_totalStakers", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "i", "type": "uint256" }], "name": "getReferredStaker", "outputs": [{ "internalType": "address", "name": "_staker", "type": "address" }, { "internalType": "uint256", "name": "_totalEarned", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "endIndex", "type": "uint256" }], "name": "getStakersList", "outputs": [{ "internalType": "address[]", "name": "stakers", "type": "address[]" }, { "internalType": "uint256[]", "name": "stakingTimestamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "lastClaimedTimeStamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "stakedTokens", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getTotalPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isEmergency", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastClaimedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reInvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "referrals", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "rewardsPendingClaim", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newRewardRate", "type": "uint256" }], "name": "setRewardRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newStakingFeeRateX100", "type": "uint256" }], "name": "setStakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newUnstakingFeeRateX100", "type": "uint256" }], "name": "setUnstakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToStake", "type": "uint256" }, { "internalType": "address", "name": "referrer", "type": "address" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "stakingTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedReferralFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalReferralFeeEarned", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferAnyERC20Token", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferAnyLegacyERC20Token", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToWithdraw", "type": "uint256" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const ABI_DYP_DYNAMIC = [{ "inputs": [{ "internalType": "address", "name": "_uniswapV2RouterAddress", "type": "address" }, { "internalType": "address", "name": "_feeRecipientAddress", "type": "address" }, { "internalType": "address", "name": "trustedDepositTokenAddress", "type": "address" }, { "internalType": "address", "name": "trustedRewardTokenAddress", "type": "address" }, { "internalType": "uint256", "name": "referralFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "stakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "unstakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "rewardRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "rewardInterval", "type": "uint256" }, { "internalType": "uint256", "name": "lockupTime", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }], "name": "EmergencyDeclared", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "newAddress", "type": "address" }], "name": "FeeRecipientAddressChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "_newLockupTime", "type": "uint256" }], "name": "LockupTimeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256" }], "name": "ReferralFeeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "referrer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "ReferralFeeTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Reinvest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Stake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256" }], "name": "StakingFeeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }], "name": "TrustedDepositContractAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }], "name": "TrustedDepositContractRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "router", "type": "address" }], "name": "UniswapV2RouterChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Unstake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256" }], "name": "UnstakingFeeChanged", "type": "event" }, { "inputs": [], "name": "EMERGENCY_WAIT_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "LOCKUP_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REFERRAL_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_INTERVAL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "STAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_DEPOSIT_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_REWARD_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "UNSTAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "addTrustedDepositContractAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "adminCanClaimAfter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "adminClaimableTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin_referralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_claim", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "claimAnyToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contractStartTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "declareEmergency", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_stakingReferralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "depositByContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feeRecipientAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "i", "type": "uint256" }], "name": "getActiveReferredStaker", "outputs": [{ "internalType": "address", "name": "_staker", "type": "address" }, { "internalType": "uint256", "name": "_totalEarned", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNumberOfHolders", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "referrer", "type": "address" }], "name": "getNumberOfReferredStakers", "outputs": [{ "internalType": "uint256", "name": "_activeStakers", "type": "uint256" }, { "internalType": "uint256", "name": "_totalStakers", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "i", "type": "uint256" }], "name": "getReferredStaker", "outputs": [{ "internalType": "address", "name": "_staker", "type": "address" }, { "internalType": "uint256", "name": "_totalEarned", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "endIndex", "type": "uint256" }], "name": "getStakersList", "outputs": [{ "internalType": "address[]", "name": "stakers", "type": "address[]" }, { "internalType": "uint256[]", "name": "stakingTimestamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "lastClaimedTimeStamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "stakedTokens", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getTotalPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isEmergency", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isTrustedDepositContract", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastClaimedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin_referralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_reinvest", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "reInvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "referrals", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "removeTrustedDepositContractAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "rewardsPendingClaim", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "lockupTime", "type": "uint256" }, { "internalType": "uint256", "name": "referralFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "stakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "unstakingFeeRateX100", "type": "uint256" }, { "internalType": "address", "name": "router", "type": "address" }, { "internalType": "address", "name": "_feeRecipientAddress", "type": "address" }], "name": "setContractVariables", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newFeeRecipientAddress", "type": "address" }], "name": "setFeeRecipientAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newLockupTime", "type": "uint256" }], "name": "setLockupTime", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newReferralFeeRateX100", "type": "uint256" }], "name": "setReferralFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newStakingFeeRateX100", "type": "uint256" }], "name": "setStakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IUniswapV2Router", "name": "_newUniswapV2Router", "type": "address" }], "name": "setUniswapV2Router", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newUnstakingFeeRateX100", "type": "uint256" }], "name": "setUnstakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToStake", "type": "uint256" }, { "internalType": "address", "name": "referrer", "type": "address" }, { "internalType": "uint256", "name": "_amountOutMin_referralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "stakingTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedReferralFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalReferralFeeEarned", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "uniswapV2Router", "outputs": [{ "internalType": "contract IUniswapV2Router", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToWithdraw", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_referralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const ABI_DYP = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "owner", "type": "address" }], "name": "EmergencyDeclared", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "referrer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "ReferralFeeTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Reinvest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "rewardRate", "type": "uint256" }], "name": "RewardRateChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }], "name": "StakingFeeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }], "name": "UnstakingFeeChanged", "type": "event" }, { "inputs": [], "name": "ADMIN_CAN_CLAIM_AFTER", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "EMERGENCY_WAIT_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "LOCKUP_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REFERRAL_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_INTERVAL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "STAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "UNSTAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "adminClaimableTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contractStartTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "declareEmergency", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToWithdraw", "type": "uint256" }], "name": "emergencyUnstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "i", "type": "uint256" }], "name": "getActiveReferredStaker", "outputs": [{ "internalType": "address", "name": "_staker", "type": "address" }, { "internalType": "uint256", "name": "_totalEarned", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNumberOfHolders", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "referrer", "type": "address" }], "name": "getNumberOfReferredStakers", "outputs": [{ "internalType": "uint256", "name": "_activeStakers", "type": "uint256" }, { "internalType": "uint256", "name": "_totalStakers", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "i", "type": "uint256" }], "name": "getReferredStaker", "outputs": [{ "internalType": "address", "name": "_staker", "type": "address" }, { "internalType": "uint256", "name": "_totalEarned", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "endIndex", "type": "uint256" }], "name": "getStakersList", "outputs": [{ "internalType": "address[]", "name": "stakers", "type": "address[]" }, { "internalType": "uint256[]", "name": "stakingTimestamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "lastClaimedTimeStamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "stakedTokens", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getTotalPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isEmergency", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastClaimedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reInvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "referrals", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "rewardsPendingClaim", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newRewardRate", "type": "uint256" }], "name": "setRewardRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newStakingFeeRateX100", "type": "uint256" }], "name": "setStakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newUnstakingFeeRateX100", "type": "uint256" }], "name": "setUnstakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToStake", "type": "uint256" }, { "internalType": "address", "name": "referrer", "type": "address" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "stakingTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedReferralFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalReferralFeeEarned", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferAnyERC20Token", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferAnyLegacyERC20Token", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToWithdraw", "type": "uint256" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const ABI_DYP_ETHSPECIAL = [{ "inputs": [{ "internalType": "address", "name": "_uniswapV2RouterAddress", "type": "address" }, { "internalType": "address", "name": "_feeRecipientAddress", "type": "address" }, { "internalType": "address", "name": "trustedDepositTokenAddress", "type": "address" }, { "internalType": "address", "name": "trustedRewardTokenAddress", "type": "address" }, { "internalType": "uint256", "name": "referralFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "stakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "unstakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "rewardRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "rewardInterval", "type": "uint256" }, { "internalType": "uint256", "name": "lockupTime", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }], "name": "EmergencyDeclared", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "newAddress", "type": "address" }], "name": "FeeRecipientAddressChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "_newLockupTime", "type": "uint256" }], "name": "LockupTimeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256" }], "name": "ReferralFeeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "referrer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "ReferralFeeTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Reinvest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Stake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256" }], "name": "StakingFeeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }], "name": "TrustedDepositContractAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }], "name": "TrustedDepositContractRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "router", "type": "address" }], "name": "UniswapV2RouterChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Unstake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256" }], "name": "UnstakingFeeChanged", "type": "event" }, { "inputs": [], "name": "EMERGENCY_WAIT_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "LOCKUP_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REFERRAL_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_INTERVAL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "STAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_DEPOSIT_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_REWARD_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_WETH_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "UNSTAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "addTrustedDepositContractAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "adminCanClaimAfter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "adminClaimableTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin_referralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_claim", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "claimAnyToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contractStartTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "declareEmergency", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feeRecipientAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "i", "type": "uint256" }], "name": "getActiveReferredStaker", "outputs": [{ "internalType": "address", "name": "_staker", "type": "address" }, { "internalType": "uint256", "name": "_totalEarned", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNumberOfHolders", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "referrer", "type": "address" }], "name": "getNumberOfReferredStakers", "outputs": [{ "internalType": "uint256", "name": "_activeStakers", "type": "uint256" }, { "internalType": "uint256", "name": "_totalStakers", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "i", "type": "uint256" }], "name": "getReferredStaker", "outputs": [{ "internalType": "address", "name": "_staker", "type": "address" }, { "internalType": "uint256", "name": "_totalEarned", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "endIndex", "type": "uint256" }], "name": "getStakersList", "outputs": [{ "internalType": "address[]", "name": "stakers", "type": "address[]" }, { "internalType": "uint256[]", "name": "stakingTimestamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "lastClaimedTimeStamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "stakedTokens", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getTotalPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isEmergency", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isTrustedDepositContract", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastClaimedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin_referralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_reinvest", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "reInvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "referrals", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "removeTrustedDepositContractAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "rewardsPendingClaim", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "lockupTime", "type": "uint256" }, { "internalType": "uint256", "name": "referralFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "stakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "unstakingFeeRateX100", "type": "uint256" }, { "internalType": "address", "name": "router", "type": "address" }, { "internalType": "address", "name": "_feeRecipientAddress", "type": "address" }], "name": "setContractVariables", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newFeeRecipientAddress", "type": "address" }], "name": "setFeeRecipientAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newLockupTime", "type": "uint256" }], "name": "setLockupTime", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newReferralFeeRateX100", "type": "uint256" }], "name": "setReferralFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newRewardRate", "type": "uint256" }], "name": "setRewardRate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newStakingFeeRateX100", "type": "uint256" }], "name": "setStakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IUniswapV2Router", "name": "_newUniswapV2Router", "type": "address" }], "name": "setUniswapV2Router", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newUnstakingFeeRateX100", "type": "uint256" }], "name": "setUnstakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToStake", "type": "uint256" }, { "internalType": "address", "name": "referrer", "type": "address" }, { "internalType": "uint256", "name": "_amountOutMin_referralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "stakingTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedReferralFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalReferralFeeEarned", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "uniswapV2Router", "outputs": [{ "internalType": "contract IUniswapV2Router", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToWithdraw", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_referralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const ABI_BUYBACK = [{ "inputs": [{ "internalType": "address", "name": "router", "type": "address" }, { "internalType": "address", "name": "trustedPlatformTokenAddress", "type": "address" }, { "internalType": "address", "name": "trustedDepositTokenAddress", "type": "address" }, { "internalType": "address", "name": "_feeRecipientAddress", "type": "address" }, { "internalType": "uint256", "name": "stakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "unstakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "lockupTime", "type": "uint256" }, { "internalType": "uint256", "name": "adminCanClaimAfter", "type": "uint256" }, { "internalType": "uint256", "name": "rewardRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "rewardInterval", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }], "name": "DepositTokenAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }], "name": "DepositTokenRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }], "name": "EmergencyDeclared", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "newAddress", "type": "address" }], "name": "FeeRecipientAddressChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "lockupTime", "type": "uint256" }], "name": "LockupTimeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Reinvest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Stake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }], "name": "StakingContractChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }], "name": "StakingFeeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "router", "type": "address" }], "name": "UniswapV2RouterChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Unstake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }], "name": "UnstakingFeeChanged", "type": "event" }, { "inputs": [], "name": "EMERGENCY_WAIT_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "LOCKUP_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_INTERVAL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "STAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_DEPOSIT_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_PLATFORM_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_STAKING_CONTRACT_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "UNSTAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenAddress", "type": "address" }], "name": "addTrustedDepositToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "adminClaimableTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "claimAnyToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contractStartTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "declareEmergency", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feeRecipientAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNumberOfHolders", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "endIndex", "type": "uint256" }], "name": "getStakersList", "outputs": [{ "internalType": "address[]", "name": "stakers", "type": "address[]" }, { "internalType": "uint256[]", "name": "stakingTimestamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "lastClaimedTimeStamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "stakedTokens", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getTotalPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isEmergency", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastClaimedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reInvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenAddress", "type": "address" }], "name": "removeTrustedDepositToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "rewardsPendingClaim", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "lockupTime", "type": "uint256" }, { "internalType": "uint256", "name": "stakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "unstakingFeeRateX100", "type": "uint256" }, { "internalType": "address", "name": "router", "type": "address" }, { "internalType": "address", "name": "newFeeRecipientAddress", "type": "address" }], "name": "setContractVariables", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newFeeRecipientAddress", "type": "address" }], "name": "setFeeRecipientAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "lockupTime", "type": "uint256" }], "name": "setLockupTime", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "trustedStakingContractAddress", "type": "address" }], "name": "setStakingContractAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newStakingFeeRateX100", "type": "uint256" }], "name": "setStakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IUniswapV2Router", "name": "router", "type": "address" }], "name": "setUniswapV2Router", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newUnstakingFeeRateX100", "type": "uint256" }], "name": "setUnstakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToDeposit", "type": "uint256" }, { "internalType": "address", "name": "depositToken", "type": "address" }, { "internalType": "uint256", "name": "_amountOutMin_75Percent", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_25Percent", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_stakingReferralFee", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "stakingTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalDepositedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "trustedDepositTokens", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "uniswapV2Router", "outputs": [{ "internalType": "contract IUniswapV2Router", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountToWithdraw", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const ABI_FARMING = [{ "inputs": [{ "internalType": "address[]", "name": "swapPath", "type": "address[]" }, { "internalType": "address", "name": "_uniswapV2RouterAddress", "type": "address" }, { "internalType": "address", "name": "_feeRecipientAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }], "name": "ClaimableTokenAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }], "name": "ClaimableTokenRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "owner", "type": "address" }], "name": "EmergencyDeclared", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EthRewardsDisbursed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EthRewardsTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "newAddress", "type": "address" }], "name": "FeeRecipientAddressChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "lockupTime", "type": "uint256" }], "name": "LockupTimeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newMagicNumber", "type": "uint256" }], "name": "MagicNumberChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsDisbursed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "holder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardsTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }], "name": "StakingFeeChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "router", "type": "address" }], "name": "UniswapV2RouterChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }], "name": "UnstakingFeeChanged", "type": "event" }, { "inputs": [], "name": "BURN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "EMERGENCY_WAIT_TIME", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MAGIC_NUMBER", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "STAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "SWAP_PATH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "UNSTAKING_FEE_RATE_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "addContractBalance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "trustedClaimableTokenAddress", "type": "address" }], "name": "addTrustedClaimableToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "adminCanClaimAfter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "adminClaimableTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "burnOrDisburseTokensPeriod", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "burnRewardTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin_claimAsToken_dyp", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_attemptSwap", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "claimAnyToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "claimAsToken", "type": "address" }, { "internalType": "uint256", "name": "_amountOutMin_claimAsToken_weth", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_claimAsToken_dyp", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_attemptSwap", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "claimAs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "cliffTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "contractBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "contractDeployTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "declareEmergency", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "depositToken", "type": "address" }, { "internalType": "uint256", "name": "amountToStake", "type": "uint256" }, { "internalType": "uint256[]", "name": "minAmounts", "type": "uint256[]" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "disburseAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "disburseDuration", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "disbursePercentX100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "disburseRewardTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "feeRecipientAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "endIndex", "type": "uint256" }], "name": "getDepositorsList", "outputs": [{ "internalType": "address[]", "name": "stakers", "type": "address[]" }, { "internalType": "uint256[]", "name": "stakingTimestamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "lastClaimedTimeStamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "stakedTokens", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getMaxSwappableAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNumberOfHolders", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getPendingDisbursement", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getPendingDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_holder", "type": "address" }], "name": "getPendingDivsEth", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isEmergency", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lastBurnOrTokenDistributeTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastClaimedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lastDisburseTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastEthDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lastSwapExecutionTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "trustedClaimableTokenAddress", "type": "address" }], "name": "removeTrustedClaimableToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newMagicNumber", "type": "uint256" }, { "internalType": "uint256", "name": "lockupTime", "type": "uint256" }, { "internalType": "uint256", "name": "stakingFeeRateX100", "type": "uint256" }, { "internalType": "uint256", "name": "unstakingFeeRateX100", "type": "uint256" }, { "internalType": "address", "name": "_uniswapV2RouterAddress", "type": "address" }, { "internalType": "address", "name": "newFeeRecipientAddress", "type": "address" }], "name": "setContractVariables", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newFeeRecipientAddress", "type": "address" }], "name": "setFeeRecipientAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newLockupTime", "type": "uint256" }], "name": "setLockupTime", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newMagicNumber", "type": "uint256" }], "name": "setMagicNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newStakingFeeRateX100", "type": "uint256" }], "name": "setStakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IUniswapV2Router", "name": "router", "type": "address" }], "name": "setUniswapV2Router", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newUnstakingFeeRateX100", "type": "uint256" }], "name": "setUnstakingFeeRateX100", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "swapAttemptPeriod", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokensToBeDisbursedOrBurnt", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokensToBeSwapped", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimedRewardsEth", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedEth", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalEthDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "trustedBaseTokenAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "trustedClaimableTokens", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "trustedDepositTokenAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "trustedPlatformTokenAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "trustedRewardTokenAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "trustedStakingContractAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "uniswapRouterV2", "outputs": [{ "internalType": "contract IUniswapV2Router", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "uniswapV2Pair", "outputs": [{ "internalType": "contract IUniswapV2Pair", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "withdrawAsToken", "type": "address" }, { "internalType": "uint256", "name": "amountToWithdraw", "type": "uint256" }, { "internalType": "uint256[]", "name": "minAmounts", "type": "uint256[]" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const ABI_VAULT = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "CompoundRewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EtherRewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EtherRewardDisbursed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "PlatformTokenAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "PlatformTokenRewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokenRewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokenRewardDisbursed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdraw", "type": "event" }, { "inputs": [], "name": "ADMIN_CAN_CLAIM_AFTER", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "BURN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "FEE_PERCENT_TO_BUYBACK_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "FEE_PERCENT_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "LOCKUP_DURATION", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MIN_ETH_FEE_IN_WEI", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ONE_HUNDRED_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "POINT_MULTIPLIER", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_INTERVAL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REWARD_RETURN_PERCENT_X_100", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_CTOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_DEPOSIT_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRUSTED_PLATFORM_TOKEN_ADDRESS", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "addPlatformTokenBalance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "cTokenBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin_platformTokens", "type": "uint256" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "claimAnyToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimCompoundDivs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimEthDivs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "claimExtraTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amountOutMin_platformTokens", "type": "uint256" }], "name": "claimPlatformTokenDivs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimTokenDivs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contractStartTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_ethFeeBuyBack", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "depositTokenBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "emergencyWithdraw", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "ethDivsBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "ethDivsOwing", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_cTokenBalance", "type": "uint256" }], "name": "getConvertedBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "endIndex", "type": "uint256" }], "name": "getDepositorsList", "outputs": [{ "internalType": "address[]", "name": "stakers", "type": "address[]" }, { "internalType": "uint256[]", "name": "stakingTimestamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "lastClaimedTimeStamps", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "stakedTokens", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getEstimatedCompoundDivsOwing", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getExchangeRateCurrent", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getExchangeRateStored", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNumberOfHolders", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastClaimedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastEthDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lastTokenDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "platformTokenDivsBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "platformTokenDivsOwing", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "tokenBalances", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "tokenDivsBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "tokenDivsOwing", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalCTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalDepositedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedCompoundDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedEthDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedPlatformTokenDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalEarnedTokenDivs", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalEthDisbursed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalEthDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalTokenDivPoints", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalTokensDepositedByUser", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalTokensDisbursed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalTokensWithdrawnByUser", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "uniswapRouterV2", "outputs": [{ "internalType": "contract IUniswapV2Router", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_ethFeeBuyBack", "type": "uint256" }, { "internalType": "uint256", "name": "_amountOutMin_tokenFeeBuyBack", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "payable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
//contract abis stop here

//contract addresses start here
const IDYP_BNBS_1 = "0x7e766F7005C7a9e74123b156697B582eeCB8d2D7"
const IDYP_BNBS_2 = "0x58366902082B90Fca01bE07D929478bD48AcFB19"
const IDYP_BNBS_3 = "0x4C04E53f9aAa17fc2C914694B4Aae57a9d1bE445"
const IDYP_BNBS_4 = "0x160fF3c4A6E9Aa8E4271aa71226Cc811BFEf7ED9"

const DYP_BNBS_1_DYNAMIC = "0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90"
const DYP_BNBS_2_DYNAMIC = "0xaF411BF994dA1435A3150B874395B86376C5f2d5"

const DYP_BNBS_3 = "0xfc4493E85fD5424456f22135DB6864Dd4E4ED662"
const DYP_BNBS_4 = "0xa9efab22cCbfeAbB6dc4583d81421e76342faf8b"
const DYP_BNBS_5 = "0xef9e50A19358CCC8816d9BC2c2355aea596efd06"

const IDYP_ETHS_1 = "0x50014432772b4123D04181727C6EdEAB34F5F988"
const IDYP_ETHS_2 = "0x9eA966B4023049BFF858BB5E698ECfF24EA54c4A"
const IDYP_ETHS_3 = "0xD4bE7a106ed193BEe39D6389a481ec76027B2660"
const IDYP_ETHS_4 = "0x3fAb09ACAeDDAF579d7a72c24Ef3e9EB1D2975c4"

const DYP_ETHS_1_DYNAMIC = "0xa4da28B8e42680916b557459D338aF6e2D8d458f"
const DYP_ETHS_2_DYNAMIC = "0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d"

const DYP_ETHS_1 = "0x44bEd8ea3296bda44870d0Da98575520De1735d4"

const IDYP_AVAXS_1 = "0xaF411BF994dA1435A3150B874395B86376C5f2d5"
const IDYP_AVAXS_2 = "0x8f28110325a727f70B64bffEbf2B9dc94B932452"
const IDYP_AVAXS_3 = "0xd13bdC0c9a9931cF959739631B1290b6BEE0c018"
const IDYP_AVAXS_4 = "0x5536E02336771CFa0317D4B6a042f3c38749535e	"

const DYP_AVAXS_1_DYNAMIC = "0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B"
const DYP_AVAXS_2_DYNAMIC = "0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9"

const DYP_AVAXS_1 = "0xb1875eeBbcF4456188968f439896053809698a8B"
const DYP_AVAXS_2 = "0x16429e51A64B7f88D4C018fbf66266A693df64b3"
const DYP_AVAXS_3 = "0xF035ec2562fbc4963e8c1c63f5c473D9696c59E3"

const BUYBACK_ETH_1 = "0xdCBB5B2148f0cf1Abd7757Ba04A5821fEaD80587"
const BUYBACK_ETH_2 = "0xDC65C4277d626d6A29C9Dc42Eb396d354fa5E85b"

const BUYBACK_BSC_1 = "0x94b1a7b57c441890b7a0f64291b39ad6f7e14804"
const BUYBACK_BSC_2 = "0x4ef782e66244a0cf002016aa1db3019448c670ae"

const BUYBACK_AVAX_1 = "0xC905D5DD9A4f26eD059F76929D11476B2844A7c3"
const BUYBACK_AVAX_2 = "0x267434f01ac323C6A5BCf41Fa111701eE0165a37"

const FARMING_ETH_1 = "0xa68BBe793ad52d0E62bBf34A67F02235bA69E737"
const FARMING_ETH_2 = "0xCFd970494a0b3C52a81dcE1EcBFF2245e6b0B0E7"
const FARMING_ETH_3 = "0x49D02CF81Cc352517350F25E200365360426aF94"
const FARMING_ETH_4 = "0xf51965c570419F2576ec9AeAD6A3C5F674424A99"
const FARMING_ETH_5 = "0x997A7254E5567d0A70329DEFCc1E4d29d71Ba224"

const FARMING_BSC_1 = "0x537DC4fee298Ea79A7F65676735415f1E2882F92"
const FARMING_BSC_2 = "0x219717BF0bC33b2764A6c1A772F75305458BDA3d"
const FARMING_BSC_3 = "0xD1151a2434931f34bcFA6c27639b67C1A23D93Af"
const FARMING_BSC_4 = "0xed869Ba773c3F1A1adCC87930Ca36eE2dC73435d"
const FARMING_BSC_5 = "0x415B1624710296717FA96cAD84F53454E8F02D18"

const FARMING_AVAX_1 = "0x035d65babF595758D7A439D5870BAdc44218D028"
const FARMING_AVAX_2 = "0x6c325DfEA0d18387D423C869E328Ef005cBA024F"
const FARMING_AVAX_3 = "0x85C4f0CEA0994dE365dC47ba22dD0FD9899F93Ab"
const FARMING_AVAX_4 = "0x6f5dC6777b2B4667Bf183D093111867239518af5"
const FARMING_AVAX_5 = "0x10E105676CAC55b74cb6500a8Fb5d2f84804393D"

const VAULT_ETH_WETH = "0x28eabA060E5EF0d41eeB20d41aafaE8f685739d9"
const VAULT_ETH_WBTC = "0x2F2cff66fEB7320FC9Adf91b7B74bFb5a80C7C35"
const VAULT_ETH_USDT = "0xA987aEE0189Af45d5FA95a9FBBCB4374228f375E"
const VAULT_ETH_USDC = "0x251B9ee6cEd97565A821C5608014a107ddc9C98F"
const VAULT_ETH_DAI = "0x54F30bFfeb925F47225e148f0bAe17a452d6b8c0"
//contract addresses stop here

const IDs_User_Pools_BSC_IDYP = {
	"0x7e766F7005C7a9e74123b156697B582eeCB8d2D7":
	{
		contract_address: "0x7e766F7005C7a9e74123b156697B582eeCB8d2D7",
	},
	"0x58366902082B90Fca01bE07D929478bD48AcFB19":
	{
		contract_address: "0x58366902082B90Fca01bE07D929478bD48AcFB19",
	},
	"0x4C04E53f9aAa17fc2C914694B4Aae57a9d1bE445":
	{
		contract_address: "0x4C04E53f9aAa17fc2C914694B4Aae57a9d1bE445",
	},
	"0x160fF3c4A6E9Aa8E4271aa71226Cc811BFEf7ED9":
	{
		contract_address: "0x160fF3c4A6E9Aa8E4271aa71226Cc811BFEf7ED9",
	},
}
const IDs_User_Pools_BSC_DYP_DYNAMIC = {
	"0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90":
	{
		contract_address: "0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90",
	},
	"0xaF411BF994dA1435A3150B874395B86376C5f2d5":
	{
		contract_address: "0xaF411BF994dA1435A3150B874395B86376C5f2d5",
	},
}
const IDs_User_Pools_BSC_DYP = {
	"0xfc4493E85fD5424456f22135DB6864Dd4E4ED662":
	{
		contract_address: "0xfc4493E85fD5424456f22135DB6864Dd4E4ED662",
	},
	"0xa9efab22cCbfeAbB6dc4583d81421e76342faf8b":
	{
		contract_address: "0xa9efab22cCbfeAbB6dc4583d81421e76342faf8b",
	},
	"0xef9e50A19358CCC8816d9BC2c2355aea596efd06":
	{
		contract_address: "0xef9e50A19358CCC8816d9BC2c2355aea596efd06",
	},
	"0x7c82513b69c1b42c23760cfc34234558119a3399":
	{
		contract_address: "0x7c82513b69c1b42c23760cfc34234558119a3399",
	},
}

const IDs_User_Pools_ETH_IDYP = {
	"0x50014432772b4123D04181727C6EdEAB34F5F988":
	{
		contract_address: "0x50014432772b4123D04181727C6EdEAB34F5F988",
	},
	"0x9eA966B4023049BFF858BB5E698ECfF24EA54c4A":
	{
		contract_address: "0x9eA966B4023049BFF858BB5E698ECfF24EA54c4A",
	},
	"0xD4bE7a106ed193BEe39D6389a481ec76027B2660":
	{
		contract_address: "0xD4bE7a106ed193BEe39D6389a481ec76027B2660",
	},
	"0x3fAb09ACAeDDAF579d7a72c24Ef3e9EB1D2975c4":
	{
		contract_address: "0x3fAb09ACAeDDAF579d7a72c24Ef3e9EB1D2975c4",
	},
}
const IDs_User_Pools_ETH_DYP_DYNAMIC = {
	"0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d":
	{
		contract_address: "0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d",
	},
	"0xa4da28B8e42680916b557459D338aF6e2D8d458f":
	{
		contract_address: "0xa4da28B8e42680916b557459D338aF6e2D8d458f",
	},
}
const IDs_User_Pools_ETH_DYP = {
	"0x44bEd8ea3296bda44870d0Da98575520De1735d4":
	{
		contract_address: "0x44bEd8ea3296bda44870d0Da98575520De1735d4",
	},
	"0xeb7dd6b50db34f7ff14898d0be57a99a9f158c4d":
	{
		contract_address: "0xeb7dd6b50db34f7ff14898d0be57a99a9f158c4d",
	},
}


const IDs_User_Pools_AVAX_IDYP = {
	"0xaF411BF994dA1435A3150B874395B86376C5f2d5":
	{
		contract_address: "0xaF411BF994dA1435A3150B874395B86376C5f2d5",
	},
	"0x8f28110325a727f70B64bffEbf2B9dc94B932452":
	{
		contract_address: "0x8f28110325a727f70B64bffEbf2B9dc94B932452",
	},
	"0xd13bdC0c9a9931cF959739631B1290b6BEE0c018":
	{
		contract_address: "0xd13bdC0c9a9931cF959739631B1290b6BEE0c018",
	},
	"0x5536E02336771CFa0317D4B6a042f3c38749535e":
	{
		contract_address: "0x5536E02336771CFa0317D4B6a042f3c38749535e",
	},
}
const IDs_User_Pools_AVAX_DYP_DYNAMIC = {
	"0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B":
	{
		contract_address: "0x1A4fd0E9046aeD92B6344F17B0a53969F4d5309B",
	},
	"0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9":
	{
		contract_address: "0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9",
	},
}
const IDs_User_Pools_AVAX_DYP = {
	"0xb1875eeBbcF4456188968f439896053809698a8B":
	{
		contract_address: "0xb1875eeBbcF4456188968f439896053809698a8B",
	},
	"0x16429e51A64B7f88D4C018fbf66266A693df64b3":
	{
		contract_address: "0x16429e51A64B7f88D4C018fbf66266A693df64b3",
	},
	"0xF035ec2562fbc4963e8c1c63f5c473D9696c59E3":
	{
		contract_address: "0xF035ec2562fbc4963e8c1c63f5c473D9696c59E3",
	},
	"0x6eb643813f0b4351b993f98bdeaef6e0f79573e9":
	{
		contract_address: "0x6eb643813f0b4351b993f98bdeaef6e0f79573e9",
	}
}

const IDs_User_Pools_ETH_BUYBACK = {
	"0xdCBB5B2148f0cf1Abd7757Ba04A5821fEaD80587":
	{
		contract_address: "0xdCBB5B2148f0cf1Abd7757Ba04A5821fEaD80587",
	},
	"0xDC65C4277d626d6A29C9Dc42Eb396d354fa5E85b":
	{
		contract_address: "0xDC65C4277d626d6A29C9Dc42Eb396d354fa5E85b",
	},
}

const IDs_User_Pools_BSC_BUYBACK = {
	"0x94b1a7b57c441890b7a0f64291b39ad6f7e14804":
	{
		contract_address: "0x94b1a7b57c441890b7a0f64291b39ad6f7e14804",
	},
	"0x4ef782e66244a0cf002016aa1db3019448c670ae":
	{
		contract_address: "0x4ef782e66244a0cf002016aa1db3019448c670ae",
	},
}

const IDs_User_Pools_AVAX_BUYBACK = {
	"0xC905D5DD9A4f26eD059F76929D11476B2844A7c3":
	{
		contract_address: "0xC905D5DD9A4f26eD059F76929D11476B2844A7c3",
	},
	"0x267434f01ac323C6A5BCf41Fa111701eE0165a37":
	{
		contract_address: "0x267434f01ac323C6A5BCf41Fa111701eE0165a37",
	},
}

const IDs_User_Pools_ETH_FARMING = {
	"0xa68BBe793ad52d0E62bBf34A67F02235bA69E737":
	{
		contract_address: "0xa68BBe793ad52d0E62bBf34A67F02235bA69E737",
	},
	"0xCFd970494a0b3C52a81dcE1EcBFF2245e6b0B0E7":
	{
		contract_address: "0xCFd970494a0b3C52a81dcE1EcBFF2245e6b0B0E7",
	},
	"0x49D02CF81Cc352517350F25E200365360426aF94":
	{
		contract_address: "0x49D02CF81Cc352517350F25E200365360426aF94",
	},
	"0xf51965c570419F2576ec9AeAD6A3C5F674424A99":
	{
		contract_address: "0xf51965c570419F2576ec9AeAD6A3C5F674424A99",
	},
	"0x997A7254E5567d0A70329DEFCc1E4d29d71Ba224":
	{
		contract_address: "0x997A7254E5567d0A70329DEFCc1E4d29d71Ba224",
	},
}

const IDs_User_Pools_BSC_FARMING = {
	"0x537DC4fee298Ea79A7F65676735415f1E2882F92":
	{
		contract_address: "0x537DC4fee298Ea79A7F65676735415f1E2882F92",
	},
	"0x219717BF0bC33b2764A6c1A772F75305458BDA3d":
	{
		contract_address: "0x219717BF0bC33b2764A6c1A772F75305458BDA3d",
	},
	"0xD1151a2434931f34bcFA6c27639b67C1A23D93Af":
	{
		contract_address: "0xD1151a2434931f34bcFA6c27639b67C1A23D93Af",
	},
	"0xed869Ba773c3F1A1adCC87930Ca36eE2dC73435d":
	{
		contract_address: "0xed869Ba773c3F1A1adCC87930Ca36eE2dC73435d",
	},
	"0x415B1624710296717FA96cAD84F53454E8F02D18":
	{
		contract_address: "0x415B1624710296717FA96cAD84F53454E8F02D18",
	},
}

const IDs_User_Pools_AVAX_FARMING = {
	"0x035d65babF595758D7A439D5870BAdc44218D028":
	{
		contract_address: "0x035d65babF595758D7A439D5870BAdc44218D028",
	},
	"0x6c325DfEA0d18387D423C869E328Ef005cBA024F":
	{
		contract_address: "0x6c325DfEA0d18387D423C869E328Ef005cBA024F",
	},
	"0x85C4f0CEA0994dE365dC47ba22dD0FD9899F93Ab":
	{
		contract_address: "0x85C4f0CEA0994dE365dC47ba22dD0FD9899F93Ab",
	},
	"0x6f5dC6777b2B4667Bf183D093111867239518af5":
	{
		contract_address: "0x6f5dC6777b2B4667Bf183D093111867239518af5",
	},
	"0x10E105676CAC55b74cb6500a8Fb5d2f84804393D":
	{
		contract_address: "0x10E105676CAC55b74cb6500a8Fb5d2f84804393D",
	},
}

const IDs_User_Pools_ETH_VAULTS = {
	"0x28eabA060E5EF0d41eeB20d41aafaE8f685739d9":
	{
		contract_address: "0x28eabA060E5EF0d41eeB20d41aafaE8f685739d9",
	},
	"0x2F2cff66fEB7320FC9Adf91b7B74bFb5a80C7C35":
	{
		contract_address: "0x2F2cff66fEB7320FC9Adf91b7B74bFb5a80C7C35",
	},
	"0xA987aEE0189Af45d5FA95a9FBBCB4374228f375E":
	{
		contract_address: "0xA987aEE0189Af45d5FA95a9FBBCB4374228f375E",
	},
	"0x251B9ee6cEd97565A821C5608014a107ddc9C98F":
	{
		contract_address: "0x251B9ee6cEd97565A821C5608014a107ddc9C98F",
	},
	"0x54F30bFfeb925F47225e148f0bAe17a452d6b8c0":
	{
		contract_address: "0x54F30bFfeb925F47225e148f0bAe17a452d6b8c0",
	},
}

let UserPoolsInfo = []


const get_USER_pools = async (user) => {

	UserPoolsInfo = []

	let contract_address = ""

	let ids_constant_staking_bsc = Object.keys(IDs_User_Pools_BSC_IDYP)
	for (let id of ids_constant_staking_bsc) {
		contract_address = IDs_User_Pools_BSC_IDYP[id].contract_address

		let res = await getPendingDivsBSC_IDYP(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}
	let ids_constant_staking_bsc_dyp = Object.keys(IDs_User_Pools_BSC_DYP)
	for (let id of ids_constant_staking_bsc_dyp) {
		contract_address = IDs_User_Pools_BSC_DYP[id].contract_address

		let res = await getPendingDivsBSC_DYP(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}
	let ids_constant_staking_bsc_dyp_dynamic = Object.keys(IDs_User_Pools_BSC_DYP_DYNAMIC)
	for (let id of ids_constant_staking_bsc_dyp_dynamic) {
		contract_address = IDs_User_Pools_BSC_DYP_DYNAMIC[id].contract_address

		let res = await getPendingDivsBSC_DYP_DYNAMIC(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}

	let ids_constant_staking_eth = Object.keys(IDs_User_Pools_ETH_IDYP)
	for (let id of ids_constant_staking_eth) {
		contract_address = IDs_User_Pools_ETH_IDYP[id].contract_address

		let res = await getPendingDivsETH_IDYP(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}
	let ids_constant_staking_eth_dyp = Object.keys(IDs_User_Pools_ETH_DYP)
	for (let id of ids_constant_staking_eth_dyp) {
		contract_address = IDs_User_Pools_ETH_DYP[id].contract_address

		let res = await getPendingDivsETH_DYP(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}
	let ids_constant_staking_eth_dyp_dynamic = Object.keys(IDs_User_Pools_ETH_DYP_DYNAMIC)
	for (let id of ids_constant_staking_eth_dyp_dynamic) {
		contract_address = IDs_User_Pools_ETH_DYP_DYNAMIC[id].contract_address

		let res = await getPendingDivsETH_DYP_DYNAMIC(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}


	let ids_constant_staking_AVAX = Object.keys(IDs_User_Pools_AVAX_IDYP)
	for (let id of ids_constant_staking_AVAX) {
		contract_address = IDs_User_Pools_AVAX_IDYP[id].contract_address

		let res = await getPendingDivsAVAX_IDYP(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}
	let ids_constant_staking_AVAX_dyp = Object.keys(IDs_User_Pools_AVAX_DYP)
	for (let id of ids_constant_staking_AVAX_dyp) {
		contract_address = IDs_User_Pools_AVAX_DYP[id].contract_address

		let res = await getPendingDivsAVAX_DYP(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}
	let ids_constant_staking_AVAX_dyp_dynamic = Object.keys(IDs_User_Pools_AVAX_DYP_DYNAMIC)
	for (let id of ids_constant_staking_AVAX_dyp_dynamic) {
		contract_address = IDs_User_Pools_AVAX_DYP_DYNAMIC[id].contract_address

		let res = await getPendingDivsAVAX_DYP_DYNAMIC(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}

	let ids_constant_staking_ETH_BUYBACK = Object.keys(IDs_User_Pools_ETH_BUYBACK)
	for (let id of ids_constant_staking_ETH_BUYBACK) {
		contract_address = IDs_User_Pools_ETH_BUYBACK[id].contract_address

		let res = await getPendingDivs_ETH_BUYBACK(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}

	let ids_constant_staking_BSC_BUYBACK = Object.keys(IDs_User_Pools_BSC_BUYBACK)
	for (let id of ids_constant_staking_BSC_BUYBACK) {
		contract_address = IDs_User_Pools_BSC_BUYBACK[id].contract_address

		let res = await getPendingDivs_BSC_BUYBACK(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}

	let ids_constant_staking_AVAX_BUYBACK = Object.keys(IDs_User_Pools_AVAX_BUYBACK)
	for (let id of ids_constant_staking_AVAX_BUYBACK) {
		contract_address = IDs_User_Pools_AVAX_BUYBACK[id].contract_address

		let res = await getPendingDivs_AVAX_BUYBACK(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}

	let ids_constant_staking_ETH_FARMING = Object.keys(IDs_User_Pools_ETH_FARMING)
	for (let id of ids_constant_staking_ETH_FARMING) {
		contract_address = IDs_User_Pools_ETH_FARMING[id].contract_address

		let res = await getPendingDivs_ETH_FARMING(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}

	let ids_constant_staking_BSC_FARMING = Object.keys(IDs_User_Pools_BSC_FARMING)
	for (let id of ids_constant_staking_BSC_FARMING) {
		contract_address = IDs_User_Pools_BSC_FARMING[id].contract_address

		let res = await getPendingDivs_BSC_FARMING(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}

	let ids_constant_staking_AVAX_FARMING = Object.keys(IDs_User_Pools_AVAX_FARMING)
	for (let id of ids_constant_staking_AVAX_FARMING) {
		contract_address = IDs_User_Pools_AVAX_FARMING[id].contract_address

		let res = await getPendingDivs_AVAX_FARMING(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}

	let ids_constant_staking_ETH_VAULTS = Object.keys(IDs_User_Pools_ETH_VAULTS)
	for (let id of ids_constant_staking_ETH_VAULTS) {
		contract_address = IDs_User_Pools_ETH_VAULTS[id].contract_address

		let res = await getPendingDivs_ETH_VAULTS(id, user)

		if ((res !== "undefined") && (res > 0)) {
			UserPoolsInfo.push({
				contract_address: contract_address,
			})
		}

	}

}


const getPendingDivsBSC_IDYP = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_BSC_IDYP[id].contract_address
	let test_contract = new bscWeb3.eth.Contract(ABI_IDYP, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivsBSC_DYP = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_BSC_DYP[id].contract_address
	let test_contract = new bscWeb3.eth.Contract(ABI_DYP, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivsBSC_DYP_DYNAMIC = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_BSC_DYP_DYNAMIC[id].contract_address
	let test_contract = new bscWeb3.eth.Contract(ABI_DYP_DYNAMIC, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivsETH_IDYP = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_ETH_IDYP[id].contract_address
	let test_contract = new infuraWeb3.eth.Contract(ABI_IDYP, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivsETH_DYP = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_ETH_DYP[id].contract_address
	let test_contract = new infuraWeb3.eth.Contract(ABI_DYP_ETHSPECIAL, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivsETH_DYP_DYNAMIC = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_ETH_DYP_DYNAMIC[id].contract_address
	let test_contract = new infuraWeb3.eth.Contract(ABI_DYP_DYNAMIC, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}


const getPendingDivsAVAX_IDYP = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_AVAX_IDYP[id].contract_address
	let test_contract = new avaxWeb3.eth.Contract(ABI_IDYP, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivsAVAX_DYP = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_AVAX_DYP[id].contract_address
	let test_contract = new avaxWeb3.eth.Contract(ABI_DYP, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivsAVAX_DYP_DYNAMIC = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_AVAX_DYP_DYNAMIC[id].contract_address
	let test_contract = new avaxWeb3.eth.Contract(ABI_DYP_DYNAMIC, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivs_ETH_BUYBACK = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_ETH_BUYBACK[id].contract_address
	let test_contract = new infuraWeb3.eth.Contract(ABI_BUYBACK, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivs_BSC_BUYBACK = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_BSC_BUYBACK[id].contract_address
	let test_contract = new bscWeb3.eth.Contract(ABI_BUYBACK, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivs_AVAX_BUYBACK = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_AVAX_BUYBACK[id].contract_address
	let test_contract = new avaxWeb3.eth.Contract(ABI_BUYBACK, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivs_ETH_FARMING = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_ETH_FARMING[id].contract_address
	let test_contract = new infuraWeb3.eth.Contract(ABI_FARMING, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivs_BSC_FARMING = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_BSC_FARMING[id].contract_address
	let test_contract = new bscWeb3.eth.Contract(ABI_FARMING, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivs_AVAX_FARMING = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_AVAX_FARMING[id].contract_address
	let test_contract = new avaxWeb3.eth.Contract(ABI_FARMING, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositedTokens(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}

const getPendingDivs_ETH_VAULTS = async (id, user) => {
	let pending_divs = 0
	let contract_address = IDs_User_Pools_ETH_VAULTS[id].contract_address
	let test_contract = new infuraWeb3.eth.Contract(ABI_VAULT, contract_address, { from: undefined });
	pending_divs = await test_contract.methods.depositTokenBalance(user).call();
	pending_divs = pending_divs / 1e18
	return pending_divs;
}
let totaltvlnew = 0;
let last_update_time_totaltvl = 0;
const getTotalTvlNew = async () => {
	last_update_time_totaltvl = Date.now()
	totaltvlnew = 0; 
	totaltvlnew = totaltvlbsc + totaltvlavax + totaltvl + totaltvlvault + totaltvlfarmingavax + totaltvlfarmingbsc +totaltvlfarmingeth
	return totaltvlnew;
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
		link_logo = "https://www.dypius.com/logo192.png",
		pool_name = "",
		pair_name = "",
		link_pair = "",
		return_types = "",
		expired = "",
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

		if (id == "0x7fc2174670d672ad7f666af0704c2d961ef32c73")
			tvl_usd = farmingTvl30
		if (id == "0x036e336ea3ac2e255124cf775c4fdab94b2c42e4")
			tvl_usd = farmingTvl60
		if (id == "0x0a32749d95217b7ee50127e24711c97849b70c6a")
			tvl_usd = farmingTvl90
		if (id == "0x82df1450efd6b504ee069f5e4548f2d5cb229880")
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
		if ((pools.pool_name).search('Ethereum') > 0) {

			let lock_pair = pools.link_pair.split('/')[3].split('-')[1]
			let staking_pair = pools.link_pair.split('/')[3].split('-')[2]
			staking_pair = lock_pair + '_' + staking_pair

			if ((pools.pair_name).search('ETH') > 0) {
				apyInfoEth.set(staking_pair, pools.apy_percent)
			}

			if ((pools.pair_name).search('BTC') > 0) {
				apyInfoEth.set(staking_pair, pools.apy_percent)
			}

			if ((pools.pair_name).search('USDC') > 0) {
				apyInfoEth.set(staking_pair, pools.apy_percent)
			}

			if ((pools.pair_name).search('USDT') > 0) {
				apyInfoEth.set(staking_pair, pools.apy_percent)
			}
		}

		//HashMap for BSC network
		if ((pools.pool_name).search('BSC') > 0) {

			let lock_pair = pools.link_pair.split('/')[3].split('-')[1]
			let staking_pair = pools.link_pair.split('/')[3].split('-')[2]
			staking_pair = lock_pair + '_' + staking_pair

			if ((pools.pair_name).search('WBNB') > 0) {
				apyInfoBsc.set(staking_pair, pools.apy_percent)
			}

			if ((pools.pair_name).search('ETH') > 0) {
				apyInfoBsc.set(staking_pair, pools.apy_percent)
			}

			if ((pools.pair_name).search('BUSD') > 0) {
				apyInfoBsc.set(staking_pair, pools.apy_percent)
			}
		}

		//HashMap for AVAX network
		if ((pools.pool_name).search('AVAX') > 0) {

			let lock_pair = pools.link_pair.split('/')[3].split('-')[1]
			let staking_pair = pools.link_pair.split('/')[3].split('-')[2]
			staking_pair = lock_pair + '_' + staking_pair

			if ((pools.pair_name).search('AVAX') > 0) {
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
		let contractBridge = new avaxWeb3.eth.Contract(TOKEN_ABI_AVAX, contractAddress, { from: undefined })
		let totalSupply = await Promise.all([contractBridge.methods.totalSupply().call()])
		let decimals = await Promise.all([contractBridge.methods.decimals().call()])
		let tokens = totalSupply / eval('1e' + decimals)

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
		link_logo = "https://www.dypius.com/logo192.png",
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
	let token_contract = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })
	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])
	let _tvlBuyback = await token_contract.methods.balanceOf(address_constant).call()
	_tvlBuyback = _tvlBuyback / 1e18 * usdPerToken
	buybackTvl = _tvlBuyback

	for (let id of ids_constant) {

		apy_percent = IDs_constant_avalanche[id].apy

		if (id == "0x4c7e0cbb0276a5e963266e6b9f34db73a1cb73f3")
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
		link_logo = "https://www.dypius.com/logo192.png",
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
	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })
	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])
	let _tvlBuyback = await token_contract.methods.balanceOf(address_constant).call()
	_tvlBuyback = _tvlBuyback / 1e18 * usdPerToken
	buybackTvlBinance = _tvlBuyback

	for (let id of ids_constant) {

		apy_percent = IDs_constant_binance[id].apy

		if (id == "0x350f3fe979bfad4766298713c83b387c2d2d7a7a")
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
		link_logo = "https://www.dypius.com/logo192.png",
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

		if (id == "0x7fc2174670d672ad7f666af0704c2d961ef32c73")
			tvl_usd = farmingTvl30
		if (id == "0x036e336ea3ac2e255124cf775c4fdab94b2c42e4")
			tvl_usd = farmingTvl60
		if (id == "0x0a32749d95217b7ee50127e24711c97849b70c6a")
			tvl_usd = farmingTvl90
		if (id == "0x82df1450efd6b504ee069f5e4548f2d5cb229880")
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
	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })
	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])
	let _tvlBuyback = await token_contract.methods.balanceOf(address_constant).call()
	_tvlBuyback = _tvlBuyback / 1e18 * usdPerToken
	buybackTvlEthereum = _tvlBuyback

	for (let id of ids_constant) {

		apy_percent = IDs_constant_ethereum[id].apy

		if (id == "0xe5262f38bf13410a79149cb40429f8dc5e830542")
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
const { data } = require('jquery')

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

PANCAKESWAP_ROUTER_ABI = [{ "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WETH", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETHSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapETHForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETHSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
async function getPancakeswapRouterContract(address = config.pancakeswap_router_address) {
	return (new bscWeb3.eth.Contract(PANCAKESWAP_ROUTER_ABI, address, { from: undefined }))
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
				if (id == TOKEN_ADDRESS)
					token_price_usd = await getPrice(config.cg_ids[id])
				else
					token_price_usd = parseFloat(_amountOutMin)
				tokens.push({ id, token_price_usd })
			}

			let platformTokenContract = {}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				if (pairAddress == '0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb') {
					platformTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address2, { from: undefined })
					usdPerPlatformToken = _amountOutMin
				}
				else {
					platformTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, { from: undefined })
					usdPerPlatformToken = aux_Price
				}

				let pairTokenContract = new bscWeb3.eth.Contract(TOKEN_ABI, pairAddress, { from: undefined })

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2 / (lpTotalSupply / 1e18)
				let usd_value_of_lp_staked = stakingLpBalance / 1e18 * usd_per_lp
				let lp_staked = stakingLpBalance / 1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {
				data: {
					tokens, liquidityPositions
				}
			}
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
				resolve({ token_data, lp_data, usd_per_eth })
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
		let contract = new bscWeb3.eth.Contract(STAKING_ABI, contract_address, { from: undefined })
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_BSC_V2({
	TOKEN_ADDRESS,
	HOLDERS_LIST
}) {

	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}


async function get_token_balances_idyp_BSC_V2({ TOKEN_ADDRESS, HOLDERS_LIST }) {

	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })
	return token_contract.methods.balanceOf(HOLDERS_LIST).call()
}

async function get_to_be_burnt_bsc(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new bscWeb3.eth.Contract(STAKING_ABI, contract_address, { from: undefined })
		return contract.methods.tokensToBeDisbursedOrBurnt().call()
	}))).map(h => Number(h))
}
let totaltvlfarmingbsc = 0
async function get_apy_and_tvl_BSC_V2(usd_values) {
	totaltvlfarmingbsc = 0
	let { token_data, lp_data, usd_per_eth } = usd_values

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

	let token_price_usd = token_data[TOKEN_ADDRESS_IDYP].token_price_usd * 1
	let dyp_price = token_data[TOKEN_ADDRESS].token_price_usd * 1
	let balances_by_address = {},
		number_of_holders_by_address = {},
		magic_number_of_pools = {},
		tokens_to_be_burnt_by_pool = {},
		apr_for_each_pool = {}

	let lp_ids = Object.keys(lp_data)
	let pair_addrs = lp_ids.map(a => a.split('-')[0])
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_BSC_V2({ TOKEN_ADDRESS, HOLDERS_LIST: addrs })
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
	let number_of_idyp_on_pair = await get_token_balances_idyp_BSC_V2({ TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: pair_addrs[0] })

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0, apyFarming = 0, TOKENS_DISBURSED = 0, apyStaking = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2) * 1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked * 1
		totaltvlfarmingbsc = totaltvlfarmingbsc + tvl_usd

		//apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC_V2[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		let maxSwappableAmount = new BigNumber(number_of_idyp_on_pair).div(1e18).multipliedBy(magic_number_of_pools[pool_address]).div(1e18).toFixed(0)

		let to_be_distributed = TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_BSC_V2[lp_id] / 365
		let sum = new BigNumber(tokens_to_be_burnt_by_pool[pool_address]).div(1e18).plus(to_be_distributed).toFixed(0)

		if (parseInt(sum) >= parseInt(maxSwappableAmount)) {
			TOKENS_DISBURSED = new BigNumber(maxSwappableAmount).multipliedBy(365).toFixed(0)
		} else if (parseInt(sum) < parseInt(maxSwappableAmount)) {
			TOKENS_DISBURSED = new BigNumber(sum).multipliedBy(365).toFixed(0)
		}

		apyFarming = (TOKENS_DISBURSED * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2) * 1
		//console.log({sum, maxSwappableAmount, TOKENS_DISBURSED, apyFarming})

		apyStaking = new BigNumber(0.25).div(dyp_price).times(apr_for_each_pool[pool_address]).div(1e2).times(token_price_usd).times(1e2).toFixed(2) * 1

		apy = new BigNumber(apyFarming).multipliedBy(0.75).plus(apyStaking * 0.25).toFixed(2) * 1

		lp_data[lp_id].apy = apy
		lp_data[lp_id].apy_percent = apy
		lp_data[lp_id].apyFarming = apyFarming
		lp_data[lp_id].apyStaking = apyStaking
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
		lp_data[lp_id].expired = "Yes"
	})

	return { token_data, lp_data, usd_per_eth, token_price_usd, price_DYPS }
}

async function get_usd_values_with_apy_and_tvl_BSC_V2(...arguments) {
	return (await get_apy_and_tvl_BSC_V2(await get_usd_values_BSC_V2(...arguments)))
}

let last_update_time_v2 = 0

async function refresh_the_graph_result_BSC_V2() {
	last_update_time_v2 = Date.now()
	let result = await get_usd_values_with_apy_and_tvl_BSC_V2({ token_contract_addresses: [TOKEN_ADDRESS, TOKEN_ADDRESS_IDYP], lp_ids: LP_ID_LIST_BSC_V2 })
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

async function totalTvliDYP() {
	let tvliDYP = 0

	let token_balances = await get_token_balances_BSC({ TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: newContracts })

	await wait(2000)

	for (let id of token_balances) {
		tvliDYP = new BigNumber(tvliDYP).plus(id)
	}

	tvliDYP = new BigNumber(tvliDYP).div(1e18).times(price_iDYP).toFixed(0)


	return tvliDYP
}

/* TVL Staking + Farming -> DYP + LP BSC */

async function totalTvlFarmingStakingV2() {
	let tvlTotal = 0
	let tvlStaking = 0

	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])

	let token_balances = await get_token_balances_BSC({ TOKEN_ADDRESS: TOKEN_ADDRESS, HOLDERS_LIST: newContracts })

	tvlTotal = tvlTotal + the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[0]].tvl_usd +
		the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[1]].tvl_usd +
		the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[2]].tvl_usd +
		the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[3]].tvl_usd +
		the_graph_result_BSC_V2.lp_data[LP_IDs_BSC_V2.wbnb[4]].tvl_usd

	for (let id of token_balances) {
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

async function totalTvliDYPAvax() {
	let tvliDYP = 0

	let token_balances = await get_token_balances_AVAX_V2({ TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: newContractsAvax })

	await wait(2000)

	for (let id of token_balances) {
		tvliDYP = new BigNumber(tvliDYP).plus(id)
	}

	tvliDYP = new BigNumber(tvliDYP).div(1e18).times(price_iDYP_avax).toFixed(0)


	return tvliDYP
}

/* TVL Staking + Farming -> DYP + LP AVAX */

async function totalTvlFarmingStakingAvaxV2() {
	let tvlTotal = 0
	let tvlStaking = 0

	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])

	let token_balances = await get_token_balances_AVAX_V2({ TOKEN_ADDRESS: TOKEN_ADDRESS, HOLDERS_LIST: newContractsAvax })

	tvlTotal = tvlTotal + the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[0]].tvl_usd +
		the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[1]].tvl_usd +
		the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[2]].tvl_usd +
		the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[3]].tvl_usd +
		the_graph_result_AVAX_V2.lp_data[LP_IDs_AVAX_V2.wavax[4]].tvl_usd

	for (let id of token_balances) {
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

async function totalTvliDYPEth() {
	let tvliDYP = 0

	let token_balances = await get_token_balances_ETH_V2({ TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: newContractsEth })

	await wait(2000)

	for (let id of token_balances) {
		tvliDYP = new BigNumber(tvliDYP).plus(id)
	}

	tvliDYP = new BigNumber(tvliDYP).div(1e18).times(price_iDYP_eth).toFixed(0)


	return tvliDYP
}

/* TVL Staking + Farming -> DYP + LP ETH V2 */

async function totalTvlFarmingStakingEthV2() {
	let tvlTotal = 0
	let tvlStaking = 0

	let [usdPerToken] = await Promise.all([getPrice('defi-yield-protocol')])

	let token_balances = await get_token_balances_AVAX_V2({ TOKEN_ADDRESS: TOKEN_ADDRESS, HOLDERS_LIST: newContractsEth })

	tvlTotal = tvlTotal + the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[0]].tvl_usd +
		the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[1]].tvl_usd +
		the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[2]].tvl_usd +
		the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[3]].tvl_usd +
		the_graph_result_ETH_V2.lp_data[LP_IDs_ETH_V2.weth[4]].tvl_usd

	for (let id of token_balances) {
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
	let token_contract = new bscWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })

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
	token_balance_sum_idyp = get_token_balances_sum(await get_token_balances_bsc({ TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: HOLDERS_LIST_IDYP })).div(1e18).toString(10)

	token_balance_sum_idyp_eth = get_token_balances_sum(await get_token_balances({ TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: HOLDERS_LIST_IDYP_ETH })).div(1e18).toString(10)
	token_balance_sum_idyp_avax = get_token_balances_sum(await get_token_balances_AVAX({ TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: HOLDERS_LIST_IDYP_AVAX })).div(1e18).toString(10)
	let circulating_supply_eth = new BigNumber(286413839).minus(token_balance_sum_idyp_eth) //bridge
	let circulating_supply_avax = new BigNumber(296413839).minus(token_balance_sum_idyp_avax) //bridge
	// circulating_supply = new BigNumber(30000000).minus(token_balance_sum).plus(circulating_supply_bsc).plus(circulating_supply_avax)

	// console.log({token_balance_sum_idyp_eth, token_balance_sum_idyp, token_balance_sum_idyp_avax})
	circulating_supply_idyp = new BigNumber(300000000).minus(36424547).minus(token_balance_sum_idyp).plus(circulating_supply_eth).plus(circulating_supply_avax);
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

PANGOLIN_ROUTER_ABI = [{ "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WAVAX", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "WAVAX", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountAVAXMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityAVAX", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountAVAX", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountAVAXMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityAVAX", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountAVAX", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountAVAXMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityAVAXSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountAVAX", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountAVAXMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityAVAXWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountAVAX", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountAVAXMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityAVAXWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountAVAX", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapAVAXForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactAVAXForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactAVAXForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForAVAX", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForAVAXSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactAVAX", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
async function getPangolinRouterContract(address = config.pangolin_router_address) {
	return (new avaxWeb3.eth.Contract(PANGOLIN_ROUTER_ABI, address, { from: undefined }))
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
				if (id == TOKEN_ADDRESS)
					token_price_usd = await getPrice(config.cg_ids_avax[id])
				else
					token_price_usd = parseFloat(_amountOutMin)
				tokens.push({ id, token_price_usd })
			}

			let platformTokenContract = {}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				if (pairAddress == '0x66eecc97203704d9e2db4a431cb0e9ce92539d5a') {
					platformTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address2, { from: undefined })
					usdPerPlatformToken = _amountOutMin
				}
				else {
					platformTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, { from: undefined })
					usdPerPlatformToken = aux_Price
				}

				let pairTokenContract = new avaxWeb3.eth.Contract(TOKEN_ABI, pairAddress, { from: undefined })

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2 / (lpTotalSupply / 1e18)
				let usd_value_of_lp_staked = stakingLpBalance / 1e18 * usd_per_lp
				let lp_staked = stakingLpBalance / 1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {
				data: {
					tokens, liquidityPositions
				}
			}
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
				resolve({ token_data, lp_data, usd_per_eth })
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
		let contract = new avaxWeb3.eth.Contract(STAKING_ABI, contract_address, { from: undefined })
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_AVAX_V2({
	TOKEN_ADDRESS,
	HOLDERS_LIST
}) {

	let token_contract = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}

async function get_token_balances_idyp_AVAX_V2({ TOKEN_ADDRESS, HOLDERS_LIST }) {

	let token_contract = new avaxWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })
	return token_contract.methods.balanceOf(HOLDERS_LIST).call()
}

async function get_to_be_burnt_avax(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new avaxWeb3.eth.Contract(STAKING_ABI, contract_address, { from: undefined })
		return contract.methods.tokensToBeDisbursedOrBurnt().call()
	}))).map(h => Number(h))
}

async function get_apy_and_tvl_AVAX_V2(usd_values) {
	let { token_data, lp_data, usd_per_eth } = usd_values

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

	let token_price_usd = token_data[TOKEN_ADDRESS_IDYP].token_price_usd * 1
	let dyp_price = token_data[TOKEN_ADDRESS].token_price_usd * 1
	let balances_by_address = {},
		number_of_holders_by_address = {},
		magic_number_of_pools = {},
		tokens_to_be_burnt_by_pool = {},
		apr_for_each_pool = {}

	let lp_ids = Object.keys(lp_data)
	let pair_addrs = lp_ids.map(a => a.split('-')[0])
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_AVAX_V2({ TOKEN_ADDRESS, HOLDERS_LIST: addrs })
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
	let number_of_idyp_on_pair = await get_token_balances_idyp_AVAX_V2({ TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: pair_addrs[0] })

	lp_ids.forEach(lp_id => {
		let apy = 0, tvl_usd = 0, apyFarming = 0, apyStaking = 0, TOKENS_DISBURSED = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2) * 1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked * 1

		//apy = (TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX_V2[lp_id] * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2)*1

		let maxSwappableAmount = new BigNumber(number_of_idyp_on_pair).div(1e18).multipliedBy(magic_number_of_pools[pool_address]).div(1e18).toFixed(0)

		let to_be_distributed = TOKENS_DISBURSED_PER_YEAR_BY_LP_ID_AVAX_V2[lp_id] / 365
		let sum = new BigNumber(tokens_to_be_burnt_by_pool[pool_address]).div(1e18).plus(to_be_distributed).toFixed(0)

		if (parseInt(sum) >= parseInt(maxSwappableAmount)) {
			TOKENS_DISBURSED = new BigNumber(maxSwappableAmount).multipliedBy(365).toFixed(0)
		} else if (parseInt(sum) < parseInt(maxSwappableAmount)) {
			TOKENS_DISBURSED = new BigNumber(sum).multipliedBy(365).toFixed(0)
		}

		apyFarming = (TOKENS_DISBURSED * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2) * 1

		apyStaking = new BigNumber(0.25).div(dyp_price).times(apr_for_each_pool[pool_address]).div(1e2).times(token_price_usd).times(1e2).toFixed(2) * 1

		apy = new BigNumber(apyFarming).multipliedBy(0.75).plus(apyStaking * 0.25).toFixed(2) * 1

		//console.log({sum, maxSwappableAmount, TOKENS_DISBURSED, apyFarming})

		lp_data[lp_id].apy = apy
		lp_data[lp_id].apy_percent = apy
		lp_data[lp_id].apyFarming = apyFarming
		lp_data[lp_id].apyStaking = apyStaking
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
		lp_data[lp_id].expired = "Yes"
	})

	return { token_data, lp_data, usd_per_eth, token_price_usd, price_DYPS }
}

async function get_usd_values_with_apy_and_tvl_AVAX_V2(...arguments) {
	return (await get_apy_and_tvl_AVAX_V2(await get_usd_values_AVAX_V2(...arguments)))
}

let last_update_time_avax_v2 = 0

async function refresh_the_graph_result_AVAX_V2() {
	last_update_time_avax_v2 = Date.now()
	let result = await get_usd_values_with_apy_and_tvl_AVAX_V2({ token_contract_addresses: [TOKEN_ADDRESS, TOKEN_ADDRESS_IDYP], lp_ids: LP_ID_LIST_AVAX_V2 })
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

UNISWAP_ROUTER_ABI = [{ "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WETH", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETHSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapETHForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETHSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
async function getUniswapRouterContract(address = config.uniswap_router_address) {
	return (new infuraWeb3.eth.Contract(UNISWAP_ROUTER_ABI, address, { from: undefined }))
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
				if (id == TOKEN_ADDRESS)
					token_price_usd = await getPrice(config.cg_ids_eth[id])
				else
					token_price_usd = parseFloat(_amountOutMin)
				tokens.push({ id, token_price_usd })
			}

			let platformTokenContract = {}
			for (let lp_id of lp_ids) {
				let pairAddress = lp_id.split('-')[0]
				let stakingContractAddress = lp_id.split('-')[1]

				if (pairAddress == '0x7463286a379f6f128058bb92b355e3d6e8bdb219') {
					platformTokenContract = new infuraWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address2, { from: undefined })
					usdPerPlatformToken = _amountOutMin
				}
				else {
					platformTokenContract = new infuraWeb3.eth.Contract(TOKEN_ABI, config.reward_token_address, { from: undefined })
					usdPerPlatformToken = aux_Price
				}

				let pairTokenContract = new infuraWeb3.eth.Contract(TOKEN_ABI, pairAddress, { from: undefined })

				let [lpTotalSupply, stakingLpBalance, platformTokenInLp] = await Promise.all([pairTokenContract.methods.totalSupply().call(), pairTokenContract.methods.balanceOf(stakingContractAddress).call(), platformTokenContract.methods.balanceOf(pairAddress).call()])

				let usd_per_lp = platformTokenInLp / 1e18 * usdPerPlatformToken * 2 / (lpTotalSupply / 1e18)
				let usd_value_of_lp_staked = stakingLpBalance / 1e18 * usd_per_lp
				let lp_staked = stakingLpBalance / 1e18
				let id = lp_id
				liquidityPositions.push({
					id,
					usd_per_lp,
					usd_value_of_lp_staked,
					lp_staked
				})
			}
			return {
				data: {
					tokens, liquidityPositions
				}
			}
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
				resolve({ token_data, lp_data, usd_per_eth })
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
		let contract = new infuraWeb3.eth.Contract(STAKING_ABI, contract_address, { from: undefined })
		return contract.methods.getNumberOfHolders().call()
	}))).map(h => Number(h))
}

async function get_token_balances_ETH_V2({
	TOKEN_ADDRESS,
	HOLDERS_LIST
}) {

	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })

	return (await Promise.all(HOLDERS_LIST.map(h => {
		return token_contract.methods.balanceOf(h).call()
	})))
}

async function get_token_balances_idyp_ETH_V2({ TOKEN_ADDRESS, HOLDERS_LIST }) {

	let token_contract = new infuraWeb3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS, { from: undefined })
	return token_contract.methods.balanceOf(HOLDERS_LIST).call()
}

async function get_to_be_burnt(staking_pools_list) {

	return (await Promise.all(staking_pools_list.map(contract_address => {
		let contract = new infuraWeb3.eth.Contract(STAKING_ABI, contract_address, { from: undefined })
		return contract.methods.tokensToBeDisbursedOrBurnt().call()
	}))).map(h => Number(h))
}
let totaltvlfarmingeth = 0
async function get_apy_and_tvl_ETH_V2(usd_values) {
	totaltvlfarmingeth = 0
	let { token_data, lp_data, usd_per_eth } = usd_values

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

	let token_price_usd = token_data[TOKEN_ADDRESS_IDYP].token_price_usd * 1
	let dyp_price = token_data[TOKEN_ADDRESS].token_price_usd * 1
	let balances_by_address = {},
		number_of_holders_by_address = {},
		magic_number_of_pools = {},
		tokens_to_be_burnt_by_pool = {},
		apr_for_each_pool = {}

	let lp_ids = Object.keys(lp_data)
	let pair_addrs = lp_ids.map(a => a.split('-')[0])
	let addrs = lp_ids.map(a => a.split('-')[1])
	let token_balances = await get_token_balances_ETH_V2({ TOKEN_ADDRESS, HOLDERS_LIST: addrs })
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
	let number_of_idyp_on_pair = await get_token_balances_idyp_ETH_V2({ TOKEN_ADDRESS: TOKEN_ADDRESS_IDYP, HOLDERS_LIST: pair_addrs[0] })

	lp_ids.forEach(lp_id => {
		let apy = 0, apyFarming = 0, tvl_usd = 0, TOKENS_DISBURSED = 0, apyStaking = 0

		let pool_address = lp_id.split('-')[1]
		let token_balance = new BigNumber(balances_by_address[pool_address] || 0)
		let token_balance_value_usd = token_balance.div(1e18).times(token_price_usd).toFixed(2) * 1

		tvl_usd = token_balance_value_usd + lp_data[lp_id].usd_value_of_lp_staked * 1
		totaltvlfarmingeth = totaltvlfarmingeth + tvl_usd
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

		if (parseInt(sum) >= parseInt(maxSwappableAmount)) {
			TOKENS_DISBURSED = new BigNumber(maxSwappableAmount).multipliedBy(365).toFixed(0)
		} else if (parseInt(sum) < parseInt(maxSwappableAmount)) {
			TOKENS_DISBURSED = new BigNumber(sum).multipliedBy(365).toFixed(0)
		}

		apyFarming = (TOKENS_DISBURSED * token_price_usd * 100 / (lp_data[lp_id].usd_value_of_lp_staked || 1)).toFixed(2) * 1

		apyStaking = new BigNumber(0.25).div(dyp_price).times(apr_for_each_pool[pool_address]).div(1e2).times(token_price_usd).times(1e2).toFixed(2) * 1

		apy = new BigNumber(apyFarming).multipliedBy(0.75).plus(apyStaking * 0.25).toFixed(2) * 1

		//console.log({sum, maxSwappableAmount, TOKENS_DISBURSED, apyFarming})

		lp_data[lp_id].apy = apy
		lp_data[lp_id].apy_percent = apy
		lp_data[lp_id].apyFarming = apyFarming
		lp_data[lp_id].apyStaking = apyStaking
		lp_data[lp_id].tvl_usd = tvl_usd
		lp_data[lp_id].stakers_num = number_of_holders_by_address[pool_address]
		lp_data[lp_id].expired = "Yes"
	})
	return { token_data, lp_data, usd_per_eth, token_price_usd, price_DYPS }
}


async function get_usd_values_with_apy_and_tvl_ETH_V2(...arguments) {
	return (await get_apy_and_tvl_ETH_V2(await get_usd_values_ETH_V2(...arguments)))
}

let last_update_time_eth_v2 = 0

async function refresh_the_graph_result_ETH_V2() {
	last_update_time_eth_v2 = Date.now()
	let result = await get_usd_values_with_apy_and_tvl_ETH_V2({ token_contract_addresses: [TOKEN_ADDRESS, TOKEN_ADDRESS_IDYP], lp_ids: LP_ID_LIST_ETH_V2 })
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

	// await wait(60000)
	/* Get Highest Apy & Total Tvl */
	await GetHighestAPY()
	await getTotalTvl()

	/* Get Total Paid */
	await PaidOutETH()
	await PaidAllInUsd()

	fecthNftFloorPrice()
	fecthLandFloorPrice()
	await get_wod_info()
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

app.get('/api/dyp-tokenomics', async (req, res) => {
	//5 minutes
	if (Date.now() - last_update_time_tokenomics > 300e3) {
		await update_tokenomics()
	}
	res.type('application/json')
	res.json({
		bsc: {
			locked: lockedBsc,
			unlocked: unlockedBsc
		},
		avax: {
			locked: lockedAvax,
			unlocked: unlockedAvax
		}
	})

})

app.get('/api/gov-stats', async (req, res) => {
	//1 day
	if (Date.now() - last_update_time_gov > 86400e3) {
		await update_proposals()
	}
	res.type('application/json')
	res.json({
		proposals: {
			bsc: bscProposals,
			avax: avaxProposals,
			eth: ethProposals,

		},
		votes: {
			bsc: bscVotes,
			avax: avaxVotes,
			eth: ethVotes,
		},
		totalVotes: totalVotes

	})


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
	if (Date.now() - last_update_time_totaltvl > 720e3) {
		await refresh_the_graph_result_BSC_V2()
		await refresh_the_graph_result_ETH_V2()
		await refresh_the_graph_result_AVAX_V2()
		await updateStakingTVLETH()
		await updateStakingTVLBNB()
		await updateStakingTVLAVAX()
		await updateVaultTVL()
		await getTotalTvlNew()
	}
	res.type('text/plain')
	res.send(String(totaltvlnew))
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

app.get('	', async (req, res) => {
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

app.get('/api/get_staking_info_eth', async (req, res) => {
	if (Date.now() - last_update_time_ethstake > 300e3) {
		await get_Land_Staking_Info()
		await get_Land_Caws_Staking_info()
		await get_NFT_Staking_Info()
		await updateStakingTVLETH()
		await get_iDYP_ETH_Staking_Info()
		await get_DYP_ETH_Staking_Info()
		await get_ETH_STAKING_HIGHEST_APY()
		await get_NFT_Staking_Info()
	}
	res.type('application/json')
	res.json({
		stakingInfoiDYPEth: iDYPEthStakingInfo,
		stakingInfoDYPEth: DYPEthStakingInfo,
		stakingInfoCAWS: NftStakingInfo,
		stakingInfoLAND: landStakingInfo,
		stakinginfoCAWSLAND: landCawsStakingInfo,
		highestAPY_ETH: all_eth_apys,
		totalTVL_ETH: totaltvl
	})
})

app.get('/api/get_wod', async (req, res) => {
	if (Date.now()- last_update_time_wod > 3600e3) {
		await get_wod_info()
	}
	res.type('application/json')
	res.json({
		playing: 2800,
		registered: registered_users2,
		discordmembers: 13+'K',
		twitterfollowers: 122+'K',
	})
})

app.get('/api/get_proposals_info', async (req, res) => {
	if (Date.now() - last_update_time_proposals_info > 3600e3) {
		await get_proposals_info()
	}

	res.type('application/json')
	res.json({
		ProposalsInfoETH: proposals_info_eth,
		ProposalsInfoBSC: proposals_info_bsc,
		ProposalsInfoAVAX: proposals_info_avax
	})
})


app.get('/api/get_nft_stats', async (req, res) => {
	if (Date.now() - last_update_time_random_nfts > 900e3) {
		await fecthNftFloorPrice()
		await get_random_nfts()
	}

	res.type('application/json')
	res.json({
		RandomNFTs: randomnfts,
		RarestNFTs: rarestnfts,
		OpenSeaStats: openseastats

	})
})



// app.get('/api/get_rarest_nfts', async (req, res) => {
// 	if (Date.now() - last_update_time_rarest_nfts > 3600e3) {
// 		await get_rarest_nfts()
// 	}
//
// 	res.type('application/json')
// 	res.json({
// 		RarestNFTs: rarestnfts
// 	})
// })

app.get('/api/get_vault_info', async (req, res) => {
	if (Date.now() - last_update_time_vault > 3600e3) {
		await updateVaultTVL()
		await get_iDYP_Vault_TVL_Info()
		
	}
	res.type('application/json')
	res.json({
		VaultTVLs: VaultTVLInfo,
		VaultTotalTVL: VaultTVLTotal

	})
})
app.get('/api/get_staking_info_bnb', async (req, res) => {
	if (Date.now() - last_update_time_bnbstake > 300e3) {
		await updateStakingTVLBNB()
		await get_iDYP_BNB_Staking_Info()
		await get_DYP_BNB_Staking_Info()
		await get_BNB_STAKING_HIGHEST_APY()
	}

	res.type('application/json')
	res.json({
		stakingInfoiDYPBnb: iDYPBNBStakingInfo,
		stakingInfoDYPBnb: DYPBnbStakingInfo,
		highestAPY_BNB: all_bsc_apys,
		totalTVL_BNB: totaltvlbsc
	})
})

app.get('/api/get_staking_info_avax', async (req, res) => {
	if (Date.now() - last_update_time_avaxstake > 300e3) {
		await updateStakingTVLAVAX()
		await get_iDYP_AVAX_Staking_Info()
		await get_DYP_AVAX_Staking_Info()
		await get_AVAX_STAKING_HIGHEST_APY()
	}
	res.type('application/json')
	res.json({
		stakingInfoiDYPAvax: iDYPAvaxStakingInfo,
		stakingInfoDYPAvax: DYPAvaxStakingInfo,
		highestAPY_AVAX: all_avax_apys,
		totalTVL_AVAX: totaltvlavax
	})
})

app.get('/api/get_buyback_info_eth', async (req, res) => {
	if (Date.now() - last_update_time_ethbuyback > 3600e3) {
		await get_ETH_Buyback_Info()
	}
	res.type('application/json')
	res.json({
		BuybackETHInfo: BuybackETHInfo,
		BuybackHighestApy: BuybackETHhighestapy,
		totalTVL_BUYBACK_ETH: totaltvlbuybacketh
	})
})

app.get('/api/get_buyback_info_avax', async (req, res) => {
	if (Date.now() - last_update_time_avaxbuyback > 3600e3) {
		await get_AVAX_Buyback_Info()
	}
	res.type('application/json')
	res.json({
		BuybackAVAXInfo: BuybackAVAXInfo,
		BuybackHighestApyAVAX: BuybackAVAXhighestapy,
		totalTVL_BUYBACK_AVAX: totaltvlbuybackavax
	})
})

app.get('/api/get_buyback_info_bnb', async (req, res) => {
	if (Date.now() - last_update_time_bnbbuyback > 3600e3) {
		await get_BNB_Buyback_Info()
	}
	res.type('application/json')
	res.json({
		BuybackBNBInfo: BuybackBNBInfo,
		BuybackHighestApyBNB: BuybackBNBhighestapy,
		totalTVL_BUYBACK_BNB: totaltvlbuybackbsc
	})
})


app.get('/api/user_pools/:address', async (req, res) => {
	if (Web3.utils.isAddress(req.params.address)) {
		let address = String(req.params.address).toLowerCase()

		let user = address

		await get_USER_pools(user)
		res.type('application/json')
		res.json({
			PoolsUserIn: UserPoolsInfo
		})

	}
})

// app.get('/address', (req, res) => {


// 	get_USER_pools()
// 	Web3.eth.getAccounts((err, accounts) => {
// 	  if (err) {
// 		res.json({ address: "Couldn't get the address."})
// 		// Handle the error
// 	  } else {
// 		// Return the user's wallet address to the client
// 		res.json({ Pools_User_In:  })
// 	  }
// 	})
//   })

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

