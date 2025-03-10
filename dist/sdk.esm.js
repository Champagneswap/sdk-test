import JSBI from 'jsbi';
export { default as JSBI } from 'jsbi';
import { BigNumber } from '@ethersproject/bignumber';
import invariant from 'tiny-invariant';
import { getAddress, getCreate2Address } from '@ethersproject/address';
import warning from 'tiny-warning';
import _Big from 'big.js';
import _Decimal from 'decimal.js-light';
import toFormat from 'toformat';
import { keccak256, pack } from '@ethersproject/solidity';
import { defaultAbiCoder } from '@ethersproject/abi';
import { SigningKey } from '@ethersproject/signing-key';
import { getMessage } from 'eip-712';
import { splitSignature } from '@ethersproject/bytes';
import { Contract } from '@ethersproject/contracts';
import fetch from 'isomorphic-unfetch';

var ChainId;

(function (ChainId) {
  ChainId[ChainId["MAINNET"] = 1] = "MAINNET";
  ChainId[ChainId["ROPSTEN"] = 3] = "ROPSTEN";
  ChainId[ChainId["RINKEBY"] = 4] = "RINKEBY";
  ChainId[ChainId["G\xD6RLI"] = 5] = "G\xD6RLI";
  ChainId[ChainId["KOVAN"] = 42] = "KOVAN";
  ChainId[ChainId["MATIC"] = 137] = "MATIC";
  ChainId[ChainId["MATIC_TESTNET"] = 80001] = "MATIC_TESTNET";
  ChainId[ChainId["FANTOM"] = 250] = "FANTOM";
  ChainId[ChainId["FANTOM_TESTNET"] = 4002] = "FANTOM_TESTNET";
  ChainId[ChainId["XDAI"] = 100] = "XDAI";
  ChainId[ChainId["BSC"] = 56] = "BSC";
  ChainId[ChainId["BSC_TESTNET"] = 97] = "BSC_TESTNET";
  ChainId[ChainId["ARBITRUM"] = 42161] = "ARBITRUM";
  ChainId[ChainId["ARBITRUM_TESTNET"] = 79377087078960] = "ARBITRUM_TESTNET";
  ChainId[ChainId["MOONBEAM_TESTNET"] = 1287] = "MOONBEAM_TESTNET";
  ChainId[ChainId["AVALANCHE"] = 43114] = "AVALANCHE";
  ChainId[ChainId["AVALANCHE_TESTNET"] = 43113] = "AVALANCHE_TESTNET";
  ChainId[ChainId["HECO"] = 128] = "HECO";
  ChainId[ChainId["HECO_TESTNET"] = 256] = "HECO_TESTNET";
  ChainId[ChainId["HARMONY"] = 1666600000] = "HARMONY";
  ChainId[ChainId["HARMONY_TESTNET"] = 1666700000] = "HARMONY_TESTNET";
  ChainId[ChainId["OKEX"] = 66] = "OKEX";
  ChainId[ChainId["OKEX_TESTNET"] = 65] = "OKEX_TESTNET";
  ChainId[ChainId["CELO"] = 42220] = "CELO";
  ChainId[ChainId["PALM"] = 11297108109] = "PALM";
  ChainId[ChainId["PALM_TESTNET"] = 11297108099] = "PALM_TESTNET";
  ChainId[ChainId["MOONRIVER"] = 1285] = "MOONRIVER";
  ChainId[ChainId["FUSE"] = 122] = "FUSE";
  ChainId[ChainId["TELOS"] = 40] = "TELOS";
})(ChainId || (ChainId = {}));

var Rounding;

(function (Rounding) {
  Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding || (Rounding = {}));

var TradeType;

(function (TradeType) {
  TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(TradeType || (TradeType = {}));

var KashiAction;

(function (KashiAction) {
  KashiAction[KashiAction["ADD_ASSET"] = 1] = "ADD_ASSET";
  KashiAction[KashiAction["REPAY"] = 2] = "REPAY";
  KashiAction[KashiAction["REMOVE_ASSET"] = 3] = "REMOVE_ASSET";
  KashiAction[KashiAction["REMOVE_COLLATERAL"] = 4] = "REMOVE_COLLATERAL";
  KashiAction[KashiAction["BORROW"] = 5] = "BORROW";
  KashiAction[KashiAction["GET_REPAY_SHARE"] = 6] = "GET_REPAY_SHARE";
  KashiAction[KashiAction["GET_REPAY_PART"] = 7] = "GET_REPAY_PART";
  KashiAction[KashiAction["ACCRUE"] = 8] = "ACCRUE"; // Functions that don't need accrue to be called

  KashiAction[KashiAction["ADD_COLLATERAL"] = 10] = "ADD_COLLATERAL";
  KashiAction[KashiAction["UPDATE_EXCHANGE_RATE"] = 11] = "UPDATE_EXCHANGE_RATE"; // Function on BentoBox

  KashiAction[KashiAction["BENTO_DEPOSIT"] = 20] = "BENTO_DEPOSIT";
  KashiAction[KashiAction["BENTO_WITHDRAW"] = 21] = "BENTO_WITHDRAW";
  KashiAction[KashiAction["BENTO_TRANSFER"] = 22] = "BENTO_TRANSFER";
  KashiAction[KashiAction["BENTO_TRANSFER_MULTIPLE"] = 23] = "BENTO_TRANSFER_MULTIPLE";
  KashiAction[KashiAction["BENTO_SETAPPROVAL"] = 24] = "BENTO_SETAPPROVAL"; // Any external call (except to BentoBox)

  KashiAction[KashiAction["CALL"] = 30] = "CALL";
})(KashiAction || (KashiAction = {}));

// Fee - Tiers TBD
var Fee;

(function (Fee) {
  Fee[Fee["DEFAULT"] = 30] = "DEFAULT";
})(Fee || (Fee = {}));

var OrderStatus;

(function (OrderStatus) {
  OrderStatus["FILLED"] = "FILLED";
  OrderStatus["CANCELLED"] = "CANCELLED";
  OrderStatus["EXPIRED"] = "EXPIRED";
  OrderStatus["PENDING"] = "PENDING";
})(OrderStatus || (OrderStatus = {}));

var _USDC_ADDRESS, _USD_ADDRESS, _FACTORY_ADDRESS, _ROUTER_ADDRESS, _SUSHI_ADDRESS, _MASTERCHEF_ADDRESS, _BAR_ADDRESS, _MAKER_ADDRESS, _TIMELOCK_ADDRESS, _BENTOBOX_ADDRESS, _KASHI_ADDRESS, _SUSHISWAP_SWAPPER_AD, _SUSHISWAP_MULTISWAPP, _SUSHISWAP_MULTI_EXAC, _CHAINLINK_ORACLE_ADD, _BORING_HELPER_ADDRES, _STOP_LIMIT_ORDER_ADD, _ARCHER_ROUTER_ADDRES, _MINICHEF_ADDRESS, _OLD_FARMS, _WETH9_ADDRESS, _WNATIVE_ADDRESS, _MASTERCHEF_V2_ADDRES, _ENS_REGISTRAR_ADDRES, _ZAPPER_ADDRESS, _MERKLE_DISTRIBUTOR_A, _MULTICALL2_ADDRESS;
var USDC_ADDRESS = (_USDC_ADDRESS = {}, _USDC_ADDRESS[ChainId.MAINNET] = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', _USDC_ADDRESS[ChainId.ROPSTEN] = '0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C', _USDC_ADDRESS[ChainId.KOVAN] = '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede', _USDC_ADDRESS[ChainId.MATIC] = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', _USDC_ADDRESS[ChainId.FANTOM] = '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', _USDC_ADDRESS[ChainId.BSC] = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', _USDC_ADDRESS[ChainId.HARMONY] = '0x985458E523dB3d53125813eD68c274899e9DfAb4', _USDC_ADDRESS[ChainId.HECO] = '0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B', _USDC_ADDRESS[ChainId.OKEX] = '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85', _USDC_ADDRESS[ChainId.XDAI] = '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', _USDC_ADDRESS[ChainId.ARBITRUM] = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', _USDC_ADDRESS[ChainId.AVALANCHE] = '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', _USDC_ADDRESS[ChainId.MOONRIVER] = '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D', _USDC_ADDRESS[ChainId.FUSE] = '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5', _USDC_ADDRESS);
var USD_ADDRESS = (_USD_ADDRESS = {}, _USD_ADDRESS[ChainId.MAINNET] = USDC_ADDRESS[ChainId.MAINNET], _USD_ADDRESS[ChainId.ROPSTEN] = USDC_ADDRESS[ChainId.ROPSTEN], _USD_ADDRESS[ChainId.KOVAN] = USDC_ADDRESS[ChainId.KOVAN], _USD_ADDRESS[ChainId.MATIC] = USDC_ADDRESS[ChainId.MATIC], _USD_ADDRESS[ChainId.FANTOM] = USDC_ADDRESS[ChainId.FANTOM], _USD_ADDRESS[ChainId.BSC] = USDC_ADDRESS[ChainId.BSC], _USD_ADDRESS[ChainId.HARMONY] = USDC_ADDRESS[ChainId.HARMONY], _USD_ADDRESS[ChainId.HECO] = USDC_ADDRESS[ChainId.HECO], _USD_ADDRESS[ChainId.OKEX] = USDC_ADDRESS[ChainId.OKEX], _USD_ADDRESS[ChainId.XDAI] = USDC_ADDRESS[ChainId.XDAI], _USD_ADDRESS[ChainId.ARBITRUM] = USDC_ADDRESS[ChainId.ARBITRUM], _USD_ADDRESS[ChainId.AVALANCHE] = USDC_ADDRESS[ChainId.AVALANCHE], _USD_ADDRESS[ChainId.MOONRIVER] = USDC_ADDRESS[ChainId.MOONRIVER], _USD_ADDRESS[ChainId.CELO] = '0x765DE816845861e75A25fCA122bb6898B8B1282a', _USD_ADDRESS[ChainId.FUSE] = USDC_ADDRESS[ChainId.FUSE], _USD_ADDRESS);
var FACTORY_ADDRESS = (_FACTORY_ADDRESS = {}, _FACTORY_ADDRESS[ChainId.MAINNET] = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac', _FACTORY_ADDRESS[ChainId.ROPSTEN] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.RINKEBY] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.GÖRLI] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.KOVAN] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.FANTOM] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.FANTOM_TESTNET] = '', _FACTORY_ADDRESS[ChainId.MATIC] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.MATIC_TESTNET] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.XDAI] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.BSC] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.BSC_TESTNET] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.ARBITRUM] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.ARBITRUM_TESTNET] = '', _FACTORY_ADDRESS[ChainId.MOONBEAM_TESTNET] = '0x2Ce3F07dD4c62b56a502E223A7cBE38b1d77A1b5', _FACTORY_ADDRESS[ChainId.AVALANCHE] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.AVALANCHE_TESTNET] = '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', _FACTORY_ADDRESS[ChainId.HECO] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.HECO_TESTNET] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.HARMONY] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.HARMONY_TESTNET] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.OKEX] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.OKEX_TESTNET] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.CELO] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.PALM] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.PALM_TESTNET] = '', _FACTORY_ADDRESS[ChainId.MOONRIVER] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS[ChainId.FUSE] = '0x43eA90e2b786728520e4f930d2A71a477BF2737C', _FACTORY_ADDRESS[ChainId.TELOS] = '0xFe7144941209306882706b440233a64e82FaD75E', _FACTORY_ADDRESS);
var ROUTER_ADDRESS = (_ROUTER_ADDRESS = {}, _ROUTER_ADDRESS[ChainId.MAINNET] = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', _ROUTER_ADDRESS[ChainId.RINKEBY] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.ROPSTEN] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.GÖRLI] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.KOVAN] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.FANTOM] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.FANTOM_TESTNET] = '', _ROUTER_ADDRESS[ChainId.MATIC] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.MATIC_TESTNET] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.XDAI] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.BSC] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.BSC_TESTNET] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.ARBITRUM] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.ARBITRUM_TESTNET] = '', _ROUTER_ADDRESS[ChainId.MOONBEAM_TESTNET] = '0xeB5c2BB5E83B51d83F3534Ae21E84336B8B376ef', _ROUTER_ADDRESS[ChainId.AVALANCHE] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.AVALANCHE_TESTNET] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.HECO] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.HECO_TESTNET] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.HARMONY] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.HARMONY_TESTNET] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.OKEX] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.OKEX_TESTNET] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.CELO] = '0x1421bDe4B10e8dd459b3BCb598810B1337D56842', _ROUTER_ADDRESS[ChainId.PALM] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.PALM_TESTNET] = '', _ROUTER_ADDRESS[ChainId.MOONRIVER] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS[ChainId.FUSE] = '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3', _ROUTER_ADDRESS[ChainId.TELOS] = '0x473Ef9B3e01E34b242b13F875b123E53208C88FA', _ROUTER_ADDRESS);
var SUSHI_ADDRESS = (_SUSHI_ADDRESS = {}, _SUSHI_ADDRESS[ChainId.MAINNET] = '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', _SUSHI_ADDRESS[ChainId.ROPSTEN] = '0x8786390221944Ca92dc3b1842089754202086b89', _SUSHI_ADDRESS[ChainId.RINKEBY] = '0x8786390221944Ca92dc3b1842089754202086b89', _SUSHI_ADDRESS[ChainId.GÖRLI] = '0x8786390221944Ca92dc3b1842089754202086b89', _SUSHI_ADDRESS[ChainId.KOVAN] = '0x8786390221944Ca92dc3b1842089754202086b89', _SUSHI_ADDRESS[ChainId.FANTOM] = '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC', _SUSHI_ADDRESS[ChainId.MATIC] = '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a', _SUSHI_ADDRESS[ChainId.XDAI] = '0x2995D1317DcD4f0aB89f4AE60F3f020A4F17C7CE', _SUSHI_ADDRESS[ChainId.BSC] = '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4', _SUSHI_ADDRESS[ChainId.ARBITRUM] = '0xd4d42F0b6DEF4CE0383636770eF773390d85c61A', _SUSHI_ADDRESS[ChainId.AVALANCHE] = '0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76', _SUSHI_ADDRESS[ChainId.HECO] = '0x52E00B2dA5Bd7940fFe26B609A42F957f31118D5', _SUSHI_ADDRESS[ChainId.HARMONY] = '0xBEC775Cb42AbFa4288dE81F387a9b1A3c4Bc552A', _SUSHI_ADDRESS[ChainId.OKEX] = '0x2218E0D5E0173769F5b4939a3aE423f7e5E4EAB7', _SUSHI_ADDRESS[ChainId.OKEX_TESTNET] = '', _SUSHI_ADDRESS[ChainId.CELO] = '0x29dFce9c22003A4999930382Fd00f9Fd6133Acd1', _SUSHI_ADDRESS[ChainId.PALM] = '', _SUSHI_ADDRESS[ChainId.PALM_TESTNET] = '', _SUSHI_ADDRESS[ChainId.MOONRIVER] = '0xf390830DF829cf22c53c8840554B98eafC5dCBc2', _SUSHI_ADDRESS[ChainId.TELOS] = '0x922D641a426DcFFaeF11680e5358F34d97d112E1', _SUSHI_ADDRESS[ChainId.FUSE] = '0x90708b20ccC1eb95a4FA7C8b18Fd2C22a0Ff9E78', _SUSHI_ADDRESS);
var MASTERCHEF_ADDRESS = (_MASTERCHEF_ADDRESS = {}, _MASTERCHEF_ADDRESS[ChainId.MAINNET] = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd', _MASTERCHEF_ADDRESS[ChainId.ROPSTEN] = '0x3f8Dcf0F0BFA7C016047b4EcA136AAB03eb75116', _MASTERCHEF_ADDRESS[ChainId.RINKEBY] = '0x3f8Dcf0F0BFA7C016047b4EcA136AAB03eb75116', _MASTERCHEF_ADDRESS[ChainId.GÖRLI] = '0x3f8Dcf0F0BFA7C016047b4EcA136AAB03eb75116', _MASTERCHEF_ADDRESS[ChainId.KOVAN] = '0x3f8Dcf0F0BFA7C016047b4EcA136AAB03eb75116', _MASTERCHEF_ADDRESS);
var BAR_ADDRESS = (_BAR_ADDRESS = {}, _BAR_ADDRESS[ChainId.MAINNET] = '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272', _BAR_ADDRESS[ChainId.ROPSTEN] = '0x0d2BB1b3CE43bC80ff6F85d2010F6243e1745D82', _BAR_ADDRESS[ChainId.RINKEBY] = '0x0d2BB1b3CE43bC80ff6F85d2010F6243e1745D82', _BAR_ADDRESS[ChainId.GÖRLI] = '0x0d2BB1b3CE43bC80ff6F85d2010F6243e1745D82', _BAR_ADDRESS[ChainId.KOVAN] = '0x0d2BB1b3CE43bC80ff6F85d2010F6243e1745D82', _BAR_ADDRESS);
var MAKER_ADDRESS = (_MAKER_ADDRESS = {}, _MAKER_ADDRESS[ChainId.MAINNET] = '0xE11fc0B43ab98Eb91e9836129d1ee7c3Bc95df50', _MAKER_ADDRESS[ChainId.ROPSTEN] = '0x3f8Dcf0F0BFA7C016047b4EcA136AAB03eb75116', _MAKER_ADDRESS[ChainId.RINKEBY] = '0x3f8Dcf0F0BFA7C016047b4EcA136AAB03eb75116', _MAKER_ADDRESS[ChainId.GÖRLI] = '0x3f8Dcf0F0BFA7C016047b4EcA136AAB03eb75116', _MAKER_ADDRESS[ChainId.KOVAN] = '0x3f8Dcf0F0BFA7C016047b4EcA136AAB03eb75116', _MAKER_ADDRESS);
var TIMELOCK_ADDRESS = (_TIMELOCK_ADDRESS = {}, _TIMELOCK_ADDRESS[ChainId.MAINNET] = '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1', _TIMELOCK_ADDRESS);
var BENTOBOX_ADDRESS = (_BENTOBOX_ADDRESS = {}, _BENTOBOX_ADDRESS[ChainId.MAINNET] = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966', _BENTOBOX_ADDRESS[ChainId.ROPSTEN] = '0x6BdD85290001C8Aef74f35A7606065FA15aD5ACF', _BENTOBOX_ADDRESS[ChainId.RINKEBY] = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966', _BENTOBOX_ADDRESS[ChainId.GÖRLI] = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966', _BENTOBOX_ADDRESS[ChainId.KOVAN] = '0x9A0D9920D92c178a58D99B455898Df2df22A2eE4', _BENTOBOX_ADDRESS[ChainId.FANTOM] = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966', _BENTOBOX_ADDRESS[ChainId.MATIC] = '0x0319000133d3AdA02600f0875d2cf03D442C3367', _BENTOBOX_ADDRESS[ChainId.MATIC_TESTNET] = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966', _BENTOBOX_ADDRESS[ChainId.XDAI] = '0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324', _BENTOBOX_ADDRESS[ChainId.BSC] = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966', _BENTOBOX_ADDRESS[ChainId.BSC_TESTNET] = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966', _BENTOBOX_ADDRESS[ChainId.ARBITRUM] = '0x74c764D41B77DBbb4fe771daB1939B00b146894A', _BENTOBOX_ADDRESS[ChainId.AVALANCHE] = '0x0711B6026068f736bae6B213031fCE978D48E026', _BENTOBOX_ADDRESS[ChainId.HECO] = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966', _BENTOBOX_ADDRESS[ChainId.CELO] = '0x0711B6026068f736bae6B213031fCE978D48E026', _BENTOBOX_ADDRESS[ChainId.HARMONY] = '0xA28cfF72b04f83A7E3f912e6ad34d5537708a2C2', _BENTOBOX_ADDRESS);
var KASHI_ADDRESS = (_KASHI_ADDRESS = {}, _KASHI_ADDRESS[ChainId.MAINNET] = '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42', _KASHI_ADDRESS[ChainId.KOVAN] = '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42', _KASHI_ADDRESS[ChainId.MATIC] = '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7', _KASHI_ADDRESS[ChainId.XDAI] = '0x7a6DA9903d0a481F40b8336c1463487BC8C0407e', _KASHI_ADDRESS[ChainId.BSC] = '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42', _KASHI_ADDRESS[ChainId.ARBITRUM] = '0xa010eE0226cd071BeBd8919A1F675cAE1f1f5D3e', _KASHI_ADDRESS[ChainId.AVALANCHE] = '0x513037395FA0C9c35E41f89189ceDfE3bD42fAdb', _KASHI_ADDRESS[ChainId.AVALANCHE_TESTNET] = '', _KASHI_ADDRESS[ChainId.HECO] = '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42', _KASHI_ADDRESS);
var SUSHISWAP_SWAPPER_ADDRESS = (_SUSHISWAP_SWAPPER_AD = {}, _SUSHISWAP_SWAPPER_AD[ChainId.MAINNET] = '0x1766733112408b95239aD1951925567CB1203084', _SUSHISWAP_SWAPPER_AD[ChainId.MATIC] = '0xe9589382130Ded5DF2397E2fD7A3E9b41DD2701D', _SUSHISWAP_SWAPPER_AD[ChainId.XDAI] = '0xE02BDb31C353CE95A1D74F81C93eEa70Bf7371B9', _SUSHISWAP_SWAPPER_AD[ChainId.BSC] = '0x1766733112408b95239aD1951925567CB1203084', _SUSHISWAP_SWAPPER_AD[ChainId.ARBITRUM] = '0x0bFcD5dD76218bF9e3BE8A1055f9e6D27E5745eb', _SUSHISWAP_SWAPPER_AD[ChainId.AVALANCHE] = '0x062eee8B38ab5E8ee3bc58CE505939db53E63785', _SUSHISWAP_SWAPPER_AD[ChainId.HECO] = '0x1766733112408b95239aD1951925567CB1203084', _SUSHISWAP_SWAPPER_AD);
var SUSHISWAP_MULTISWAPPER_ADDRESS = (_SUSHISWAP_MULTISWAPP = {}, _SUSHISWAP_MULTISWAPP[ChainId.MAINNET] = '0x545820d5Cc05248da112419fEfb18522c63C8e12', _SUSHISWAP_MULTISWAPP[ChainId.KOVAN] = '0xc0c1649b2c67f1a9f5ff1dd618188165e2555bcf', _SUSHISWAP_MULTISWAPP[ChainId.MATIC] = '0x73BE093B84c773fe8eE0f76DDc0829E45c215415', _SUSHISWAP_MULTISWAPP[ChainId.XDAI] = '0x735f0FbEb3b6389986BcaAf073Af07D2F8be2b93', _SUSHISWAP_MULTISWAPP[ChainId.BSC] = '0x86c655cAc122e9A2fd9Ae1f79Df27b30E357968c', _SUSHISWAP_MULTISWAPP[ChainId.ARBITRUM] = '0xbe7D5968296843756109D42946D01195320922EF', _SUSHISWAP_MULTISWAPP[ChainId.AVALANCHE] = '0xB7C8b5BFcd7212f034Be42a2aAb08b8773B76920', _SUSHISWAP_MULTISWAPP);
var SUSHISWAP_MULTI_EXACT_SWAPPER_ADDRESS = (_SUSHISWAP_MULTI_EXAC = {}, _SUSHISWAP_MULTI_EXAC[ChainId.MAINNET] = '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7', _SUSHISWAP_MULTI_EXAC[ChainId.KOVAN] = '0x75AE0Aa596D39b20addC921DeB5EE3c96279dABE', _SUSHISWAP_MULTI_EXAC[ChainId.MATIC] = '0xDB6C4EDd9545d3b815dA85E6429B699c418886f9', _SUSHISWAP_MULTI_EXAC[ChainId.XDAI] = '0x07b6e34EeCF38B02e83b6B4702699717e298967E', _SUSHISWAP_MULTI_EXAC[ChainId.BSC] = '0x1B16149Edaf1EFa6ADE6aEEF33e63C6e08c9bB1B', _SUSHISWAP_MULTI_EXAC[ChainId.ARBITRUM] = '0x860D841bfD1cfEf72A14B2b734005799F07dC7ED', _SUSHISWAP_MULTI_EXAC[ChainId.AVALANCHE] = '0x2c46217Fae90D302d1Fb5467ADA504bC2A84f448', _SUSHISWAP_MULTI_EXAC);
var PEGGED_ORACLE_ADDRESS = '0x6cbfbB38498Df0E1e7A4506593cDB02db9001564';
var SUSHISWAP_TWAP_0_ORACLE_ADDRESS = '0x66F03B0d30838A3fee971928627ea6F59B236065';
var SUSHISWAP_TWAP_1_ORACLE_ADDRESS = '0x0D51b575591F8f74a2763Ade75D3CDCf6789266f';
var CHAINLINK_ORACLE_ADDRESS = (_CHAINLINK_ORACLE_ADD = {}, _CHAINLINK_ORACLE_ADD[ChainId.MAINNET] = '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB', _CHAINLINK_ORACLE_ADD[ChainId.MATIC] = '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB', _CHAINLINK_ORACLE_ADD[ChainId.XDAI] = '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB', _CHAINLINK_ORACLE_ADD[ChainId.BSC] = '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB', _CHAINLINK_ORACLE_ADD[ChainId.ARBITRUM] = '0xB2B5C26B6868be10fF77e4E233fD231ceB90162a', _CHAINLINK_ORACLE_ADD[ChainId.AVALANCHE] = '0x43198B6fA5d89B88D2E072fA4841724571De5A59', _CHAINLINK_ORACLE_ADD);
var BORING_HELPER_ADDRESS = (_BORING_HELPER_ADDRES = {}, _BORING_HELPER_ADDRES[ChainId.MAINNET] = '0x11Ca5375AdAfd6205E41131A4409f182677996E6', _BORING_HELPER_ADDRES[ChainId.KOVAN] = '0x11Ca5375AdAfd6205E41131A4409f182677996E6', _BORING_HELPER_ADDRES[ChainId.MATIC] = '0xA77a7fD5a16237B85E0FAd02C51f459D18AE93Cd', _BORING_HELPER_ADDRES[ChainId.XDAI] = '0x97e4a0fb71243A83A6FbaEF7Cf73617594e4cF2F', _BORING_HELPER_ADDRES[ChainId.BSC] = '0x11Ca5375AdAfd6205E41131A4409f182677996E6', _BORING_HELPER_ADDRES[ChainId.ARBITRUM] = '0x9AF28d4f7Fa007686958c306BD4c8c52c2b615b8', _BORING_HELPER_ADDRES[ChainId.AVALANCHE] = '0xD18cA07a599bf5eBb9B7327871ad682F0b660748', _BORING_HELPER_ADDRES[ChainId.HECO] = '0x11Ca5375AdAfd6205E41131A4409f182677996E6', _BORING_HELPER_ADDRES);
var STOP_LIMIT_ORDER_ADDRESS = (_STOP_LIMIT_ORDER_ADD = {}, _STOP_LIMIT_ORDER_ADD[ChainId.KOVAN] = '0xce9365dB1C99897f04B3923C03ba9a5f80E8DB87', _STOP_LIMIT_ORDER_ADD[ChainId.MATIC] = '0x1aDb3Bd86bb01797667eC382a0BC6A9854b4005f', _STOP_LIMIT_ORDER_ADD[ChainId.AVALANCHE] = '0xf6f9c9DB78AF5791A296c4bF34d59E0236E990E0', _STOP_LIMIT_ORDER_ADD);
var ARCHER_ROUTER_ADDRESS = (_ARCHER_ROUTER_ADDRES = {}, _ARCHER_ROUTER_ADDRES[ChainId.MAINNET] = '0x9917C083FF9FbD29Df1367FBF7F2388A9a202431', _ARCHER_ROUTER_ADDRES);
var MINICHEF_ADDRESS = (_MINICHEF_ADDRESS = {}, _MINICHEF_ADDRESS[ChainId.MATIC] = '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', _MINICHEF_ADDRESS[ChainId.XDAI] = '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3', _MINICHEF_ADDRESS[ChainId.HARMONY] = '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287', _MINICHEF_ADDRESS[ChainId.ARBITRUM] = '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3', _MINICHEF_ADDRESS[ChainId.CELO] = '0x8084936982D089130e001b470eDf58faCA445008', _MINICHEF_ADDRESS[ChainId.MOONRIVER] = '0x3dB01570D97631f69bbb0ba39796865456Cf89A5', _MINICHEF_ADDRESS[ChainId.FUSE] = '0x182CD0C6F1FaEc0aED2eA83cd0e160c8Bd4cb063', _MINICHEF_ADDRESS);
var OLD_FARMS = (_OLD_FARMS = {}, _OLD_FARMS[ChainId.CELO] = '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', _OLD_FARMS);
var WETH9_ADDRESS = (_WETH9_ADDRESS = {}, _WETH9_ADDRESS[ChainId.MAINNET] = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', _WETH9_ADDRESS[ChainId.ROPSTEN] = '0xc778417E063141139Fce010982780140Aa0cD5Ab', _WETH9_ADDRESS[ChainId.RINKEBY] = '0xc778417E063141139Fce010982780140Aa0cD5Ab', _WETH9_ADDRESS[ChainId.GÖRLI] = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', _WETH9_ADDRESS[ChainId.KOVAN] = '0xd0A1E359811322d97991E03f863a0C30C2cF029C', _WETH9_ADDRESS[ChainId.ARBITRUM] = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', _WETH9_ADDRESS[ChainId.ARBITRUM_TESTNET] = '0xf8456e5e6A225C2C1D74D8C9a4cB2B1d5dc1153b', _WETH9_ADDRESS[ChainId.BSC] = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', _WETH9_ADDRESS[ChainId.FANTOM] = '0x74b23882a30290451A17c44f4F05243b6b58C76d', _WETH9_ADDRESS[ChainId.MATIC] = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', _WETH9_ADDRESS[ChainId.OKEX] = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', _WETH9_ADDRESS[ChainId.HECO] = '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD', _WETH9_ADDRESS[ChainId.HARMONY] = '0x6983D1E6DEf3690C4d616b13597A09e6193EA013', _WETH9_ADDRESS[ChainId.XDAI] = '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1', _WETH9_ADDRESS[ChainId.AVALANCHE] = '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', _WETH9_ADDRESS[ChainId.CELO] = '0x122013fd7dF1C6F636a5bb8f03108E876548b455', _WETH9_ADDRESS);
var WNATIVE_ADDRESS = (_WNATIVE_ADDRESS = {}, _WNATIVE_ADDRESS[ChainId.MAINNET] = WETH9_ADDRESS[ChainId.MAINNET], _WNATIVE_ADDRESS[ChainId.ROPSTEN] = WETH9_ADDRESS[ChainId.ROPSTEN], _WNATIVE_ADDRESS[ChainId.RINKEBY] = WETH9_ADDRESS[ChainId.RINKEBY], _WNATIVE_ADDRESS[ChainId.GÖRLI] = WETH9_ADDRESS[ChainId.GÖRLI], _WNATIVE_ADDRESS[ChainId.KOVAN] = WETH9_ADDRESS[ChainId.KOVAN], _WNATIVE_ADDRESS[ChainId.ARBITRUM] = WETH9_ADDRESS[ChainId.ARBITRUM], _WNATIVE_ADDRESS[ChainId.ARBITRUM_TESTNET] = WETH9_ADDRESS[ChainId.ARBITRUM_TESTNET], _WNATIVE_ADDRESS[ChainId.FANTOM] = '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', _WNATIVE_ADDRESS[ChainId.FANTOM_TESTNET] = '0xf1277d1Ed8AD466beddF92ef448A132661956621', _WNATIVE_ADDRESS[ChainId.MATIC] = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', _WNATIVE_ADDRESS[ChainId.MATIC_TESTNET] = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', _WNATIVE_ADDRESS[ChainId.XDAI] = '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', _WNATIVE_ADDRESS[ChainId.BSC] = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', _WNATIVE_ADDRESS[ChainId.BSC_TESTNET] = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', _WNATIVE_ADDRESS[ChainId.MOONBEAM_TESTNET] = '0xe73763DB808ecCDC0E36bC8E32510ED126910394', _WNATIVE_ADDRESS[ChainId.AVALANCHE] = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', _WNATIVE_ADDRESS[ChainId.AVALANCHE_TESTNET] = '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', _WNATIVE_ADDRESS[ChainId.HECO] = '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F', _WNATIVE_ADDRESS[ChainId.HECO_TESTNET] = '0x5B2DA6F42CA09C77D577a12BeaD0446148830687', _WNATIVE_ADDRESS[ChainId.HARMONY] = '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a', _WNATIVE_ADDRESS[ChainId.HARMONY_TESTNET] = '0x7a2afac38517d512E55C0bCe3b6805c10a04D60F', _WNATIVE_ADDRESS[ChainId.OKEX] = '0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15', _WNATIVE_ADDRESS[ChainId.OKEX_TESTNET] = '0x2219845942d28716c0F7C605765fABDcA1a7d9E0', _WNATIVE_ADDRESS[ChainId.CELO] = '0x471EcE3750Da237f93B8E339c536989b8978a438', _WNATIVE_ADDRESS[ChainId.PALM] = '0xF98cABF0a963452C5536330408B2590567611a71', _WNATIVE_ADDRESS[ChainId.MOONRIVER] = '0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d', _WNATIVE_ADDRESS[ChainId.FUSE] = '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629', _WNATIVE_ADDRESS[ChainId.TELOS] = '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E', _WNATIVE_ADDRESS);
var MASTERCHEF_V2_ADDRESS = (_MASTERCHEF_V2_ADDRES = {}, _MASTERCHEF_V2_ADDRES[ChainId.MAINNET] = '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d', _MASTERCHEF_V2_ADDRES);
var ENS_REGISTRAR_ADDRESS = (_ENS_REGISTRAR_ADDRES = {}, _ENS_REGISTRAR_ADDRES[ChainId.MAINNET] = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', _ENS_REGISTRAR_ADDRES[ChainId.GÖRLI] = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', _ENS_REGISTRAR_ADDRES[ChainId.ROPSTEN] = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', _ENS_REGISTRAR_ADDRES[ChainId.RINKEBY] = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', _ENS_REGISTRAR_ADDRES);
var ZAPPER_ADDRESS = (_ZAPPER_ADDRESS = {}, _ZAPPER_ADDRESS[ChainId.MAINNET] = '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2', _ZAPPER_ADDRESS[ChainId.ROPSTEN] = '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2', _ZAPPER_ADDRESS);
var MERKLE_DISTRIBUTOR_ADDRESS = (_MERKLE_DISTRIBUTOR_A = {}, _MERKLE_DISTRIBUTOR_A[ChainId.MAINNET] = '0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982', _MERKLE_DISTRIBUTOR_A[ChainId.ROPSTEN] = '0x84d1f7202e0e7dac211617017ca72a2cb5e2b955', _MERKLE_DISTRIBUTOR_A);
var MULTICALL2_ADDRESS = (_MULTICALL2_ADDRESS = {}, _MULTICALL2_ADDRESS[ChainId.MAINNET] = '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696', _MULTICALL2_ADDRESS[ChainId.ROPSTEN] = '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696', _MULTICALL2_ADDRESS[ChainId.RINKEBY] = '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696', _MULTICALL2_ADDRESS[ChainId.GÖRLI] = '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696', _MULTICALL2_ADDRESS[ChainId.KOVAN] = '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696', _MULTICALL2_ADDRESS[ChainId.ARBITRUM] = '0x80C7DD17B01855a6D2347444a0FCC36136a314de', _MULTICALL2_ADDRESS[ChainId.ARBITRUM_TESTNET] = '0xa501c031958F579dB7676fF1CE78AD305794d579', _MULTICALL2_ADDRESS[ChainId.CELO] = '0x9aac9048fC8139667D6a2597B902865bfdc225d3', _MULTICALL2_ADDRESS[ChainId.FANTOM] = '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5', _MULTICALL2_ADDRESS[ChainId.MATIC] = '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD', _MULTICALL2_ADDRESS[ChainId.MATIC_TESTNET] = '0xc1400d49baa8e307B4462cD46E0a20109D25F50f', _MULTICALL2_ADDRESS[ChainId.XDAI] = '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287', _MULTICALL2_ADDRESS[ChainId.BSC] = '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9', _MULTICALL2_ADDRESS[ChainId.AVALANCHE] = '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3', _MULTICALL2_ADDRESS[ChainId.HECO] = '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3', _MULTICALL2_ADDRESS[ChainId.HARMONY] = '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3', _MULTICALL2_ADDRESS[ChainId.OKEX] = '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3', _MULTICALL2_ADDRESS[ChainId.PALM] = '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', _MULTICALL2_ADDRESS[ChainId.MOONRIVER] = '0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5', _MULTICALL2_ADDRESS[ChainId.FUSE] = '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', _MULTICALL2_ADDRESS[ChainId.TELOS] = '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3', _MULTICALL2_ADDRESS);

var ACTION_ADD_ASSET = 1;
var ACTION_REPAY = 2;
var ACTION_REMOVE_ASSET = 3;
var ACTION_REMOVE_COLLATERAL = 4;
var ACTION_BORROW = 5;
var ACTION_GET_REPAY_SHARE = 6;
var ACTION_GET_REPAY_PART = 7;
var ACTION_ACCRUE = 8; // Functions that don't need accrue to be called

var ACTION_ADD_COLLATERAL = 10;
var ACTION_UPDATE_EXCHANGE_RATE = 11; // Function on BentoBox

var ACTION_BENTO_DEPOSIT = 20;
var ACTION_BENTO_WITHDRAW = 21;
var ACTION_BENTO_TRANSFER = 22;
var ACTION_BENTO_TRANSFER_MULTIPLE = 23;
var ACTION_BENTO_SETAPPROVAL = 24; // Any external call (except to BentoBox)

var ACTION_CALL = 30;
var MINIMUM_TARGET_UTILIZATION = /*#__PURE__*/BigNumber.from('700000000000000000'); // 70%

var MAXIMUM_TARGET_UTILIZATION = /*#__PURE__*/BigNumber.from('800000000000000000'); // 80%

var UTILIZATION_PRECISION = /*#__PURE__*/BigNumber.from('1000000000000000000');
var FULL_UTILIZATION = /*#__PURE__*/BigNumber.from('1000000000000000000');
var FULL_UTILIZATION_MINUS_MAX = /*#__PURE__*/FULL_UTILIZATION.sub(MAXIMUM_TARGET_UTILIZATION);
var STARTING_INTEREST_PER_YEAR = /*#__PURE__*/BigNumber.from(317097920).mul(BigNumber.from(60)).mul(BigNumber.from(60)).mul(BigNumber.from(24)).mul( /*#__PURE__*/BigNumber.from(365)); // approx 1% APR

var MINIMUM_INTEREST_PER_YEAR = /*#__PURE__*/BigNumber.from(79274480).mul(BigNumber.from(60)).mul(BigNumber.from(60)).mul(BigNumber.from(24)).mul( /*#__PURE__*/BigNumber.from(365)); // approx 0.25% APR

var MAXIMUM_INTEREST_PER_YEAR = /*#__PURE__*/BigNumber.from(317097920000).mul(BigNumber.from(60)).mul(BigNumber.from(60)).mul(BigNumber.from(24)).mul( /*#__PURE__*/BigNumber.from(365)); // approx 1000% APR

var INTEREST_ELASTICITY = /*#__PURE__*/BigNumber.from('28800000000000000000000000000000000000000'); // Half or double in 28800 seconds (8 hours) if linear

var FACTOR_PRECISION = /*#__PURE__*/BigNumber.from('1000000000000000000');
var PROTOCOL_FEE = /*#__PURE__*/BigNumber.from('10000'); // 10%

var PROTOCOL_FEE_DIVISOR = /*#__PURE__*/BigNumber.from('100000');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */

var AbstractCurrency = /*#__PURE__*/function () {
  /**
   * Constructs an instance of the base class `BaseCurrency`.
   * @param chainId the chain ID on which this currency resides
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  function AbstractCurrency(chainId, decimals, symbol, name) {
    !Number.isSafeInteger(chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_ID') : invariant(false) : void 0;
    !(decimals >= 0 && decimals < 255 && Number.isInteger(decimals)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'DECIMALS') : invariant(false) : void 0;
    this.chainId = chainId;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }
  /**
   * Returns token address. Useful in cases where a dependency is needed to detect changes (e.g. useEffect).
   */


  var _proto = AbstractCurrency.prototype;

  _proto.serialize = function serialize() {
    return this.wrapped.address;
  };

  return AbstractCurrency;
}();

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */

var NativeCurrency = /*#__PURE__*/function (_AbstractCurrency) {
  _inheritsLoose(NativeCurrency, _AbstractCurrency);

  function NativeCurrency() {
    var _this;

    _this = _AbstractCurrency.apply(this, arguments) || this;
    _this.isNative = true;
    _this.isToken = false;
    return _this;
  }

  return NativeCurrency;
}(AbstractCurrency);

function validateAndParseAddress(address) {
  try {
    var checksummedAddress = getAddress(address);
    process.env.NODE_ENV !== "production" ? warning(address === checksummedAddress, address + " is not checksummed.") : void 0;
    return checksummedAddress;
  } catch (error) {
     process.env.NODE_ENV !== "production" ? invariant(false, address + " is not a valid address.") : invariant(false) ;
  }
}

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */

var Token = /*#__PURE__*/function (_AbstractCurrency) {
  _inheritsLoose(Token, _AbstractCurrency);

  function Token(chainId, address, decimals, symbol, name) {
    var _this;

    _this = _AbstractCurrency.call(this, chainId, decimals, symbol, name) || this;
    _this.isNative = false;
    _this.isToken = true;
    _this.chainId = chainId;
    _this.address = validateAndParseAddress(address);
    return _this;
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */


  var _proto = Token.prototype;

  _proto.equals = function equals(other) {
    return other.isToken && this.chainId === other.chainId && this.address === other.address;
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  ;

  _proto.sortsBefore = function sortsBefore(other) {
    !(this.chainId === other.chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_IDS') : invariant(false) : void 0;
    !(this.address !== other.address) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ADDRESSES') : invariant(false) : void 0;
    return this.address.toLowerCase() < other.address.toLowerCase();
  }
  /**
   * Return this token, which does not need to be wrapped
   */
  ;

  _createClass(Token, [{
    key: "wrapped",
    get: function get() {
      return this;
    }
  }]);

  return Token;
}(AbstractCurrency);
/**
 * Compares two currencies for equality
 */

function currencyEquals(currencyA, currencyB) {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB);
  } else if (currencyA instanceof Token) {
    return false;
  } else if (currencyB instanceof Token) {
    return false;
  } else {
    return currencyA === currencyB;
  }
}

var _USDC, _extends2, _WETH, _WNATIVE;
var USDC = (_USDC = {}, _USDC[ChainId.MAINNET] = /*#__PURE__*/new Token(ChainId.MAINNET, USDC_ADDRESS[ChainId.MAINNET], 6, 'USDC', 'USD Coin'), _USDC[ChainId.ROPSTEN] = /*#__PURE__*/new Token(ChainId.ROPSTEN, USDC_ADDRESS[ChainId.ROPSTEN], 6, 'USDC', 'USD Coin'), _USDC[ChainId.KOVAN] = /*#__PURE__*/new Token(ChainId.KOVAN, USDC_ADDRESS[ChainId.KOVAN], 6, 'USDC', 'USD Coin'), _USDC[ChainId.MATIC] = /*#__PURE__*/new Token(ChainId.MATIC, USDC_ADDRESS[ChainId.MATIC], 6, 'USDC', 'USD Coin'), _USDC[ChainId.FANTOM] = /*#__PURE__*/new Token(ChainId.FANTOM, USDC_ADDRESS[ChainId.FANTOM], 6, 'USDC', 'USD Coin'), _USDC[ChainId.BSC] = /*#__PURE__*/new Token(ChainId.BSC, USDC_ADDRESS[ChainId.BSC], 18, 'USDC', 'USD Coin'), _USDC[ChainId.HARMONY] = /*#__PURE__*/new Token(ChainId.HARMONY, USDC_ADDRESS[ChainId.HARMONY], 6, 'USDC', 'USD Coin'), _USDC[ChainId.HECO] = /*#__PURE__*/new Token(ChainId.HECO, USDC_ADDRESS[ChainId.HECO], 6, 'USDC', 'USD Coin'), _USDC[ChainId.OKEX] = /*#__PURE__*/new Token(ChainId.OKEX, USDC_ADDRESS[ChainId.OKEX], 18, 'USDC', 'USD Coin'), _USDC[ChainId.XDAI] = /*#__PURE__*/new Token(ChainId.XDAI, USDC_ADDRESS[ChainId.XDAI], 6, 'USDC', 'USD Coin'), _USDC[ChainId.ARBITRUM] = /*#__PURE__*/new Token(ChainId.ARBITRUM, USDC_ADDRESS[ChainId.ARBITRUM], 6, 'USDC', 'USD Coin'), _USDC[ChainId.MOONRIVER] = /*#__PURE__*/new Token(ChainId.MOONRIVER, USDC_ADDRESS[ChainId.MOONRIVER], 6, 'USDC', 'USD Coin'), _USDC[ChainId.FUSE] = /*#__PURE__*/new Token(ChainId.FUSE, USDC_ADDRESS[ChainId.FUSE], 6, 'USDC', 'USD Coin'), _USDC);
var USD = /*#__PURE__*/_extends({}, USDC, (_extends2 = {}, _extends2[ChainId.CELO] = /*#__PURE__*/new Token(ChainId.CELO, USD_ADDRESS[ChainId.CELO], 18, 'cUSD', 'Celo Dollar'), _extends2));
var WETH9 = (_WETH = {}, _WETH[ChainId.MAINNET] = /*#__PURE__*/new Token(ChainId.MAINNET, WETH9_ADDRESS[ChainId.MAINNET], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.ROPSTEN] = /*#__PURE__*/new Token(ChainId.ROPSTEN, WETH9_ADDRESS[ChainId.ROPSTEN], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.RINKEBY] = /*#__PURE__*/new Token(ChainId.RINKEBY, WETH9_ADDRESS[ChainId.RINKEBY], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.GÖRLI] = /*#__PURE__*/new Token(ChainId.GÖRLI, WETH9_ADDRESS[ChainId.GÖRLI], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.KOVAN] = /*#__PURE__*/new Token(ChainId.KOVAN, WETH9_ADDRESS[ChainId.KOVAN], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.ARBITRUM] = /*#__PURE__*/new Token(ChainId.ARBITRUM, WETH9_ADDRESS[ChainId.ARBITRUM], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.ARBITRUM_TESTNET] = /*#__PURE__*/new Token(ChainId.ARBITRUM_TESTNET, WETH9_ADDRESS[ChainId.ARBITRUM_TESTNET], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.BSC] = /*#__PURE__*/new Token(ChainId.BSC, WETH9_ADDRESS[ChainId.BSC], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.FANTOM] = /*#__PURE__*/new Token(ChainId.FANTOM, WETH9_ADDRESS[ChainId.FANTOM], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.MATIC] = /*#__PURE__*/new Token(ChainId.MATIC, WETH9_ADDRESS[ChainId.MATIC], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.OKEX] = /*#__PURE__*/new Token(ChainId.OKEX, WETH9_ADDRESS[ChainId.OKEX], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.HECO] = /*#__PURE__*/new Token(ChainId.HECO, WETH9_ADDRESS[ChainId.HECO], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.HARMONY] = /*#__PURE__*/new Token(ChainId.HARMONY, WETH9_ADDRESS[ChainId.HARMONY], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.XDAI] = /*#__PURE__*/new Token(ChainId.XDAI, WETH9_ADDRESS[ChainId.XDAI], 18, 'WETH', 'Wrapped Ether'), _WETH[ChainId.AVALANCHE] = /*#__PURE__*/new Token(ChainId.AVALANCHE, WETH9_ADDRESS[ChainId.AVALANCHE], 18, 'WETH', 'Wrapped Ether'), _WETH);
var WNATIVE = (_WNATIVE = {}, _WNATIVE[ChainId.MAINNET] = WETH9[ChainId.MAINNET], _WNATIVE[ChainId.ROPSTEN] = WETH9[ChainId.ROPSTEN], _WNATIVE[ChainId.RINKEBY] = WETH9[ChainId.RINKEBY], _WNATIVE[ChainId.GÖRLI] = WETH9[ChainId.GÖRLI], _WNATIVE[ChainId.KOVAN] = WETH9[ChainId.KOVAN], _WNATIVE[ChainId.FANTOM] = /*#__PURE__*/new Token(ChainId.FANTOM, WNATIVE_ADDRESS[ChainId.FANTOM], 18, 'WFTM', 'Wrapped FTM'), _WNATIVE[ChainId.FANTOM_TESTNET] = /*#__PURE__*/new Token(ChainId.FANTOM_TESTNET, WNATIVE_ADDRESS[ChainId.FANTOM_TESTNET], 18, 'FTM', 'Wrapped FTM'), _WNATIVE[ChainId.MATIC] = /*#__PURE__*/new Token(ChainId.MATIC, WNATIVE_ADDRESS[ChainId.MATIC], 18, 'WMATIC', 'Wrapped Matic'), _WNATIVE[ChainId.MATIC_TESTNET] = /*#__PURE__*/new Token(ChainId.MATIC_TESTNET, WNATIVE_ADDRESS[ChainId.MATIC_TESTNET], 18, 'WMATIC', 'Wrapped Matic'), _WNATIVE[ChainId.XDAI] = /*#__PURE__*/new Token(ChainId.XDAI, WNATIVE_ADDRESS[ChainId.XDAI], 18, 'WXDAI', 'Wrapped xDai'), _WNATIVE[ChainId.BSC] = /*#__PURE__*/new Token(ChainId.BSC, WNATIVE_ADDRESS[ChainId.BSC], 18, 'WBNB', 'Wrapped BNB'), _WNATIVE[ChainId.BSC_TESTNET] = /*#__PURE__*/new Token(ChainId.BSC_TESTNET, WNATIVE_ADDRESS[ChainId.BSC_TESTNET], 18, 'WBNB', 'Wrapped BNB'), _WNATIVE[ChainId.ARBITRUM] = WETH9[ChainId.ARBITRUM], _WNATIVE[ChainId.ARBITRUM_TESTNET] = WETH9[ChainId.ARBITRUM_TESTNET], _WNATIVE[ChainId.MOONBEAM_TESTNET] = /*#__PURE__*/new Token(ChainId.MOONBEAM_TESTNET, WNATIVE_ADDRESS[ChainId.MOONBEAM_TESTNET], 18, 'WETH', 'Wrapped Ether'), _WNATIVE[ChainId.AVALANCHE] = /*#__PURE__*/new Token(ChainId.AVALANCHE, WNATIVE_ADDRESS[ChainId.AVALANCHE], 18, 'WAVAX', 'Wrapped AVAX'), _WNATIVE[ChainId.AVALANCHE_TESTNET] = /*#__PURE__*/new Token(ChainId.AVALANCHE_TESTNET, WNATIVE_ADDRESS[ChainId.AVALANCHE_TESTNET], 18, 'WAVAX', 'Wrapped AVAX'), _WNATIVE[ChainId.HECO] = /*#__PURE__*/new Token(ChainId.HECO, WNATIVE_ADDRESS[ChainId.HECO], 18, 'WHT', 'Wrapped HT'), _WNATIVE[ChainId.HECO_TESTNET] = /*#__PURE__*/new Token(ChainId.HECO_TESTNET, WNATIVE_ADDRESS[ChainId.HECO_TESTNET], 18, 'WHT', 'Wrapped HT'), _WNATIVE[ChainId.HARMONY] = /*#__PURE__*/new Token(ChainId.HARMONY, WNATIVE_ADDRESS[ChainId.HARMONY], 18, 'WONE', 'Wrapped ONE'), _WNATIVE[ChainId.HARMONY_TESTNET] = /*#__PURE__*/new Token(ChainId.HARMONY_TESTNET, WNATIVE_ADDRESS[ChainId.HARMONY_TESTNET], 18, 'WONE', 'Wrapped ONE'), _WNATIVE[ChainId.OKEX] = /*#__PURE__*/new Token(ChainId.OKEX, WNATIVE_ADDRESS[ChainId.OKEX], 18, 'WOKT', 'Wrapped OKExChain'), _WNATIVE[ChainId.OKEX_TESTNET] = /*#__PURE__*/new Token(ChainId.OKEX_TESTNET, WNATIVE_ADDRESS[ChainId.OKEX_TESTNET], 18, 'WOKT', 'Wrapped OKExChain'), _WNATIVE[ChainId.CELO] = /*#__PURE__*/new Token(ChainId.CELO, WNATIVE_ADDRESS[ChainId.CELO], 18, 'CELO', 'Celo'), _WNATIVE[ChainId.PALM] = /*#__PURE__*/new Token(ChainId.PALM, WNATIVE_ADDRESS[ChainId.PALM], 18, 'WPALM', 'Wrapped Palm'), _WNATIVE[ChainId.MOONRIVER] = /*#__PURE__*/new Token(ChainId.MOONRIVER, WNATIVE_ADDRESS[ChainId.MOONRIVER], 18, 'WMOVR', 'Wrapped Moonriver'), _WNATIVE[ChainId.FUSE] = /*#__PURE__*/new Token(ChainId.FUSE, WNATIVE_ADDRESS[ChainId.FUSE], 18, 'WFUSE', 'Wrapped Fuse'), _WNATIVE[ChainId.TELOS] = /*#__PURE__*/new Token(ChainId.TELOS, WNATIVE_ADDRESS[ChainId.TELOS], 18, 'WTLOS', 'Wrapped Telos'), _WNATIVE);

var Avalanche = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Avalanche, _NativeCurrency);

  function Avalanche(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'AVAX', 'Avalanche') || this;
  }

  Avalanche.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Avalanche(chainId);
  };

  var _proto = Avalanche.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Avalanche, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Avalanche;
}(NativeCurrency);
Avalanche._cache = {};

var Binance = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Binance, _NativeCurrency);

  function Binance(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'BNB', 'Binance Coin') || this;
  }

  Binance.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Binance(chainId);
  };

  var _proto = Binance.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Binance, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Binance;
}(NativeCurrency);
Binance._cache = {};

var Celo = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Celo, _NativeCurrency);

  function Celo(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'CELO', 'Celo') || this;
  }

  Celo.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Celo(chainId);
  };

  var _proto = Celo.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Celo, [{
    key: "wrapped",
    get: function get() {
      var wcelo = WNATIVE[this.chainId];
      !!!wcelo ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wcelo;
    }
  }]);

  return Celo;
}(NativeCurrency);
Celo._cache = {};

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */

var Ether = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Ether, _NativeCurrency);

  function Ether(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'ETH', 'Ether') || this;
  }

  Ether.onChain = function onChain(chainId) {
    var _this$_etherCache$cha;

    return (_this$_etherCache$cha = this._etherCache[chainId]) != null ? _this$_etherCache$cha : this._etherCache[chainId] = new Ether(chainId);
  };

  var _proto = Ether.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Ether, [{
    key: "wrapped",
    get: function get() {
      var weth9 = WETH9[this.chainId];
      !!!weth9 ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return weth9;
    }
  }]);

  return Ether;
}(NativeCurrency);
Ether._etherCache = {};

var Fantom = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Fantom, _NativeCurrency);

  function Fantom(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'FTM', 'Fantom') || this;
  }

  Fantom.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Fantom(chainId);
  };

  var _proto = Fantom.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Fantom, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Fantom;
}(NativeCurrency);
Fantom._cache = {};

var Harmony = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Harmony, _NativeCurrency);

  function Harmony(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'ONE', 'Harmony') || this;
  }

  Harmony.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Harmony(chainId);
  };

  var _proto = Harmony.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Harmony, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Harmony;
}(NativeCurrency);
Harmony._cache = {};

var Heco = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Heco, _NativeCurrency);

  function Heco(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'HT', 'Huobi Token') || this;
  }

  Heco.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Heco(chainId);
  };

  var _proto = Heco.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Heco, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Heco;
}(NativeCurrency);
Heco._cache = {};

var Matic = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Matic, _NativeCurrency);

  function Matic(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'MATIC', 'Matic') || this;
  }

  Matic.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Matic(chainId);
  };

  var _proto = Matic.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Matic, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Matic;
}(NativeCurrency);
Matic._cache = {};

var Movr = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Movr, _NativeCurrency);

  function Movr(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'MOVR', 'Moonriver') || this;
  }

  Movr.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Movr(chainId);
  };

  var _proto = Movr.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Movr, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Movr;
}(NativeCurrency);
Movr._cache = {};

var Okex = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Okex, _NativeCurrency);

  function Okex(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'OKT', 'OKExChain') || this;
  }

  Okex.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Okex(chainId);
  };

  var _proto = Okex.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Okex, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Okex;
}(NativeCurrency);
Okex._cache = {};

var xDai = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(xDai, _NativeCurrency);

  function xDai(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'XDAI', 'xDai') || this;
  }

  xDai.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new xDai(chainId);
  };

  var _proto = xDai.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(xDai, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return xDai;
}(NativeCurrency);
xDai._cache = {};

var Palm = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Palm, _NativeCurrency);

  function Palm(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'PALM', 'Palm') || this;
  }

  Palm.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Palm(chainId);
  };

  var _proto = Palm.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Palm, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Palm;
}(NativeCurrency);
Palm._cache = {};

var Fuse = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Fuse, _NativeCurrency);

  function Fuse(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'FUSE', 'Fuse') || this;
  }

  Fuse.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Fuse(chainId);
  };

  var _proto = Fuse.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Fuse, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Fuse;
}(NativeCurrency);
Fuse._cache = {};

var Telos = /*#__PURE__*/function (_NativeCurrency) {
  _inheritsLoose(Telos, _NativeCurrency);

  function Telos(chainId) {
    return _NativeCurrency.call(this, chainId, 18, 'TLOS', 'Telos') || this;
  }

  Telos.onChain = function onChain(chainId) {
    var _this$_cache$chainId;

    return (_this$_cache$chainId = this._cache[chainId]) != null ? _this$_cache$chainId : this._cache[chainId] = new Telos(chainId);
  };

  var _proto = Telos.prototype;

  _proto.equals = function equals(other) {
    return other.isNative && other.chainId === this.chainId;
  };

  _createClass(Telos, [{
    key: "wrapped",
    get: function get() {
      var wnative = WNATIVE[this.chainId];
      !!!wnative ? process.env.NODE_ENV !== "production" ? invariant(false, 'WRAPPED') : invariant(false) : void 0;
      return wnative;
    }
  }]);

  return Telos;
}(NativeCurrency);
Telos._cache = {};

var _NATIVE;
var NATIVE = (_NATIVE = {}, _NATIVE[ChainId.MAINNET] = /*#__PURE__*/Ether.onChain(ChainId.MAINNET), _NATIVE[ChainId.ROPSTEN] = /*#__PURE__*/Ether.onChain(ChainId.ROPSTEN), _NATIVE[ChainId.RINKEBY] = /*#__PURE__*/Ether.onChain(ChainId.RINKEBY), _NATIVE[ChainId.GÖRLI] = /*#__PURE__*/Ether.onChain(ChainId.GÖRLI), _NATIVE[ChainId.KOVAN] = /*#__PURE__*/Ether.onChain(ChainId.KOVAN), _NATIVE[ChainId.FANTOM] = /*#__PURE__*/Fantom.onChain(ChainId.FANTOM), _NATIVE[ChainId.FANTOM_TESTNET] = /*#__PURE__*/Fantom.onChain(ChainId.FANTOM_TESTNET), _NATIVE[ChainId.MATIC] = /*#__PURE__*/Matic.onChain(ChainId.MATIC), _NATIVE[ChainId.MATIC_TESTNET] = /*#__PURE__*/Matic.onChain(ChainId.MATIC_TESTNET), _NATIVE[ChainId.XDAI] = /*#__PURE__*/xDai.onChain(ChainId.XDAI), _NATIVE[ChainId.BSC] = /*#__PURE__*/Binance.onChain(ChainId.BSC), _NATIVE[ChainId.BSC_TESTNET] = /*#__PURE__*/Binance.onChain(ChainId.BSC_TESTNET), _NATIVE[ChainId.ARBITRUM] = /*#__PURE__*/Ether.onChain(ChainId.ARBITRUM), _NATIVE[ChainId.AVALANCHE] = /*#__PURE__*/Avalanche.onChain(ChainId.AVALANCHE), _NATIVE[ChainId.AVALANCHE_TESTNET] = /*#__PURE__*/Avalanche.onChain(ChainId.AVALANCHE_TESTNET), _NATIVE[ChainId.HECO] = /*#__PURE__*/Heco.onChain(ChainId.HECO), _NATIVE[ChainId.HECO_TESTNET] = /*#__PURE__*/Heco.onChain(ChainId.HECO_TESTNET), _NATIVE[ChainId.HARMONY] = /*#__PURE__*/Harmony.onChain(ChainId.HARMONY), _NATIVE[ChainId.HARMONY_TESTNET] = /*#__PURE__*/Harmony.onChain(ChainId.HARMONY_TESTNET), _NATIVE[ChainId.OKEX] = /*#__PURE__*/Okex.onChain(ChainId.OKEX), _NATIVE[ChainId.OKEX_TESTNET] = /*#__PURE__*/Okex.onChain(ChainId.OKEX_TESTNET), _NATIVE[ChainId.CELO] = /*#__PURE__*/Celo.onChain(ChainId.CELO), _NATIVE[ChainId.PALM] = /*#__PURE__*/Palm.onChain(ChainId.PALM), _NATIVE[ChainId.MOONRIVER] = /*#__PURE__*/Movr.onChain(ChainId.MOONRIVER), _NATIVE[ChainId.FUSE] = /*#__PURE__*/Fuse.onChain(ChainId.FUSE), _NATIVE[ChainId.TELOS] = /*#__PURE__*/Telos.onChain(ChainId.TELOS), _NATIVE);

var MaxUint256 = /*#__PURE__*/JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'); // exports for internal consumption

var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1);
var TWO = /*#__PURE__*/JSBI.BigInt(2);
var THREE = /*#__PURE__*/JSBI.BigInt(3);
var FIVE = /*#__PURE__*/JSBI.BigInt(5);
var TEN = /*#__PURE__*/JSBI.BigInt(10);
var _100 = /*#__PURE__*/JSBI.BigInt(100);
var _997 = /*#__PURE__*/JSBI.BigInt(997);
var _1000 = /*#__PURE__*/JSBI.BigInt(1000);

var _INIT_CODE_HASH, _SOLIDITY_TYPE_MAXIMA;
// TODO: Lots of redudency here... let's fix this.

var INIT_CODE_HASH = (_INIT_CODE_HASH = {}, _INIT_CODE_HASH[ChainId.MAINNET] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.ROPSTEN] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.RINKEBY] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.GÖRLI] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.KOVAN] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.FANTOM] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.MATIC] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.MATIC_TESTNET] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.XDAI] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.BSC] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.BSC_TESTNET] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.ARBITRUM] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.MOONBEAM_TESTNET] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.AVALANCHE] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.AVALANCHE_TESTNET] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.HECO] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.HECO_TESTNET] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.HARMONY] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.HARMONY_TESTNET] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.OKEX] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.OKEX_TESTNET] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.CELO] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.PALM] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.MOONRIVER] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH[ChainId.FUSE] = '0x1901958ef8b470f2c0a3875a79ee0bd303866d85102c0f1ea820d317024d50b5', _INIT_CODE_HASH[ChainId.TELOS] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _INIT_CODE_HASH);
var MINIMUM_LIQUIDITY = /*#__PURE__*/JSBI.BigInt(1000);
var SolidityType;

(function (SolidityType) {
  SolidityType["uint8"] = "uint8";
  SolidityType["uint256"] = "uint256";
})(SolidityType || (SolidityType = {}));

var SOLIDITY_TYPE_MAXIMA = (_SOLIDITY_TYPE_MAXIMA = {}, _SOLIDITY_TYPE_MAXIMA[SolidityType.uint8] = /*#__PURE__*/JSBI.BigInt('0xff'), _SOLIDITY_TYPE_MAXIMA[SolidityType.uint256] = /*#__PURE__*/JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), _SOLIDITY_TYPE_MAXIMA);
var LAMBDA_URL = 'https://9epjsvomc4.execute-api.us-east-1.amazonaws.com/dev';
var SOCKET_URL = 'wss://hfimt374ge.execute-api.us-east-1.amazonaws.com/dev';

// see https://stackoverflow.com/a/41102306
var CAN_SET_PROTOTYPE = ('setPrototypeOf' in Object);
/**
 * Indicates that the pair has insufficient reserves for a desired output amount. I.e. the amount of output cannot be
 * obtained by sending any amount of input.
 */

var InsufficientReservesError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(InsufficientReservesError, _Error);

  function InsufficientReservesError() {
    var _this;

    _this = _Error.call(this) || this;
    _this.isInsufficientReservesError = true;
    _this.name = _this.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_assertThisInitialized(_this), (this instanceof InsufficientReservesError ? this.constructor : void 0).prototype);
    return _this;
  }

  return InsufficientReservesError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Indicates that the input amount is too small to produce any amount of output. I.e. the amount of input sent is less
 * than the price of a single unit of output after fees.
 */

var InsufficientInputAmountError = /*#__PURE__*/function (_Error2) {
  _inheritsLoose(InsufficientInputAmountError, _Error2);

  function InsufficientInputAmountError() {
    var _this2;

    _this2 = _Error2.call(this) || this;
    _this2.isInsufficientInputAmountError = true;
    _this2.name = _this2.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_assertThisInitialized(_this2), (this instanceof InsufficientInputAmountError ? this.constructor : void 0).prototype);
    return _this2;
  }

  return InsufficientInputAmountError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var _toSignificantRoundin, _toFixedRounding;
var Decimal = /*#__PURE__*/toFormat(_Decimal);
var Big = /*#__PURE__*/toFormat(_Big);
Big.strict = true;
var toSignificantRounding = (_toSignificantRoundin = {}, _toSignificantRoundin[Rounding.ROUND_DOWN] = Decimal.ROUND_DOWN, _toSignificantRoundin[Rounding.ROUND_HALF_UP] = Decimal.ROUND_HALF_UP, _toSignificantRoundin[Rounding.ROUND_UP] = Decimal.ROUND_UP, _toSignificantRoundin);
var toFixedRounding = (_toFixedRounding = {}, _toFixedRounding[Rounding.ROUND_DOWN] = 0, _toFixedRounding[Rounding.ROUND_HALF_UP] = 1, _toFixedRounding[Rounding.ROUND_UP] = 3, _toFixedRounding);
var Fraction = /*#__PURE__*/function () {
  function Fraction(numerator, denominator) {
    if (denominator === void 0) {
      denominator = JSBI.BigInt(1);
    }

    this.numerator = JSBI.BigInt(numerator);
    this.denominator = JSBI.BigInt(denominator);
  }

  Fraction.tryParseFraction = function tryParseFraction(fractionish) {
    if (fractionish instanceof JSBI || typeof fractionish === 'number' || typeof fractionish === 'string') return new Fraction(fractionish);
    if ('numerator' in fractionish && 'denominator' in fractionish) return fractionish;
    throw new Error('Could not parse fraction');
  } // performs floor division
  ;

  var _proto = Fraction.prototype;

  _proto.invert = function invert() {
    return new Fraction(this.denominator, this.numerator);
  };

  _proto.add = function add(other) {
    var otherParsed = Fraction.tryParseFraction(other);

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.add(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.subtract = function subtract(other) {
    var otherParsed = Fraction.tryParseFraction(other);

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.subtract(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.lessThan = function lessThan(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return JSBI.lessThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.equalTo = function equalTo(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return JSBI.equal(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.greaterThan = function greaterThan(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return JSBI.greaterThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.multiply = function multiply(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.numerator), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.divide = function divide(other) {
    var otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(this.denominator, otherParsed.numerator));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(significantDigits) ? process.env.NODE_ENV !== "production" ? invariant(false, significantDigits + " is not an integer.") : invariant(false) : void 0;
    !(significantDigits > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, significantDigits + " is not positive.") : invariant(false) : void 0;
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding]
    });
    var quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(decimalPlaces) ? process.env.NODE_ENV !== "production" ? invariant(false, decimalPlaces + " is not an integer.") : invariant(false) : void 0;
    !(decimalPlaces >= 0) ? process.env.NODE_ENV !== "production" ? invariant(false, decimalPlaces + " is negative.") : invariant(false) : void 0;
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  }
  /**
   * Helper method for converting any super class back to a fraction
   */
  ;

  _createClass(Fraction, [{
    key: "quotient",
    get: function get() {
      return JSBI.divide(this.numerator, this.denominator);
    } // remainder after floor division

  }, {
    key: "remainder",
    get: function get() {
      return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator);
    }
  }, {
    key: "asFraction",
    get: function get() {
      return new Fraction(this.numerator, this.denominator);
    }
  }]);

  return Fraction;
}();

var Big$1 = /*#__PURE__*/toFormat(_Big);
Big$1.strict = true;
var CurrencyAmount = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(CurrencyAmount, _Fraction);

  function CurrencyAmount(currency, numerator, denominator) {
    var _this;

    _this = _Fraction.call(this, numerator, denominator) || this;
    !JSBI.lessThanOrEqual(_this.quotient, MaxUint256) ? process.env.NODE_ENV !== "production" ? invariant(false, 'AMOUNT') : invariant(false) : void 0;
    _this.currency = currency;
    _this.decimalScale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals));
    return _this;
  }
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */


  CurrencyAmount.fromRawAmount = function fromRawAmount(currency, rawAmount) {
    return new CurrencyAmount(currency, rawAmount);
  }
  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  ;

  CurrencyAmount.fromFractionalAmount = function fromFractionalAmount(currency, numerator, denominator) {
    return new CurrencyAmount(currency, numerator, denominator);
  };

  var _proto = CurrencyAmount.prototype;

  _proto.add = function add(other) {
    !this.currency.equals(other.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CURRENCY') : invariant(false) : void 0;

    var added = _Fraction.prototype.add.call(this, other);

    return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator);
  };

  _proto.subtract = function subtract(other) {
    !this.currency.equals(other.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CURRENCY') : invariant(false) : void 0;

    var subtracted = _Fraction.prototype.subtract.call(this, other);

    return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator);
  };

  _proto.multiply = function multiply(other) {
    var multiplied = _Fraction.prototype.multiply.call(this, other);

    return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator);
  };

  _proto.divide = function divide(other) {
    var divided = _Fraction.prototype.divide.call(this, other);

    return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator);
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN;
    }

    return _Fraction.prototype.divide.call(this, this.decimalScale).toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.currency.decimals;
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN;
    }

    !(decimalPlaces <= this.currency.decimals) ? process.env.NODE_ENV !== "production" ? invariant(false, 'DECIMALS') : invariant(false) : void 0;
    return _Fraction.prototype.divide.call(this, this.decimalScale).toFixed(decimalPlaces, format, rounding);
  };

  _proto.toExact = function toExact(format) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    Big$1.DP = this.currency.decimals;
    return new Big$1(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format);
  };

  /**
   * Returns a string representation of the address and currency amount.
   * Useful in cases where a dependency is needed to detect changes (e.g. useEffect).
   * @return string [0x6B3595068778DD592e39A122f4f5a5cF09C90fE2 - 1323.94]
   */
  _proto.serialize = function serialize() {
    return "[" + this.currency.wrapped.address + " - " + this.toExact() + "]";
  };

  _createClass(CurrencyAmount, [{
    key: "wrapped",
    get: function get() {
      if (this.currency.isToken) return this;
      return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator);
    }
  }]);

  return CurrencyAmount;
}(Fraction);

var Price = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Price, _Fraction);

  /**
   * Construct a price, either with the base and quote currency amount, or the
   * @param args
   */
  function Price() {
    var _this;

    var baseCurrency, quoteCurrency, denominator, numerator;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length === 4) {
      baseCurrency = args[0];
      quoteCurrency = args[1];
      denominator = args[2];
      numerator = args[3];
    } else {
      var result = args[0].quoteAmount.divide(args[0].baseAmount);
      var _ref = [args[0].baseAmount.currency, args[0].quoteAmount.currency, result.denominator, result.numerator];
      baseCurrency = _ref[0];
      quoteCurrency = _ref[1];
      denominator = _ref[2];
      numerator = _ref[3];
    }

    _this = _Fraction.call(this, numerator, denominator) || this;
    _this.baseCurrency = baseCurrency;
    _this.quoteCurrency = quoteCurrency;
    _this.scalar = new Fraction(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(baseCurrency.decimals)), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(quoteCurrency.decimals)));
    return _this;
  }
  /**
   * Flip the price, switching the base and quote currency
   */


  var _proto = Price.prototype;

  _proto.invert = function invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  }
  /**
   * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
   * @param other the other price
   */
  ;

  _proto.multiply = function multiply(other) {
    !this.quoteCurrency.equals(other.baseCurrency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    var fraction = _Fraction.prototype.multiply.call(this, other);

    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
  }
  /**
   * Return the amount of quote currency corresponding to a given amount of the base currency
   * @param currencyAmount the amount of base currency to quote against the price
   */
  ;

  _proto.quote = function quote(currencyAmount) {
    !currencyAmount.currency.equals(this.baseCurrency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    var result = _Fraction.prototype.multiply.call(this, currencyAmount);

    return CurrencyAmount.fromFractionalAmount(this.quoteCurrency, result.numerator, result.denominator);
  }
  /**
   * Get the value scaled by decimals for formatting
   * @private
   */
  ;

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    return this.adjustedForDecimals.toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 4;
    }

    return this.adjustedForDecimals.toFixed(decimalPlaces, format, rounding);
  };

  _createClass(Price, [{
    key: "adjustedForDecimals",
    get: function get() {
      return _Fraction.prototype.multiply.call(this, this.scalar);
    }
  }]);

  return Price;
}(Fraction);

var computePoolInitCodeHash = function computePoolInitCodeHash(_ref) {
  var creationCode = _ref.creationCode,
      deployData = _ref.deployData,
      masterDeployerAddress = _ref.masterDeployerAddress;
  return keccak256(['bytes'], [pack(['bytes', 'bytes'], [creationCode, defaultAbiCoder.encode(['bytes', 'address'], [deployData, masterDeployerAddress])])]);
};

var MASTER_DEPLOYER_ADDRESS = '0xa2A7Aa74cb94f37221FD49F5BA6F3fF876092700';
var CONSTANT_PRODUCT_POOL_CREATION_CODE = '0x6101806040523480156200001257600080fd5b5060405162004195380380620041958339810160408190526200003591620005d2565b604080518082018252600e81526d29bab9b434902628102a37b5b2b760911b6020918201528151808301835260018152603160f81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f918101919091527fc2bf45081e840722410522aa366600d7fe4da5bfb5a5b417f4d5125b4ed180a4918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6606082015246608082018190523060a08301529060c0016040516020818303038152906040528051906020012060808181525050506000806000808580602001905181019062000132919062000572565b929650909450925090506001600160a01b038416620001875760405162461bcd60e51b815260206004820152600c60248201526b5a45524f5f4144445245535360a01b60448201526064015b60405180910390fd5b826001600160a01b0316846001600160a01b03161415620001eb5760405162461bcd60e51b815260206004820152601360248201527f4944454e544943414c5f4144445245535345530000000000000000000000000060448201526064016200017e565b6001600160a01b038416301415620002365760405162461bcd60e51b815260206004820152600d60248201526c24a72b20a624a22faa27a5a2a760991b60448201526064016200017e565b6001600160a01b038316301415620002815760405162461bcd60e51b815260206004820152600d60248201526c24a72b20a624a22faa27a5a2a760991b60448201526064016200017e565b612710821115620002c85760405162461bcd60e51b815260206004820152601060248201526f494e56414c49445f535741505f46454560801b60448201526064016200017e565b60408051600481526024810182526020810180516001600160e01b03166360a56c0160e11b17905290516000916001600160a01b038816916200030c9190620006b9565b600060405180830381855afa9150503d806000811462000349576040519150601f19603f3d011682016040523d82523d6000602084013e6200034e565b606091505b5060408051600481526024810182526020810180516001600160e01b0316630605066960e11b1790529051919350600092506001600160a01b03891691620003979190620006b9565b600060405180830381855afa9150503d8060008114620003d4576040519150601f19603f3d011682016040523d82523d6000602084013e620003d9565b606091505b5060408051600481526024810182526020810180516001600160e01b0316634da3182760e01b1790529051919350600092506001600160a01b038a1691620004229190620006b9565b600060405180830381855afa9150503d80600081146200045f576040519150601f19603f3d011682016040523d82523d6000602084013e62000464565b606091505b506001600160601b031960608a811b82166101405289901b166101605260a087905261271087900360c0528451909250620004aa9150840160209081019085016200069f565b6004558151620004c490830160209081019084016200054b565b60601b6001600160601b03191660e0528051620004eb90602090830181019083016200054b565b6001600160601b0319606091821b8116610100529089901b1661012052600160095583156200052a57600880546001600160e01b0316600160e01b1790555b50505050505050505062000739565b8051620005468162000720565b919050565b6000602082840312156200055e57600080fd5b81516200056b8162000720565b9392505050565b600080600080608085870312156200058957600080fd5b8451620005968162000720565b6020860151909450620005a98162000720565b6040860151606087015191945092508015158114620005c757600080fd5b939692955090935050565b60008060408385031215620005e657600080fd5b82516001600160401b0380821115620005fe57600080fd5b818501915085601f8301126200061357600080fd5b8151818111156200062857620006286200070a565b604051601f8201601f19908116603f011681019083821181831017156200065357620006536200070a565b816040528281528860208487010111156200066d57600080fd5b62000680836020830160208801620006d7565b8096505050505050620006966020840162000539565b90509250929050565b600060208284031215620006b257600080fd5b5051919050565b60008251620006cd818460208701620006d7565b9190910192915050565b60005b83811015620006f4578181015183820152602001620006da565b8381111562000704576000848401525b50505050565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146200073657600080fd5b50565b60805160a05160c05160e05160601c6101005160601c6101205160601c6101405160601c6101605160601c61390062000895600039600081816105b301528181610791015281816108c00152818161096e01528181610ff6015281816110fe01528181611336015281816113a5015281816115e701528181611fc30152818161204a01526129e701526000818161032e0152818161070d01528181610a5301528181610b8201528181610fca01528181611095015281816112e2015281816114860152818161157901528181611d24015281816120830152818161216e01526128e801526000818161058c015281816118070152611c240152600081816103f901528181612650015281816127c6015281816128ac0152612a900152600081816102e20152612eb3015260006125520152600081816104200152818161315501526131c00152600081816103d2015261233901526139006000f3fe608060405234801561001057600080fd5b506004361061020b5760003560e01c8063627dd56a1161012a578063a69840a8116100bd578063c14ad8021161008c578063d21220a711610071578063d21220a7146105ae578063d505accf146105d5578063dd62ed3e146105e857600080fd5b8063c14ad8021461057e578063cf58879a1461058757600080fd5b8063a69840a81461051e578063a8f1f52e14610545578063a9059cbb14610558578063af8c09bf1461056b57600080fd5b80637ba0e2e7116100f95780637ba0e2e7146104a55780637ecebe00146104b857806392bc3219146104d857806395d89b41146104e257600080fd5b8063627dd56a1461045457806367e4ac2c1461046757806370a082311461047c5780637464fc3d1461049c57600080fd5b80632a07b6c7116101a25780634da31827116101715780634da31827146103f457806354cf2aeb1461041b5780635909c0d5146104425780635a3d54931461044b57600080fd5b80632a07b6c71461036c57806330adf81f1461038c578063313ce567146103b35780633644e515146103cd57600080fd5b80630c0a0cd2116101de5780630c0a0cd2146102dd5780630dfe16811461032957806318160ddd1461035057806323b872dd1461035957600080fd5b8063053da1c81461021057806306fdde03146102365780630902f1ac1461027f578063095ea7b3146102ba575b600080fd5b61022361021e366004613566565b610613565b6040519081526020015b60405180910390f35b6102726040518060400160405280600e81526020017f5375736869204c5020546f6b656e00000000000000000000000000000000000081525081565b60405161022d9190613716565b610287610c3e565b604080516dffffffffffffffffffffffffffff948516815293909216602084015263ffffffff169082015260600161022d565b6102cd6102c8366004613449565b610ca7565b604051901515815260200161022d565b6103047f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161022d565b6103047f000000000000000000000000000000000000000000000000000000000000000081565b61022360005481565b6102cd6103673660046134ae565b610d20565b61037f61037a366004613566565b610e6c565b60405161022d91906136b1565b6102237f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b6103bb601281565b60405160ff909116815260200161022d565b6102237f000000000000000000000000000000000000000000000000000000000000000081565b6103047f000000000000000000000000000000000000000000000000000000000000000081565b6102237f000000000000000000000000000000000000000000000000000000000000000081565b61022360055481565b61022360065481565b610223610462366004613566565b6111e1565b61046f611557565b60405161022d9190613657565b61022361048a36600461327d565b60016020526000908152604090205481565b61022360075481565b6102236104b3366004613566565b611656565b6102236104c636600461327d565b60036020526000908152604090205481565b6104e0611bb2565b005b6102726040518060400160405280600381526020017f534c50000000000000000000000000000000000000000000000000000000000081525081565b6102237f54726964656e743a436f6e7374616e7450726f6475637400000000000000000081565b610223610553366004613566565b611cad565b6102cd610566366004613449565b611de0565b610223610579366004613566565b611e65565b61022360045481565b6103047f000000000000000000000000000000000000000000000000000000000000000081565b6103047f000000000000000000000000000000000000000000000000000000000000000081565b6104e06105e33660046134ef565b61220e565b6102236105f6366004613475565b600260209081526000928352604080842090915290825290205481565b6000600954600114610686576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b4544000000000000000000000000000000000000000000000000000060448201526064015b60405180910390fd5b600260095560008080808061069d87890189613305565b9450945094509450945060008060006107056008546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b9250925092507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff16141561096c5761078a85846dffffffffffffffffffffffffffff16846dffffffffffffffffffffffffffff1661254a565b98506107b87f00000000000000000000000000000000000000000000000000000000000000008a89896125ad565b6040517fbd50c7b1000000000000000000000000000000000000000000000000000000008152339063bd50c7b1906107f4908790600401613716565b600060405180830381600087803b15801561080e57600080fd5b505af1158015610822573d6000803e3d6000fd5b505050506000806108316128a5565b9150915086856dffffffffffffffffffffffffffff16830310156108b1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f494e53554646494349454e545f414d4f554e545f494e00000000000000000000604482015260640161067d565b6108be8282878787612b1d565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e460628a8f60405161095d929190918252602082015260400190565b60405180910390a45050610c2a565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff1614610a21576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f494e56414c49445f494e5055545f544f4b454e00000000000000000000000000604482015260640161067d565b610a4c85836dffffffffffffffffffffffffffff16856dffffffffffffffffffffffffffff1661254a565b9850610a7a7f00000000000000000000000000000000000000000000000000000000000000008a89896125ad565b6040517fbd50c7b1000000000000000000000000000000000000000000000000000000008152339063bd50c7b190610ab6908790600401613716565b600060405180830381600087803b158015610ad057600080fd5b505af1158015610ae4573d6000803e3d6000fd5b50505050600080610af36128a5565b9150915086846dffffffffffffffffffffffffffff1682031015610b73576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f494e53554646494349454e545f414d4f554e545f494e00000000000000000000604482015260640161067d565b610b808282878787612b1d565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e460628a8f604051610c1f929190918252602082015260400190565b60405180910390a450505b505060016009555094979650505050505050565b6000806000610c9c6008546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250909192565b33600081815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92590610d0f9086815260200190565b60405180910390a350600192915050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526002602090815260408083203384529091528120547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14610dbd5773ffffffffffffffffffffffffffffffffffffffff8416600090815260026020908152604080832033845290915281208054849290610db7908490613792565b90915550505b73ffffffffffffffffffffffffffffffffffffffff841660009081526001602052604081208054849290610df2908490613792565b909155505073ffffffffffffffffffffffffffffffffffffffff808416600081815260016020526040908190208054860190555190918616907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610e5a9086815260200190565b60405180910390a35060019392505050565b6060600954600114610eda576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b45440000000000000000000000000000000000000000000000000000604482015260640161067d565b6002600955600080610eee84860186613414565b915091506000806000610f506008546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250600080610f616128a5565b60008054308252600160205260409091205492945090925090610f85878784612e33565b90910190600082610f968684613755565b610fa09190613741565b9050600083610faf8685613755565b610fb99190613741565b9050610fc53084612ee2565b610ff17f0000000000000000000000000000000000000000000000000000000000000000838d8d6125ad565b61101d7f0000000000000000000000000000000000000000000000000000000000000000828d8d6125ad565b8186039550808503945061103486868b8b8b612b1d565b6110466110418688613755565b612f75565b6007556040805160028082526060820190925290816020015b604080518082019091526000808252602082015281526020019060019003908161105f579050509b5060405180604001604052807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168152602001838152508c6000815181106110e6576110e6613847565b602002602001018190525060405180604001604052807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168152602001828152508c60018151811061114f5761114f613847565b60200260200101819052508a73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d8193649684846040516111c2929190918252602082015260400190565b60405180910390a35050600160095550979a9950505050505050505050565b600060095460011461124f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b45440000000000000000000000000000000000000000000000000000604482015260640161067d565b600260095560008080611264858701876132be565b92509250925060008060006112c86008546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b9250925092506000806112d96128a5565b915091506000807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff1614156113a3577f00000000000000000000000000000000000000000000000000000000000000009050866dffffffffffffffffffffffffffff168403915061139782886dffffffffffffffffffffffffffff16886dffffffffffffffffffffffffffff1661254a565b9a508a830392506114bf565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff1614611458576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f494e56414c49445f494e5055545f544f4b454e00000000000000000000000000604482015260640161067d565b50506008546dffffffffffffffffffffffffffff6e01000000000000000000000000000090910481168203907f0000000000000000000000000000000000000000000000000000000000000000906114b7908390888116908a1661254a565b9a508a840393505b6114cb818c8b8b6125ad565b6114d88484898989612b1d565b8073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e46062858f604051610c1f929190918252602082015260400190565b60408051600280825260608083018452926020830190803683370190505090507f0000000000000000000000000000000000000000000000000000000000000000816000815181106115ab576115ab613847565b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250507f00000000000000000000000000000000000000000000000000000000000000008160018151811061161957611619613847565b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505090565b60006009546001146116c4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b45440000000000000000000000000000000000000000000000000000604482015260640161067d565b600260095560006116d78385018561327d565b905060008060006117376008546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b9250925092506000806117486128a5565b600054919350915061175b868683612e33565b0160006117786dffffffffffffffffffffffffffff881685613792565b905060006117966dffffffffffffffffffffffffffff881685613792565b90506000806117c784848c6dffffffffffffffffffffffffffff168c6dffffffffffffffffffffffffffff166130fa565b909250905060006117ef6117db8389613792565b6117e5858b613792565b6110419190613755565b905085611a705761180360006103e86131fd565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16637cd07e476040518163ffffffff1660e01b815260040160206040518083038186803b15801561186b57600080fd5b505afa15801561187f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118a391906132a1565b90503373ffffffffffffffffffffffffffffffffffffffff821614156119dd578073ffffffffffffffffffffffffffffffffffffffff166340dc0e376040518163ffffffff1660e01b815260040160206040518083038186803b15801561190957600080fd5b505afa15801561191d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061194191906135d8565b9d508d1580159061197257507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8e14155b6119d8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f4241445f444553495245445f4c49515549444954590000000000000000000000604482015260640161067d565b611a6a565b73ffffffffffffffffffffffffffffffffffffffff811615611a5b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f4f4e4c595f4d49475241544f5200000000000000000000000000000000000000604482015260640161067d565b611a676103e883613792565b9d505b50611ab8565b6000611a926110416dffffffffffffffffffffffffffff808e16908f16613755565b90508087611aa08285613792565b611aaa9190613755565b611ab49190613741565b9d50505b8c611b1f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f494e53554646494349454e545f4c49515549444954595f4d494e544544000000604482015260640161067d565b611b298c8e6131fd565b611b3688888d8d8d612b1d565b611b43611041888a613755565b600755604080518681526020810186905273ffffffffffffffffffffffffffffffffffffffff8e169133917fdbba30eb0402b389513e87f51f4db2db80bed454384ec6925a24097c3548a02a91015b60405180910390a35050600160095550989b9a5050505050505050505050565b60408051600481526024810182526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fc14ad80200000000000000000000000000000000000000000000000000000000179052905160009173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001691611c4f919061363b565b600060405180830381855afa9150503d8060008114611c8a576040519150601f19603f3d011682016040523d82523d6000602084013e611c8f565b606091505b5091505080806020019051810190611ca791906135d8565b60045550565b60008080611cbd84860186613449565b91509150600080611d1d6008546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b50915091507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415611da857611da183836dffffffffffffffffffffffffffff16836dffffffffffffffffffffffffffff1661254a565b9450611dd6565b611dd383826dffffffffffffffffffffffffffff16846dffffffffffffffffffffffffffff1661254a565b94505b5050505092915050565b33600090815260016020526040812080548391908390611e01908490613792565b909155505073ffffffffffffffffffffffffffffffffffffffff8316600081815260016020526040908190208054850190555133907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610d0f9086815260200190565b6000600954600114611ed3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b45440000000000000000000000000000000000000000000000000000604482015260640161067d565b600260095560008080611ee8858701876132be565b9250925092506000806000611f4c6008546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250600080611f5d6128a5565b60008054308252600160205260409091205492945090925090611f81878784612e33565b90910190600082611f928684613755565b611f9c9190613741565b9050600083611fab8685613755565b611fb59190613741565b9050611fc13084612ee2565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168c73ffffffffffffffffffffffffffffffffffffffff1614156120815761204482838b6dffffffffffffffffffffffffffff1603838b6dffffffffffffffffffffffffffff160361254a565b016120717f0000000000000000000000000000000000000000000000000000000000000000828d8d6125ad565b9b5050918a90039160008b6121a1565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168c73ffffffffffffffffffffffffffffffffffffffff1614612136576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f494e56414c49445f4f55545055545f544f4b454e000000000000000000000000604482015260640161067d565b61216581828a6dffffffffffffffffffffffffffff1603848c6dffffffffffffffffffffffffffff160361254a565b820191506121957f0000000000000000000000000000000000000000000000000000000000000000838d8d6125ad565b509a50928a9003928a60005b6121ae86868b8b8b612b1d565b6121bb6110418688613755565b600755604080518381526020810183905273ffffffffffffffffffffffffffffffffffffffff8d169133917fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d819364969101611b92565b42841015612278576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f5045524d49545f444541444c494e455f45585049524544000000000000000000604482015260640161067d565b73ffffffffffffffffffffffffffffffffffffffff878116600081815260036020908152604080832080546001810190915581517f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98185015280830195909552948b166060850152608084018a905260a084019490945260c08084018990528451808503909101815260e0840190945283519301929092207f19010000000000000000000000000000000000000000000000000000000000006101008301527f000000000000000000000000000000000000000000000000000000000000000061010283015261012282015261014201604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff88169284019290925260608301869052608083018590529092509060019060a0016020604051602081039080840390855afa1580156123f1573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff81161580159061246c57508873ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b6124d2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f494e56414c49445f5045524d49545f5349474e41545552450000000000000000604482015260640161067d565b73ffffffffffffffffffffffffffffffffffffffff90811660009081526002602090815260408083208b8516808552908352928190208a905551898152919350918a16917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a350505050505050565b6000806125777f000000000000000000000000000000000000000000000000000000000000000086613755565b90508061258661271086613755565b6125909190613729565b61259a8483613755565b6125a49190613741565b95945050505050565b801561272f576040805173ffffffffffffffffffffffffffffffffffffffff8681166024830152306044830152848116606483015260006084830181905260a48084018890528451808503909101815260c490930184526020830180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f97da6d300000000000000000000000000000000000000000000000000000000017905292517f00000000000000000000000000000000000000000000000000000000000000009091169161267c9161363b565b6000604051808303816000865af19150503d80600081146126b9576040519150601f19603f3d011682016040523d82523d6000602084013e6126be565b606091505b5050905080612729576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f57495448445241575f4641494c45440000000000000000000000000000000000604482015260640161067d565b5061289f565b6040805173ffffffffffffffffffffffffffffffffffffffff8681166024830152306044830152848116606483015260848083018790528351808403909101815260a490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167ff18d03cc0000000000000000000000000000000000000000000000000000000017905291516000927f000000000000000000000000000000000000000000000000000000000000000016916127f09161363b565b6000604051808303816000865af19150503d806000811461282d576040519150601f19603f3d011682016040523d82523d6000602084013e612832565b606091505b505090508061289d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f5452414e534645525f4641494c45440000000000000000000000000000000000604482015260640161067d565b505b50505050565b60008060007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663f7888aec7f00000000000000000000000000000000000000000000000000000000000000003060405160240161293b92919073ffffffffffffffffffffffffffffffffffffffff92831681529116602082015260400190565b6040516020818303038152906040529060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050604051612989919061363b565b600060405180830381855afa9150503d80600081146129c4576040519150601f19603f3d011682016040523d82523d6000602084013e6129c9565b606091505b50915050808060200190518101906129e191906135d8565b604080517f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff90811660248301523060448084019190915283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167ff7888aec0000000000000000000000000000000000000000000000000000000017905291519295506000927f000000000000000000000000000000000000000000000000000000000000000090921691612abd919061363b565b600060405180830381855afa9150503d8060008114612af8576040519150601f19603f3d011682016040523d82523d6000602084013e612afd565b606091505b5091505080806020019051810190612b1591906135d8565b925050509091565b6dffffffffffffffffffffffffffff8511801590612b4957506dffffffffffffffffffffffffffff8411155b612baf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f4f564552464c4f57000000000000000000000000000000000000000000000000604482015260640161067d565b6008547c0100000000000000000000000000000000000000000000000000000000900463ffffffff16612c3357600880546dffffffffffffffffffffffffffff8681166e010000000000000000000000000000027fffffffff0000000000000000000000000000000000000000000000000000000090921690881617179055612df3565b6000612c44640100000000426137d5565b90508163ffffffff168163ffffffff1614158015612c7157506dffffffffffffffffffffffffffff841615155b8015612c8c57506dffffffffffffffffffffffffffff831615155b15612d515781810360006dffffffffffffffffffffffffffff86167bffffffffffffffffffffffffffff0000000000000000000000000000607087901b1681612cd757612cd7613818565b600580549290910463ffffffff851681029092019055905060006dffffffffffffffffffffffffffff8616607088901b7bffffffffffffffffffffffffffff00000000000000000000000000001681612d3257612d32613818565b0490508263ffffffff1681026006600082825401925050819055505050505b6008805463ffffffff9092167c0100000000000000000000000000000000000000000000000000000000027bffffffffffffffffffffffffffffffffffffffffffffffffffffffff6dffffffffffffffffffffffffffff8881166e010000000000000000000000000000027fffffffff00000000000000000000000000000000000000000000000000000000909516908a161793909317929092169190911790555b60408051868152602081018690527fcf2aa50876cdfbb541206f89af0ee78d44a2abf8d328e37fa4917f982149848a910160405180910390a15050505050565b6007546000908015612eda576000612e616110416dffffffffffffffffffffffffffff808816908916613755565b905081811115612ed857612710816004548484612e7e9190613792565b612e889088613755565b612e929190613755565b612e9c9190613741565b612ea69190613741565b92508215612ed857612ed87f0000000000000000000000000000000000000000000000000000000000000000846131fd565b505b509392505050565b73ffffffffffffffffffffffffffffffffffffffff821660009081526001602052604081208054839290612f17908490613792565b909155505060008054829003815560405182815273ffffffffffffffffffffffffffffffffffffffff8416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906020015b60405180910390a35050565b600081612f8457506000919050565b8160017001000000000000000000000000000000008210612faa5760809190911c9060401b5b680100000000000000008210612fc55760409190911c9060201b5b6401000000008210612fdc5760209190911c9060101b5b620100008210612ff15760109190911c9060081b5b61010082106130055760089190911c9060041b5b601082106130185760049190911c9060021b5b600882106130245760011b5b600181858161303557613035613818565b048201901c9050600181858161304d5761304d613818565b048201901c9050600181858161306557613065613818565b048201901c9050600181858161307d5761307d613818565b048201901c9050600181858161309557613095613818565b048201901c905060018185816130ad576130ad613818565b048201901c905060018185816130c5576130c5613818565b048201901c905060008185816130dd576130dd613818565b0490508082106130ed57806130ef565b815b93505050505b919050565b600080831580613108575082155b15613118575060009050806131f4565b6000846131258589613755565b61312f9190613741565b905085811161318a576131456127106002613755565b61314f8288613792565b613179907f0000000000000000000000000000000000000000000000000000000000000000613755565b6131839190613741565b91506131f2565b6000846131978789613755565b6131a19190613741565b90506131b06127106002613755565b6131ba828a613792565b6131e4907f0000000000000000000000000000000000000000000000000000000000000000613755565b6131ee9190613741565b9350505b505b94509492505050565b8060008082825461320e9190613729565b909155505073ffffffffffffffffffffffffffffffffffffffff82166000818152600160209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101612f69565b803580151581146130f557600080fd5b60006020828403121561328f57600080fd5b813561329a816138a5565b9392505050565b6000602082840312156132b357600080fd5b815161329a816138a5565b6000806000606084860312156132d357600080fd5b83356132de816138a5565b925060208401356132ee816138a5565b91506132fc6040850161326d565b90509250925092565b600080600080600060a0868803121561331d57600080fd5b8535613328816138a5565b94506020860135613338816138a5565b93506133466040870161326d565b925060608601359150608086013567ffffffffffffffff8082111561336a57600080fd5b818801915088601f83011261337e57600080fd5b81358181111561339057613390613876565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156133d6576133d6613876565b816040528281528b60208487010111156133ef57600080fd5b8260208601602083013760006020848301015280955050505050509295509295909350565b6000806040838503121561342757600080fd5b8235613432816138a5565b91506134406020840161326d565b90509250929050565b6000806040838503121561345c57600080fd5b8235613467816138a5565b946020939093013593505050565b6000806040838503121561348857600080fd5b8235613493816138a5565b915060208301356134a3816138a5565b809150509250929050565b6000806000606084860312156134c357600080fd5b83356134ce816138a5565b925060208401356134de816138a5565b929592945050506040919091013590565b600080600080600080600060e0888a03121561350a57600080fd5b8735613515816138a5565b96506020880135613525816138a5565b95506040880135945060608801359350608088013560ff8116811461354957600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806020838503121561357957600080fd5b823567ffffffffffffffff8082111561359157600080fd5b818501915085601f8301126135a557600080fd5b8135818111156135b457600080fd5b8660208285010111156135c657600080fd5b60209290920196919550909350505050565b6000602082840312156135ea57600080fd5b5051919050565b600081518084526136098160208601602086016137a9565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6000825161364d8184602087016137a9565b9190910192915050565b6020808252825182820181905260009190848201906040850190845b818110156136a557835173ffffffffffffffffffffffffffffffffffffffff1683529284019291840191600101613673565b50909695505050505050565b602080825282518282018190526000919060409081850190868401855b82811015613709578151805173ffffffffffffffffffffffffffffffffffffffff1685528601518685015292840192908501906001016136ce565b5091979650505050505050565b60208152600061329a60208301846135f1565b6000821982111561373c5761373c6137e9565b500190565b60008261375057613750613818565b500490565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561378d5761378d6137e9565b500290565b6000828210156137a4576137a46137e9565b500390565b60005b838110156137c45781810151838201526020016137ac565b8381111561289f5750506000910152565b6000826137e4576137e4613818565b500690565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b73ffffffffffffffffffffffffffffffffffffffff811681146138c757600080fd5b5056fea264697066735822122004f193ad403a2048e6ef0c1fc9da9b9f522fe2ad030c99737c73f0f04901cf7464736f6c63430008070033';
var computeConstantProductPoolAddress = function computeConstantProductPoolAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
      tokenA = _ref.tokenA,
      tokenB = _ref.tokenB,
      fee = _ref.fee,
      twap = _ref.twap;

  // does safety checks
  var _ref2 = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA],
      token0 = _ref2[0],
      token1 = _ref2[1];

  var deployData = defaultAbiCoder.encode(['address', 'address', 'uint256', 'bool'], [].concat([token0.address, token1.address].sort(), [fee, twap])); // Compute init code hash based off the bytecode, deployData & masterDeployerAddress

  var CONSTANT_PRODUCT_POOL_INIT_CODE_HASH = computePoolInitCodeHash({
    creationCode: CONSTANT_PRODUCT_POOL_CREATION_CODE,
    deployData: deployData,
    masterDeployerAddress: MASTER_DEPLOYER_ADDRESS
  }); // Compute pool address

  return getCreate2Address(factoryAddress, keccak256(['bytes'], [deployData]), CONSTANT_PRODUCT_POOL_INIT_CODE_HASH);
};

var MAX_SAFE_INTEGER = /*#__PURE__*/JSBI.BigInt(Number.MAX_SAFE_INTEGER);
var ZERO$1 = /*#__PURE__*/JSBI.BigInt(0);
var ONE$1 = /*#__PURE__*/JSBI.BigInt(1);
var TWO$1 = /*#__PURE__*/JSBI.BigInt(2);
/**
 * Computes floor(sqrt(value))
 * @param value the value for which to compute the square root, rounded down
 */

function sqrt(value) {
  !JSBI.greaterThanOrEqual(value, ZERO$1) ? process.env.NODE_ENV !== "production" ? invariant(false, 'NEGATIVE') : invariant(false) : void 0; // rely on built in sqrt if possible

  if (JSBI.lessThan(value, MAX_SAFE_INTEGER)) {
    return JSBI.BigInt(Math.floor(Math.sqrt(JSBI.toNumber(value))));
  }

  var z;
  var x;
  z = value;
  x = JSBI.add(JSBI.divide(value, TWO$1), ONE$1);

  while (JSBI.lessThan(x, z)) {
    z = x;
    x = JSBI.divide(JSBI.add(JSBI.divide(value, x), x), TWO$1);
  }

  return z;
}

var ConstantProductPool = /*#__PURE__*/function () {
  function ConstantProductPool(currencyAmountA, currencyAmountB, fee, twap) {
    if (fee === void 0) {
      fee = 25;
    }

    if (twap === void 0) {
      twap = true;
    }

    var currencyAmounts = currencyAmountA.currency.sortsBefore(currencyAmountB.currency) // does safety checks
    ? [currencyAmountA, currencyAmountB] : [currencyAmountB, currencyAmountA];
    this.liquidityToken = new Token(currencyAmounts[0].currency.chainId, ConstantProductPool.getAddress(currencyAmounts[0].currency, currencyAmounts[1].currency, fee, twap), 18, 'SLP', 'Sushi LP Token');
    this.fee = fee;
    this.twap = twap;
    this.tokenAmounts = currencyAmounts;
  }

  ConstantProductPool.getAddress = function getAddress(tokenA, tokenB, fee, twap) {
    if (fee === void 0) {
      fee = 25;
    }

    if (twap === void 0) {
      twap = true;
    }

    return computeConstantProductPoolAddress({
      factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
      tokenA: tokenA,
      tokenB: tokenB,
      fee: fee,
      twap: twap
    });
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  ;

  var _proto = ConstantProductPool.prototype;

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount) {
    !this.involvesToken(inputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO)) {
      throw new InsufficientReservesError();
    }

    var inputReserve = this.reserveOf(inputAmount.currency);
    var outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0);
    var inputAmountWithFee = JSBI.multiply(inputAmount.quotient, _997);
    var numerator = JSBI.multiply(inputAmountWithFee, outputReserve.quotient);
    var denominator = JSBI.add(JSBI.multiply(inputReserve.quotient, _1000), inputAmountWithFee);
    var outputAmount = CurrencyAmount.fromRawAmount(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0, JSBI.divide(numerator, denominator));

    if (JSBI.equal(outputAmount.quotient, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return [outputAmount, new ConstantProductPool(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };

  _proto.getInputAmount = function getInputAmount(outputAmount) {
    !this.involvesToken(outputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO) || JSBI.greaterThanOrEqual(outputAmount.quotient, this.reserveOf(outputAmount.currency).quotient)) {
      throw new InsufficientReservesError();
    }

    var outputReserve = this.reserveOf(outputAmount.currency);
    var inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0);
    var numerator = JSBI.multiply(JSBI.multiply(inputReserve.quotient, outputAmount.quotient), _1000);
    var denominator = JSBI.multiply(JSBI.subtract(outputReserve.quotient, outputAmount.quotient), _997 // 3%
    );
    var inputAmount = CurrencyAmount.fromRawAmount(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0, JSBI.add(JSBI.divide(numerator, denominator), ONE));
    return [inputAmount, new ConstantProductPool(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.fee, this.twap)];
  };

  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.currency.equals(this.liquidityToken) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LIQUIDITY') : invariant(false) : void 0;
    var tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    !(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    var liquidity;

    if (JSBI.equal(totalSupply.quotient, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].quotient, tokenAmounts[1].quotient)), MINIMUM_LIQUIDITY);
    } else {
      var amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].quotient, totalSupply.quotient), this.reserve0.quotient);
      var amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].quotient, totalSupply.quotient), this.reserve1.quotient);
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return CurrencyAmount.fromRawAmount(this.liquidityToken, liquidity);
  };

  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    !totalSupply.currency.equals(this.liquidityToken) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOTAL_SUPPLY') : invariant(false) : void 0;
    !liquidity.currency.equals(this.liquidityToken) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LIQUIDITY') : invariant(false) : void 0;
    !JSBI.lessThanOrEqual(liquidity.quotient, totalSupply.quotient) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LIQUIDITY') : invariant(false) : void 0;
    return CurrencyAmount.fromRawAmount(token, JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserveOf(token).quotient), totalSupply.quotient));
  };

  _createClass(ConstantProductPool, [{
    key: "token0Price",
    get: function get() {
      var result = this.tokenAmounts[1].divide(this.tokenAmounts[0]);
      return new Price(this.token0, this.token1, result.denominator, result.numerator);
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1Price",
    get: function get() {
      var result = this.tokenAmounts[0].divide(this.tokenAmounts[1]);
      return new Price(this.token1, this.token0, result.denominator, result.numerator);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].currency;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].currency;
    }
  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }]);

  return ConstantProductPool;
}();

var computePairAddress = function computePairAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
      tokenA = _ref.tokenA,
      tokenB = _ref.tokenB;

  var _ref2 = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA],
      token0 = _ref2[0],
      token1 = _ref2[1]; // does safety checks


  return getCreate2Address(factoryAddress, keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]), INIT_CODE_HASH[token0.chainId]);
};

var Pair = /*#__PURE__*/function () {
  function Pair(currencyAmountA, currencyAmountB) {
    var currencyAmounts = currencyAmountA.currency.sortsBefore(currencyAmountB.currency) // does safety checks
    ? [currencyAmountA, currencyAmountB] : [currencyAmountB, currencyAmountA];
    this.liquidityToken = new Token(currencyAmounts[0].currency.chainId, Pair.getAddress(currencyAmounts[0].currency, currencyAmounts[1].currency), 18, 'UNI-V2', 'Uniswap V2');
    this.tokenAmounts = currencyAmounts;
  }

  Pair.getAddress = function getAddress(tokenA, tokenB) {
    return computePairAddress({
      factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
      tokenA: tokenA,
      tokenB: tokenB
    });
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  ;

  var _proto = Pair.prototype;

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount) {
    !this.involvesToken(inputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO)) {
      throw new InsufficientReservesError();
    }

    var inputReserve = this.reserveOf(inputAmount.currency);
    var outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0);
    var inputAmountWithFee = JSBI.multiply(inputAmount.quotient, _997);
    var numerator = JSBI.multiply(inputAmountWithFee, outputReserve.quotient);
    var denominator = JSBI.add(JSBI.multiply(inputReserve.quotient, _1000), inputAmountWithFee);
    var outputAmount = CurrencyAmount.fromRawAmount(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0, JSBI.divide(numerator, denominator));

    if (JSBI.equal(outputAmount.quotient, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };

  _proto.getInputAmount = function getInputAmount(outputAmount) {
    !this.involvesToken(outputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO) || JSBI.greaterThanOrEqual(outputAmount.quotient, this.reserveOf(outputAmount.currency).quotient)) {
      throw new InsufficientReservesError();
    }

    var outputReserve = this.reserveOf(outputAmount.currency);
    var inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0);
    var numerator = JSBI.multiply(JSBI.multiply(inputReserve.quotient, outputAmount.quotient), _1000);
    var denominator = JSBI.multiply(JSBI.subtract(outputReserve.quotient, outputAmount.quotient), _997);
    var inputAmount = CurrencyAmount.fromRawAmount(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0, JSBI.add(JSBI.divide(numerator, denominator), ONE));
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };

  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.currency.equals(this.liquidityToken) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LIQUIDITY') : invariant(false) : void 0;
    var tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    !(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    var liquidity;

    if (JSBI.equal(totalSupply.quotient, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].quotient, tokenAmounts[1].quotient)), MINIMUM_LIQUIDITY);
    } else {
      var amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].quotient, totalSupply.quotient), this.reserve0.quotient);
      var amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].quotient, totalSupply.quotient), this.reserve1.quotient);
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return CurrencyAmount.fromRawAmount(this.liquidityToken, liquidity);
  };

  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity, feeOn, kLast) {
    if (feeOn === void 0) {
      feeOn = false;
    }

    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    !totalSupply.currency.equals(this.liquidityToken) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOTAL_SUPPLY') : invariant(false) : void 0;
    !liquidity.currency.equals(this.liquidityToken) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LIQUIDITY') : invariant(false) : void 0;
    !JSBI.lessThanOrEqual(liquidity.quotient, totalSupply.quotient) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LIQUIDITY') : invariant(false) : void 0;
    var totalSupplyAdjusted;

    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      !!!kLast ? process.env.NODE_ENV !== "production" ? invariant(false, 'K_LAST') : invariant(false) : void 0;
      var kLastParsed = JSBI.BigInt(kLast);

      if (!JSBI.equal(kLastParsed, ZERO)) {
        var rootK = sqrt(JSBI.multiply(this.reserve0.quotient, this.reserve1.quotient));
        var rootKLast = sqrt(kLastParsed);

        if (JSBI.greaterThan(rootK, rootKLast)) {
          var numerator = JSBI.multiply(totalSupply.quotient, JSBI.subtract(rootK, rootKLast));
          var denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast);
          var feeLiquidity = JSBI.divide(numerator, denominator);
          totalSupplyAdjusted = totalSupply.add(CurrencyAmount.fromRawAmount(this.liquidityToken, feeLiquidity));
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }

    return CurrencyAmount.fromRawAmount(token, JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserveOf(token).quotient), totalSupplyAdjusted.quotient));
  };

  _createClass(Pair, [{
    key: "token0Price",
    get: function get() {
      var result = this.tokenAmounts[1].divide(this.tokenAmounts[0]);
      return new Price(this.token0, this.token1, result.denominator, result.numerator);
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1Price",
    get: function get() {
      var result = this.tokenAmounts[0].divide(this.tokenAmounts[1]);
      return new Price(this.token1, this.token0, result.denominator, result.numerator);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].currency;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].currency;
    }
  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }]);

  return Pair;
}();

var ONE_HUNDRED = /*#__PURE__*/new Fraction( /*#__PURE__*/JSBI.BigInt(100));
/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */

function toPercent(fraction) {
  return new Percent(fraction.numerator, fraction.denominator);
}

var Percent = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Percent, _Fraction);

  function Percent() {
    var _this;

    _this = _Fraction.apply(this, arguments) || this;
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */

    _this.isPercent = true;
    return _this;
  }

  var _proto = Percent.prototype;

  _proto.add = function add(other) {
    return toPercent(_Fraction.prototype.add.call(this, other));
  };

  _proto.subtract = function subtract(other) {
    return toPercent(_Fraction.prototype.subtract.call(this, other));
  };

  _proto.multiply = function multiply(other) {
    return toPercent(_Fraction.prototype.multiply.call(this, other));
  };

  _proto.divide = function divide(other) {
    return toPercent(_Fraction.prototype.divide.call(this, other));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 5;
    }

    return _Fraction.prototype.multiply.call(this, ONE_HUNDRED).toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 2;
    }

    return _Fraction.prototype.multiply.call(this, ONE_HUNDRED).toFixed(decimalPlaces, format, rounding);
  };

  return Percent;
}(Fraction);

var Route = /*#__PURE__*/function () {
  function Route(pairs, input, output) {
    this._midPrice = null;
    !(pairs.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PAIRS') : invariant(false) : void 0;
    var chainId = pairs[0].chainId;
    !pairs.every(function (pair) {
      return pair.chainId === chainId;
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_IDS') : invariant(false) : void 0;
    var wrappedInput = input.wrapped;
    !pairs[0].involvesToken(wrappedInput) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
    !(typeof output === 'undefined' || pairs[pairs.length - 1].involvesToken(output.wrapped)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
    var path = [wrappedInput];

    for (var _iterator = _createForOfIteratorHelperLoose(pairs.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pair = _step$value[1];
      var currentInput = path[i];
      !(currentInput.equals(pair.token0) || currentInput.equals(pair.token1)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PATH') : invariant(false) : void 0;

      var _output = currentInput.equals(pair.token0) ? pair.token1 : pair.token0;

      path.push(_output);
    }

    this.pairs = pairs;
    this.path = path;
    this.input = input;
    this.output = output;
  }

  _createClass(Route, [{
    key: "midPrice",
    get: function get() {
      if (this._midPrice !== null) return this._midPrice;
      var prices = [];

      for (var _iterator2 = _createForOfIteratorHelperLoose(this.pairs.entries()), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
            i = _step2$value[0],
            pair = _step2$value[1];
        prices.push(this.path[i].equals(pair.token0) ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.quotient, pair.reserve1.quotient) : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.quotient, pair.reserve0.quotient));
      }

      var reduced = prices.slice(1).reduce(function (accumulator, currentValue) {
        return accumulator.multiply(currentValue);
      }, prices[0]);
      return this._midPrice = new Price(this.input, this.output, reduced.denominator, reduced.numerator);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.pairs[0].chainId;
    }
  }]);

  return Route;
}();

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */

function computePriceImpact(midPrice, inputAmount, outputAmount) {
  var quotedOutputAmount = midPrice.quote(inputAmount); // calculate price impact := (exactQuote - outputAmount) / exactQuote

  var priceImpact = quotedOutputAmount.subtract(outputAmount).divide(quotedOutputAmount);
  return new Percent(priceImpact.numerator, priceImpact.denominator);
}

// `maxSize` by removing the last item

function sortedInsert(items, add, maxSize, comparator) {
  !(maxSize > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_SIZE_ZERO') : invariant(false) : void 0; // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize

  !(items.length <= maxSize) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ITEMS_SIZE') : invariant(false) : void 0; // short circuit first item add

  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    var isFull = items.length === maxSize; // short circuit if full and the additional item does not come before the last item

    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add;
    }

    var lo = 0,
        hi = items.length;

    while (lo < hi) {
      var mid = lo + hi >>> 1;

      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}

// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first

function inputOutputComparator(a, b) {
  // must have same input and output token for comparison
  !a.inputAmount.currency.equals(b.inputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT_CURRENCY') : invariant(false) : void 0;
  !a.outputAmount.currency.equals(b.outputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT_CURRENCY') : invariant(false) : void 0;

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    } // trade A requires less input than trade B, so A should come first


    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
} // extension of the input output comparator that also considers other dimensions of the trade in ranking them

function tradeComparator(a, b) {
  var ioComp = inputOutputComparator(a, b);

  if (ioComp !== 0) {
    return ioComp;
  } // consider lowest slippage next, since these are less likely to fail


  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1;
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1;
  } // finally consider the number of hops since each hop costs gas


  return a.route.path.length - b.route.path.length;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */

var Trade = /*#__PURE__*/function () {
  function Trade(route, amount, tradeType) {
    this.route = route;
    this.tradeType = tradeType;
    var tokenAmounts = new Array(route.path.length);

    if (tradeType === TradeType.EXACT_INPUT) {
      !amount.currency.equals(route.input) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
      tokenAmounts[0] = amount.wrapped;

      for (var i = 0; i < route.path.length - 1; i++) {
        var pair = route.pairs[i];

        var _pair$getOutputAmount = pair.getOutputAmount(tokenAmounts[i]),
            outputAmount = _pair$getOutputAmount[0];

        tokenAmounts[i + 1] = outputAmount;
      }

      this.inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
      this.outputAmount = CurrencyAmount.fromFractionalAmount(route.output, tokenAmounts[tokenAmounts.length - 1].numerator, tokenAmounts[tokenAmounts.length - 1].denominator);
    } else {
      !amount.currency.equals(route.output) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
      tokenAmounts[tokenAmounts.length - 1] = amount.wrapped;

      for (var _i = route.path.length - 1; _i > 0; _i--) {
        var _pair = route.pairs[_i - 1];

        var _pair$getInputAmount = _pair.getInputAmount(tokenAmounts[_i]),
            inputAmount = _pair$getInputAmount[0];

        tokenAmounts[_i - 1] = inputAmount;
      }

      this.inputAmount = CurrencyAmount.fromFractionalAmount(route.input, tokenAmounts[0].numerator, tokenAmounts[0].denominator);
      this.outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
    }

    this.executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient);
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount);
  }
  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */


  Trade.exactIn = function exactIn(route, amountIn) {
    return new Trade(route, amountIn, TradeType.EXACT_INPUT);
  }
  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  ;

  Trade.exactOut = function exactOut(route, amountOut) {
    return new Trade(route, amountOut, TradeType.EXACT_OUTPUT);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  var _proto = Trade.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SLIPPAGE_TOLERANCE') : invariant(false) : void 0;

    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return this.outputAmount;
    } else {
      var slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(this.outputAmount.quotient).quotient;
      return CurrencyAmount.fromRawAmount(this.outputAmount.currency, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SLIPPAGE_TOLERANCE') : invariant(false) : void 0;

    if (this.tradeType === TradeType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      var slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.quotient).quotient;
      return CurrencyAmount.fromRawAmount(this.inputAmount.currency, slippageAdjustedAmountIn);
    }
  }
  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param nextAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param currencyAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  Trade.bestTradeExactIn = function bestTradeExactIn(pairs, currencyAmountIn, currencyOut, _temp, // used in recursion.
  currentPairs, nextAmountIn, bestTrades) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$maxNumResults = _ref.maxNumResults,
        maxNumResults = _ref$maxNumResults === void 0 ? 3 : _ref$maxNumResults,
        _ref$maxHops = _ref.maxHops,
        maxHops = _ref$maxHops === void 0 ? 3 : _ref$maxHops;

    if (currentPairs === void 0) {
      currentPairs = [];
    }

    if (nextAmountIn === void 0) {
      nextAmountIn = currencyAmountIn;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pairs.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PAIRS') : invariant(false) : void 0;
    !(maxHops > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_HOPS') : invariant(false) : void 0;
    !(currencyAmountIn === nextAmountIn || currentPairs.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INVALID_RECURSION') : invariant(false) : void 0;
    var amountIn = nextAmountIn.wrapped;
    var tokenOut = currencyOut.wrapped;

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i]; // pair irrelevant

      if (!pair.token0.equals(amountIn.currency) && !pair.token1.equals(amountIn.currency)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;
      var amountOut = void 0;

      try {
        ;

        var _pair$getOutputAmount2 = pair.getOutputAmount(amountIn);

        amountOut = _pair$getOutputAmount2[0];
      } catch (error) {
        // input too low
        if (error.isInsufficientInputAmountError) {
          continue;
        }

        throw error;
      } // we have arrived at the output token, so this is the final trade of one of the paths


      if (amountOut.currency.equals(tokenOut)) {
        sortedInsert(bestTrades, new Trade(new Route([].concat(currentPairs, [pair]), currencyAmountIn.currency, currencyOut), currencyAmountIn, TradeType.EXACT_INPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops

        Trade.bestTradeExactIn(pairsExcludingThisPair, currencyAmountIn, currencyOut, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [].concat(currentPairs, [pair]), amountOut, bestTrades);
      }
    }

    return bestTrades;
  }
  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   */
  ;

  _proto.worstExecutionPrice = function worstExecutionPrice(slippageTolerance) {
    return new Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn(slippageTolerance).quotient, this.minimumAmountOut(slippageTolerance).quotient);
  }
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param nextAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param currencyAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  Trade.bestTradeExactOut = function bestTradeExactOut(pairs, currencyIn, currencyAmountOut, _temp2, // used in recursion.
  currentPairs, nextAmountOut, bestTrades) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        _ref2$maxNumResults = _ref2.maxNumResults,
        maxNumResults = _ref2$maxNumResults === void 0 ? 3 : _ref2$maxNumResults,
        _ref2$maxHops = _ref2.maxHops,
        maxHops = _ref2$maxHops === void 0 ? 3 : _ref2$maxHops;

    if (currentPairs === void 0) {
      currentPairs = [];
    }

    if (nextAmountOut === void 0) {
      nextAmountOut = currencyAmountOut;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pairs.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PAIRS') : invariant(false) : void 0;
    !(maxHops > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_HOPS') : invariant(false) : void 0;
    !(currencyAmountOut === nextAmountOut || currentPairs.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INVALID_RECURSION') : invariant(false) : void 0;
    var amountOut = nextAmountOut.wrapped;
    var tokenIn = currencyIn.wrapped;

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i]; // pair irrelevant

      if (!pair.token0.equals(amountOut.currency) && !pair.token1.equals(amountOut.currency)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;
      var amountIn = void 0;

      try {
        ;

        var _pair$getInputAmount2 = pair.getInputAmount(amountOut);

        amountIn = _pair$getInputAmount2[0];
      } catch (error) {
        // not enough liquidity in this pair
        if (error.isInsufficientReservesError) {
          continue;
        }

        throw error;
      } // we have arrived at the input token, so this is the first trade of one of the paths


      if (amountIn.currency.equals(tokenIn)) {
        sortedInsert(bestTrades, new Trade(new Route([pair].concat(currentPairs), currencyIn, currencyAmountOut.currency), currencyAmountOut, TradeType.EXACT_OUTPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops

        Trade.bestTradeExactOut(pairsExcludingThisPair, currencyIn, currencyAmountOut, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [pair].concat(currentPairs), amountIn, bestTrades);
      }
    }

    return bestTrades;
  };

  return Trade;
}();

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

var PoolType;

(function (PoolType) {
  PoolType["ConstantProduct"] = "ConstantProduct";
  PoolType["Weighted"] = "Weighted";
  PoolType["Hybrid"] = "Hybrid";
  PoolType["ConcentratedLiquidity"] = "ConcentratedLiquidity";
})(PoolType || (PoolType = {}));

var Pool = function Pool(_info) {
  var info = _extends({
    minLiquidity: 1000,
    swapGasCost: 40000
  }, _info);

  this.address = info.address;
  this.token0 = info.token0;
  this.token1 = info.token1;
  this.type = info.type;
  this.reserve0 = info.reserve0;
  this.reserve1 = info.reserve1;
  this.fee = info.fee;
  this.minLiquidity = info.minLiquidity;
  this.swapGasCost = info.swapGasCost;
};
var RConstantProductPool = /*#__PURE__*/function (_Pool) {
  _inheritsLoose(RConstantProductPool, _Pool);

  function RConstantProductPool(info) {
    return _Pool.call(this, _extends({
      type: PoolType.ConstantProduct
    }, info)) || this;
  }

  return RConstantProductPool;
}(Pool);
var RHybridPool = /*#__PURE__*/function (_Pool2) {
  _inheritsLoose(RHybridPool, _Pool2);

  function RHybridPool(info) {
    var _this;

    _this = _Pool2.call(this, _extends({
      type: PoolType.Hybrid
    }, info)) || this;
    _this.A = info.A;
    return _this;
  }

  return RHybridPool;
}(Pool);
var RWeightedPool = /*#__PURE__*/function (_Pool3) {
  _inheritsLoose(RWeightedPool, _Pool3);

  function RWeightedPool(info) {
    var _this2;

    _this2 = _Pool3.call(this, _extends({
      type: PoolType.Weighted
    }, info)) || this;
    _this2.weight0 = info.weight0;
    _this2.weight1 = info.weight1;
    return _this2;
  }

  return RWeightedPool;
}(Pool);
var CL_MIN_TICK = -887272;
var CL_MAX_TICK = -CL_MIN_TICK - 1;
var RConcentratedLiquidityPool = /*#__PURE__*/function (_Pool4) {
  _inheritsLoose(RConcentratedLiquidityPool, _Pool4);

  function RConcentratedLiquidityPool(info) {
    var _this3;

    _this3 = _Pool4.call(this, _extends({
      type: PoolType.ConcentratedLiquidity,
      reserve0: BigNumber.from(0),
      reserve1: BigNumber.from(0)
    }, info)) || this;
    _this3.liquidity = info.liquidity;
    _this3.sqrtPrice = info.sqrtPrice;
    _this3.nearestTick = info.nearestTick;
    _this3.ticks = info.ticks;
    return _this3;
  }

  return RConcentratedLiquidityPool;
}(Pool);
var RouteStatus;

(function (RouteStatus) {
  RouteStatus["Success"] = "Success";
  RouteStatus["NoWay"] = "NoWay";
  RouteStatus["Partial"] = "Partial";
})(RouteStatus || (RouteStatus = {}));

var types = {
  EIP712Domain: [{
    name: 'name',
    type: 'string'
  }, {
    name: 'chainId',
    type: 'uint256'
  }, {
    name: 'verifyingContract',
    type: 'address'
  }],
  LimitOrder: [{
    name: 'maker',
    type: 'address'
  }, {
    name: 'tokenIn',
    type: 'address'
  }, {
    name: 'tokenOut',
    type: 'address'
  }, {
    name: 'amountIn',
    type: 'uint256'
  }, {
    name: 'amountOut',
    type: 'uint256'
  }, {
    name: 'recipient',
    type: 'address'
  }, {
    name: 'startTime',
    type: 'uint256'
  }, {
    name: 'endTime',
    type: 'uint256'
  }, {
    name: 'stopPrice',
    type: 'uint256'
  }, {
    name: 'oracleAddress',
    type: 'address'
  }, {
    name: 'oracleData',
    type: 'bytes32'
  }]
};
var bentoTypes = {
  EIP712Domain: [{
    name: 'name',
    type: 'string'
  }, {
    name: 'chainId',
    type: 'uint256'
  }, {
    name: 'verifyingContract',
    type: 'address'
  }],
  SetMasterContractApproval: [{
    name: 'warning',
    type: 'string'
  }, {
    name: 'user',
    type: 'address'
  }, {
    name: 'masterContract',
    type: 'address'
  }, {
    name: 'approved',
    type: 'bool'
  }, {
    name: 'nonce',
    type: 'uint256'
  }]
};
var name = 'LimitOrder';

var getSignature = function getSignature(message, chainId, privateKey) {
  var domain = {
    name: name,
    chainId: chainId,
    verifyingContract: STOP_LIMIT_ORDER_ADDRESS[chainId]
  };
  return sign({
    types: types,
    primaryType: 'LimitOrder',
    domain: domain,
    message: message
  }, privateKey);
};
var getTypedData = function getTypedData(message, chainId) {
  var domain = {
    name: name,
    chainId: chainId,
    verifyingContract: STOP_LIMIT_ORDER_ADDRESS[chainId]
  };
  return {
    types: types,
    primaryType: 'LimitOrder',
    domain: domain,
    message: message
  };
};
var getTypedDataBento = function getTypedDataBento(message, chainId) {
  var domain = {
    name: 'BentoBox V1',
    chainId: chainId,
    verifyingContract: BENTOBOX_ADDRESS[chainId]
  };
  return {
    types: bentoTypes,
    primaryType: 'SetMasterContractApproval',
    domain: domain,
    message: message
  };
};
var getTypeHash = function getTypeHash(typedData) {
  var message = getMessage(typedData, true).toString('hex');
  return "0x" + message;
};

var sign = function sign(typedData, privateKey) {
  var message = getMessage(typedData, true);
  var signingKey = new SigningKey(privateKey);

  var _signingKey$signDiges = signingKey.signDigest(message),
      v = _signingKey$signDiges.v,
      r = _signingKey$signDiges.r,
      s = _signingKey$signDiges.s;

  return {
    v: v,
    r: r,
    s: s
  };
};

var getSignatureWithProvider = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(message, chainId, provider) {
    var typedData, signature, _splitSignature, v, r, s;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            typedData = getTypedData(message, chainId);
            _context.next = 3;
            return provider.send('eth_signTypedData_v4', [message.maker, JSON.stringify(typedData)]);

          case 3:
            signature = _context.sent;
            _splitSignature = splitSignature(signature), v = _splitSignature.v, r = _splitSignature.r, s = _splitSignature.s;
            return _context.abrupt("return", {
              v: v,
              r: r,
              s: s
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getSignatureWithProvider(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var getSignatureWithProviderBentobox = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(message, chainId, provider) {
    var typedData, signature, _splitSignature2, v, r, s;

    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            typedData = getTypedDataBento(message, chainId);
            _context2.next = 3;
            return provider.send('eth_signTypedData_v4', [message.user, JSON.stringify(typedData)]);

          case 3:
            signature = _context2.sent;
            _splitSignature2 = splitSignature(signature), v = _splitSignature2.v, r = _splitSignature2.r, s = _splitSignature2.s;
            return _context2.abrupt("return", {
              v: v,
              r: r,
              s: s
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getSignatureWithProviderBentobox(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var getSignatureBento = /*#__PURE__*/function () {
  var _ref3 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(bentoApproval, chainId, privateKey) {
    var domain;
    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            domain = {
              name: 'BentoBox V1',
              chainId: chainId,
              verifyingContract: BENTOBOX_ADDRESS[chainId]
            };
            return _context3.abrupt("return", sign({
              types: bentoTypes,
              primaryType: 'SetMasterContractApproval',
              domain: domain,
              message: bentoApproval
            }, privateKey));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getSignatureBento(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

function validateSolidityTypeInstance(value, solidityType) {
  !JSBI.greaterThanOrEqual(value, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, value + " is not a " + solidityType + ".") : invariant(false) : void 0;
  !JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]) ? process.env.NODE_ENV !== "production" ? invariant(false, value + " is not a " + solidityType + ".") : invariant(false) : void 0;
}

function toHex(currencyAmount) {
  return "0x" + currencyAmount.quotient.toString(16);
}
var ZERO_HEX = '0x0';
/**
 * Represents the Uniswap V2 Router, and has static methods for helping execute trades.
 */

var Router = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Router() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */


  Router.swapCallParameters = function swapCallParameters(trade, options) {
    var etherIn = trade.inputAmount.currency.isNative;
    var etherOut = trade.outputAmount.currency.isNative; // the router does not support both ether in and out

    !!(etherIn && etherOut) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ETHER_IN_OUT') : invariant(false) : void 0;
    !(!('ttl' in options) || options.ttl > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TTL') : invariant(false) : void 0;
    var to = validateAndParseAddress(options.recipient);
    var amountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
    var amountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
    var path = trade.route.path.map(function (token) {
      return token.address;
    });
    var deadline = 'ttl' in options ? "0x" + (Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16) : "0x" + options.deadline.toString(16);
    var useFeeOnTransfer = Boolean(options.feeOnTransfer);
    var methodName;
    var args;
    var value;

    switch (trade.tradeType) {
      case TradeType.EXACT_INPUT:
        if (etherIn) {
          methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens'; // (uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = useFeeOnTransfer ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens' : 'swapExactTokensForTokens'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        }

        break;

      case TradeType.EXACT_OUTPUT:
        !!useFeeOnTransfer ? process.env.NODE_ENV !== "production" ? invariant(false, 'EXACT_OUT_FOT') : invariant(false) : void 0;

        if (etherIn) {
          methodName = 'swapETHForExactTokens'; // (uint amountOut, address[] calldata path, address to, uint deadline)

          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = 'swapTokensForExactETH'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = 'swapTokensForExactTokens'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        }

        break;
    }

    return {
      methodName: methodName,
      args: args,
      value: value
    };
  };

  return Router;
}();

var A_PRECISION = 100;
var DCacheBN = /*#__PURE__*/new Map();
function HybridComputeLiquidity(pool) {
  var res = DCacheBN.get(pool);
  if (res !== undefined) return res;
  var r0 = pool.reserve0;
  var r1 = pool.reserve1;

  if (r0.isZero() && r1.isZero()) {
    DCacheBN.set(pool, BigNumber.from(0));
    return BigNumber.from(0);
  }

  var s = r0.add(r1);
  var nA = BigNumber.from(pool.A * 2);
  var prevD;
  var D = s;

  for (var i = 0; i < 256; i++) {
    var dP = D.mul(D).div(r0).mul(D).div(r1).div(4);
    prevD = D;
    D = nA.mul(s).div(A_PRECISION).add(dP.mul(2)).mul(D).div(nA.div(A_PRECISION).sub(1).mul(D).add(dP.mul(3)));

    if (D.sub(prevD).abs().lte(1)) {
      break;
    }
  }

  DCacheBN.set(pool, D);
  return D;
}
function HybridgetY(pool, x) {
  var D = HybridComputeLiquidity(pool);
  var nA = pool.A * 2;
  var c = D.mul(D).div(x.mul(2)).mul(D).div(nA * 2 / A_PRECISION);
  var b = D.mul(A_PRECISION).div(nA).add(x);
  var yPrev;
  var y = D;

  for (var i = 0; i < 256; i++) {
    yPrev = y;
    y = y.mul(y).add(c).div(y.mul(2).add(b).sub(D));

    if (y.sub(yPrev).abs().lte(1)) {
      break;
    }
  }

  return y;
}
function calcOutByIn(pool, amountIn, direction) {
  if (direction === void 0) {
    direction = true;
  }

  var xBN = direction ? pool.reserve0 : pool.reserve1;
  var yBN = direction ? pool.reserve1 : pool.reserve0;

  switch (pool.type) {
    case PoolType.ConstantProduct:
      {
        var x = parseInt(xBN.toString());
        var y = parseInt(yBN.toString());
        return y * amountIn / (x / (1 - pool.fee) + amountIn);
      }

    case PoolType.Weighted:
      {
        var _x = parseInt(xBN.toString());

        var _y = parseInt(yBN.toString());

        var wPool = pool;
        var weightRatio = direction ? wPool.weight0 / wPool.weight1 : wPool.weight1 / wPool.weight0;
        var actualIn = amountIn * (1 - pool.fee);

        var out = _y * (1 - Math.pow(_x / (_x + actualIn), weightRatio));

        return out;
      }

    case PoolType.Hybrid:
      {
        // const xNew = x + amountIn*(1-pool.fee);
        // const yNew = HybridgetY(pool, xNew);
        // const dy = y - yNew;
        var xNewBN = xBN.add(getBigNumber(undefined, amountIn * (1 - pool.fee)));
        var yNewBN = HybridgetY(pool, xNewBN);
        var dy = parseInt(yBN.sub(yNewBN).toString());
        return dy;
      }

    case PoolType.ConcentratedLiquidity:
      {
        return ConcentratedLiquidityOutByIn(pool, amountIn, direction);
      }
  }
}
var OutOfLiquidity = /*#__PURE__*/function (_Error) {
  _inheritsLoose(OutOfLiquidity, _Error);

  function OutOfLiquidity() {
    return _Error.apply(this, arguments) || this;
  }

  return OutOfLiquidity;
}( /*#__PURE__*/_wrapNativeSuper(Error));

function ConcentratedLiquidityOutByIn(pool, inAmount, direction) {
  if (pool.ticks.length === 0) return 0;
  if (pool.ticks[0].index > CL_MIN_TICK) pool.ticks.unshift({
    index: CL_MIN_TICK,
    DLiquidity: 0
  });
  if (pool.ticks[pool.ticks.length - 1].index < CL_MAX_TICK) pool.ticks.push({
    index: CL_MAX_TICK,
    DLiquidity: 0
  });
  var nextTickToCross = direction ? pool.nearestTick : pool.nearestTick + 1;
  var currentPrice = pool.sqrtPrice;
  var currentLiquidity = pool.liquidity;
  var outAmount = 0;
  var input = inAmount;

  while (input > 0) {
    if (nextTickToCross < 0 || nextTickToCross >= pool.ticks.length) throw new OutOfLiquidity();
    var nextTickPrice = Math.sqrt(Math.pow(1.0001, pool.ticks[nextTickToCross].index)); // console.log('L, P, tick, nextP', currentLiquidity,
    //     currentPrice, pool.ticks[nextTickToCross].index, nextTickPrice);

    var output = 0;

    if (direction) {
      var maxDx = currentLiquidity * (currentPrice - nextTickPrice) / currentPrice / nextTickPrice; //console.log('input, maxDx', input, maxDx);

      if (input <= maxDx) {
        output = currentLiquidity * currentPrice * input / (input + currentLiquidity / currentPrice);
        input = 0;
      } else {
        output = currentLiquidity * (currentPrice - nextTickPrice);
        currentPrice = nextTickPrice;
        input -= maxDx;

        if (pool.ticks[nextTickToCross].index % 2 === 0) {
          currentLiquidity -= pool.ticks[nextTickToCross].DLiquidity;
        } else {
          currentLiquidity += pool.ticks[nextTickToCross].DLiquidity;
        }

        nextTickToCross--;
      }
    } else {
      var maxDy = currentLiquidity * (nextTickPrice - currentPrice); //console.log('input, maxDy', input, maxDy);

      if (input <= maxDy) {
        output = input / currentPrice / (currentPrice + input / currentLiquidity);
        input = 0;
      } else {
        output = currentLiquidity * (nextTickPrice - currentPrice) / currentPrice / nextTickPrice;
        currentPrice = nextTickPrice;
        input -= maxDy;

        if (pool.ticks[nextTickToCross].index % 2 === 0) {
          currentLiquidity += pool.ticks[nextTickToCross].DLiquidity;
        } else {
          currentLiquidity -= pool.ticks[nextTickToCross].DLiquidity;
        }

        nextTickToCross++;
      }
    }

    outAmount += output * (1 - pool.fee); //console.log('out', outAmount);
  }

  return outAmount;
}

function calcInByOut(pool, amountOut, direction) {
  var input = 0;
  var xBN = direction ? pool.reserve0 : pool.reserve1;
  var yBN = direction ? pool.reserve1 : pool.reserve0;

  switch (pool.type) {
    case PoolType.ConstantProduct:
      {
        var x = parseInt(xBN.toString());
        var y = parseInt(yBN.toString());
        input = x * amountOut / (1 - pool.fee) / (y - amountOut);
        break;
      }

    case PoolType.Weighted:
      {
        var _x2 = parseInt(xBN.toString());

        var _y2 = parseInt(yBN.toString());

        var wPool = pool;
        var weightRatio = direction ? wPool.weight0 / wPool.weight1 : wPool.weight1 / wPool.weight0;
        input = _x2 * (1 - pool.fee) * (Math.pow(1 - amountOut / _y2, -weightRatio) - 1);
        break;
      }

    case PoolType.Hybrid:
      {
        var yNewBN = yBN.sub(getBigNumber(undefined, amountOut));
        if (yNewBN.lt(1)) // lack of precision
          yNewBN = BigNumber.from(1);
        var xNewBN = HybridgetY(pool, yNewBN);
        input = Math.round(parseInt(xNewBN.sub(xBN).toString()) / (1 - pool.fee)); // const yNew = y - amountOut;
        // const xNew = HybridgetY(pool, yNew);
        // input = (xNew - x)/(1-pool.fee);

        break;
      }

    default:
      console.error('Unknown pool type');
  } // ASSERT(() => {
  //   const amount2 = calcOutByIn(pool, input, direction);
  //   const res = closeValues(amountOut, amount2, 1e-6);
  //   if (!res) console.log("Error 138:", amountOut, amount2, Math.abs(amountOut/amount2 - 1));
  //   return res;
  // });


  if (input < 1) input = 1;
  return input;
}
function calcPrice(pool, amountIn, takeFeeIntoAccount) {
  if (takeFeeIntoAccount === void 0) {
    takeFeeIntoAccount = true;
  }

  var r0 = parseInt(pool.reserve0.toString());
  var r1 = parseInt(pool.reserve1.toString());
  var oneMinusFee = takeFeeIntoAccount ? 1 - pool.fee : 1;

  switch (pool.type) {
    case PoolType.ConstantProduct:
      {
        var x = r0 / oneMinusFee;
        return r1 * x / (x + amountIn) / (x + amountIn);
      }

    case PoolType.Weighted:
      {
        var wPool = pool;
        var weightRatio = wPool.weight0 / wPool.weight1;

        var _x3 = r0 + amountIn * oneMinusFee;

        return r1 * weightRatio * oneMinusFee * Math.pow(r0 / _x3, weightRatio) / _x3;
      }

    case PoolType.Hybrid:
      {
        var hPool = pool;
        var D = parseInt(HybridComputeLiquidity(hPool).toString());
        var A = hPool.A / A_PRECISION;

        var _x4 = r0 + amountIn;

        var b = 4 * A * _x4 + D - 4 * A * D;
        var ac4 = D * D * D / _x4;
        var Ds = Math.sqrt(b * b + 4 * A * ac4);
        var res = (0.5 - (2 * b - ac4 / _x4) / Ds / 4) * oneMinusFee;
        return res;
      }
  }

  return 0;
}

function calcInputByPriceConstantMean(pool, price) {
  var r0 = parseInt(pool.reserve0.toString());
  var r1 = parseInt(pool.reserve1.toString());
  var weightRatio = pool.weight0 / pool.weight1;
  var t = r1 * price * weightRatio * (1 - pool.fee) * Math.pow(r0, weightRatio);
  return (Math.pow(t, 1 / (weightRatio + 1)) - r0) / (1 - pool.fee);
}

function calcInputByPrice(pool, priceEffective, hint) {
  if (hint === void 0) {
    hint = 1;
  }

  switch (pool.type) {
    case PoolType.ConstantProduct:
      {
        var r0 = parseInt(pool.reserve0.toString());
        var r1 = parseInt(pool.reserve1.toString());
        var x = r0 / (1 - pool.fee);
        var res = Math.sqrt(r1 * x * priceEffective) - x;
        return res;
      }

    case PoolType.Weighted:
      {
        var _res = calcInputByPriceConstantMean(pool, priceEffective);

        return _res;
      }

    case PoolType.Hybrid:
      {
        return revertPositive(function (x) {
          return 1 / calcPrice(pool, x);
        }, priceEffective, hint);
      }
  }

  return 0;
} //================================= Utils ====================================

function ASSERT(f, t) {
  if (!f() && t) console.error(t);
}
function closeValues(a, b, accuracy) {
  if (accuracy === 0) return a === b;
  if (a < 1 / accuracy) return Math.abs(a - b) <= 10;
  return Math.abs(a / b - 1) < accuracy;
}
function calcSquareEquation(a, b, c) {
  var D = b * b - 4 * a * c;
  console.assert(D >= 0, "Discriminant is negative! " + a + " " + b + " " + c);
  var sqrtD = Math.sqrt(D);
  return [(-b - sqrtD) / 2 / a, (-b + sqrtD) / 2 / a];
} // returns such x > 0 that f(x) = out or 0 if there is no such x or f defined not everywhere
// hint - approximation of x to spead up the algorithm
// f assumed to be continues monotone growth function defined everywhere

function revertPositive(f, out, hint) {
  if (hint === void 0) {
    hint = 1;
  }

  try {
    if (out <= f(0)) return 0;
    var min, max;

    if (f(hint) > out) {
      min = hint / 2;

      while (f(min) > out) {
        min /= 2;
      }

      max = min * 2;
    } else {
      max = hint * 2;

      while (f(max) < out) {
        max *= 2;
      }

      min = max / 2;
    }

    while (max / min - 1 > 1e-4) {
      var x0 = (min + max) / 2;
      var y0 = f(x0);
      if (out === y0) return x0;
      if (out < y0) max = x0;else min = x0;
    }

    return (min + max) / 2;
  } catch (e) {
    return 0;
  }
}
function getBigNumber(valueBN, value) {
  if (valueBN !== undefined) return valueBN;
  if (value < Number.MAX_SAFE_INTEGER) return BigNumber.from(Math.round(value));
  var exp = Math.floor(Math.log(value) / Math.LN2);
  console.assert(exp >= 51, 'Internal Error 314');
  var shift = exp - 51;
  var mant = Math.round(value / Math.pow(2, shift));
  var res = BigNumber.from(mant).mul(BigNumber.from(2).pow(shift));
  return res;
}

var abi = [
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_externalOrderFee",
				type: "uint256"
			},
			{
				internalType: "contract IBentoBoxV1",
				name: "_bentoBox",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "feeTo",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "LogFeesCollected",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "maker",
				type: "address"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "digest",
				type: "bytes32"
			},
			{
				indexed: false,
				internalType: "contract ILimitOrderReceiver",
				name: "receiver",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "fillAmount",
				type: "uint256"
			}
		],
		name: "LogFillOrder",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "digest",
				type: "bytes32"
			}
		],
		name: "LogOrderCancelled",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "feeTo",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "externalOrderFee",
				type: "uint256"
			}
		],
		name: "LogSetFees",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "contract ILimitOrderReceiver",
				name: "receiver",
				type: "address"
			}
		],
		name: "LogWhiteListReceiver",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		inputs: [
		],
		name: "FEE_DIVISOR",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "calls",
				type: "bytes[]"
			},
			{
				internalType: "bool",
				name: "revertOnFail",
				type: "bool"
			}
		],
		name: "batch",
		outputs: [
			{
				internalType: "bool[]",
				name: "successes",
				type: "bool[]"
			},
			{
				internalType: "bytes[]",
				name: "results",
				type: "bytes[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "maker",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOut",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "startTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "endTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "stopPrice",
						type: "uint256"
					},
					{
						internalType: "contract IOracle",
						name: "oracleAddress",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "oracleData",
						type: "bytes"
					},
					{
						internalType: "uint256",
						name: "amountToFill",
						type: "uint256"
					},
					{
						internalType: "uint8",
						name: "v",
						type: "uint8"
					},
					{
						internalType: "bytes32",
						name: "r",
						type: "bytes32"
					},
					{
						internalType: "bytes32",
						name: "s",
						type: "bytes32"
					}
				],
				internalType: "struct StopLimitOrder.OrderArgs[]",
				name: "order",
				type: "tuple[]"
			},
			{
				internalType: "contract IERC20",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "contract IERC20",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "contract ILimitOrderReceiver",
				name: "receiver",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "batchFillOrder",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "maker",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOut",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "startTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "endTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "stopPrice",
						type: "uint256"
					},
					{
						internalType: "contract IOracle",
						name: "oracleAddress",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "oracleData",
						type: "bytes"
					},
					{
						internalType: "uint256",
						name: "amountToFill",
						type: "uint256"
					},
					{
						internalType: "uint8",
						name: "v",
						type: "uint8"
					},
					{
						internalType: "bytes32",
						name: "r",
						type: "bytes32"
					},
					{
						internalType: "bytes32",
						name: "s",
						type: "bytes32"
					}
				],
				internalType: "struct StopLimitOrder.OrderArgs[]",
				name: "order",
				type: "tuple[]"
			},
			{
				internalType: "contract IERC20",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "contract IERC20",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "contract ILimitOrderReceiver",
				name: "receiver",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "batchFillOrderOpen",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "hash",
				type: "bytes32"
			}
		],
		name: "cancelOrder",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		name: "cancelledOrder",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "claimOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "deploymentChainId",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "externalOrderFee",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feeTo",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "",
				type: "address"
			}
		],
		name: "feesCollected",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "maker",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOut",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "startTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "endTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "stopPrice",
						type: "uint256"
					},
					{
						internalType: "contract IOracle",
						name: "oracleAddress",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "oracleData",
						type: "bytes"
					},
					{
						internalType: "uint256",
						name: "amountToFill",
						type: "uint256"
					},
					{
						internalType: "uint8",
						name: "v",
						type: "uint8"
					},
					{
						internalType: "bytes32",
						name: "r",
						type: "bytes32"
					},
					{
						internalType: "bytes32",
						name: "s",
						type: "bytes32"
					}
				],
				internalType: "struct StopLimitOrder.OrderArgs",
				name: "order",
				type: "tuple"
			},
			{
				internalType: "contract IERC20",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "contract IERC20",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "contract ILimitOrderReceiver",
				name: "receiver",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "fillOrder",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "maker",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amountIn",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "amountOut",
						type: "uint256"
					},
					{
						internalType: "address",
						name: "recipient",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "startTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "endTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "stopPrice",
						type: "uint256"
					},
					{
						internalType: "contract IOracle",
						name: "oracleAddress",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "oracleData",
						type: "bytes"
					},
					{
						internalType: "uint256",
						name: "amountToFill",
						type: "uint256"
					},
					{
						internalType: "uint8",
						name: "v",
						type: "uint8"
					},
					{
						internalType: "bytes32",
						name: "r",
						type: "bytes32"
					},
					{
						internalType: "bytes32",
						name: "s",
						type: "bytes32"
					}
				],
				internalType: "struct StopLimitOrder.OrderArgs",
				name: "order",
				type: "tuple"
			},
			{
				internalType: "contract IERC20",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "contract IERC20",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "contract ILimitOrderReceiver",
				name: "receiver",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "fillOrderOpen",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		name: "orderStatus",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "pendingOwner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			},
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permitToken",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_feeTo",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_externalOrderFee",
				type: "uint256"
			}
		],
		name: "setFees",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			}
		],
		name: "swipe",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address"
			}
		],
		name: "swipeFees",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			},
			{
				internalType: "bool",
				name: "direct",
				type: "bool"
			},
			{
				internalType: "bool",
				name: "renounce",
				type: "bool"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "contract ILimitOrderReceiver",
				name: "receiver",
				type: "address"
			}
		],
		name: "whiteListReceiver",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var LimitOrder = /*#__PURE__*/function () {
  function LimitOrder(maker, amountIn, amountOut, recipient, startTime, endTime, stopPrice, oracleAddress, oracleData, v, r, s) {
    if (stopPrice === void 0) {
      stopPrice = '0';
    }

    if (oracleAddress === void 0) {
      oracleAddress = '0x0000000000000000000000000000000000000000';
    }

    if (oracleData === void 0) {
      oracleData = '0x00000000000000000000000000000000000000000000000000000000000000';
    }

    if (v === void 0) {
      v = 0;
    }

    if (r === void 0) {
      r = '';
    }

    if (s === void 0) {
      s = '';
    }

    this.maker = validateAndParseAddress(maker);
    this.amountIn = amountIn;
    this.amountOut = amountOut;
    this.recipient = validateAndParseAddress(recipient);
    this.startTime = startTime.toString();
    this.endTime = endTime.toString();
    this.stopPrice = stopPrice;
    this.oracleAddress = validateAndParseAddress(oracleAddress);
    this.oracleData = oracleData;
    this.v = v;
    this.r = r;
    this.s = s;
  }

  LimitOrder.getLimitOrder = function getLimitOrder(data) {
    return new LimitOrder(data.maker, CurrencyAmount.fromRawAmount(new Token(data.chainId, data.tokenIn, data.tokenInDecimals, data.tokenInSymbol), data.amountIn), CurrencyAmount.fromRawAmount(new Token(data.chainId, data.tokenOut, data.tokenOutDecimals, data.tokenOutSymbol), data.amountOut), data.recipient, data.startTime, data.endTime, data.stopPrice, data.oracleAddress, data.oracleData, data.v, data.r, data.s);
  };

  var _proto = LimitOrder.prototype;

  _proto.usePrice = function usePrice(price) {
    return new LimitOrder(this.maker, this.amountIn, CurrencyAmount.fromRawAmount(this.amountOut.currency, price.quote(this.amountIn).quotient.toString()), this.recipient, this.startTime, this.endTime, this.stopPrice, this.oracleAddress, this.oracleData);
  };

  _proto.signdOrderWithPrivatekey = function signdOrderWithPrivatekey(chainId, privateKey) {
    var order = {
      maker: this.maker,
      tokenIn: this.tokenInAddress,
      tokenOut: this.tokenOutAddress,
      amountIn: this.amountInRaw,
      amountOut: this.amountOutRaw,
      recipient: this.recipient,
      startTime: this.startTime,
      endTime: this.endTime,
      stopPrice: this.stopPrice,
      oracleAddress: this.oracleAddress,
      oracleData: keccak256(['bytes'], [this.oracleData])
    };

    var _getSignature = getSignature(order, chainId, privateKey),
        v = _getSignature.v,
        r = _getSignature.r,
        s = _getSignature.s;

    this.v = v;
    this.r = r;
    this.s = s;
    return {
      v: v,
      r: r,
      s: s
    };
  };

  _proto.signOrderWithProvider = /*#__PURE__*/function () {
    var _signOrderWithProvider = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(chainId, provider) {
      var order, _yield$getSignatureWi, v, r, s;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              order = {
                maker: this.maker,
                tokenIn: this.tokenInAddress,
                tokenOut: this.tokenOutAddress,
                amountIn: this.amountInRaw,
                amountOut: this.amountOutRaw,
                recipient: this.recipient,
                startTime: this.startTime,
                endTime: this.endTime,
                stopPrice: this.stopPrice,
                oracleAddress: this.oracleAddress,
                oracleData: keccak256(['bytes'], [this.oracleData])
              };
              _context.next = 3;
              return getSignatureWithProvider(order, chainId, provider);

            case 3:
              _yield$getSignatureWi = _context.sent;
              v = _yield$getSignatureWi.v;
              r = _yield$getSignatureWi.r;
              s = _yield$getSignatureWi.s;
              this.v = v;
              this.r = r;
              this.s = s;
              return _context.abrupt("return", {
                v: v,
                r: r,
                s: s
              });

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function signOrderWithProvider(_x, _x2) {
      return _signOrderWithProvider.apply(this, arguments);
    }

    return signOrderWithProvider;
  }();

  _proto.getTypedData = function getTypedData$1() {
    var order = {
      maker: this.maker,
      tokenIn: this.tokenInAddress,
      tokenOut: this.tokenOutAddress,
      amountIn: this.amountInRaw,
      amountOut: this.amountOutRaw,
      recipient: this.recipient,
      startTime: this.startTime,
      endTime: this.endTime,
      stopPrice: this.stopPrice,
      oracleAddress: this.oracleAddress,
      oracleData: keccak256(['bytes'], [this.oracleData])
    };
    return getTypedData(order, this.chainId);
  };

  _proto.getTypeHash = function getTypeHash$1() {
    var typedData = this.getTypedData();

    var digest = getTypeHash(typedData);

    return digest;
  };

  _proto.send = /*#__PURE__*/function () {
    var _send = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      var resp;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return fetch(LAMBDA_URL + "/orders/create", {
                method: 'POST',
                body: JSON.stringify({
                  maker: this.maker,
                  tokenIn: this.tokenInAddress,
                  tokenOut: this.tokenOutAddress,
                  tokenInDecimals: this.tokenInDecimals,
                  tokenOutDecimals: this.tokenOutDecimals,
                  tokenInSymbol: this.tokenInSymbol,
                  tokenOutSymbol: this.tokenOutSymbol,
                  amountIn: this.amountInRaw,
                  amountOut: this.amountOutRaw,
                  recipient: this.recipient,
                  startTime: this.startTime,
                  endTime: this.endTime,
                  stopPrice: this.stopPrice,
                  oracleAddress: this.oracleAddress,
                  oracleData: this.oracleData,
                  v: this.v,
                  r: this.r,
                  s: this.s,
                  chainId: this.amountIn.currency.chainId
                })
              });

            case 2:
              resp = _context2.sent;
              return _context2.abrupt("return", resp.json());

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function send() {
      return _send.apply(this, arguments);
    }

    return send;
  }();

  _createClass(LimitOrder, [{
    key: "amountInRaw",
    get: function get() {
      return this.amountIn.quotient.toString();
    }
  }, {
    key: "amountOutRaw",
    get: function get() {
      return this.amountOut.quotient.toString();
    }
  }, {
    key: "tokenInAddress",
    get: function get() {
      return this.amountIn.currency.address;
    }
  }, {
    key: "tokenOutAddress",
    get: function get() {
      return this.amountOut.currency.address;
    }
  }, {
    key: "tokenInDecimals",
    get: function get() {
      return this.amountIn.currency.decimals;
    }
  }, {
    key: "tokenOutDecimals",
    get: function get() {
      return this.amountOut.currency.decimals;
    }
  }, {
    key: "tokenInSymbol",
    get: function get() {
      return this.amountIn.currency.symbol || '';
    }
  }, {
    key: "tokenOutSymbol",
    get: function get() {
      return this.amountOut.currency.symbol || '';
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.amountIn.currency.chainId;
    }
  }]);

  return LimitOrder;
}();
var FillLimitOrder = /*#__PURE__*/function () {
  function FillLimitOrder(order, path, amountExternal, amountToFill, limitOrderReceiver, to, keepTokenIn) {
    if (keepTokenIn === void 0) {
      keepTokenIn = false;
    }

    this.order = order;
    this.path = path.map(validateAndParseAddress);
    this.amountExternal = amountExternal;
    this.amountToFill = amountToFill;
    this.limitOrderReceiver = validateAndParseAddress(limitOrderReceiver);
    this.to = validateAndParseAddress(to);
    this.tokenIn = order.amountIn.currency.address;
    this.tokenOut = order.amountOut.currency.address;
    this.limitOrderReceiverData = defaultAbiCoder.encode(['address[]', 'uint256', 'address', 'bool'], [this.path, this.amountExternal.toString(), this.to, keepTokenIn]);
  }

  var _proto2 = FillLimitOrder.prototype;

  _proto2.fillOrderOpen = function fillOrderOpen(signer, extra) {
    extra.open = true;
    return this.fillOrder(signer, extra);
  };

  _proto2.fillOrder = /*#__PURE__*/function () {
    var _fillOrder = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(signer, extra) {
      var gasPrice, nonce, _extra$forceExecution, forceExecution, _extra$open, open, func, orderArg, limitOrderContract, gasLimit, executed, transaction;

      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              gasPrice = extra.gasPrice, nonce = extra.nonce, _extra$forceExecution = extra.forceExecution, forceExecution = _extra$forceExecution === void 0 ? false : _extra$forceExecution, _extra$open = extra.open, open = _extra$open === void 0 ? false : _extra$open;
              func = open ? 'fillOrderOpen' : 'fillOrder';
              orderArg = [this.order.maker, this.order.amountInRaw, this.order.amountOutRaw, this.order.recipient, this.order.startTime, this.order.endTime, this.order.stopPrice, this.order.oracleAddress, this.order.oracleData, this.amountToFill.toString(), this.order.v, this.order.r, this.order.s];
              limitOrderContract = new Contract(STOP_LIMIT_ORDER_ADDRESS[this.order.chainId], abi, signer);
              executed = true;
              if (extra.debug) console.log(orderArg, this.path, this.limitOrderReceiver, this.limitOrderReceiverData);
              _context3.prev = 6;
              _context3.next = 9;
              return limitOrderContract.estimateGas[func](orderArg, this.path[0], this.path[this.path.length - 1], this.limitOrderReceiver, this.limitOrderReceiverData);

            case 9:
              gasLimit = _context3.sent;
              gasLimit = gasLimit.mul(11).div(10);
              _context3.next = 22;
              break;

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](6);

              if (!forceExecution) {
                _context3.next = 21;
                break;
              }

              console.log('Failed to estimate gas, forcing execution');
              gasLimit = BigNumber.from('400000'); // 400k

              executed = true;
              _context3.next = 22;
              break;

            case 21:
              return _context3.abrupt("return", {
                executed: false
              });

            case 22:
              _context3.next = 24;
              return limitOrderContract.fillOrder(orderArg, this.path[0], this.path[this.path.length - 1], this.limitOrderReceiver, this.limitOrderReceiverData, {
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                nonce: nonce
              });

            case 24:
              transaction = _context3.sent;
              return _context3.abrupt("return", {
                executed: executed,
                transaction: transaction
              });

            case 26:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[6, 13]]);
    }));

    function fillOrder(_x3, _x4) {
      return _fillOrder.apply(this, arguments);
    }

    return fillOrder;
  }();

  return FillLimitOrder;
}();

export { ACTION_ACCRUE, ACTION_ADD_ASSET, ACTION_ADD_COLLATERAL, ACTION_BENTO_DEPOSIT, ACTION_BENTO_SETAPPROVAL, ACTION_BENTO_TRANSFER, ACTION_BENTO_TRANSFER_MULTIPLE, ACTION_BENTO_WITHDRAW, ACTION_BORROW, ACTION_CALL, ACTION_GET_REPAY_PART, ACTION_GET_REPAY_SHARE, ACTION_REMOVE_ASSET, ACTION_REMOVE_COLLATERAL, ACTION_REPAY, ACTION_UPDATE_EXCHANGE_RATE, ARCHER_ROUTER_ADDRESS, ASSERT, AbstractCurrency, Avalanche, BAR_ADDRESS, BENTOBOX_ADDRESS, BORING_HELPER_ADDRESS, Binance, CHAINLINK_ORACLE_ADDRESS, CL_MAX_TICK, CL_MIN_TICK, Celo, ChainId, ConstantProductPool, CurrencyAmount, ENS_REGISTRAR_ADDRESS, Ether, FACTORY_ADDRESS, FACTOR_PRECISION, FIVE, FULL_UTILIZATION, FULL_UTILIZATION_MINUS_MAX, Fantom, Fee, FillLimitOrder, Fraction, Fuse, Harmony, Heco, HybridComputeLiquidity, HybridgetY, INIT_CODE_HASH, INTEREST_ELASTICITY, InsufficientInputAmountError, InsufficientReservesError, KASHI_ADDRESS, KashiAction, LAMBDA_URL, LimitOrder, MAKER_ADDRESS, MASTERCHEF_ADDRESS, MASTERCHEF_V2_ADDRESS, MAXIMUM_INTEREST_PER_YEAR, MAXIMUM_TARGET_UTILIZATION, MERKLE_DISTRIBUTOR_ADDRESS, MINICHEF_ADDRESS, MINIMUM_INTEREST_PER_YEAR, MINIMUM_LIQUIDITY, MINIMUM_TARGET_UTILIZATION, MULTICALL2_ADDRESS, Matic, MaxUint256, Movr, NATIVE, NativeCurrency, OLD_FARMS, ONE, Okex, OrderStatus, OutOfLiquidity, PEGGED_ORACLE_ADDRESS, PROTOCOL_FEE, PROTOCOL_FEE_DIVISOR, Pair, Palm, Percent, Pool, PoolType, Price, RConcentratedLiquidityPool, RConstantProductPool, RHybridPool, ROUTER_ADDRESS, RWeightedPool, Rounding, Route, RouteStatus, Router, SOCKET_URL, SOLIDITY_TYPE_MAXIMA, STARTING_INTEREST_PER_YEAR, STOP_LIMIT_ORDER_ADDRESS, SUSHISWAP_MULTISWAPPER_ADDRESS, SUSHISWAP_MULTI_EXACT_SWAPPER_ADDRESS, SUSHISWAP_SWAPPER_ADDRESS, SUSHISWAP_TWAP_0_ORACLE_ADDRESS, SUSHISWAP_TWAP_1_ORACLE_ADDRESS, SUSHI_ADDRESS, SolidityType, TEN, THREE, TIMELOCK_ADDRESS, TWO, Telos, Token, Trade, TradeType, USD, USDC, USDC_ADDRESS, USD_ADDRESS, UTILIZATION_PRECISION, WETH9, WETH9_ADDRESS, WNATIVE, WNATIVE_ADDRESS, ZAPPER_ADDRESS, ZERO, _100, _1000, _997, bentoTypes, calcInByOut, calcInputByPrice, calcOutByIn, calcPrice, calcSquareEquation, closeValues, computeConstantProductPoolAddress, computePairAddress, computePoolInitCodeHash, computePriceImpact, currencyEquals, getBigNumber, getSignature, getSignatureBento, getSignatureWithProvider, getSignatureWithProviderBentobox, getTypeHash, getTypedData, getTypedDataBento, inputOutputComparator, name, revertPositive, sortedInsert, sqrt, toHex, tradeComparator, types, validateAndParseAddress, validateSolidityTypeInstance, xDai };
//# sourceMappingURL=sdk.esm.js.map
