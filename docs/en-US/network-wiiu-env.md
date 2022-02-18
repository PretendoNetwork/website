# Pretendo Network Installer (WiiU Environments)
In this guide you will learn how to setup a PNID from Scratch on a WiiU.


<div class="info-frame">ℹ️ This guide assumes that you have a <b>Homebrewed System</b>, if you don't please follow this <a href="https://wiiu.hacks.guide/#/">guide</a> on how to homebrew your system first.</div>


## SD Preparation
### What you need
`30_nimble.rpx`  [Github](https://github.com/PretendoNetwork/Nimble/tree/tiramisu)

<div class="info-frame green">You would need to compile from source as there is no prebuilt available right now.</div>


### Instructions

 1. Open your SD in a File Explorer
 2. Go to `\wiiu\environments\(tiramisu || aroma)\modules\setup`
 3. Copy the `30_nimble.rpx` to that location
 4. Rename it to `XX_nimble.rpx` if the 30 number is taken

## Launching Nimble
The next step is to launch Nimble and run it to redirect the URLs from Nintendo to Pretendo.

Open the H&S app (if it is not autobooting) and nimble would run automatcally

If it has succeeded, the URLs should now be directing to Pretendo

## Creating a PNID
After we directed the URLs to Pretendo we can now create a PNID.
<div class="info-frame">ℹ️ Since we can't use the same NNID Account we are going to create a new account, <b>Save Data will not be moved and will be handled in another guide</b>.</div>

 1. Click on your Mii Account (top right of the Wii U Home Screen)
 2. Click on change account
 3. If you have a local account already setup click on it to log in using that account else create a local account
 4. Click on Link a Nintendo Network ID (**Note that it will say a Nintendo Network, however, it is creating a Pretendo Network Account**) and continue clicking ok until you see the Do you have Nintendo Account
 5. If you have a PNID already make click the Yes button and login with your information, else click No and create a PN Account.
 
<div class="info-frame">ℹ️ To Verify that you are creating a Pretendo Account, Check if the EULA says <b>Pretendo</b> if not try running the patcher again.</div>

After finishing, your PN Account should now be linked to that user.

## Logging into a PNID

If you want to log into a PNID Account after a Restart, run the Running Nimble Steps then Log in to your Account.


## Returning to Nintendo Servers
Restart the Console and hold the ZL button when booting the CFW.

<div class="info-frame">ℹ️ If you try to login to your PNID without running the patcher, the console would try to connect to NN instead and give a incorrect Password for the ID</div>

#### TroubleShoot
Please visit this [Page](/docs/troubleshoot-errors) if you encounter an issue.