# 3DS/2DS Family

## Things to know before you start

This guide assumes that you have a **Homebrewed System** running the latest version of Luma3DS (13+). If you are unsure or do not have a homebrewed system, please follow the [3DS Hacks Guide](https://3ds.hacks.guide/) to check, install and update it. 

**Support for system transfer is currently in development**. Attempting to perform one while being connected to Pretendo will prevent you from being able to go online in the future. If you need to do a system transfer, please do it before continuing with this guide.

Badges in **Nintendo Badge Arcade** might disappear and become de-synchronized when switching between Pretendo and Nintendo Network. This is due to your local data not matching the data stored on the respective server.

## Getting Started

To connect to the Pretendo Network, you will need to install a homebrew application and enable Luma patches on your console.

Nimbus is our homebrew application that allows you to connect and switch from Nintendo Network to the Pretendo Network.

This guide is divided into the following steps:
1. [Downloading Nimbus](#downloading-nimbus)
2. [Enabling Luma patches](#luma-patches)
3. [Using Nimbus](#using-nimbus)
4. [Signing into your PNID](#signing-into-your-pnid)

## Downloading Nimbus

<div class="tip">
	ℹ️ Nimbus is also available on <a href="https://db.universal-team.net/3ds/nimbus" target="_blank">Universal-Updater</a>. If you do not have Universal-Updater, you may follow this <a href="https://universal-team.net/projects/universal-updater.html" target="_blank">guide</a>. You may download the required files from there, rather than GitHub, or install/update the app directly from your console.
	<br>
	<br>
	ℹ️ If installed directly from your console for the first time, you will still be required to install the associated IPS patches from GitHub. Once installed, updates may be managed purely from Universal-Updater
</div>

Before starting, power off your console and insert its SD card into your computer.

Once inserted, download the latest [Nimbus release](https://github.com/PretendoNetwork/Nimbus/releases/latest).

Nimbus is available as both a 3DSX app and an installable CIA. The releases page offers downloads for both. Select the version you would like to use, or select the `combined.[version].zip` archive to use both.

<img src="/assets/images/docs/install/3ds/zip-highlight.png" width=100% height=auto/>

Extract the contents of the zip archive to the root of your SD card. If you are asked to merge or overwrite files, accept the changes.

Ensure your SD card has all the following files

- `SD:/luma/titles/000400300000BC02/code.ips` (Miiverse, JPN)
- `SD:/luma/titles/000400300000BD02/code.ips` (Miiverse, USA)
- `SD:/luma/titles/000400300000BE02/code.ips` (Miiverse, EUR)
- `SD:/luma/sysmodules/0004013000002F02.ips` (SSL)
- `SD:/luma/sysmodules/0004013000003202.ips` (FRD/Friends)
- `SD:/luma/sysmodules/0004013000003802.ips` (ACT/NNID)
- `SD:/3ds/juxt-prod.pem` (Juxtaposition certificate)

If not installed through Universal-Updater, ensure at least one of the following also exists

- `SD:/cias/nimbus.cia`
- `SD:/3ds/nimbus.3dsx`

Insert your SD card back into your console.

## Luma patches

<div class="tip">
ℹ️ <b>Skip this step if you've already enabled the required patches on your console for Pretendo Network.</b>
</div>

In order to make use of the Pretendo Network service, you will need to enable Luma patches on your console. Hold the `SELECT` button on your 3DS and power it on.

On the screen that is displayed, make sure that these following options are enabled:

- `Enable loading external FIRMS and modules`
- `Enable game patching`

Press `START` to save and continue with these changes.

## Installing Nimbus to HOME Menu

<div class="tip">
ℹ️ <b>Skip this step if you downloaded the 3DSX only zip file.</b>
</div>

If you downloaded the combined or cia archives, you can install Nimbus to the HOME Menu for quick and easy access.

Open FBI. If you do not have FBI, download the latest release from [GitHub](https://github.com/lifehackerhansol/FBI/releases/latest). Select `SD`, then `cias`. Find and select `nimbus.cia`. Select either `Install CIA` or `Install and delete CIA`.

Once it has finished installing, press the HOME button and exit FBI. You should see a message that a new application has been added to the HOME Menu. Click OK and you'll now have Nimbus on your HOME Menu.

## Using Nimbus

Depending on how you installed Nimbus, launch it either through the Homebrew Launcher or the 3DS HOME Menu. Select either `Pretendo` or `Nintendo` to swap between services.

Your selection persists between reboots.

## Signing into your PNID

The 3DS does not rely on NNIDs for the vast majority of it's game servers. Because of this, using a PNID is also not required for most games<sup><a>[[1]](#footnote-1)</a></sup>.

Setting up a PNID on the 3DS is the same as setting up a NNID. You may either create the PNID on your console, or register from an account [on our website](/account/register) and link it to your console once you're ready.

It is recommended to register the PNID on your device at this time, as registering on the website does not currently allow you to change your user data.

<div class="tip red">
	<strong>CAUTION:</strong>
	A Pretendo Network ID may not use the same username as the account already linked to your 3DS! Ensure that you have a choose a different name for your PNID than the name on your NNID.
</div>


## Other information

### How does Nimbus work?
Nimbus will create a 2nd local account set to the `test` NASC environment. The IPS patches will set the `test` NASC environment URLs to point to Pretendo. You may freely switch between Pretendo and Nintendo. Your selected mode will persist between reboots.

### 2nd local account?
You may have thought to yourself; _"2nd local account? What's that? I thought the 3DS only had one account?"_ And you'd be half right. The 3DS only _normally_ supports one account, and you may only have one account active at a time. However Nintendo implemented support for multiple local accounts on the 3DS/2DS which remains unused on all retail units. On a normal retail unit only one local account is ever made, which is set to the `prod` NASC environment. Local accounts may be set to `prod`, `test` or `dev`. Nimbus makes use of this unused feature to create sandboxed local accounts with different environments

<ul id="footnotes">
	<li id="footnote-1"><sup>[1]</sup> Some games may require a PNID for certain actions, such as eShop purchases. The only known game which requires a PNID for general use is Nintendo Badge Arcade, which is not yet supported</li>
</ul>

### Restoring Nintendo Badge Arcade Badges
1. Insert your SD Card into your PC.
2. Back up your badges at the folder on your SD Card `SD:Nintendo 3DS/ID0/ID1/extdata/00000000/000014d1`.
3. Download [Simple Badge Injector](https://github.com/AntiMach/simple-badge-injector/releases/latest).
4. Insert your SD Card into your console.
5. Use Nimbus to switch to Pretendo.
6. Open Simple Badge Injector and make a note of the "Nintendo Network ID" value.
7. Still inside SBI, choose the option to dump your badge data files.
8. Turn off your 3DS and remove the SD card. Insert your SD card into your PC.
9. Download and open [Advanced Badge Editor](https://github.com/AntiMach/advanced-badge-editor/releases/latest).
10. Go to `File > Open Data`, then choose the folder where BadgeData.dat and BadgeMngFile.dat are. (Located at `sd:/3ds/SimpleBadgeInjector/Dumped`)
11. Replace the NNID value with the one you made a note of in SBI earlier.
12. Select `Save As` to save the modified file separately from the backup.
13. Put your modified badge data filed into `sd:/3ds/SimpleBadgeInjector`
14. Put your SD card back into your 3DS and go back into SBI
15. Inject your modified badge data files.

All badges *placed* on the home menu will be deleted, and you have to re-add them in the order you have had them before.
    
If you encounter any errors, restore your backed up badge data through SBI. Injecting badges while using Pretendo Network will make them disappear when swapping back to Nintendo Network, and vice versa.
