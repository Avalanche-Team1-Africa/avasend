# avasend
# 🌍 AvaSend – Cross-Border Remittances on Avalanche

**AvaSend** is a decentralized remittance application powered by **Avalanche** and built entirely using **Next.js**. It enables users to send **USDC** instantly across borders with near-zero fees. Recipients receive funds directly via **M-Pesa/Airtel** using **IntaSend Sandbox**, and users are automatically issued virtual debit cards via **Stripe Testnet** for online use.

---

## 🚀 DEMO 

> [avasend.vercel.app]

---

## ⚙️ Key Features

- 🌐 **Cross-Border Remittances:** Users send USDC to friends/family across Africa.
- 💸 **Instant Payouts to M-Pesa/Airtel:** Powered by IntaSend’s sandbox API.
- 💳 **Stripe Testnet Debit Cards:** Auto-issued to users via Stripe, mapped to their wallets, usable for online purchases.
- ⚡ **Low Fees (<1%):** Avalanche's efficiency beats traditional remittance services.
- 🛠 **Fully Automated:** No admin intervention, no KYC – just seamless transfers.
- 🔐 **Trustless Escrow:** Smart contracts handle funds securely.

---

## 🏗 Tech Stack

| Layer       | Tech Used                         |
|-------------|-----------------------------------|
| Framework   | Next.js (Fullstack)               |
| Blockchain  | Avalanche C-Chain                 |
| Contracts   | Solidity + Hardhat                |
| APIs        | IntaSend (Payout), Stripe (Cards) |
| Wallet      | MetaMask/Web3Modal                |
| Styling     | TailwindCSS                       |
| Hosting     | Vercel (suggested)                |

---

## 🧠 How It Works

1. **User connects wallet** (MetaMask).
2. **Enters recipient's phone number and USDC amount.**
3. **Smart contract locks funds** and emits a payout event.
4. **Next.js backend listens**, calls IntaSend to payout via M-Pesa/Airtel.
5. **User is auto-issued a virtual debit card** from Stripe testnet, emailed for use.
6. **Recipient receives mobile money instantly.**

---

      # You're here!
