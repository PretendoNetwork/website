# 3DS/2DS Family

<div class="tip red">
	<strong>CAUTION:</strong>
	DON'T REMOVE YOUR NNID TO SET UP PRETENDO NETWORK, IT'S NOT NECESSARY AND BY DOING SO YOU WILL LOSE BADGES, REDOWNLOADABLE GAMES, THEMES AND POKÉMON BANK DATA!
</div>

<div class="tip red">
	<strong>CAUTION:</strong>
	SYSTEM TRANSFERS ARE NOT CURRENTLY SUPPORTED BY OUR SERVERS. ATTEMPTING TO PERFORM A SYSTEM TRANSFER MAY PREVENT YOU FROM BEING ABLE TO GO ONLINE IN THE FUTURE. SUPPORT FOR SYSTEM TRANSFERS IS IN DEVELOPMENT.
</div>

<div class="tip red">
	<strong>CAUTION:</strong>
	Collecting badges in Nintendo Badge Arcade while connected to one network and then launching the game on a different network will result in your badges disappearing. This occurs because the locally saved data does not match the data stored on the server.
</div>

<div class="tip">
	ℹ️ This guide assumes that you have a <b>Homebrewed System running the latest version of Luma3DS (v13 or higher)</b>. If you don't, please follow this <a href="https://3ds.hacks.guide/" target="_blank">guide</a> on how to install homebrew to your system first.
</div>

The following steps are required for you to connect to the Pretendo Network:

1. [Downloading Nimbus](#downloading-nimbus)
2. [Enabling Luma patches](#enabling-luma-patches)
3. [Using Nimbus](#using-nimbus)
4. [Link a Pretendo Network ID (optional)](#link-a-pretendo-network-id-optional)
5. [Other information](#other-information)

## Downloading Nimbus

### Using Universal Updater

The easiest way to get Nimbus is by using Universal Updater. Universal Updater is also great for updating all of your other homebrew apps, so installing it is highly recommended. To install Universal Updater, get it from <a href="https://universal-team.net/projects/universal-updater.html" target="_blank">here</a>.

Once you have Universal Updater, simply open it and search for "Nimbus". Select `nimbus.3dsx` if you want to launch Nimbus from the Homebrew Launcher, or select `nimbus.cia` if you want to launch it from your HOME Menu.

<b>Continue to the [Enabling Luma patches](#enabling-luma-patches) section.</b>

### Without using Universal Updater

If you'd prefer not to use Universal Updater, Nimbus can be installed manually by extracting the needed files to your SD card.

Before starting, power off your console and insert its SD card into your computer.

You may choose one of the following options:

- [Installing to HOME Menu](#installing-to-home-menu)
- [Installing to Homebrew Launcher](#installing-to-homebrew-launcher)
- [Installing to both HOME Menu and Homebrew Launcher](#installing-to-both-home-menu-and-homebrew-launcher)

#### Installing to HOME Menu

If you want to launch Nimbus from your HOME Menu, download the zip file labeled `cia.[version].zip` from the [latest Nimbus release](https://github.com/PretendoNetwork/nimbus/releases/latest) and copy the `3ds` and `cias` folders from inside it to the root of your SD card. If you are asked to merge or overwrite files, accept the changes.

Before putting the SD card back in your system, check that it contains all of the following files:

- `SD:/3ds/nimbus/update/000400300000BC02.ips` (Miiverse, JPN)
- `SD:/3ds/nimbus/update/000400300000BD02.ips` (Miiverse, USA)
- `SD:/3ds/nimbus/update/000400300000BE02.ips` (Miiverse, EUR)
- `SD:/3ds/nimbus/update/0004013000002902.ips` (HTTP)
- `SD:/3ds/nimbus/update/0004013000002E02.ips` (Sockets)
- `SD:/3ds/nimbus/update/0004013000002F02.ips` (SSL)
- `SD:/3ds/nimbus/update/0004013000003202.ips` (FRD/Friends)
- `SD:/3ds/nimbus/update/0004013000003802.ips` (ACT/NNID)
- `SD:/3ds/nimbus/update/juxt-prod.pem` (Juxtaposition certificate)
- `SD:/3ds/nimbus/update/nimbus.3gx` (Nimbus plugin for Luma)
- `SD:/cias/nimbus.cia`

Once you've finished copying the files to your SD card, insert the SD card into your 3DS/2DS system.

Open FBI. If you do not have FBI, download the latest release from [GitHub](https://github.com/lifehackerhansol/FBI/releases/latest). Select `SD`, then `cias`. Find and select `nimbus.cia`. Select either `Install CIA` or `Install and delete CIA`.

Once it has finished installing, press the HOME button and exit FBI. You should see a message that a new application has been added to the HOME Menu. Press A or tap OK and you'll now have Nimbus on your HOME Menu.

<b>Continue to the [Enabling Luma patches](#enabling-luma-patches) section.</b>

#### Installing to Homebrew Launcher

If you want to launch Nimbus from the Homebrew Launcher, download the zip file labeled `3dsx.[version].zip` from the [latest Nimbus release](https://github.com/PretendoNetwork/nimbus/releases/latest) and copy the `3ds` folder from inside it to the root of your SD card. If you are asked to merge or overwrite files, accept the changes.

Before putting the SD card back in your system, check that it contains all of the following files:

- `SD:/3ds/nimbus/update/000400300000BC02.ips` (Miiverse, JPN)
- `SD:/3ds/nimbus/update/000400300000BD02.ips` (Miiverse, USA)
- `SD:/3ds/nimbus/update/000400300000BE02.ips` (Miiverse, EUR)
- `SD:/3ds/nimbus/update/0004013000002902.ips` (HTTP)
- `SD:/3ds/nimbus/update/0004013000002E02.ips` (Sockets)
- `SD:/3ds/nimbus/update/0004013000002F02.ips` (SSL)
- `SD:/3ds/nimbus/update/0004013000003202.ips` (FRD/Friends)
- `SD:/3ds/nimbus/update/0004013000003802.ips` (ACT/NNID)
- `SD:/3ds/nimbus/update/juxt-prod.pem` (Juxtaposition certificate)
- `SD:/3ds/nimbus/update/nimbus.3gx` (Nimbus plugin for Luma)
- `SD:/3ds/nimbus.3dsx`

Once you've finished copying the files to your SD card, insert the SD card into your 3DS/2DS system.

<b>Continue to the [Enabling Luma patches](#enabling-luma-patches) section.</b>

#### Installing to both HOME Menu and Homebrew Launcher

If you want to launch Nimbus from both the HOME Menu and Homebrew Launcher, download the zip file labeled `combined.[version].zip` from the [latest Nimbus release](https://github.com/PretendoNetwork/nimbus/releases/latest) and copy the `3ds` and `cias` folders from inside it to the root of your SD card. If you are asked to merge or overwrite files, accept the changes.

Before putting the SD card back in your system, check that it contains all of the following files:

- `SD:/3ds/nimbus/update/000400300000BC02.ips` (Miiverse, JPN)
- `SD:/3ds/nimbus/update/000400300000BD02.ips` (Miiverse, USA)
- `SD:/3ds/nimbus/update/000400300000BE02.ips` (Miiverse, EUR)
- `SD:/3ds/nimbus/update/0004013000002902.ips` (HTTP)
- `SD:/3ds/nimbus/update/0004013000002E02.ips` (Sockets)
- `SD:/3ds/nimbus/update/0004013000002F02.ips` (SSL)
- `SD:/3ds/nimbus/update/0004013000003202.ips` (FRD/Friends)
- `SD:/3ds/nimbus/update/0004013000003802.ips` (ACT/NNID)
- `SD:/3ds/nimbus/update/juxt-prod.pem` (Juxtaposition certificate)
- `SD:/3ds/nimbus/update/nimbus.3gx` (Nimbus plugin for Luma)
- `SD:/3ds/nimbus.3dsx`
- `SD:/cias/nimbus.cia`

Once you've finished copying the files to your SD card, insert the SD card into your 3DS/2DS system.

To install Nimbus to your HOME Menu, open FBI. If you do not have FBI, download the latest release from [GitHub](https://github.com/lifehackerhansol/FBI/releases/latest). Select `SD`, then `cias`. Find and select `nimbus.cia`. Select either `Install CIA` or `Install and delete CIA`.

Once it has finished installing, press the HOME button and exit FBI. You should see a message that a new application has been added to the HOME Menu. Click OK and you'll now have Nimbus on your HOME Menu.

<b>Continue to the [Enabling Luma patches](#enabling-luma-patches) section.</b>

## Enabling Luma patches

<div class="tip">
ℹ️ <b>Skip this step if you've already enabled the required patches on your console for Pretendo Network.</b>
</div>

In order to make use of the Pretendo Network service, you will need to enable Luma patches on your console. With your SD card inserted, hold `SELECT` + `Power` on your 3DS/2DS to turn it on and open the Luma configuration menu.

On the screen that is displayed, make sure that these following options are enabled:

- `Enable loading external FIRMS and modules`
- `Enable game patching`

Press `START` to save and continue with these changes.

## Using Nimbus

Depending on how you installed Nimbus, launch it either through the Homebrew Launcher or the HOME Menu. Select either `Pretendo` or `Nintendo` to swap between services. Your selection persists between reboots.

## Link a Pretendo Network ID (optional)

Some games and apps require a Pretendo Network ID (PNID) to be linked before you can use them online.

To link a PNID, open the System Settings app in Azahar and click on `Nintendo Network ID Settings`. From here, you can either create a new PNID or link an existing one. Follow the directions on your screen to create or link a PNID. Please note that even though it says "Nintendo Network ID" throughout, you are still creating/linking a Pretendo Network ID.

You may also register an account [on our website](/account/register) and link it to your console once you're ready.

<div class="tip red">
	<strong>CAUTION:</strong>
	A Pretendo Network ID may not use the same username as the account already linked to your 3DS/2DS! Ensure that you have chosen a different name for your PNID than the name on your NNID.
</div>

## Other information

### How does Nimbus work?

Nimbus will create a 2nd local account set to the `test` NASC environment. The IPS patches will set the `test` NASC environment URLs to point to Pretendo. You may freely switch between Pretendo and Nintendo. Your selected mode will persist between reboots.

### 2nd local account?

You may have thought to yourself; _"2nd local account? What's that? I thought the 3DS only had one account?"_ And you'd be half right. The 3DS only _normally_ supports one account, and you may only have one account active at a time. However Nintendo implemented support for multiple local accounts on the 3DS/2DS which remains unused on all retail units. On a normal retail unit only one local account is ever made, which is set to the `prod` NASC environment. Local accounts may be set to `prod`, `test` or `dev`. Nimbus makes use of this unused feature to create sandboxed local accounts with different environments

### Restoring Nintendo Badge Arcade Badges

1. Insert your SD Card into your PC.
2. Back up your badges at the folder on your SD Card `SD:Nintendo 3DS/ID0/ID1/extdata/00000000/000014d1`.
3. Download [Simple Badge Injector](https://github.com/AntiMach/simple-badge-injector/releases/latest).
4. Insert your SD Card into your console.
5. Use Nimbus to switch to Pretendo.
6. Open Simple Badge Injector and make a note of the "Nintendo Network ID" value.
7. Still inside SBI, choose the option to dump your badge data files.
8. Turn off your 3DS/2DS and remove the SD card. Insert your SD card into your PC.
9. Download and open [Advanced Badge Editor](https://github.com/AntiMach/advanced-badge-editor/releases/latest).
10. Go to `File > Open Data`, then choose the folder where BadgeData.dat and BadgeMngFile.dat are. (Located at `sd:/3ds/SimpleBadgeInjector/Dumped`)
11. Replace the NNID value with the one you made a note of in SBI earlier.
12. Select `Save As` to save the modified file separately from the backup.
13. Put your modified badge data filed into `sd:/3ds/SimpleBadgeInjector`
14. Put your SD card back into your 3DS/2DS and go back into SBI
15. Inject your modified badge data files.

All badges _placed_ on the home menu will be deleted, and you have to re-add them in the order you have had them before.

If you encounter any errors, restore your backed up badge data through SBI. Injecting badges while using Pretendo Network will make them disappear when swapping back to Nintendo Network, and vice versa.
