# Pretendo Network Installer (WiiU)
In this guide you would learn how to setup a PNID from Scratch on a WiiU.


<div class="info-frame">ℹ️ This guide assumes that you have a <b>Homebrewed System</b>, if you don't please follow this <a href="https://wiiu.hacks.guide/#/">guide</a> on how to homebrew your system first.</div>

<div class="info-frame green">I am a green Frame</div>

<div class="info-frame yellow">A Body has been Discovered</div>

<div class="info-frame red">Red Sus</div>


## SD Preparation
### What you need
`nimble_patcher.elf`  [Github](https://github.com/PretendoNetwork/Nimble/releases)

### Instructions

 1. Open your SD in a File Explorer
 2. Go to `/wiiu/apps/`
 3. Create a folder (Name it whatever you want)
 4. Copy the `nimble_patcher.elf`

## Launching Nimble
The next step is to launch Nimble and run it to redirect the URLs from Nintendo to Pretendo.

 1. Turn your WiiU on and open the Homebrew Launcher/Channel.
 2. Find the nimble patcher (since it does not have a meta.xml it is assigned alphabetically using the folder name it was put) 
 3. Launch the Nimble patcher a screen with text would appear 
 4. Press A , You should be taken back to the Homebrew Launcher/Channel 

If you have followed these steps correctly the URLs should now be directing to Pretendo

## Creating a PNID
After we directed the URLs to Pretendo we can now create a PNID.
?>ℹ️ Since we can't use the same NNID Account we are going to create a new account, **Save Data will not be moved and will be handled in another guide**.

 1. Click on your Mii Account (top right of the Wii U Home Screen)
 2. Click on change account
 3. If you have a local account already setup click on it to log in using that account else create a local account
 4. Click on Link a Nintendo Network ID (**Note that it will say a Nintendo Network, however, it is creating a Pretendo Network Account**) and continue clicking ok until you see the Do you have Nintendo Account
 5. If you have a PNID already make click the Yes button and login with your information, else click No and create a PN Account.
 
 >ℹ️ To Verify that you are creating a Pretendo Account, Check if the EULA says **Pretendo** if not try running the patcher again.

After finishing, your PN Account should now be linked to that user.

## Logging into a PNID

If you want to log into a PNID Account after a Restart, run the Running Nimble Steps then Log in to your Account.


## Returning to Nintendo Servers
Just Restart the Console then all network patching will be reverted.

>ℹ️ If you try to login to your PNID without running the patcher, the console would try to connect to NN instead and give a incorrect Password for the ID.

#### TroubleShoot
Please visit this [Page](/docs/troubleshoot-errors) if you encounter an issue.




