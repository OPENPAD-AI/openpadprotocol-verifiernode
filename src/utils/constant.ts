enum ValidUploadFileType {
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  'model/gltf.binary',
  'model/gltf-binary',
  'model/gltf+json',
  'application/json',
  'video/mp4',
  'video/webm',
}

enum ImageSize {
  '512x512',
  '512x768',
  '768x512',
}

enum TransactionType {
  DEFAULT = '',
  CHAT = 'CHAT',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  CONNECT_WALLET = 'CONNECT WALLET',
  REFERRAL = 'REFERRAL',
  GET_MAR3_ID = 'GET MAR3 ID',
  SUCCESS_WALLET_SYNC = 'SUCCESS WALLET SYNC',
  MINT_IMAGE_NFT = 'MINT IMAGE NFT',
  BUY_CREDIT = 'BUY CREDIT',
  GIFT_CODE = 'GIFT CODE',
}

enum RecordType {
  DEFAULT = '',
  CHAT = 'CHAT',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  CONNECT_WALLET = 'CONNECT WALLET',
  REFERRAL = 'REFERRAL',
  SUCCESS_WALLET_SYNC = 'SUCCESS WALLET SYNC',
}

enum QuestType {
  CONNECT_WALLET = 'CONNECT WALLET',
  REFERRAL = 'REFERRAL',
  SUCCESS_WALLET_SYNC = 'SUCCESS WALLET SYNC',
}

enum PostType {
  ARTICLE = 'ARTICLE',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
  LINKEDIN = 'LINKEDIN',
}

enum CopyType {
  STRING = 'STRING',
  JSON = 'JSON',
}

enum CreditCost {
  CHAT = 2,
  TEXT = 2,
  IMAGE = 2,
}

enum HttpStatusCode {
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  INTERNAL_ERROR = 500,
}

enum ActivityType {
  BUY_IDO = 'BUY IDO',
  CLAIM_IDO = 'CLAIM IDO',
  STAKING = 'STAKING',
  BUY_NODE = 'BUY NODE',
}

enum StakingType {
  STAKE = 'STAKE',
  UN_STAKE = 'UN STAKE',
}

enum ProjectType {
  IDO = 'IDO',
  VESTING = 'VESTING',
  VESTING_V2 = 'VESTINGV2',
  STAKING = 'STAKING',
  NODE = 'NODE',
  NODE_RUNNING_SMC = 'NODE_RUNNING_SMC',
}

enum NftType {
  MAR3_ID = 'MAR3_ID',
  MAR3_IMAGE = 'MAR3_IMAGE',
}

enum ProjectStatus {
  UPCOMING = 'Upcoming',
  ON_GOING = 'On-Going',
  ENDED = 'Ended',
}

enum ProjectRound {
  Community = 'Community Round', //Community Round - FCFS -> FCFS -> Public Round -> Community Round
  Tier = 'Tier Round', //Public Round -> Tier Round
  Vip = 'VIP Round', //Vip Round
}
enum LogType {
  DailyLogin,
  CheckNews,
  ClaimRuby,
  CompleteQuest,
  SpinLuckyWheel,
  UpgradeStorageAndLevelMiner,
  TapTap,
}
enum EventSMC {
  nodeEnter,
}

enum KYCStatus {
  INIT = 'INIT',
  IN_REVIEW = 'IN REVIEW',
  REJECTED = 'REJECTED',
  RETRY = 'RETRY',
  APPROVED = 'APPROVED',
}

enum Network {
  BSC_MAINNET = '56',
  BSC_TESTNET = '97',
  BASE_MAINNET = '8453',
  BASE_GOERLI = '84531',
  BASE_SEPOLIA = '84532',
  OP_BNB_TESTNET = '5611',
  OP_BNB_MAINNET = '204',
  POLYGON_MAINNET = '137',
  POLYGON_TESTNET = '80001',
  AVALANCHE_MAINNET = '43114',
  AVALANCHE_FUJI = '43113',
  OPTIMISM_MAINNET = '10',
  OPTIMISM_SEPOLIA = '11155420',
  ETH_MAINNET = '1',
  ETH_SEPOLIA = '11155111',
  ZK_MAINNET = '324',
  ZK_SEPOLIA = '300',
  ETHERLINK_TESTNET = '128123',
  ARBITRUM_SEPOLIA = '421614',
  ARBITRUM_MAINNET = '42161',
  IMMUTABLE_ZK_EVM_TESTNET = '13473',
  IMMUTABLE_ZK_EVM_MAINNET = '13471',
  SEI_TESTNET = '713715',
  SEI_MAINNET = '1329',
  BITLAYER_MAINNET = '200901',
  BITLAYER_TESTNET = '200810',
  BOBA_MAINNET = '288',
  BOBA_TESTNET = '28882',
}

enum NonEvmNetwork {
  TEZOS_GHOSTNET = 'tezos-ghostnet',
  TEZOS_MAINNET = 'tezos-mainnet',
}

const DATE_FORMAT = 'YYYY-MM-DD';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const MAX_SIZE_FILE_UPLOAD = 1024 * 1024 * 100; // 100 Mb
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const IOS_APP = 'https://apps.apple.com/us/app/mar3-ai/id6456041696';
const ANDROID_APP =
  'https://play.google.com/store/apps/details?id=com.mar3ai.mar3app';

export {
  ActivityType,
  StakingType,
  ProjectType,
  ProjectRound,
  ValidUploadFileType,
  DATE_FORMAT,
  DATETIME_FORMAT,
  MAX_SIZE_FILE_UPLOAD,
  ZERO_ADDRESS,
  TransactionType,
  CreditCost,
  ImageSize,
  RecordType,
  QuestType,
  PostType,
  HttpStatusCode,
  CopyType,
  NftType,
  ProjectStatus,
  IOS_APP,
  ANDROID_APP,
  KYCStatus,
  Network,
  LogType,
  NonEvmNetwork,
  EventSMC,
};
