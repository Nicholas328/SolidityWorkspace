const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

/**
 * 通过自带的Wallet加密方法，生成钱包的私钥
 * 可以直接通过私钥Json读取钱包
 */
async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD
  );
  console.log(encryptedJsonKey);
  //把json写入文件
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
